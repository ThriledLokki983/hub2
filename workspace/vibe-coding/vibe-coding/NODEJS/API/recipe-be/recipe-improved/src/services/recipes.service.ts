import { Service } from 'typedi';
import slugify from 'slugify';
import { query, pool } from '@database';
import { HttpException } from '@exceptions/httpException';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Recipe, RecipePhoto, RecipeQueryParams, Tag, Region, RecipeRating, RecipeComment } from '@interfaces/recipes.interface';
import {
  CreateRecipeDto,
  CreateTagDto,
  UpdateTagDto,
  CreateRegionDto,
  UpdateRegionDto,
  CreateRatingDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@dtos/recipes.dto';
import { logger } from '@utils/logger';
import { PAGINATION } from '@config';

@Service()
export class RecipeService {
  private dbPool: typeof pool;

  constructor() {
    this.dbPool = pool;
  }

  public async findAllRecipes(queryParams: RecipeQueryParams): Promise<{ recipes: Recipe[]; total: number }> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        category,
        search,
        user_id,
        tags,
        sort = 'created_at',
        sort_direction = 'DESC',
        tag_ids,
        // Advanced filter parameters
        max_prep_time,
        max_cook_time,
        max_total_time,
        min_calories,
        max_calories,
        min_protein,
        max_protein,
        min_fat,
        max_fat,
        min_carbs,
        max_carbs,
        exclude_ingredients,
      } = queryParams;

      const actualLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
      const offset = (page - 1) * actualLimit;

      const params: any[] = [];
      let paramIndex = 1;

      const { rows: tablesExist } = await query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_name = 'recipes'
        )
        `,
        [],
      );

      if (!tablesExist[0].exists) {
        logger.info('Recipes table does not exist yet');
        return { recipes: [], total: 0 };
      }

      let sqlQuery = `
        SELECT
          r.*,
          u.email as user_email
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
      `;

      // Add a join for ingredient filtering if needed
      if (exclude_ingredients && exclude_ingredients.length > 0) {
        sqlQuery += `
          LEFT JOIN LATERAL (
            SELECT 1 FROM recipe_ingredients ri
            WHERE ri.recipe_id = r.id
            AND LOWER(ri.name) IN (${exclude_ingredients.map((_, i) => `LOWER($${paramIndex + i})`).join(', ')})
            LIMIT 1
          ) excluded_ingredient ON TRUE
        `;
        paramIndex += exclude_ingredients.length;
      }

      sqlQuery += ` WHERE r.deleted_at IS NULL`;

      if (exclude_ingredients && exclude_ingredients.length > 0) {
        sqlQuery += ` AND excluded_ingredient IS NULL`;
        exclude_ingredients.forEach(ingredient => {
          params.push(ingredient);
        });
      }

      if (category) {
        sqlQuery += ` AND r.category = $${paramIndex++}`;
        params.push(category);
      }

      if (search) {
        sqlQuery += ` AND (r.title ILIKE $${paramIndex++} OR r.description ILIKE $${paramIndex++})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern);
      }

      if (user_id) {
        sqlQuery += ` AND r.user_id = $${paramIndex++}`;
        params.push(user_id);
      }

      if (tags && tags.length) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];
        sqlQuery += ` AND r.tags && $${paramIndex++}::text[]`;
        params.push(tagsArray);
      }

      if (tag_ids) {
        const tagIdsArray = Array.isArray(tag_ids) ? tag_ids : [tag_ids];
        sqlQuery += `
          AND EXISTS (
            SELECT 1 FROM recipe_tags rt
            WHERE rt.recipe_id = r.id
            AND rt.tag_id IN (${tagIdsArray.map((_, idx) => `$${paramIndex++}`).join(',')})
          )
        `;
        params.push(...tagIdsArray);
      }

      // Add time filtering
      if (max_prep_time !== undefined) {
        sqlQuery += ` AND (r.prep_time IS NULL OR r.prep_time <= $${paramIndex++})`;
        params.push(max_prep_time);
      }

      if (max_cook_time !== undefined) {
        sqlQuery += ` AND (r.cook_time IS NULL OR r.cook_time <= $${paramIndex++})`;
        params.push(max_cook_time);
      }

      if (max_total_time !== undefined) {
        sqlQuery += ` AND (r.total_time IS NULL OR r.total_time <= $${paramIndex++})`;
        params.push(max_total_time);
      }

      // Add nutritional filtering
      if (min_calories !== undefined) {
        sqlQuery += ` AND r.calories >= $${paramIndex++}`;
        params.push(min_calories);
      }

      if (max_calories !== undefined) {
        sqlQuery += ` AND (r.calories IS NULL OR r.calories <= $${paramIndex++})`;
        params.push(max_calories);
      }

      if (min_protein !== undefined) {
        sqlQuery += ` AND r.protein >= $${paramIndex++}`;
        params.push(min_protein);
      }

      if (max_protein !== undefined) {
        sqlQuery += ` AND (r.protein IS NULL OR r.protein <= $${paramIndex++})`;
        params.push(max_protein);
      }

      if (min_fat !== undefined) {
        sqlQuery += ` AND r.fat >= $${paramIndex++}`;
        params.push(min_fat);
      }

      if (max_fat !== undefined) {
        sqlQuery += ` AND (r.fat IS NULL OR r.fat <= $${paramIndex++})`;
        params.push(max_fat);
      }

      if (min_carbs !== undefined) {
        sqlQuery += ` AND r.carbohydrates >= $${paramIndex++}`;
        params.push(min_carbs);
      }

      if (max_carbs !== undefined) {
        sqlQuery += ` AND (r.carbohydrates IS NULL OR r.carbohydrates <= $${paramIndex++})`;
        params.push(max_carbs);
      }

      const countQuery = `SELECT COUNT(*) FROM (${sqlQuery}) AS count_query`;
      const { rows: countRows } = await query(countQuery, params);
      const total = parseInt(countRows[0].count, 10);

      sqlQuery += ` ORDER BY r.${sort} ${sort_direction}`;
      sqlQuery += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(actualLimit, offset);

      const { rows } = await query(sqlQuery, params);

      const recipes = rows.map(row => {
        const recipe: Recipe = {
          id: row.id,
          user_id: row.user_id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          image: row.image,
          chef: row.chef,
          category: row.category,
          tags: row.tags,
          prep_time: row.prep_time,
          cook_time: row.cook_time,
          total_time: row.total_time,
          servings: row.servings,
          difficulty: row.difficulty,
          calories: row.calories,
          protein: row.protein,
          fat: row.fat,
          carbohydrates: row.carbohydrates,
          status: row.status,
          is_public: row.is_public,
          average_rating: row.average_rating,
          ratings_count: row.ratings_count,
          views: row.views,
          source: row.source,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };

        return recipe;
      });

      for (const recipe of recipes) {
        const { rows: tagRows } = await query(
          `
          SELECT t.*
          FROM tags t
          JOIN recipe_tags rt ON t.id = rt.tag_id
          WHERE rt.recipe_id = $1
        `,
          [recipe.id],
        );

        recipe.tag_objects = tagRows;
      }

      return { recipes, total };
    } catch (error) {
      logger.error(`Error in findAllRecipes: ${error.message}`);
      if (error.message.includes('relation "recipes" does not exist')) {
        return { recipes: [], total: 0 };
      }
      throw new HttpException(500, `Failed to retrieve recipes: ${error.message}`);
    }
  }

  public async findRecipeById(recipeId: string): Promise<Recipe> {
    try {
      const { rows: recipeRows, rowCount: recipeExists } = await query(
        `
        SELECT
          r.*,
          u.email as user_email
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = $1 AND r.deleted_at IS NULL
        `,
        [recipeId],
      );

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const recipe: Recipe = {
        id: recipeRows[0].id,
        user_id: recipeRows[0].user_id,
        title: recipeRows[0].title,
        slug: recipeRows[0].slug,
        description: recipeRows[0].description,
        image: recipeRows[0].image,
        chef: recipeRows[0].chef,
        category: recipeRows[0].category,
        tags: recipeRows[0].tags,
        prep_time: recipeRows[0].prep_time,
        cook_time: recipeRows[0].cook_time,
        total_time: recipeRows[0].total_time,
        servings: recipeRows[0].servings,
        difficulty: recipeRows[0].difficulty,
        calories: recipeRows[0].calories,
        protein: recipeRows[0].protein,
        fat: recipeRows[0].fat,
        carbohydrates: recipeRows[0].carbohydrates,
        status: recipeRows[0].status,
        is_public: recipeRows[0].is_public,
        average_rating: recipeRows[0].average_rating,
        ratings_count: recipeRows[0].ratings_count,
        views: recipeRows[0].views,
        source: recipeRows[0].source,
        created_at: recipeRows[0].created_at,
        updated_at: recipeRows[0].updated_at,
      };

      await query('UPDATE recipes SET views = views + 1 WHERE id = $1', [recipeId]);

      const { rows: ingredientRows } = await query('SELECT * FROM recipe_ingredients WHERE recipe_id = $1 ORDER BY order_index ASC', [recipeId]);
      const { rows: instructionRows } = await query('SELECT * FROM recipe_instructions WHERE recipe_id = $1 ORDER BY step_number ASC', [recipeId]);
      const { rows: photoRows } = await query('SELECT * FROM recipe_photos WHERE recipe_id = $1', [recipeId]);
      const { rows: tagRows } = await query(
        `
        SELECT t.*
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = $1
        ORDER BY t.name ASC
      `,
        [recipeId],
      );

      // Get recipe ratings and comments
      const { rows: ratingRows } = await query(
        `
        SELECT rr.*, u.email as user_email
        FROM recipe_ratings rr
        JOIN users u ON rr.user_id = u.id
        WHERE rr.recipe_id = $1
        ORDER BY rr.created_at DESC
        `,
        [recipeId],
      );

      const { rows: commentRows } = await query(
        `
        SELECT rc.*, u.email as user_email
        FROM recipe_comments rc
        JOIN users u ON rc.user_id = u.id
        WHERE rc.recipe_id = $1 AND rc.deleted_at IS NULL
        ORDER BY rc.created_at DESC
        `,
        [recipeId],
      );

      recipe.ingredients = ingredientRows;
      recipe.instructions = instructionRows;
      recipe.photos = photoRows;
      recipe.tag_objects = tagRows;
      recipe.ratings = ratingRows;
      recipe.comments = commentRows;

      return recipe;
    } catch (error) {
      logger.error(`Error in findRecipeById: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve recipe: ${error.message}`);
    }
  }

  public async createRecipe(userId: string, recipeData: CreateRecipeDto): Promise<Recipe> {
    try {
      const tagIds = recipeData.tag_ids || [];
      delete recipeData.tag_ids;

      if (!recipeData.slug) {
        recipeData.slug = slugify(recipeData.title, { lower: true });
      }

      const { rows: existingSlug } = await query('SELECT EXISTS(SELECT 1 FROM recipes WHERE slug = $1)', [recipeData.slug]);

      if (existingSlug[0].exists) {
        recipeData.slug = `${recipeData.slug}-${Math.floor(Math.random() * 10000)}`;
      }

      const client = await this.dbPool.connect();

      try {
        await client.query('BEGIN');

        const { rows } = await client.query(
          `
          INSERT INTO recipes(
            user_id, title, slug, description, chef, category, tags,
            prep_time, cook_time, total_time, servings, difficulty,
            calories, protein, fat, carbohydrates, status, is_public, source
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING *
          `,
          [
            userId,
            recipeData.title,
            recipeData.slug,
            recipeData.description || null,
            recipeData.chef || null,
            recipeData.category || null,
            recipeData.tags || [],
            recipeData.prep_time || null,
            recipeData.cook_time || null,
            recipeData.total_time || null,
            recipeData.servings || null,
            recipeData.difficulty || null,
            recipeData.calories || null,
            recipeData.protein || null,
            recipeData.fat || null,
            recipeData.carbohydrates || null,
            recipeData.status || 'published',
            recipeData.is_public !== undefined ? recipeData.is_public : true,
            recipeData.source || null,
          ],
        );

        const newRecipe = rows[0];

        if (tagIds.length > 0) {
          for (const tagId of tagIds) {
            const { rowCount: tagExists } = await client.query('SELECT id FROM tags WHERE id = $1', [tagId]);

            if (!tagExists) {
              throw new HttpException(404, `Tag with id ${tagId} not found`);
            }

            await client.query(
              `
              INSERT INTO recipe_tags(recipe_id, tag_id)
              VALUES ($1, $2)
            `,
              [newRecipe.id, tagId],
            );
          }
        }

        if (recipeData.tags && recipeData.tags.length > 0) {
          for (const tagName of recipeData.tags) {
            const { rows: existingTags } = await client.query('SELECT * FROM tags WHERE LOWER(name) = LOWER($1)', [tagName]);

            let tagId;

            if (existingTags.length > 0) {
              tagId = existingTags[0].id;
            } else {
              const slug = slugify(tagName, { lower: true });

              const { rows: existingSlug } = await client.query('SELECT EXISTS(SELECT 1 FROM tags WHERE slug = $1)', [slug]);

              const finalSlug = existingSlug[0].exists ? `${slug}-${Math.floor(Math.random() * 10000)}` : slug;

              const { rows: newTag } = await client.query(
                `
                INSERT INTO tags(name, slug)
                VALUES ($1, $2)
                RETURNING id
              `,
                [tagName, finalSlug],
              );

              tagId = newTag[0].id;
            }

            await client.query(
              `
              INSERT INTO recipe_tags(recipe_id, tag_id)
              VALUES ($1, $2)
            `,
              [newRecipe.id, tagId],
            );
          }
        }

        await client.query('COMMIT');
        return newRecipe;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error(`Error in createRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to create recipe: ${error.message}`);
    }
  }

  public async findAllTags(): Promise<Tag[]> {
    try {
      const { rows } = await query(`
        SELECT * FROM tags
        ORDER BY name ASC
      `);

      return rows;
    } catch (error) {
      logger.error(`Error in findAllTags: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve tags: ${error.message}`);
    }
  }

  public async findTagById(tagId: string): Promise<Tag> {
    try {
      const { rows, rowCount } = await query(
        `
        SELECT * FROM tags WHERE id = $1
      `,
        [tagId],
      );

      if (!rowCount) {
        throw new HttpException(404, `Tag with id ${tagId} not found`);
      }

      return rows[0];
    } catch (error) {
      logger.error(`Error in findTagById: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve tag: ${error.message}`);
    }
  }

  public async createTag(tagData: CreateTagDto): Promise<Tag> {
    try {
      if (!tagData.slug) {
        tagData.slug = slugify(tagData.name, { lower: true });
      }

      const { rows: existingSlug } = await query('SELECT EXISTS(SELECT 1 FROM tags WHERE slug = $1)', [tagData.slug]);

      if (existingSlug[0].exists) {
        tagData.slug = `${tagData.slug}-${Math.floor(Math.random() * 10000)}`;
      }

      const { rows } = await query(
        `
        INSERT INTO tags(
          name, slug, description
        ) VALUES ($1, $2, $3)
        RETURNING *
      `,
        [tagData.name, tagData.slug, tagData.description || null],
      );

      return rows[0];
    } catch (error) {
      logger.error(`Error in createTag: ${error.message}`);
      throw new HttpException(500, `Failed to create tag: ${error.message}`);
    }
  }

  public async updateTag(tagId: string, tagData: UpdateTagDto): Promise<Tag> {
    try {
      const { rowCount } = await query('SELECT id FROM tags WHERE id = $1', [tagId]);

      if (!rowCount) {
        throw new HttpException(404, `Tag with id ${tagId} not found`);
      }

      if (tagData.slug) {
        const { rows: existingSlug } = await query('SELECT EXISTS(SELECT 1 FROM tags WHERE slug = $1 AND id != $2)', [tagData.slug, tagId]);

        if (existingSlug[0].exists) {
          tagData.slug = `${tagData.slug}-${Math.floor(Math.random() * 10000)}`;
        }
      } else if (tagData.name) {
        const newSlug = slugify(tagData.name, { lower: true });
        const { rows: existingSlug } = await query('SELECT EXISTS(SELECT 1 FROM tags WHERE slug = $1 AND id != $2)', [newSlug, tagId]);

        if (existingSlug[0].exists) {
          tagData.slug = `${newSlug}-${Math.floor(Math.random() * 10000)}`;
        } else {
          tagData.slug = newSlug;
        }
      }

      const updateFields = [];
      const values = [tagId];
      let paramIndex = 2;

      for (const [key, value] of Object.entries(tagData)) {
        if (value !== undefined && key !== 'id') {
          updateFields.push(`${key} = $${paramIndex++}`);
          values.push(value);
        }
      }

      updateFields.push(`updated_at = NOW()`);

      if (updateFields.length > 0) {
        const { rows } = await query(
          `
          UPDATE tags
          SET ${updateFields.join(', ')}
          WHERE id = $1
          RETURNING *
        `,
          values,
        );

        return rows[0];
      }

      const { rows } = await query('SELECT * FROM tags WHERE id = $1', [tagId]);
      return rows[0];
    } catch (error) {
      logger.error(`Error in updateTag: ${error.message}`);
      throw new HttpException(500, `Failed to update tag: ${error.message}`);
    }
  }

  public async deleteTag(tagId: string): Promise<void> {
    try {
      const { rowCount } = await query('SELECT id FROM tags WHERE id = $1', [tagId]);

      if (!rowCount) {
        throw new HttpException(404, `Tag with id ${tagId} not found`);
      }

      await query('DELETE FROM tags WHERE id = $1', [tagId]);
    } catch (error) {
      logger.error(`Error in deleteTag: ${error.message}`);
      throw new HttpException(500, `Failed to delete tag: ${error.message}`);
    }
  }

  public async findTagsByRecipe(recipeId: string): Promise<Tag[]> {
    try {
      const { rowCount } = await query('SELECT id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [recipeId]);

      if (!rowCount) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const { rows } = await query(
        `
        SELECT t.*
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = $1
        ORDER BY t.name ASC
      `,
        [recipeId],
      );

      return rows;
    } catch (error) {
      logger.error(`Error in findTagsByRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve recipe tags: ${error.message}`);
    }
  }

  public async addTagsToRecipe(recipeId: string, userId: string, tagIds: string[]): Promise<Tag[]> {
    try {
      const { rows: recipe, rowCount: recipeExists } = await query('SELECT user_id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [recipeId]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      if (recipe[0].user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to modify this recipe');
      }

      const client = await this.dbPool.connect();

      try {
        await client.query('BEGIN');

        for (const tagId of tagIds) {
          const { rowCount: tagExists } = await client.query('SELECT id FROM tags WHERE id = $1', [tagId]);

          if (!tagExists) {
            throw new HttpException(404, `Tag with id ${tagId} not found`);
          }

          const { rows: existingTag } = await client.query(
            `
            SELECT EXISTS(
              SELECT 1 FROM recipe_tags
              WHERE recipe_id = $1 AND tag_id = $2
            ) as exists
          `,
            [recipeId, tagId],
          );

          if (!existingTag[0].exists) {
            await client.query(
              `
              INSERT INTO recipe_tags(recipe_id, tag_id)
              VALUES ($1, $2)
            `,
              [recipeId, tagId],
            );
          }
        }

        await client.query('COMMIT');

        const { rows } = await query(
          `
          SELECT t.*
          FROM tags t
          JOIN recipe_tags rt ON t.id = rt.tag_id
          WHERE rt.recipe_id = $1
          ORDER BY t.name ASC
        `,
          [recipeId],
        );

        return rows;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error(`Error in addTagsToRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to add tags to recipe: ${error.message}`);
    }
  }

  public async removeTagFromRecipe(recipeId: string, userId: string, tagId: string): Promise<void> {
    try {
      const { rows: recipe, rowCount: recipeExists } = await query('SELECT user_id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [recipeId]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      if (recipe[0].user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to modify this recipe');
      }

      const { rowCount: tagExists } = await query('SELECT id FROM tags WHERE id = $1', [tagId]);

      if (!tagExists) {
        throw new HttpException(404, `Tag with id ${tagId} not found`);
      }

      await query('DELETE FROM recipe_tags WHERE recipe_id = $1 AND tag_id = $2', [recipeId, tagId]);
    } catch (error) {
      logger.error(`Error in removeTagFromRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to remove tag from recipe: ${error.message}`);
    }
  }

  // Region methods
  public async findAllRegions(): Promise<Region[]> {
    try {
      const { rows } = await query(
        `
        SELECT *
        FROM regions
        WHERE deleted_at IS NULL
        ORDER BY name ASC
        `,
        [],
      );

      return rows;
    } catch (error) {
      logger.error(`Error in findAllRegions: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve regions: ${error.message}`);
    }
  }

  public async findRegionById(regionId: string): Promise<Region> {
    try {
      const { rows, rowCount } = await query(
        `
        SELECT *
        FROM regions
        WHERE id = $1 AND deleted_at IS NULL
        `,
        [regionId],
      );

      if (!rowCount) {
        throw new HttpException(404, `Region with id ${regionId} not found`);
      }

      return rows[0];
    } catch (error) {
      logger.error(`Error in findRegionById: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve region: ${error.message}`);
    }
  }

  public async createRegion(regionData: CreateRegionDto): Promise<Region> {
    try {
      const { name, description } = regionData;

      const { rows: existingRegion } = await query('SELECT id FROM regions WHERE LOWER(name) = LOWER($1) AND deleted_at IS NULL', [name]);
      if (existingRegion.length > 0) {
        throw new HttpException(409, `Region with name "${name}" already exists`);
      }

      const { rows } = await query(
        `
        INSERT INTO regions (name, description)
        VALUES ($1, $2)
        RETURNING *
        `,
        [name, description || null],
      );

      return rows[0];
    } catch (error) {
      logger.error(`Error in createRegion: ${error.message}`);
      throw new HttpException(500, `Failed to create region: ${error.message}`);
    }
  }

  public async updateRegion(regionId: string, regionData: UpdateRegionDto): Promise<Region> {
    try {
      const { name, description } = regionData;

      const { rowCount: regionExists } = await query('SELECT id FROM regions WHERE id = $1 AND deleted_at IS NULL', [regionId]);

      if (!regionExists) {
        throw new HttpException(404, `Region with id ${regionId} not found`);
      }

      // If name is being updated, check for duplicates
      if (name) {
        const { rows: duplicateName } = await query('SELECT id FROM regions WHERE LOWER(name) = LOWER($1) AND id != $2 AND deleted_at IS NULL', [
          name,
          regionId,
        ]);

        if (duplicateName.length > 0) {
          throw new HttpException(409, `Region with name "${name}" already exists`);
        }
      }

      // Build the dynamic SQL update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        values.push(name);
      }

      if (description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        values.push(description);
      }

      updateFields.push(`updated_at = now()`);

      // Add the regionId as the last parameter
      values.push(regionId);

      const { rows } = await query(
        `
        UPDATE regions
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex} AND deleted_at IS NULL
        RETURNING *
        `,
        values,
      );

      return rows[0];
    } catch (error) {
      logger.error(`Error in updateRegion: ${error.message}`);
      throw new HttpException(500, `Failed to update region: ${error.message}`);
    }
  }

  public async deleteRegion(regionId: string): Promise<void> {
    try {
      const { rowCount: regionExists } = await query('SELECT id FROM regions WHERE id = $1 AND deleted_at IS NULL', [regionId]);

      if (!regionExists) {
        throw new HttpException(404, `Region with id ${regionId} not found`);
      }

      // Check if any recipes are using this region
      const { rowCount: hasRecipes } = await query(
        `
        SELECT 1
        FROM recipes
        WHERE region_id = $1 AND deleted_at IS NULL
        LIMIT 1
        `,
        [regionId],
      );

      if (hasRecipes) {
        // Soft delete - set deleted_at timestamp
        await query(
          `
          UPDATE regions
          SET deleted_at = now()
          WHERE id = $1
          `,
          [regionId],
        );
      } else {
        // Hard delete - no references
        await query(
          `
          DELETE FROM regions
          WHERE id = $1
          `,
          [regionId],
        );
      }
    } catch (error) {
      logger.error(`Error in deleteRegion: ${error.message}`);
      throw new HttpException(500, `Failed to delete region: ${error.message}`);
    }
  }

  public async setRecipeRegion(recipeId: string, userId: string, regionId: string | null): Promise<Recipe> {
    try {
      // Check if recipe exists and belongs to user
      const { rows: recipeRows, rowCount: recipeExists } = await query('SELECT user_id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [
        recipeId,
      ]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      if (recipeRows[0].user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to modify this recipe');
      }

      // If regionId is provided, check if it exists
      if (regionId) {
        const { rowCount: regionExists } = await query('SELECT id FROM regions WHERE id = $1 AND deleted_at IS NULL', [regionId]);

        if (!regionExists) {
          throw new HttpException(404, `Region with id ${regionId} not found`);
        }
      }

      // Update the recipe with the new region
      const { rows } = await query(
        `
        UPDATE recipes
        SET region_id = $1, updated_at = now()
        WHERE id = $2
        RETURNING *
        `,
        [regionId, recipeId],
      );

      return rows[0];
    } catch (error) {
      logger.error(`Error in setRecipeRegion: ${error.message}`);
      throw new HttpException(500, `Failed to set recipe region: ${error.message}`);
    }
  }

  public async forkRecipe(recipeId: string, userId: string): Promise<Recipe> {
    // First, fetch the original recipe with all details
    const { rows: recipeRows, rowCount: recipeCount } = await query(
      `
      SELECT * FROM recipes
      WHERE id = $1 AND (is_public = true OR user_id = $2)
      `,
      [recipeId, userId],
    );

    if (!recipeCount) {
      throw new HttpException(404, 'Recipe not found or not public');
    }

    const originalRecipe = recipeRows[0];

    // Don't allow forking your own recipes
    if (originalRecipe.user_id === userId) {
      throw new HttpException(400, 'You cannot fork your own recipe');
    }

    // Create a new recipe as a copy
    const { rows: newRecipeRows } = await query(
      `
      INSERT INTO recipes(
        user_id,
        title,
        slug,
        description,
        image,
        chef,
        category,
        region_id,
        prep_time,
        cook_time,
        total_time,
        servings,
        difficulty,
        calories,
        protein,
        fat,
        carbohydrates,
        status,
        is_public,
        source
      )
      VALUES (
        $1,
        $2 || ' (Forked)',
        $3 || '-forked-' || gen_random_uuid(),
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        'draft',
        false,
        $18
      )
      RETURNING *
      `,
      [
        userId,
        originalRecipe.title,
        originalRecipe.slug,
        originalRecipe.description,
        originalRecipe.image,
        originalRecipe.chef,
        originalRecipe.category,
        originalRecipe.region_id,
        originalRecipe.prep_time,
        originalRecipe.cook_time,
        originalRecipe.total_time,
        originalRecipe.servings,
        originalRecipe.difficulty,
        originalRecipe.calories,
        originalRecipe.protein,
        originalRecipe.fat,
        originalRecipe.carbohydrates,
        `Forked from ${recipeId}`,
      ],
    );

    const newRecipe = newRecipeRows[0];

    // Copy ingredients
    const { rows: ingredientRows } = await query(
      `
      SELECT * FROM recipe_ingredients
      WHERE recipe_id = $1
      `,
      [recipeId],
    );

    if (ingredientRows.length > 0) {
      const ingredientValues = ingredientRows
        .map((ingredient, index) => {
          return `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${index * 4 + 5})`;
        })
        .join(', ');

      const ingredientParams = [newRecipe.id];
      ingredientRows.forEach(ingredient => {
        ingredientParams.push(ingredient.name, ingredient.quantity, ingredient.unit, ingredient.notes);
      });

      await query(
        `
        INSERT INTO recipe_ingredients(recipe_id, name, quantity, unit, notes)
        VALUES ${ingredientValues}
        `,
        ingredientParams,
      );
    }

    // Copy instructions
    const { rows: instructionRows } = await query(
      `
      SELECT * FROM recipe_instructions
      WHERE recipe_id = $1
      ORDER BY step_number ASC
      `,
      [recipeId],
    );

    if (instructionRows.length > 0) {
      const instructionValues = instructionRows
        .map((instruction, index) => {
          return `($1, $${index * 2 + 2}, $${index * 2 + 3})`;
        })
        .join(', ');

      const instructionParams = [newRecipe.id];
      instructionRows.forEach(instruction => {
        instructionParams.push(instruction.step_number, instruction.instruction);
      });

      await query(
        `
        INSERT INTO recipe_instructions(recipe_id, step_number, instruction)
        VALUES ${instructionValues}
        `,
        instructionParams,
      );
    }

    // Copy tags
    const { rows: tagRows } = await query(
      `
      SELECT rt.tag_id
      FROM recipe_tags rt
      WHERE rt.recipe_id = $1
      `,
      [recipeId],
    );

    if (tagRows.length > 0) {
      const tagValues = tagRows
        .map((_, index) => {
          return `($1, $${index + 2})`;
        })
        .join(', ');

      const tagParams = [newRecipe.id];
      tagRows.forEach(tag => {
        tagParams.push(tag.tag_id);
      });

      await query(
        `
        INSERT INTO recipe_tags(recipe_id, tag_id)
        VALUES ${tagValues}
        `,
        tagParams,
      );
    }

    // Return fully populated recipe
    return this.findRecipeById(newRecipe.id);
  }

  // Recipe Rating methods
  public async getRatingsByRecipe(recipeId: string): Promise<RecipeRating[]> {
    try {
      const { rowCount: recipeExists } = await query('SELECT id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [recipeId]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const { rows } = await query(
        `
        SELECT rr.*, u.email as user_email
        FROM recipe_ratings rr
        JOIN users u ON rr.user_id = u.id
        WHERE rr.recipe_id = $1
        ORDER BY rr.created_at DESC
        `,
        [recipeId],
      );

      return rows;
    } catch (error) {
      logger.error(`Error in getRatingsByRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve recipe ratings: ${error.message}`);
    }
  }

  public async getUserRatingForRecipe(recipeId: string, userId: string): Promise<RecipeRating | null> {
    try {
      const { rows, rowCount } = await query(
        `
        SELECT rr.*, u.email as user_email
        FROM recipe_ratings rr
        JOIN users u ON rr.user_id = u.id
        WHERE rr.recipe_id = $1 AND rr.user_id = $2
        `,
        [recipeId, userId],
      );

      return rowCount ? rows[0] : null;
    } catch (error) {
      logger.error(`Error in getUserRatingForRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve user rating: ${error.message}`);
    }
  }

  public async rateRecipe(recipeId: string, userId: string, ratingData: CreateRatingDto): Promise<RecipeRating> {
    try {
      const { rating } = ratingData;

      // Check if recipe exists and is public or owned by the user
      const { rows: recipeRows, rowCount: recipeExists } = await query(
        `
        SELECT id, user_id, is_public FROM recipes
        WHERE id = $1 AND deleted_at IS NULL
        `,
        [recipeId],
      );

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const recipe = recipeRows[0];

      // Only allow rating public recipes or recipes owned by the user
      if (!recipe.is_public && recipe.user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to rate this recipe');
      }

      // Check if user already rated this recipe
      const existingRating = await this.getUserRatingForRecipe(recipeId, userId);

      if (existingRating) {
        // Update existing rating
        const { rows } = await query(
          `
          UPDATE recipe_ratings
          SET rating = $1, updated_at = NOW()
          WHERE recipe_id = $2 AND user_id = $3
          RETURNING *
          `,
          [rating, recipeId, userId],
        );

        return rows[0];
      } else {
        // Create new rating
        const { rows } = await query(
          `
          INSERT INTO recipe_ratings (recipe_id, user_id, rating)
          VALUES ($1, $2, $3)
          RETURNING *
          `,
          [recipeId, userId, rating],
        );

        return rows[0];
      }
    } catch (error) {
      logger.error(`Error in rateRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to rate recipe: ${error.message}`);
    }
  }

  public async deleteRating(recipeId: string, userId: string): Promise<void> {
    try {
      const { rowCount: ratingExists } = await query(
        `
        SELECT id FROM recipe_ratings
        WHERE recipe_id = $1 AND user_id = $2
        `,
        [recipeId, userId],
      );

      if (!ratingExists) {
        throw new HttpException(404, 'Rating not found');
      }

      await query(
        `
        DELETE FROM recipe_ratings
        WHERE recipe_id = $1 AND user_id = $2
        `,
        [recipeId, userId],
      );
    } catch (error) {
      logger.error(`Error in deleteRating: ${error.message}`);
      throw new HttpException(500, `Failed to delete rating: ${error.message}`);
    }
  }

  // Recipe Comment methods
  public async getCommentsByRecipe(recipeId: string): Promise<RecipeComment[]> {
    try {
      const { rowCount: recipeExists } = await query('SELECT id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [recipeId]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const { rows } = await query(
        `
        SELECT rc.*, u.email as user_email
        FROM recipe_comments rc
        JOIN users u ON rc.user_id = u.id
        WHERE rc.recipe_id = $1 AND rc.deleted_at IS NULL
        ORDER BY rc.created_at DESC
        `,
        [recipeId],
      );

      return rows;
    } catch (error) {
      logger.error(`Error in getCommentsByRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to retrieve recipe comments: ${error.message}`);
    }
  }

  public async addCommentToRecipe(recipeId: string, userId: string, commentData: CreateCommentDto): Promise<RecipeComment> {
    try {
      // Check if recipe exists and is public or owned by the user
      const { rows: recipeRows, rowCount: recipeExists } = await query(
        `
        SELECT id, user_id, is_public FROM recipes
        WHERE id = $1 AND deleted_at IS NULL
        `,
        [recipeId],
      );

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      const recipe = recipeRows[0];

      // Only allow commenting on public recipes or recipes owned by the user
      if (!recipe.is_public && recipe.user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to comment on this recipe');
      }

      const { rows } = await query(
        `
        INSERT INTO recipe_comments (recipe_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [recipeId, userId, commentData.comment],
      );

      // Get the user email for the response
      const { rows: userRows } = await query('SELECT email FROM users WHERE id = $1', [userId]);

      const comment = rows[0];
      comment.user_email = userRows[0].email;

      return comment;
    } catch (error) {
      logger.error(`Error in addCommentToRecipe: ${error.message}`);
      throw new HttpException(500, `Failed to add comment: ${error.message}`);
    }
  }

  public async updateComment(commentId: string, userId: string, commentData: UpdateCommentDto): Promise<RecipeComment> {
    try {
      // Check if comment exists and belongs to the user
      const { rows: commentRows, rowCount: commentExists } = await query(
        `
        SELECT rc.*, u.email as user_email
        FROM recipe_comments rc
        JOIN users u ON rc.user_id = u.id
        WHERE rc.id = $1 AND rc.deleted_at IS NULL
        `,
        [commentId],
      );

      if (!commentExists) {
        throw new HttpException(404, `Comment with id ${commentId} not found`);
      }

      const comment = commentRows[0];

      if (comment.user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to update this comment');
      }

      const { rows } = await query(
        `
        UPDATE recipe_comments
        SET comment = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
        [commentData.comment, commentId],
      );

      rows[0].user_email = comment.user_email;

      return rows[0];
    } catch (error) {
      logger.error(`Error in updateComment: ${error.message}`);
      throw new HttpException(500, `Failed to update comment: ${error.message}`);
    }
  }

  public async deleteComment(commentId: string, userId: string): Promise<void> {
    try {
      // Check if comment exists
      const { rows, rowCount: commentExists } = await query(
        `
        SELECT id, user_id, recipe_id
        FROM recipe_comments
        WHERE id = $1 AND deleted_at IS NULL
        `,
        [commentId],
      );

      if (!commentExists) {
        throw new HttpException(404, `Comment with id ${commentId} not found`);
      }

      const comment = rows[0];

      // Check if recipe belongs to user
      const { rows: recipeRows } = await query('SELECT user_id FROM recipes WHERE id = $1', [comment.recipe_id]);
      const isRecipeOwner = recipeRows[0]?.user_id === userId;

      // Allow deletion if user is the comment author or the recipe owner
      if (comment.user_id !== userId && !isRecipeOwner) {
        throw new HttpException(403, 'You are not authorized to delete this comment');
      }

      // Soft delete the comment
      await query(
        `
        UPDATE recipe_comments
        SET deleted_at = NOW()
        WHERE id = $1
        `,
        [commentId],
      );
    } catch (error) {
      logger.error(`Error in deleteComment: ${error.message}`);
      throw new HttpException(500, `Failed to delete comment: ${error.message}`);
    }
  }

  public async addPhoto(recipeId: string, userId: string, fileData: any): Promise<RecipePhoto> {
    try {
      // Check if recipe exists and belongs to user
      const { rows: recipeRows, rowCount: recipeExists } = await query('SELECT user_id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [
        recipeId,
      ]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      if (recipeRows[0].user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to modify this recipe');
      }

      // If this is a primary photo, update the other photos to be non-primary
      if (fileData.isPrimary) {
        await query(
          `
          UPDATE recipe_photos
          SET is_primary = false
          WHERE recipe_id = $1
          `,
          [recipeId],
        );
      }

      // Calculate absolute paths for file processing
      const relativePath = fileData.path;
      const absolutePath = path.join(process.cwd(), relativePath);

      // Get the directory and filename parts
      const dirName = path.dirname(absolutePath);
      const fileName = path.basename(absolutePath);
      const fileNameWithoutExt = path.basename(fileName, path.extname(fileName));

      // Create thumbnails directory if it doesn't exist
      const thumbnailsDir = path.join(dirName, 'thumbnails');
      if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true });
      }

      // Define thumbnail paths
      const thumbnailSmallPath = path.join(thumbnailsDir, `${fileNameWithoutExt}-small.jpg`);
      const thumbnailMediumPath = path.join(thumbnailsDir, `${fileNameWithoutExt}-medium.jpg`);

      // Calculate relative paths for the database
      const relativeThumbSmallPath = `/uploads/recipes/${recipeId}/thumbnails/${fileNameWithoutExt}-small.jpg`;
      const relativeThumbMediumPath = `/uploads/recipes/${recipeId}/thumbnails/${fileNameWithoutExt}-medium.jpg`;

      // Generate thumbnails with Sharp
      await sharp(absolutePath).resize(200, 200, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(thumbnailSmallPath);

      await sharp(absolutePath).resize(400, 400, { fit: 'cover' }).jpeg({ quality: 85 }).toFile(thumbnailMediumPath);

      // Store file information in the database
      const { rows } = await query(
        `
        INSERT INTO recipe_photos(
          recipe_id, file_path, file_name, file_size, mime_type, is_primary, thumbnail_small, thumbnail_medium
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
          recipeId,
          relativePath,
          fileData.originalname,
          fileData.size,
          fileData.mimetype,
          fileData.isPrimary === true,
          relativeThumbSmallPath,
          relativeThumbMediumPath,
        ],
      );

      return rows[0];
    } catch (error) {
      logger.error(`Error in addPhoto: ${error.message}`);
      throw new HttpException(500, `Failed to add photo: ${error.message}`);
    }
  }

  public async deletePhoto(recipeId: string, photoId: string, userId: string): Promise<void> {
    try {
      // Check if recipe exists and belongs to user
      const { rows: recipeRows, rowCount: recipeExists } = await query('SELECT user_id FROM recipes WHERE id = $1 AND deleted_at IS NULL', [
        recipeId,
      ]);

      if (!recipeExists) {
        throw new HttpException(404, `Recipe with id ${recipeId} not found`);
      }

      if (recipeRows[0].user_id !== userId) {
        throw new HttpException(403, 'You are not authorized to modify this recipe');
      }

      // Get the photo information
      const { rows: photoRows, rowCount: photoExists } = await query(
        `
        SELECT * FROM recipe_photos
        WHERE id = $1 AND recipe_id = $2
        `,
        [photoId, recipeId],
      );

      if (!photoExists) {
        throw new HttpException(404, `Photo with id ${photoId} not found`);
      }

      // Delete the physical files
      const photo = photoRows[0];
      try {
        // Delete original file
        const absolutePath = path.join(process.cwd(), photo.file_path);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }

        // Delete thumbnails if they exist
        if (photo.thumbnail_small) {
          const thumbnailSmallPath = path.join(process.cwd(), photo.thumbnail_small);
          if (fs.existsSync(thumbnailSmallPath)) {
            fs.unlinkSync(thumbnailSmallPath);
          }
        }

        if (photo.thumbnail_medium) {
          const thumbnailMediumPath = path.join(process.cwd(), photo.thumbnail_medium);
          if (fs.existsSync(thumbnailMediumPath)) {
            fs.unlinkSync(thumbnailMediumPath);
          }
        }
      } catch (fsError) {
        // Log the file deletion error but continue with database deletion
        logger.error(`Error deleting photo files: ${fsError.message}`);
      }

      // Delete the database entry
      await query(
        `
        DELETE FROM recipe_photos
        WHERE id = $1
        `,
        [photoId],
      );
    } catch (error) {
      logger.error(`Error in deletePhoto: ${error.message}`);
      throw new HttpException(500, `Failed to delete photo: ${error.message}`);
    }
  }
}

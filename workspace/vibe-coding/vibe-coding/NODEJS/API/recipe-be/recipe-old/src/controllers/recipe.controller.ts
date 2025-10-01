import { NextFunction, Request, Response } from 'express';
import { RecipeService } from '../services/recipe.service';
import { HttpException } from '../exceptions/httpException';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
} from '../interfaces/recipe.interface';

export class RecipeController {
  public recipeService = new RecipeService();

  public getAllRecipes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipes = await this.recipeService.getAllRecipes();
      res.status(200).json({
        message: 'Recipes retrieved successfully',
        count: recipes.length,
        recipes,
      });
    } catch (error) {
      next(error);
    }
  };

  public getRecipeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const recipe = await this.recipeService.getRecipeById(recipeId);

      if (!recipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Recipe retrieved successfully',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public createRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeData: CreateRecipeDto = req.body;
      const recipe = await this.recipeService.createRecipe(recipeData);

      res.status(201).json({
        message: 'Recipe created successfully',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const recipeData: UpdateRecipeDto = req.body;

      const updatedRecipe = await this.recipeService.updateRecipe(
        recipeId,
        recipeData
      );

      if (!updatedRecipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Recipe updated successfully',
        data: updatedRecipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const isDeleted = await this.recipeService.deleteRecipe(recipeId);

      if (!isDeleted) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Recipe deleted successfully',
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  public addIngredientsToRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const { ingredients } = req.body;

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return next(
          new HttpException(400, 'Ingredients must be a non-empty array')
        );
      }

      // Validate each ingredient has required properties
      for (const ingredient of ingredients) {
        if (!ingredient.name || !ingredient.amount) {
          return next(
            new HttpException(
              400,
              'Each ingredient must have a name and amount'
            )
          );
        }
      }

      const updatedRecipe = await this.recipeService.addIngredientsToRecipe(
        recipeId,
        ingredients
      );

      if (!updatedRecipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Ingredients added successfully',
        data: updatedRecipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public addInstructionsToRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const { instructions } = req.body;

      if (!Array.isArray(instructions) || instructions.length === 0) {
        return next(
          new HttpException(400, 'Instructions must be a non-empty array')
        );
      }

      // Validate each instruction has required properties
      for (const instruction of instructions) {
        if (!instruction.text || instruction.text.trim() === '') {
          return next(
            new HttpException(400, 'Each instruction must have non-empty text')
          );
        }
      }

      const updatedRecipe = await this.recipeService.addInstructionsToRecipe(
        recipeId,
        instructions
      );

      if (!updatedRecipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Instructions added successfully',
        data: updatedRecipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllIngredients = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const ingredients = await this.recipeService.getAllIngredients();
      res.status(200).json({
        message: 'Ingredients retrieved successfully',
        count: ingredients.length,
        ingredients,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllInstructions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const instructions = await this.recipeService.getAllInstructions();
      res.status(200).json({
        message: 'Instructions retrieved successfully',
        count: instructions.length,
        instructions,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFeaturedRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipe = await this.recipeService.getFeaturedRecipe();

      if (!recipe) {
        return next(new HttpException(404, 'No recipes available to feature'));
      }

      res.status(200).json({
        message: 'Featured recipe retrieved successfully',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadRecipePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const file = req.file as Express.Multer.File;

      if (!file) {
        throw new HttpException(400, 'No photo uploaded');
      }

      // Get the photo URL (relative path)
      const photoUrl = `/uploads/${file.filename}`;

      const updatedRecipe = await this.recipeService.addPhotoToRecipe(
        recipeId,
        photoUrl
      );

      if (!updatedRecipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(201).json({
        message: 'Photo uploaded successfully',
        data: {
          photo_url: photoUrl,
          recipe: updatedRecipe,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadMultipleRecipePhotos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new HttpException(400, 'No photos uploaded');
      }

      // Get photo URLs (relative paths) for all uploaded files
      const photoUrls = files.map((file) => `/uploads/${file.filename}`);

      const updatedRecipe = await this.recipeService.addPhotosToRecipe(
        recipeId,
        photoUrls
      );

      if (!updatedRecipe) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(201).json({
        message: 'Photos uploaded successfully',
        data: {
          photo_urls: photoUrls,
          recipe: updatedRecipe,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getRecipePhotos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recipeId = req.params.id;
      const photos = await this.recipeService.getRecipePhotos(recipeId);

      if (photos === null) {
        return next(
          new HttpException(404, `Recipe with id ${recipeId} not found`)
        );
      }

      res.status(200).json({
        message: 'Recipe photos retrieved successfully',
        count: photos.length,
        photos,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRecipePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { recipeId, photoId } = req.params;
      const result = await this.recipeService.deleteRecipePhoto(
        recipeId,
        photoId
      );

      if (!result) {
        return next(
          new HttpException(
            404,
            `Photo with id ${photoId} not found for recipe ${recipeId}`
          )
        );
      }

      res.status(200).json({
        message: 'Recipe photo deleted successfully',
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

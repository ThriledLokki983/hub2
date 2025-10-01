<?php get_header(); ?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>
        <?php dhwz_content_builder() ?>

        <section class="products products__lists">
            <?php
            $posts = new WP_Query([
                'post_type' => 'post',
                'posts_per_page' => get_field('projects_items_per_page', 'option'),
                'category__in' => [92]
            ]);
            ?>

            <?php if ($posts->have_posts()) : ?>
                <?php while ($posts->have_posts()) : $posts->the_post(); ?>
                    <a href="<?= the_permalink() ?>?ref=projects" class="products__card hover">
                        <div class="products__card--photo">
                            <picture>
                                <img loading="lazy" decoding="async" width="300" height="200"
                                     src="<?= get_the_post_thumbnail_url() ?>" alt="<?= get_the_title() ?>">
                            </picture>
                        </div>
                        <div class="products__card--text">
                            <h3><?= the_title() ?></h3>
                            <p class="mb-0"><?= trimExcerpt(get_the_excerpt(), 150) ?></p>
                        </div>
                    </a>
                <?php endwhile; ?>

                <?php wp_reset_postdata(); ?>
            <?php endif; ?>
        </section>

<section class="divider"></section>
    </main>

<?php get_footer(); ?>
<?php get_header(); ?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>

        <section class="products products__lists">
            <?php
            $posts = new WP_Query([
                'post_type' => 'post',
                'posts_per_page' => -1,
                'category__in' => [91]
            ]);
            ?>

            <?php if ( $posts->have_posts() ) : ?>
                <?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
                    <article class="products__card">
                        <div class="products__card--photo">
                            <picture>
                                <img loading="lazy" decoding="async" width="300" height="200" src="<?= get_the_post_thumbnail_url() ?>" alt="<?= get_the_title() ?>">
                            </picture>
                        </div>
                        <div class="products__card--text">
                            <h3><?= the_title() ?></h3>
                            <p><?= trimExcerpt(get_the_excerpt(), 150) ?></p>
                            <a href="<?= the_permalink() ?>" class="btn">
                                <span>Lees meer</span>
                                <svg class="icon">
                                    <use xlink:href="http://dhwz-v2.local/wp-content/themes/dhwz/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>

                <?php wp_reset_postdata(); ?>
            <?php endif; ?>
        </section>

<section class="divider"></section>
    </main>

<?php get_footer(); ?>
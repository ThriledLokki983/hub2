<?php get_header(); ?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>
        <?php dhwz_content_builder() ?>

        <section class="products products__lists">
            <?php
            $products = new WP_Query([
                'post_type' => 'dhwec_product',
                'posts_per_page' => -1
            ]);
            ?>

            <?php if ($products->have_posts()) : ?>
                <?php while ($products->have_posts()) : $products->the_post(); ?>
                    <article class="products__card">
                        <div class="products__card--photo">
                            <picture>
                                <?php
                                $img = get_field('dhwec_image');
                                $src = $img['url'];
                                $alt = getAcfImageAlt($img);
                                ?>
                                <img loading="lazy" decoding="async" width="300" height="200" src="<?= $src ?>"
                                     alt="<?= $alt ?>">
                            </picture>
                        </div>
                        <div class="products__card--text">
                            <h3><?= the_title() ?></h3>
                            <p><?= trimExcerpt(get_field('dhwec_description'), 150) ?></p>
                            <a href="<?= the_permalink() ?>" class="btn">
                                <span>Bekijk product</span>
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
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
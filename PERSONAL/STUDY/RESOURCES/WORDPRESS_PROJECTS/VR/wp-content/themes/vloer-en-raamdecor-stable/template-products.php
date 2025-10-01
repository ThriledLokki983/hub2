<?php
/**
 * Template Name: Producten
 */
get_header();

$fields = get_fields();
?>

    <main class="main">
        <section class="categories__header">
            <div class="filter-box">
                <svg class="icon">
                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-filter"></use>
                </svg>
                <span>filter</span>
            </div>
            <?= get_template_part('parts/part', 'categories-header'); ?>
        </section>

        <section class="modulo__select">
            <aside class="select__options hide mob-select-opt" data-expanded="false">
                <div class="product-card-title-secondary">
                    <span class="product-text">BINNEN WELKE CATEGORIE</span>
                    <h2 class="product-text">WILT U ZOEKEN?</h2>
                </div>
                <?php echo do_shortcode('[searchandfilter id="' . $fields['search_and_filter_id'] . '"]'); ?>
            </aside>
            <article class="select__results span-3">
                <?php
                $args = [
                    'post_type' => 'product',
                    'search_filter_id' => $fields['search_and_filter_id']
                ];
                $productsQuery = new WP_Query($args);
                global $productsQuery;
                require 'parts/part-products-loop.php'
                ?>
            </article>
        </section>

        <section class="specialist">
            <div class="product-card-title-secondary">
                <span class="product-text"><?= $fields['seo_content_heading_1'] ?></span>
                <h2 class="product-text"><?= $fields['seo_content_heading_2'] ?></h2>
            </div>

            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <?php the_content(); ?>
                <?php endwhile; ?>
            <?php endif; ?>
        </section>

        <?php vr_content_builder(); ?>

        <?= get_template_part('parts/part', 'services'); ?>
        <?= get_template_part('parts/part', 'support'); ?>
    </main>

<?php get_footer(); ?>
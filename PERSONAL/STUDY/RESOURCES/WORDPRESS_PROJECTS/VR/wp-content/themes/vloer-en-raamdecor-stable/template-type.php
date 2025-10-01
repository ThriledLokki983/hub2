<?php
/**
 * Template Name: Types
 */
get_header();

$fields = get_fields();
?>

    <main class="main">
        <section class="categories__hero">
            <article class="categories__hero--collection floor__type">
                <ul class="collection__lists floor__type--left span-2">
                    <li class="collection__lists-item span-2">
                        <picture class="collection__lists-item-link--img">
                            <?php
                            $img = $fields['page_header_background'];
                            $src = $img['url'];
                            $alt = getAcfImageAlt($img);
                            ?>
                            <source
                                media="(max-width: 767px)"
                                srcset="<?= $src ?>"
                            />
                            <source
                                media="(min-width: 768px)"
                                srcset="<?= $src ?>"
                            />
                            <img
                                src="<?= $src ?>"
                                alt="<?= $alt ?>"
                                loading="lazy"
                            />
                            <div class="hero__big--overlay">
                                <span><?= $fields['page_header_heading_1'] ?></span>
                                <h1><?= $fields['page_header_heading_2'] ?></h1>
                            </div>
                        </picture>
                    </li>

                    <?php foreach ($fields['product_types'] as $productType) : ?>
                        <?php
                        $src = $productType['image']['url'];
                        $alt = getAcfImageAlt($productType['image']);
                        ?>
                        <li class="collection__lists-item">
                            <a href="<?= $productType['link'] ?>" class="collection__lists-item-link">
                                <picture class="collection__lists-item-link--img">
                                    <source
                                            media="(max-width: 767px)"
                                            srcset="<?= $src ?>"
                                    />
                                    <source
                                            media="(min-width: 768px)"
                                            srcset="<?= $src ?>"
                                    />
                                    <img
                                            class="small-a-ratio"
                                            src="<?= $src ?>"
                                            alt="<?= $alt ?>"
                                            loading="lazy"
                                    />
                                    <button class="btn primary"><?= $productType['title'] ?></button>
                                </picture>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <div class="floor__type--right">
                    <div class="floor__type--right-top">
                        <div class="product-card-title-primary">
                            <span class="product-text"><?= get_field('tpl_types_offer_form_title_1', 'option') ?></span>
                            <h2 class="product-text"><?= get_field('tpl_types_offer_form_title_2', 'option') ?></h2>
                        </div>
                        <?php echo do_shortcode('[ninja_form id=2]'); ?>
                    </div>
                    <div class="floor__type--right-bottom">
                        <div class="product-card-title-primary">
                            <span class="product-text"><?= get_field('tpl_types_usps_title_1', 'option') ?></span>
                            <h2 class="product-text"><?= get_field('tpl_types_usps_title_2', 'option') ?></h2>
                        </div>
                        <ul class="lists">
                            <?php $usps = get_field('tpl_types_usps_items', 'option'); ?>
                            <?php foreach ($usps as $usp) : ?>
                                <li class="lists-item">
                                    <svg class="icon">
                                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-check"></use>
                                    </svg>
                                    <span><?= $usp['item']; ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
            </article>
        </section>

        <section class="furnishing">
            <article class="text span-3">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= $fields['seo_content_heading_1'] ?></span>
                    <h2 class="product-text"><?= $fields['seo_content_heading_2'] ?></h2>
                </div>
                <div class="furnishing__content">
                    <?php if ( have_posts() ) : ?>
                        <?php while ( have_posts() ) : the_post(); ?>
                            <?php the_content(); ?>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </article>
            <article class="photo">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= get_field('tpl_types_aside_title_1', 'option') ?></span>
                    <h2 class="product-text"><?= get_field('tpl_types_aside_title_2', 'option') ?></h2>
                </div>
                <figure>
                    <?php
                    $img = get_field('tpl_types_aside_image', 'option');
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy" />
                </figure>
                <?= get_field('tpl_types_aside_text', 'option') ?>
            </article>
        </section>

        <?= get_template_part('parts/part', 'support'); ?>
    </main>

<?php get_footer(); ?>
<?php
/**
 * Template Name: Vloeren
 */
get_header();

$fields = get_fields();
?>

    <main class="main">
        <section class="categories__header">
            <?= get_template_part('parts/part', 'categories-header'); ?>
        </section>

        <section class="categories__hero">
            <h2 class="section--title"><?= $fields['title_above_product_types'] ?></h2>

            <div class="categories__hero--collection">
                <ul class="collection__lists">
                    <li class="collection__lists-item span-2">
                        <a href="<?= $fields['link_of_first_product_type'] ?>" class="collection__lists-item-link">
                            <?php
                            $src = $fields['image_of_first_product_type']['url'];
                            $alt = getAcfImageAlt($fields['image_of_first_product_type']);
                            ?>
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
                                        src="<?= $src ?>"
                                        alt="hero"
                                        loading="<?= $alt ?>"
                                />
                                <div class="hero__big--overlay">
                                    <span><?= $fields['title_1_of_first_product_type'] ?></span>
                                    <h1><?= $fields['title_2_of_first_product_type'] ?></h1>
                                </div>
                                <button class="btn primary"
                                        href=""><?= $fields['button_label_of_first_product_type'] ?></button>
                            </picture>
                        </a>
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
            </div>
        </section>

        <section class="furnishing">
            <article class="text span-3">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= $fields['seo_content_heading_1'] ?></span>
                    <h2 class="product-text"><?= $fields['seo_content_heading_2'] ?></h2>
                </div>
                <div class="furnishing__content">
                    <?php if (have_posts()) : ?>
                        <?php while (have_posts()) : the_post(); ?>
                            <?php the_content(); ?>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </article>
            <article class="photo">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= $fields['sidebar_titel_1'] ?></span>
                    <h2 class="product-text"><?= $fields['sidebar_titel_2'] ?></h2>
                </div>
                <p class="paragraph"><?= $fields['sidebar_text'] ?></p>

                <?php
                $src = $fields['sidebar_image']['url'];
                $alt = getAcfImageAlt($fields['sidebar_image']);
                ?>
                <figure>
                    <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                </figure>
            </article>
        </section>

        <?= get_template_part('parts/part', 'rating'); ?>
        <?= get_template_part('parts/part', 'support'); ?>
    </main>

<?php get_footer(); ?>
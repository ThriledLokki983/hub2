<?php
/*
 * Template Name: Product
 */
get_header();
?>

<main class="main products-page">
    <?php get_template_part('parts/part', 'page-header'); ?>

    <section class="kenmerk">
        <article class="kenmerk__content">
            <h2 class="kenmerk__content--header"><?= get_field('usps_title'); ?></h2>
            <ul class="kenmerk__content--lists">
                <?php foreach (get_field('usps') as $usp) : ?>
                    <li class="info__content--lists-item">
                        <svg class="info__content--lists-item-svg icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/img/sprite.svg#icon-check"></use>
                        </svg>
                        <span class="info__content--lists-item-title"><?= $usp['usp'] ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </article>
        <article class="kenmerk__photo">
            <figure>
                <picture>
                    <?php
                    $img = get_field('usp_image_1');
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <img width="300" height="200"
                         loading="lazy" decoding="async"
                         src="<?= $src ?>"
                         alt="<?= $alt ?>"
                    />
                </picture>
            </figure>
        </article>
        <article class="kenmerk__photo">
            <figure>
                <picture>
                    <?php
                    $img = get_field('usp_image_2');
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <img width="300" height="200"
                         loading="lazy" decoding="async"
                         src="<?= $src ?>"
                         alt="<?= $alt ?>"
                    />
                </picture>
            </figure>
        </article>
    </section>

    <?php
    $featuredContent = get_field('featured_content');
    $i = 1;
    ?>

    <?php if (!empty($featuredContent)) : ?>
        <section class="news">
            <?php foreach ($featuredContent as $block) : ?>
                <?php if ($i === 1) : ?>
                    <article class="news__left">
                        <div class="news__left--photo" style="background-image: url('<?= $block['image']['url'] ?>');"></div>
                        <div class="news__left--text">
                            <h2><?= $block['title'] ?></h2>
                            <p><?= $block['text'] ?></p>
                            <a href="<?= $block['button_link'] ?>" class="btn">
                                <span><?= $block['button_label'] ?></span>
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                    </article>
                <?php elseif ($i === 2) : ?>
                    <article class="news__right">
                        <div class="news__right--photo" style="background-image: url('<?= $block['image']['url'] ?>');"></div>
                        <div class="news__right--text">
                            <h2><?= $block['title'] ?></h2>
                            <p><?= $block['text'] ?></p>
                            <a href="<?= $block['button_link'] ?>" class="btn">
                                <span><?= $block['button_label'] ?></span>
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                    </article>
                <?php endif; ?>
                <?php $i++; ?>
            <?php endforeach; ?>
        </section>
    <?php endif; ?>

    <section class="prefooter">
        <figure class="prefooter__image-box span-6">
            <?php
            $img = get_field('product_cta_background', 'option');
            $src = $img['url'];
            $alt = getAcfImageAlt($img);
            ?>
            <img loading="eager" decoding="sync"
                 width="300"
                 height="200"
                 src="<?= $src ?>"
                 alt="<?= $alt ?>"
                 class="prefooter__image-box--img"
            />
            <div class="overlay">
                <div class="overlay__content">
                    <h1 class="overlay--title clr-primary"><?= get_field('product_cta_title', 'option') ?></h1>
                    <p><?= get_field('product_cta_text', 'option') ?></p>
                </div>
                <div class="header__top--btn">
                    <a href="<?= get_field('product_cta_button_link', 'option') ?>" class="btn bn primary">
                        <span><?= get_field('product_cta_button_label', 'option') ?></span>
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                        </svg>
                    </a>
                </div>
            </div>
        </figure>
    </section>

    <section class="prefooter grid-2-1">
        <article class="prefooter__text wysiwyg">
            <?= get_field('seo_text_left') ?>
        </article>
        <article class="prefooter__text wysiwyg">
            <?= get_field('seo_text_right') ?>
        </article>
    </section>

    <section class="divider"></section>
</main>

<?php get_footer(); ?>

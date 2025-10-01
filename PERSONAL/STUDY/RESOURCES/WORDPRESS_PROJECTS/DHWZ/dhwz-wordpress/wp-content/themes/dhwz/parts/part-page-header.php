<?php $fields = get_fields(); ?>

<?php if ($fields['hero_show'] === 'T1') : ?>
    <section class="intro">
        <article class="intro__left">
            <picture>
                <?php
                $src = $fields['hero_image']['url'];
                $alt = getAcfImageAlt($fields['hero_image']);
                ?>
                <img loading="lazy" decoding="async"
                     src="<?= $src ?>"
                     alt="<?= $alt ?>"
                />
            </picture>
        </article>
        <article class="intro__right">
            <div class="intro__right--content">
                <h2 class="title"><?= get_field('hero_title'); ?></h2>
                <?= get_field('hero_text'); ?>
            </div>
            <?php if (!empty(get_field('hero_button_label')) && !empty(get_field('hero_button_link'))) : ?>
                <div class="header__top--btn">
                    <a href="<?= get_field('hero_button_link') ?>" class="btn bn">
                        <span><?= get_field('hero_button_label') ?></span>
                        <svg class="icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                        </svg>
                    </a>
                </div>
            <?php endif; ?>
        </article>
    </section>
<?php elseif ($fields['hero_show'] === 'T2') : ?>
    <section class="hero">
        <figure class="hero__image-box span-6">
            <?php
            $src = $fields['hero_image']['url'];
            $alt = getAcfImageAlt($fields['hero_image']);
            ?>
            <img
                    loading="eager"
                    decoding="sync"
                    width="300"
                    height="200"
                    src="<?= $src ?>"
                    alt="<?= $alt ?>"
                    srcset="<?= $src ?>"
                    sizes="(max-width: 960px) 100%, ..."
                    class="hero__image-box--img"
            />
            <div class="hero__overlay">
                <div class="hero__overlay__content">
                    <h1 class="hero__overlay__content-title clr-primary"><?= get_field('hero_title'); ?></h1>
                    <p class="hero__overlay__content-paragraph"><?= get_field('hero_text'); ?></p>
                </div>

                <?php if (!empty(get_field('hero_button_label')) && !empty(get_field('hero_button_link'))) : ?>
                    <div class="header__top--btn">
                        <a href="<?= get_field('hero_button_link') ?>" class="btn bn primary">
                            <span><?= get_field('hero_button_label') ?></span>
                            <svg class="icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                            </svg>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </figure>
    </section>
<?php endif; ?>

<?php if (empty($_SESSION['dhwec']['employee'])) : ?>
    <?php if (get_the_id() !== 13093) : ?>
        <section class="breadcrumbs">
            <ul class="breadcrumbs__lists">
                <li class="breadcrumbs__lists--item">
                    <a href="<?= get_site_url() ?>" class="breadcrumbs__lists--item-link">Home</a>
                    <span>&#8250;</span>
                </li>

                <?php if (is_single()) : ?>
                    <?php if (!empty($_GET['ref']) && $_GET['ref'] === 'projects') : ?>
                        <li class="breadcrumbs__lists--item">
                            <a href="<?= get_site_url() ?>/projecten/"
                               class="breadcrumbs__lists--item-link">Projecten</a>
                            <span>&#8250;</span>
                        </li>
                    <?php else : ?>
                        <li class="breadcrumbs__lists--item">
                            <a href="<?= get_site_url() ?>/actueel/" class="breadcrumbs__lists--item-link">Actueel</a>
                            <span>&#8250;</span>
                        </li>
                    <?php endif; ?>
                <?php else : ?>
                    <?php $id = get_the_id(); ?>
                    <?php $topAncestorId = dhwz_get_post_top_ancestor_id($id); ?>

                    <?php if (!empty($topAncestorId) && $topAncestorId !== $id): ?>
                        <li class="breadcrumbs__lists--item">
                            <a href="<?= get_the_permalink($topAncestorId) ?>"
                               class="breadcrumbs__lists--item-link"><?= get_the_title($topAncestorId) ?></a>
                            <span>&#8250;</span>
                        </li>
                    <?php endif; ?>
                <?php endif; ?>

                <li class="breadcrumbs__lists--item">
                    <?= get_the_title($id) ?>
                </li>
            </ul>
        </section>
    <?php endif; ?>
<?php endif; ?>
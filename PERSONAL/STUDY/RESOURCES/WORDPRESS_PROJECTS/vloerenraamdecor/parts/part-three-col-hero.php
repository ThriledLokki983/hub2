<section class="hero grid size">
    <article class="hero__big span-2">
        <a href="<?= get_sub_field('three_col_hero_b1_link'); ?>">
            <picture class="hero__big--img">
                <?php
                $img = get_sub_field('three_col_hero_b1_image');
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                <div class="hero__big--overlay">
                    <span><?= get_sub_field('three_col_hero_b1_title_1'); ?></span>
                    <h1><?= get_sub_field('three_col_hero_b1_title_2'); ?></h1>
                </div>
                <button class="btn secondary"><?= get_sub_field('three_col_hero_b1_label'); ?></button>
            </picture>
        </a>
    </article>
    <article class="hero__small">
        <a href="<?= get_sub_field('three_col_hero_b2_link'); ?>">
            <picture class="hero__small--img">
                <?php
                $img = get_sub_field('three_col_hero_b2_image');
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                <button class="btn red"><?= get_sub_field('three_col_hero_b2_label'); ?></button>
            </picture>
        </a>
    </article>
    <article class="hero__small">
        <a href="<?= get_sub_field('three_col_hero_b3_link'); ?>">
            <picture class="hero__small--img">
                <?php
                $img = get_sub_field('three_col_hero_b3_image');
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                <button class="btn primary"><?= get_sub_field('three_col_hero_b3_label'); ?></button>
            </picture>
        </a>
    </article>
    <button class="btn home-hero-caro" aria-label="Next">
        <svg class="icon">
            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"></use>
        </svg>
    </button>
</section>
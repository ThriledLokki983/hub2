<section class="hero">
  <ul class="hero__lists snaps-inline js-slider-container" tabindex='0'>
      <li class="hero__lists--item hero__lists--item__big span-2 js-slide">
        <a href="<?= get_sub_field('three_col_hero_b1_link'); ?>">
            <picture class="hero__lists--item__big--img ">
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy" class="hero__lists--item__big--img-img"/>
                <div class="hero__lists--item__big--overlay">
                    <span class="hero__lists--item__big--overlay-text"><?= get_sub_field('three_col_hero_b1_title_1'); ?></span>
                    <h1 class="hero__lists--item__big--overlay-heading"><?= get_sub_field('three_col_hero_b1_title_2'); ?></h1>
                </div>
                <button class="btn secondary hero__lists--item__big--img-btn"><?= get_sub_field('three_col_hero_b1_label'); ?></button>
            </picture>
        </a>
    </li>
    <li class="hero__lists--item hero__lists--item__small js-slide">
        <a href="<?= get_sub_field('three_col_hero_b2_link'); ?>">
            <picture class="hero__lists--item__small--img">
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy" class="hero__lists--item__small--img-img"/>
                <button class="btn red hero__lists--item__small--img-btn"><?= get_sub_field('three_col_hero_b2_label'); ?></button>
            </picture>
        </a>
    </li>
    <li class="hero__lists--item hero__lists--item__small js-slide">
        <a href="<?= get_sub_field('three_col_hero_b3_link'); ?>">
            <picture class="hero__lists--item__small--img">
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
                <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy" class="hero__lists--item__small--img-img"/>
                <button class="btn primary hero__lists--item__small--img-btn"><?= get_sub_field('three_col_hero_b3_label'); ?></button>
            </picture>
        </a>
    </li>
    <button class="btn home-hero-caro js-hero-next" aria-label="Next">
        <svg class="icon">
            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"></use>
        </svg>
    </button>
  </ul>
</section>
<section class="hero">
    <figure class="hero__image-box span-6">
        <?php
        $img = get_sub_field('image');
        $src = $img['url'];
        $alt = getAcfImageAlt($img);
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
                <h1 class="hero__overlay__content-title clr-primary"><?= get_sub_field('title'); ?></h1>
                <p class="hero__overlay__content-paragraph"><?= get_sub_field('text'); ?></p>
            </div>
            <div class="header__top--btn">
                <a href="<?= get_sub_field('button_link'); ?>" class="btn primary hero__overlay--link">
                    <span><?= get_sub_field('button_label'); ?></span>
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                    </svg>
                </a>
            </div>
        </div>
    </figure>
</section>
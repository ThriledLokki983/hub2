<section class="prefooter">
    <figure class="prefooter__image-box span-6">
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
            class="prefooter__image-box--img"
        />
        <div class="overlay">
            <div class="overlay__content">
                <h1 class="overlay--title clr-primary"><?= get_sub_field('title') ?></h1>
                <p><?= get_sub_field('text') ?></p>
            </div>
            <div class="header__top--btn">
                <a href="<?= get_sub_field('button_link') ?>" class="btn bn primary">
                    <span><?= get_sub_field('button_label') ?></span>
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                    </svg>
                </a>
            </div>
        </div>
    </figure>
</section>
<section class="prefooter">
    <figure class="prefooter__image-box span-6">
        <?php
        $img = get_field('jobs_image', 'option');
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
                <h1 class="overlay__content-title clr-primary"><?= get_field('jobs_title', 'option') ?></h1>
                <p class="overlay__content-paragraph"><?= get_field('jobs_text', 'option') ?></p>
            </div>
            <div class="header__top--btn">
                <a href="<?= get_field('jobs_button_link', 'option') ?>" class="btn bn primary">
                    <span><?= get_field('jobs_button_label', 'option') ?></span>
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                    </svg>
                </a>
            </div>
        </div>
    </figure>
</section>
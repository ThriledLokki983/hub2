<?php $fields = get_fields(); ?>

<div class="categories__header--container">
    <div class="categories__header--container-left">
        <div class="categories__header--container-left-text">
            <picture class="hero__big--img">
                <?php
                $src = $fields['intro_image']['url'];
                $alt = getAcfImageAlt($fields['intro_image']);
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
                    <span><?= $fields['intro_image_overlay_title_1'] ?></span>
                    <h1><?= $fields['intro_image_overlay_title_2'] ?></h1>
                </div>
            </picture>
        </div>
    </div>
    <div class="categories__header--container-right">
        <div class="product-card-title-secondary">
            <span class="product-text"><?= $fields['intro_text_title_1'] ?></span>
            <h2 class="product-text"><?= $fields['intro_text_title_2'] ?></h2>
        </div>
        <div class="categories__header--container-right-text">
            <p class="paragraph"><?= $fields['intro_text_paragraph'] ?></p>
        </div>
        <a href="<?= $fields['intro_text_button_link'] ?>"
           class="btn black"><?= $fields['intro_text_button_label'] ?></a>
    </div>
</div>
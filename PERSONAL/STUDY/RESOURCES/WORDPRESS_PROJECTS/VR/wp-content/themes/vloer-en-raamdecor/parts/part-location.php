<?php $fields = get_fields('options'); ?>

<section class="location container--full">
    <h2 class="section--title size"><?= $fields['location_title'] ?></h2>
    <picture class="">
        <source srcset="<?= TPL_DIR_URI ?>/public/assets/img/new-location.jpg"
             media="(min-width: 75em)" type="image/jpg" />
         <source
             srcset="<?= TPL_DIR_URI ?>/public/assets/img/prefooter-mobile.png"
             media="(max-width: 600px)" type="image/png" />
         <img src="<?= TPL_DIR_URI ?>/public/assets/img/new-location.jpg"
             loading="lazy" decoding="async" alt="Location on the map" />

        <div class=" location-message">
            <article class="description">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= $fields['location_overlay_title_1'] ?></span>
                    <h2 class="product-text"><?= $fields['location_overlay_title_2'] ?></h2>
                </div>

                <p class="paragraph"><?= $fields['location_overlay_text'] ?></p>

                <a href="<?= $fields['location_button_link'] ?>"
                   class="btn primary small inline-block"><?= $fields['location_button_label'] ?></a>
            </article>
        </div>
    </picture>
</section>
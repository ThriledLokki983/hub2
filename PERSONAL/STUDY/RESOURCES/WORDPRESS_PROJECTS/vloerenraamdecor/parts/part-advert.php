<?php $fields = get_fields('options'); ?>

<?php if ($fields['advert_show'] === 'Y') : ?>
    <section class="advert">
        <div class="close-btn">
            <svg class="icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-times"></use>
            </svg>
        </div>
        <figure class="advert--image">
            <div class="advert-content">
                <div class="product-card-title-primary">
                    <span class="product-text"><?= $fields['advert_title_1'] ?></span>
                    <h2 class="product-text align-left"><?= $fields['advert_title_2'] ?></h2>
                </div>
                <div class="bottom-content">
                    <a href="<?= $fields['advert_button_link'] ?>" class="btn small"><?= $fields['advert_button_label'] ?></a>
                </div>
            </div>
        </figure>
    </section>
<?php endif; ?>
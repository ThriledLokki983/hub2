<section class="inspiration">
    <h2 class="section--title"><?= get_sub_field('inspiration_title') ?></h2>
    <article class="inspiration__content">
        <ul class="inspiration__scroller snaps-inline">
            <?php $items = get_sub_field('inspiration_items'); ?>
            <?php foreach ($items as $item) : ?>
                <figure class="inspiration__scroller--item effect-dexter">
                    <?php
                    $img = $item['image'];
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                    <figcaption class="more-info__content">
                        <div class="product-card-title-primary">
                            <span class="product-text"><?= $item['title_1'] ?></span>
                            <h2 class="product-text"><?= $item['title_2'] ?></h2>
                        </div>
                        <p class="product-text small-text"><?= $item['text'] ?></p>
                        <a href="<?= $item['button_link'] ?>"><button class="btn primary small"><?= $item['button_label'] ?></button></a>
                    </figcaption>
                </figure>
            <?php endforeach; ?>
        </ul>
        <div class="inspiration__controls">
            <div class="button-group">
                <button class="btn primary left-btn slick-previous slick-arrow" aria-label="Previous">
                    <svg class="icon">
                        <use
                                xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-left"
                        ></use>
                    </svg>
                </button>
                <button class="btn primary right-btn slick-next slick-arrow" aria-label="Next">
                    <svg class="icon">
                        <use
                                xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"
                        ></use>
                    </svg>
                </button>
            </div>
            <a class="btn primary"
               href="<?= get_sub_field('inspiration_button_link') ?>"><?= get_sub_field('inspiration_button_label') ?></a>
        </div>
    </article>
</section>
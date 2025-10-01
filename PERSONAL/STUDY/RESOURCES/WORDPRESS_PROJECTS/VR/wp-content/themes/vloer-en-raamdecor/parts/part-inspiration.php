<section class="inspiration">
    <h2 class="section--title"><?= get_sub_field('inspiration_title') ?></h2>
    <article class="inspiration__content">
        <ul class="inspiration__scroller snaps-inline">
            <?php $items = get_sub_field('inspiration_items'); ?>
            <?php foreach ($items as $item) : ?>
                <li class="inspiration__scroller--item">
                    <figure>
                        <?php
                        $img = $item['image'];
                        $src = $img['url'];
                        $alt = getAcfImageAlt($img);
                        ?>
                        <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                        <figcaption class="inspiration__scroller__content">
                            <div class="caption--title">
                                <span><?= $item['title_1'] ?></span>
                                <h2><?= $item['title_2'] ?></h2>
                            </div>
                            <p class="caption--text"><?= $item['text'] ?></p>
                            <a href="<?= $item['button_link'] ?>"><button class="btn primary small"><?= $item['button_label'] ?></button></a>
                        </figcaption>
                    </figure>
                </li>
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
            <div class="loader">
        <div class="loader-inner cube-transition">
          <div></div>
          <div></div>
        </div>
      </div>
    </article>
</section>
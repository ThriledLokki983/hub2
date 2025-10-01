<?php $fields = get_fields('options'); ?>

<section class="rating container--small">
    <h2 class="section--title"><?= $fields['reviews_title'] ?></h2>
    <div class="rating__content">
        <p class="paragraph">
            <?php
            $score = '<span>8.9</span>';
            $reviewsCount = '<span>1772</span>';

            $reviewsScoreString = $fields['reviews_score_string'];
            $reviewsScoreString = str_replace('{score}', $score, $reviewsScoreString);
            $reviewsScoreString = str_replace('{reviewsCount}', $reviewsCount, $reviewsScoreString);

            echo $reviewsScoreString;
            ?>
        </p>
        <article class="rating__content--footer">
            <div class="rating__content--footer-stars">
                <svg class="icon">
                    <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"
                    ></use>
                </svg>
                <svg class="icon">
                    <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"
                    ></use>
                </svg>
                <svg class="icon">
                    <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"
                    ></use>
                </svg>
                <svg class="icon">
                    <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"
                    ></use>
                </svg>
                <svg class="icon">
                    <use
                            xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"
                    ></use>
                </svg>
            </div>
            <figure>
                <img src="<?= TPL_DIR_URI ?>/public/assets/img/rating-photo.png" alt="" loading="lazy"/>
            </figure>
        </article>
</section>
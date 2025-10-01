<?php $fields = get_fields('options'); ?>

<section class="rating container--small">
    <div class="klantenvertellen">
        <h2 class="section--title"><?= $fields['reviews_title'] ?></h2>
        <div class="rating__content">
            <p class="paragraph">
                <?php
                if (!isset($reviews)) {
                    $stream = file_get_contents(ABSPATH . 'wp-content/themes/vloer-en-raamdecor/reviews.json');
                    $reviews = json_decode($stream);
                }
                $score = '<span>' . $reviews->averageRating . '</span>';
                $reviewsCount = '<span>' . $reviews->numberReviews . '</span>';

                $reviewsScoreString = $fields['reviews_score_string'];
                $reviewsScoreString = str_replace('{score}', $score, $reviewsScoreString);
                $reviewsScoreString = str_replace('{reviewsCount}', $reviewsCount, $reviewsScoreString);

                echo $reviewsScoreString;
                ?>
            </p>
            <?php
            if (!empty($reviews->averageRating)) : ?>
                <a href="https://www.klantenvertellen.nl/reviews/1038616/woninginrichting-aanhuis.nl" target="_blank"
                   class="header-rating part-rating">
                    <div class="star-ratings-css">
                        <div class="star-ratings-css-top"
                             style="width: <?php echo str_replace('.', '', $reviews->averageRating); ?>% !important;">
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                        </div>
                        <div class="star-ratings-css-bottom">
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                            <svg class="header-reviews__icon-box-icon icon star">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
                            </svg>
                        </div>
                    </div>
                    <img class="rating-logo" src="<?= TPL_DIR_URI ?>/public/assets/img/klanten-vertellen-logo.png" alt="Klanten vertelllen">
                </a>
            <?php endif; ?>
        </div>
</section>
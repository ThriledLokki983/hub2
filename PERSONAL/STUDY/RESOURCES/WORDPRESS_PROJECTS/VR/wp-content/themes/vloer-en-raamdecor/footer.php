<?php $fields = get_fields('options'); ?>

<footer class="footer">
    <section class="footer__content">
        <div class="content">
            <div class="content__first">
                <div class="first_top">
                    <h2 class="footer__column--title"><?= $fields['footer_hours_title'] ?></h2>
                    <ul class="content__lists">
                        <?php foreach ($fields['footer_hours_table'] as $item) : ?>
                            <li class="content__lists--item">
                                <span><?= $item['day'] ?></span>
                                <span>: <?= $item['hours'] ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="first_bottom">
                    <ul>
                        <?php foreach ($fields['footer_logos'] as $logo) : ?>
                            <li>
                                <a href="<?= $logo['link'] ?>" target="_blank" arial-label="Affiliate supports">
                                    <?php
                                    $img = $logo['logo'];
                                    $src = $img['url'];
                                    $alt = getAcfImageAlt($img);
                                    ?>
                                    <img src="<?= $src ?>" alt="<?= $alt ?>">
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            <div class="content__second">
                <h2 class="footer__column--title"><?= $fields['footer_address_title'] ?></h2>
                <ul class="content__lists">
                    <?php foreach ($fields['footer_address_lines'] as $item) : ?>
                        <li class="content__lists--item">
                            <span><?= $item['line'] ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <ul class="content__lists--social">
                    <?php foreach ($fields['footer_socials'] as $item) : ?>
                        <li class="content__lists--item">
                            <a href="<?= $item['link'] ?>" target="_blank" aria-label="Social media link">
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-<?= $item['icon'] ?>"></use>
                                </svg>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="content__last">
                <div class="klantenvertellen ratings-container reviews">
                    <?php
                    $stream = file_get_contents(ABSPATH . 'wp-content/themes/vloer-en-raamdecor/reviews.json');
                    $reviews = json_decode($stream);
                    if (!empty($reviews->averageRating) && !empty($reviews->numberReviews)) : ?>
                        <a href="https://www.klantenvertellen.nl/reviews/1038616/woninginrichting-aanhuis.nl" target="_blank">
                            <div class="top-rating-container">
                                <div class="star-ratings-css">
                                    <div class="star-ratings-css-top"
                                         style="width: <?php echo str_replace('.', '', $reviews->averageRating); ?>% !important;">
                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                    </div>
                                    <div class="star-ratings-css-bottom">
                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                    </div>
                                </div>
                                <span class="average">
                                    <?php echo $reviews->averageRating; ?> van 5
                                </span>
                                <span class="total-rating">
                                    <?php echo $reviews->numberReviews; ?>
                                    beoordelingen
                                </span>
                            </div>
                        </a>
                        <div class="reviews-container">
                            <?php
                            $customerReviews = $reviews->reviews->reviews;
                            $numberOfReviews = 2;
                            if ($numberOfReviews > count($customerReviews) - 1) $numberOfReviews = $customerReviews;
                            for($i = 0;$i < $numberOfReviews; $i++) : ?>
                                <div class="review">
                                    <div class="ratings">
                                        <div class="star-ratings-css">
                                                    <span class="star-ratings-css-top"
                                                          style="width: <?php echo str_replace('.', '', $reviews->averageRating); ?>% !important;">
                                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                                    </span>
                                            <span class="star-ratings-css-bottom">
                                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                                    </span>
                                        </div>
                                        <div class="custom-review-rating">
                                            <?= (float) $customerReviews[$i]->rating / 2; ?> / 5
                                        </div>
                                    </div>
                                    <span class="text"><?= $customerReviews[$i]->reviewContent->reviewContent[1]->rating; ?></span>
                                    <span class="name">
                                        <?= $customerReviews[$i]->reviewAuthor; ?>
                                    </span>
                                </div>
                            <?php endfor; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
    <section class="footer__copyright">
        <div class="content">
            <p class="footer__copyright-copy">
                <?php
                $copyright = $fields['footer_copyright'];
                echo str_replace('{year}', date('Y'), $copyright);
                ?>
            </p>

            <?= wp_nav_menu([
                'theme_location' => 'footer',
                'depth' => -1,
                'container_class' => 'footer__copyright-text'
            ]); ?>
        </div>
    </section>
</footer>

<?= get_template_part('parts/part', 'advert'); ?>

<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>

<?php wp_footer(); ?>
</body>
</html>
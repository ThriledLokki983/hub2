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
                                <a href="<?= $logo['link'] ?>" target="_blank">
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
                            <a href="<?= $item['link'] ?>" target="_blank">
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-<?= $item['icon'] ?>"></use>
                                </svg>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="content__last">
                <picture>
                    <source media="(max-width: 768px)" srcset="<?= TPL_DIR_URI ?>/public/assets/img/footer-card.png"
                            type="image/webp"/>
                    <source srcset="<?= TPL_DIR_URI ?>/public/assets/img/footer-card.png" type="image/png"/>
                    <img src="<?= TPL_DIR_URI ?>/public/assets/img/footer-card.png" alt="" loading="lazy"/>
                </picture>
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
            <p class="footer__copyright-text">
                <?= wp_nav_menu([
                    'theme_location' => 'footer',
                    'depth' => -1
                ]); ?>
            </p>
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
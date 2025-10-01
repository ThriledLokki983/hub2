<?php if (empty($_SESSION['dhwec']['employee'])) : ?>
    <?php if (get_the_id() !== 13093) : ?>
        <footer class="footer">
            <div class="footer__top">
                <div class="footer__top__column">
                    <ul class="footer__top__column--list">
                        <?php
                        $locations = get_nav_menu_locations();
                        $menu = get_term($locations['footer-left'], 'nav_menu');
                        $items = wp_get_nav_menu_items($menu);
                        foreach ($items as $item) : ?>
                            <li class="footer__top__column--list-item">
                                <a href="<?= $item->url ?>" class="link">
                                    <svg class="icon">
                                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                    </svg>
                                    <span><?= $item->title ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="footer__top__column">
                    <ul class="footer__top__column--list">
                        <?php
                        $locations = get_nav_menu_locations();
                        $menu = get_term($locations['footer-right'], 'nav_menu');
                        $items = wp_get_nav_menu_items($menu);
                        foreach ($items as $item) : ?>
                            <li class="footer__top__column--list-item">
                                <a href="<?= $item->url ?>" class="link">
                                    <svg class="icon">
                                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                    </svg>
                                    <span><?= $item->title ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="footer__top__column">
                    <div class="footer__top__column--content">
                        <div class="footer__top__column--content-top">
                            <a href="<?= get_site_url(); ?>">
                                <img
                                        loading="lazy"
                                        decoding="async"
                                        src="<?= TPL_DIR_URI ?>/public/assets/img/logo-dhw.svg"
                                        alt="Logo"
                                        width="300"
                                        height="200"
                                />
                            </a>
                        </div>
                        <div class="footer__top__column--content-bottom">
                            <ul class="social-media-list">
                                <li>
                                    <a
                                            href="https://www.linkedin.com/company/de-haan-westerhoff/"
                                            target="_blank"
                                            class="link"
                                            aria-label="LinkedIn link"
                                    >
                                        <svg class="icon">
                                            <use
                                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-linkedin"
                                            ></use>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                            href="https://www.instagram.com/dehaanwesterhoff/"
                                            target="_blank"
                                            class="link"
                                            aria-label="Instagram link"
                                    >
                                        <svg class="icon">
                                            <use
                                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-instagram"
                                            ></use>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                            href="https://www.facebook.com/dehaanwesterhoff/"
                                            target="_blank"
                                            class="link"
                                            aria-label="Facebook link"
                                    >
                                        <svg class="icon">
                                            <use
                                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-facebook"
                                            ></use>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                            href="https://www.youtube.com/channel/UC8ErwjJBFS25RWSeGk-wnAQ"
                                            target="_blank"
                                            class="link"
                                            aria-label="Youtube link"
                                    >
                                        <svg class="icon">
                                            <use
                                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-youtube"
                                            ></use>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="footer__top__column">
                    <div class="side">
                        <ul class="footer__top__column--list">
                            <?php
                            $locations = get_nav_menu_locations();
                            $menu = get_term($locations['footer-locations-left'], 'nav_menu');
                            $items = wp_get_nav_menu_items($menu);
                            foreach ($items as $item) : ?>
                                <li class="footer__top__column--list-item">
                                    <a href="<?= $item->url ?>" class="link">
                                        <svg class="icon">
                                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                        </svg>
                                        <span><?= $item->title ?></span>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                        <ul class="footer__top__column--list">
                            <?php
                            $locations = get_nav_menu_locations();
                            $menu = get_term($locations['footer-locations-right'], 'nav_menu');
                            $items = wp_get_nav_menu_items($menu);
                            foreach ($items as $item) : ?>
                                <li class="footer__top__column--list-item">
                                    <a href="<?= $item->url ?>" class="link">
                                        <svg class="icon">
                                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                        </svg>
                                        <span><?= $item->title ?></span>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <ul class="footer__top__column--list mt-1">
                        <?php
                        $locations = get_nav_menu_locations();
                        $menu = get_term($locations['footer-legal'], 'nav_menu');
                        $items = wp_get_nav_menu_items($menu);
                        foreach ($items as $item) : ?>
                            <li class="footer__top__column--list-item">
                                <a href="<?= $item->url ?>" class="link">
                                    <svg class="icon">
                                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                                    </svg>
                                    <span class="bold"><?= $item->title ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            <div class="footer__bottom">
                <p>
                    &copy; <?= date('Y') ?> · De Haan Westerhoff · webontwikkeling door
                    <a href="https://wiersma-ict.nl" target="_blank" class="link">Wiersma ICT & Custard</a>
                </p>
            </div>
        </footer>
    <?php endif; ?>
<?php endif; ?>

<?php wp_footer(); ?>

<div class="consent">
    <p>
        Deze site gebruikt cookies om de site handiger te maken en te leren hoe bezoekers de site gebruiken. Dit laatste gebeurt met geanonimiseerde data. Door op de knop 'Ja ik ga akkoord' te klikken of door verder te surfen op deze website ga je akkoord met het plaatsen van deze cookies.
    </p>

    <a href="http://dhwz-v2.local" class="btn primary">
        <span>Ja, ik ga akkoord</span>
        <svg class="icon">
            <use xlink:href="http://dhwz-v2.local/wp-content/themes/dhwz/public/assets/icons/sprites.svg#icon-chevron-right"></use>
        </svg>
    </a>
</div>

</body>
</html>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="supported-color-schemes" content="light dark"/>
    <meta name="msapplication-TileColor" content="#ffffff"/>
    <meta name="theme-color" content="#ffffff"/>

    <meta name="facebook-domain-verification" content="95hm12v8efzcw4et2n6kpdmcrcknp9"/>
    <meta name="facebook-domain-verification" content="3p48o0y1pe6dqi1f47gzg5yomvh2yr"/>

    <?php wp_head(); ?>

    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-75838041-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-75838041-1');
    </script>
    <!-- Google Tag Manager -->

    <!-- Microsoft Advertising -->
    <script>(function (w, d, t, r, u) {
            var f, n, i;
            w[u] = w[u] || [], f = function () {
                var o = {ti: "5599038"};
                o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
            }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () {
                var s = this.readyState;
                s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
            }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
        })(window, document, "script", "//bat.bing.com/bat.js", "uetq");</script>
    <!-- Microsoft Advertising -->

    <!-- Hotjar Tracking Code for -->
    <script>
        (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () {
                (h.hj.q = h.hj.q || []).push(arguments)
            };
            h._hjSettings = {hjid: 2186887, hjsv: 6};
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    </script>
    <!-- Hotjar Tracking Code -->
</head>
<body dir="ltr" <?php body_class(); ?>>
<!-- Google Tag Manager (noscript) -->
<noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T3PKFKS" height="0" width="0"
            style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->

<?php if (empty($_SESSION['dhwec']['employee'])) : ?>
    <?php if (get_the_id() !== 13093) : ?>
        <header class="header primary__header" data-header>
            <section class="header__top">
                <div class="header__top--tel">
                    <span class="header__top--tel-text">Hulp nodig?</span>
                    <a href="tel:+316512351333" class="header__top--tel-tel-number">(0512) 35 13 33</a>
                </div>
                <?php if(!empty($_SESSION['dhwec']['items'])) : ?>
                    <div class="header__top--cart">
                        <a href="<?= get_site_url(); ?>/aanvraag/" class="header__top--cart-link">
                            <svg class="icon header__top--cart-icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-basket"></use>
                            </svg>
                        </a>
                    </div>
                <?php endif; ?>
                <div class="header__top--btn">
                    <a href="<?= get_site_url(); ?>/offerte/" class="btn header__top--btn-bn">
                        <span class="header__top--btn-bn-text">Meteen een offerte aanvragen</span>
                        <svg class="icon">
                            <use
                                    xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"
                            ></use>
                        </svg>
                    </a>
                </div>
            </section>

            <section class="navbar header__bottom">
                <div class="header__bottom--logo-box">
                    <a href="<?= get_site_url(); ?>" class="header__bottom--logo">
                    	<picture class="logo">
                            <source srcset="<?= TPL_DIR_URI ?>/public/assets/img/logo-dhw.svg" type="image/webp">  <!-- Reinder: Could you replace the SVGfile in teh source for a png file as a fallback for when the SVG fails to load for any reason -->
                            <img src="<?= TPL_DIR_URI ?>/public/assets/img/logo-dhw.svg" alt="De Haan Westerhoff logo" class="header__bottom--logo-img">
                        </picture>
                    </a>
                </div>

                <nav
                    class="nav primary-navigation"
                    id="primary-navigation"
                    aria-label="Primary Navigation"
                >
                    <ul class="nav__lists" role="list" aria-label="Primary">
                        <?php
                        $locations = get_nav_menu_locations();
                        $megaMenus = get_field('mega_menus', 'option');
                        if (isset($locations['mega-menu'])) {
                            $menu = get_term($locations['mega-menu'], 'nav_menu');
                            if ($items = wp_get_nav_menu_items($menu->name)) {
                                foreach ($items as $item) {
                                    echo '<li class="nav__lists--item" data-id="' . $item->ID . '">';
                                    echo '<div class="nav__lists--item--link-content">';
                                    echo '<a href="' . $item->url . ' " class="nav__lists--item--link-content-link" aria-label="Navigation link">' . $item->title . '</a>';
                                        foreach ($megaMenus as $megaMenu) {
                                            if ($megaMenu['menu_item_id'] == $item->ID) {
                                                echo '<svg class="icon nav__lists--item--link-content-icon">';
                                                echo '<use xlink:href="' . TPL_DIR_URI . '/public/assets/icons/sprites.svg#icon-chevron-right"></use>';
                                                echo '</svg>';
                                                echo '</div>';

                                                echo '<div class="nav__lists--item--dropdown-content dropdown-content '. (count($megaMenu['menus']) == 1 ? 'single-column' : '') .' ">';
                                                echo '<div class="sub__menu">';
                                                foreach ($megaMenu['menus'] as $menu) {
                                                    echo '<ul class="sub__menu--lists">';
                                                    echo '<li class="sub__menu--lists--item">';
                                                    echo '<a href="#" class="sub__menu--lists--item-link">' . $menu['name'] . '</a>';
                                                    echo '</li>';

                                                    foreach ($menu['items'] as $item) {
                                                        echo '<li class="sub__menu--lists--item">';
                                                        echo '<a href="' . get_the_permalink($item['page_link']->ID) . '" class="sub__menu--lists--item-link" data-image="' . $item['image']['sizes']['thumbnail'] . '">' . $item['page_link']->post_title . '</a>';
                                                        echo '</li>';
                                                    }
                                                    echo '</ul>';
                                                }

                                                $img = $megaMenu['default_image'];
                                                $src = $img['sizes']['thumbnail'];
                                                $alt = getAcfImageAlt($img);

                                                echo '
                                                    <ul class="sub__menu--lists">
                                                        <li class="sub__menu--lists--item">
                                                            <picture>
                                                                <img
                                                                        class="nav-image"
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                        src="' . $src . '"
                                                                        alt="' . $alt . '"
                                                                />
                                                            </picture>
                                                        </li>
                                                    </ul>';
                                                echo '</div>';
                                                echo '</div>';
                                            }
                                        }
                                    echo '</li>';
                                }
                            }
                        }
                        ?>
                        <div class="header__nav__cart">
                                <a href="<?= get_site_url(); ?>/offerte/" class="btn">
                                <span class="text">Meteen een offerte aanvragen</span>
                                <svg class="icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"
                                    ></use>
                                </svg>
                            </a>
                            <a href="<?= get_site_url(); ?>/aanvraag/" class="link">
                                <svg class="icon cart-icon">
                                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-basket"></use>
                                </svg>
                            </a>
                        </div>
                    </ul>
                </nav>

                <template id="burger-template">
					<button
						type="button"
						class="burger"
						aria-label="Menu"
						aria-expanded="false"
						aria-controls="mainnav"
					>
						<span class="burger__line" aria-hidden="true"></span>
						<span class="burger__line" aria-hidden="true"></span>
						<span class="burger__line" aria-hidden="true"></span>
					</button>
				</template>
            </section>
        </header>
    <?php endif; ?>
<?php endif; ?>

<?php echo do_shortcode('[dhwec-sales-bar]'); ?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <?php wp_head(); ?>
</head>

<?php
$extraBodyClasses = [];

if (
    is_page_template('template-floors.php') ||
    is_page_template('template-products.php') ||
    is_product() ||
    is_page_template('template-cart.php')
) {
    $extraBodyClasses[] = 'page-categories';
}

if (is_page_template('template-type.php')) {
    $extraBodyClasses[] = 'floor__type-page';
}

if (is_page_template('template-cart.php')) {
    $extraBodyClasses[] = 'cart-page';
}
?>

<body <?php body_class(implode('', $extraBodyClasses)); ?>>
<?php $fields = get_fields('options'); ?>

<header class="header size">
    <section class="top" aria-labelledby="top-search-bar">
        <form class="top__search" role="search" method="get" id="searchform" action="/">
            <div class="top__search--input">
                <span><?= $fields['header_affiliate_text'] ?></span>
                <picture>
                    <?php
                    $img = $fields['header_affiliate_logo'];
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <source media="(max-width: 767px)" srcset="<?= $src ?>"/>
                    <source media="(min-width: 768px)" srcset="<?= $src ?>"/>
                    <img
                            src="<?= $src ?>"
                            alt="<?= $alt ?>"
                            id="logo"
                            class="m-t-08"
                            loading="lazy"
                    />
                </picture>
                <div class="top__search--input-box">
                    <button type="submit">
                        <svg class="top__search--input-box-icon icon">
                            <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-search"></use>
                        </svg>
                    </button>
                    <input
                            type="text"
                            class="search-field"
                            placeholder="<?= $fields['header_search_placeholder'] ?>"
                            name="s"
                    />
                </div>
            </div>
            <div class="button-box">
                <a href="<?= $fields['header_button_1_link'] ?>"
                   class="btn secondary mob-sm"><?= $fields['header_button_1_label'] ?></a>
                <a href="<?= $fields['header_button_2_link'] ?>"
                   class="btn green mob-sm"><?= $fields['header_button_2_label'] ?></a>
            </div>
        </form>
    </section>
    <section class="header-reviews">
        <div class="header-reviews__icon-box">
            <svg class="header-reviews__icon-box-icon icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
            </svg>
            <svg class="header-reviews__icon-box-icon icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
            </svg>
            <svg class="header-reviews__icon-box-icon icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
            </svg>
            <svg class="header-reviews__icon-box-icon icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
            </svg>
            <svg class="header-reviews__icon-box-icon icon">
                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full"></use>
            </svg>
        </div>
        <div class="header-reviews__text">
            <span>
            <?php
            $reviewsCount = 1772;
            echo str_replace('{reviewsCount}', $reviewsCount, $fields['header_score_string']);
            ?>
            </span>
        </div>
    </section>
    <section class="nav m-t--7">
        <div class="logo--box">
            <a href="/" class="nav__logo-link">
                <div class="nav__logo">
                    <picture class="logo">
                        <?php
                        $img = $fields['header_logo'];
                        $src = $img['url'];
                        $alt = getAcfImageAlt($img);
                        ?>
                        <source
                                media="(max-width: 767px)"
                                srcset="<?= $src ?>"
                        />
                        <source
                                media="(min-width: 768px)"
                                srcset="<?= $src ?>"
                        />
                        <img src="<?= TPL_DIR_URI ?>" alt="<?= $alt ?>" id="logo"/>
                    </picture>
                </div>
            </a>
            <div class="mob-menu">
                <input class="menu__btn" type="checkbox" id="menu__btn"/>
                <label class="menu__icon" htmlFor="menu__btn">
                    <span class="navicon"></span>
                </label>
            </div>
        </div>
        <nav class="nav__container mobile--menu" aria-labelledby="primary-navigation">
            <ul class="nav__list menu">
                <?php
                $locations = get_nav_menu_locations();
                if (isset($locations['mega-menu'])) {
                    $menu = get_term($locations['mega-menu'], 'nav_menu');
                    if ($items = wp_get_nav_menu_items($menu->name)) {
                        foreach ($items as $item) {
                            if ($item->menu_item_parent == 0) {
                                echo '<li class="nav__list--item">';
                                echo '<a href="' . $item->url . '" class="nav__list--item-link">' . $item->title . '</a>';

                                $subMenuItems = [];
                                foreach ($items as $subMenuItem) {
                                    if ($item->ID == $subMenuItem->menu_item_parent) {
                                        $subMenuItems[] = $subMenuItem;
                                    }
                                }

                                if (!empty($subMenuItems)) {
                                    echo '<ul class="sub__menu">';
                                    foreach ($subMenuItems as $subMenuItem) {
                                        echo '<li class="sub__menu--item">';
                                        echo '<a class="sub__menu--item-link" href="' . $subMenuItem->url . '">';
                                        echo '<span>' . $subMenuItem->title . '</span>';
                                        echo '</a>';
                                        echo '</li>';
                                    }
                                    echo '<li class="sub__menu--item-last">';
                                    echo '<span>' . $fields['mega_menu_title_1'] . '</span>';
                                    $img = $fields['mega_menu_image'];
                                    $src = $img['url'];
                                    $alt = getAcfImageAlt($img);
                                    echo '<img src="' . $src . '" alt="' . $alt . '">';
                                    echo '<span>' . $fields['mega_menu_title_2'] . '</span>';
                                    echo '</li>';
                                    echo '</ul>';
                                }
                                echo '</li>';
                            }
                        }
                    }
                }
                ?>
            </ul>
        </nav>
    </section>
</header>
<?php
    if (!is_front_page()) {
        echo get_breadcrumbs();
    }
?>
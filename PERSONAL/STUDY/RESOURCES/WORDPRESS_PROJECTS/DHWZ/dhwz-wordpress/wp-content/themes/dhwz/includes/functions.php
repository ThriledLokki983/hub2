<?php
/**
 * Function for retrieving page content (content builder).
 *
 * @return void
 */
function dhwz_content_builder()
{
    if (have_rows('content_builder')) {
        while (have_rows('content_builder')) {
            the_row();

            get_template_part('parts/part', get_row_layout());
        }
    }
}

/**
 * Get ACF image alt.
 *
 * @param array $imageObj An ACF image object as array
 *
 * @return string The content for the alt attribute of the image
 */
function getAcfImageAlt($imageObj)
{
    $alt = $imageObj['title'];

    if (!empty($imageObj['alt'])) {
        $alt = $imageObj['alt'];
    }

    return $alt;
}

/**
 * Gets the id of the topmost ancestor of the current page. Returns the current posts's ID if there is no parent.
 *
 * @param int|bool $post_id
 *
 * @return int|bool parent post id
 * @uses object $post - global $post object
 */
function dhwz_get_post_top_ancestor_id($post_id = false)
{
    global $post;

    if ($post_id) {
        $post = get_post($post_id);
    }

    if (!is_object($post)) {
        return;
    }

    if ($post->post_parent) {
        $ancestors = array_reverse(get_post_ancestors($post->ID));

        return $ancestors[0];
    }

    return $post->ID;
}

/**
 * HTML block for rendering a location on the locations page.
 *
 * @param $location
 *
 * @return false|string
 */
function dhwz_location_html($location)
{
    ob_start(); ?>

    <li class="products__lists--item" id="<?= strtolower($location['city']) ?>">
        <div class="products__lists--item--photo">
            <picture>
                <?php
                $src = $location['image']['url'];
                $alt = getAcfImageAlt($location['image']);
                ?>
                <img loading="lazy" decoding="async"
                     src="<?= $src ?>"
                     alt="<?= $alt ?>"
                />
            </picture>
        </div>
        <div class="products__lists--item--text">
            <header class="products__lists--item--text--header">
                <h3>De Haan Westerhoff</h3>
                <h2><?= $location['city'] ?></h2>
            </header>
            <div class="products__lists--item--text--address">
                <div class="address">
                    <span><?= $location['address'] ?></span>
                    <span><?= $location['zipcode_city'] ?></span>
                </div>
                <div class="contact">
                    <?php if ($location['is_showroom'] === 'Y') : ?>
                        <span>
                            <svg class="icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-map-marker-check"></use>
                            </svg>
                            Showroom
                        </span>
                    <?php endif; ?>
                    <a href="tel:<?= $location['phone_link'] ?>"><?= $location['phone'] ?></a>
                </div>
            </div>
            <a href="<?= $location['google_route_link'] ?>" class="btn">
                <span>Route naar DHW <?= $location['city'] ?></span>
                <svg class="icon">
                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                </svg>
            </a>
        </div>
    </li>

    <?php return ob_get_clean();
}

/**
 * Trim excerpt for.
 *
 * @param $content
 * @param $length
 *
 * @return false|string
 */
function trimExcerpt($content, $length)
{
    $result = str_replace('[&hellip;]', '', $content);
    return substr($result, 0, $length) . ' ...';
}
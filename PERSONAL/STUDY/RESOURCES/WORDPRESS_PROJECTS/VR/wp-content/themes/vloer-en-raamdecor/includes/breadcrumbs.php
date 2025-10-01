<?php

function get_breadcrumbs()
{
    global $post;

    if(!isset($post->post_type)) {
        return;
    }

    $items = [];
    $tpl = TPL_DIR_URI;
    $html = null;
    $count = WC()->cart->get_cart_contents_count();

    $current_item = $post->ID;

    if ($post->post_type === 'product')
    {
        if (!is_tax()) $items[] = get_post($current_item);

        $categories = get_the_terms( $current_item, 'product_cat');
        if ($categories[0]) {
            $current_category = $categories[0]->term_id;
            while($current_category) {
                $current_category = get_term($current_category);
                $items[] = $current_category;
                echo '</pre>';
                if (!is_object($current_category) || !property_exists($current_category, 'parent') || $current_category->parent === 0) {
                    break;
                }
                $current_category = $current_category->parent;
            }
        }
    } else {
        while($current_item) {
            $items[] = get_post($current_item);
            $current_item = get_post_parent($current_item);
        }
    }

    $items = array_reverse($items);
    $html = '<div class="breadcrumbs-container container"><ul class="breadcrumbs container"><li class="breadcrumbs--item"> <a href="/" class="breadcrumbs--item-link"> Home </a></li>';

    if (count($items) > 0)
    {
        foreach ($items as $item) {
            setup_postdata($item);
            if ($item->taxonomy === 'product_cat')
            {
                $item_title = $item->name;
                $item_link = str_replace('producten/', '', get_term_link( $item->term_id, 'product_cat' ));

                if (!get_page_by_path(str_replace(get_site_url(), '', $item_link))) continue;
            } else {
                $item_title = get_the_title($item);
                $item_link = get_permalink($item);
            }

            if (strtolower($item_title) !== 'geen categorie')
            {
                $html .= <<<EOD
                            <li class="breadcrumbs--item">
                                 <svg class="icon">
                                        <use xlink:href="$tpl/public/assets/icons/sprite.svg' ?>#icon-chevron-right"
                                        ></use>
                                </svg>
                                <a class="breadcrumbs--item-link" href="$item_link">$item_title</a>
                            </li>
                        EOD;
            }

        }
        $html .= '</ul>';
    }
    if (is_page('offerte-aanvragen'))
    {
        $html .= <<<EOD
            <span class="number-of-products"><svg class="icon"><use xlink:href="$tpl/public/assets/icons/sprite.svg' ?>#icon-receipt"></use>
            </svg>&nbsp; $count artikelen</span>
        EOD;
    }
    $html .= '</div>';
return $html;
}

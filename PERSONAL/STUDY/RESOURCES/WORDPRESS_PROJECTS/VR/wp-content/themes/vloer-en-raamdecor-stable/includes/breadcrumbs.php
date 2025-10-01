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

    $current_item = $post->ID;

    if ($post->post_type === 'product')
    {
        $items[] = get_post($current_item);
        $categories = get_the_terms( $current_item, 'product_cat');
        if ($categories[0]) $items[] = $categories[0];
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
                $item_link = get_term_link( $item->term_id, 'product_cat' );
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
        $html .= '<span class="number-of-products">&#x1f5cf; ' . WC()->cart->get_cart_contents_count() . ' artiekelen</span>';
    }
    $html .= '</div>';
return $html;
}

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

    if (count($items) > 0)
    {
        $html = '<ul class="breadcrumbs">';
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

            $html .= <<<EOD
            <li class="breadcrumbs--item">
                 <svg class="icon">
                        <use xlink:href="$tpl . '/public/assets/icons/sprite.svg' ?>#icon-chevron-right" ></use>
                </svg>
                <a href="$item_link">$item_title</a>
            </li>
        EOD;
        }
        $html .= '</ul>';
    }

    return $html;
}
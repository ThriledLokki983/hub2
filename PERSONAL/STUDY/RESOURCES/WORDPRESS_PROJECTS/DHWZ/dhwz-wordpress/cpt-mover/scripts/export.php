<?php
/*
|--------------------------------------------------------------------------
| Include required files for this script
|--------------------------------------------------------------------------
*/
require_once '../../wp-load.php';
require_once '../includes/functions.php';

/*
|--------------------------------------------------------------------------
| Export dimensions
|--------------------------------------------------------------------------
*/
$dimensions = new WP_Query([
    'post_type'      => 'dhwec_dimensions',
    'posts_per_page' => -1
]);

if ($dimensions->have_posts()) {
    $output = [];

    while ($dimensions->have_posts()) {
        $dimensions->the_post();

        $entry = [];
        $entry['id'] = get_the_id();
        $entry['title'] = get_the_title();
        $entry['dimensions_table_type'] = get_field('dimensions_table_type');
        $entry['dimensions_x_axis_data_label'] = get_field('dimensions_x_axis_data_label');
        $entry['dimensions_y_axis_data_label'] = get_field('dimensions_y_axis_data_label');
        $entry['dimensions_x_axis_minimum_value'] = get_field('dimensions_x_axis_minimum_value');
        $entry['dimensions_x_axis_maximum_value'] = get_field('dimensions_x_axis_maximum_value');
        $entry['dimensions_y_axis_minimum_value'] = get_field('dimensions_y_axis_minimum_value');
        $entry['dimensions_reversed_x_axis_minimum_value'] = get_field('dimensions_reversed_x_axis_minimum_value');
        $entry['dimensions_reversed_x_axis_maximum_value'] = get_field('dimensions_reversed_x_axis_maximum_value');
        $entry['dimensions_reversed_y_axis_maximum_value'] = get_field('dimensions_reversed_y_axis_maximum_value');
        $entry['dimensions'] = get_field('dimensions');
        $output[] = $entry;
    }

    wp_reset_postdata();

    writeOutputToFile('../data/dimensions.json', $output);
}

/*
|--------------------------------------------------------------------------
| Export color sets
|--------------------------------------------------------------------------
*/
$color_sets = new WP_Query([
    'post_type'      => 'dhwec_color_set',
    'posts_per_page' => -1
]);

if ($color_sets->have_posts()) {
    $output = [];

    while ($color_sets->have_posts()) {
        $color_sets->the_post();

        $entry = [];
        $entry['id'] = get_the_id();
        $entry['title'] = get_the_title();
        $entry['color_set'] = get_field('dhwec_color_set');
        $output[] = $entry;
    }

    wp_reset_postdata();

    writeOutputToFile('../data/color_sets.json', $output);
}

/*
|--------------------------------------------------------------------------
| Export products
|--------------------------------------------------------------------------
*/
$products = new WP_Query([
    'post_type'      => 'dhwec_product',
    'posts_per_page' => -1
]);

if ($products->have_posts()) {
    $output = [];

    while ($products->have_posts()) {
        $products->the_post();

        $entry = [];
        $entry['id'] = get_the_id();
        $entry['wp_title'] = get_the_title();
        $entry['export_code'] = get_field('dhwec_export_code');
        $entry['display_title'] = get_field('dhwec_display_title');
        $entry['title'] = get_field('dhwec_title');
        $entry['type'] = get_field('dhwec_type');
        $entry['description'] = get_field('dhwec_description');
        $entry['image'] = get_field('dhwec_image');
        $entry['fields'] = get_field('dhwec_fields');
        $output[] = $entry;
    }

    wp_reset_postdata();

    writeOutputToFile('../data/products.json', $output);
}

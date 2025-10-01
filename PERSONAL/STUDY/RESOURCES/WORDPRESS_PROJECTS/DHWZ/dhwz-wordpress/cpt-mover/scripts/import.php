<?php
ini_set('memory_limit','256M');

/*
|--------------------------------------------------------------------------
| Include required files for this script
|--------------------------------------------------------------------------
*/
define('WP_USE_THEMES', false);
require_once '../../wp-load.php';
include_once('../../wp-admin/includes/admin.php');
require_once '../includes/functions.php';

/*
|--------------------------------------------------------------------------
| Delete old dimensions
|--------------------------------------------------------------------------
*/
$dimensions = new WP_Query([
    'post_type'      => 'dhwec_dimensions',
    'posts_per_page' => -1,
    'post_status'    => 'any'
]);

if ($dimensions->have_posts()) {
    while ($dimensions->have_posts()) {
        $dimensions->the_post();

        // delete post
        wp_delete_post(get_the_id(), true);
    }

    wp_reset_postdata();
}

/*
|--------------------------------------------------------------------------
| Delete old color sets including attached media
|--------------------------------------------------------------------------
*/
$color_set = new WP_Query([
    'post_type'      => 'dhwec_color_set',
    'posts_per_page' => -1,
    'post_status'    => 'any'
]);

if ($color_set->have_posts()) {
    while ($color_set->have_posts()) {
        $color_set->the_post();

        // delete images
        $rows = get_field('dhwec_color_set');
        foreach ($rows as $row) {
            $image = $row['dhwec_color_set_image'];
            if (!empty($image)) {
                if (is_attachment($image['id'])) {
                    wp_delete_attachment($image['id'], false);
                }
            }
        }

        // delete post
        wp_delete_post(get_the_id(), true);
    }

    wp_reset_postdata();
}

/*
|--------------------------------------------------------------------------
| Delete old products including attached media
|--------------------------------------------------------------------------
*/
$products = new WP_Query([
    'post_type'      => 'dhwec_product',
    'posts_per_page' => -1,
    'post_status'    => 'any'
]);

if ($products->have_posts()) {
    while ($products->have_posts()) {
        $products->the_post();

        // delete main image of product
        $image = get_field('dhwec_image');
        if (!empty($image)) {
            if (is_attachment($image['id'])) {
                wp_delete_attachment($image['id'], false);
            }
        }

        // delete images of option select options
        $fields = get_field('dhwec_fields');
        if (!empty($fields)) {
            foreach ($fields as $field) {
                $options = $field['dhwec_option_select_visual_options'];
                if (!empty($options)) {
                    foreach ($options as $option) {
                        $image = $option['dhwec_option_select_visual_options_image'];
                        if (!empty($image)) {
                            if (is_attachment($image['id'])) {
                                wp_delete_attachment($image['id'], false);
                            }
                        }
                    }
                }
            }
        }

        // delete post
        wp_delete_post(get_the_id(), true);
    }

    wp_reset_postdata();
}

/*
|--------------------------------------------------------------------------
| Stores relations between old and new post ID's
|--------------------------------------------------------------------------
*/
$dimension_relations = [];
$color_set_relations = [];

/*
|--------------------------------------------------------------------------
| Import dimensions
|--------------------------------------------------------------------------
*/
$json = file_get_contents('../data/dimensions.json');
$items = json_decode($json);

foreach ($items as $item) {
    // create new post
    $post_id = wp_insert_post([
        'post_title'  => $item->title,
        'post_type'   => 'dhwec_dimensions',
        'post_status' => 'publish'
    ]);

    // set relation between the old and new post ID
    $dimension_relations[$item->id] = $post_id;

    // update fields
    update_field('dimensions_table_type', $item->dimensions_table_type, $post_id);
    update_field('dimensions_x_axis_data_label', $item->dimensions_x_axis_data_label, $post_id);
    update_field('dimensions_y_axis_data_label', $item->dimensions_y_axis_data_label, $post_id);
    update_field('dimensions_x_axis_minimum_value', $item->dimensions_x_axis_minimum_value, $post_id);
    update_field('dimensions_x_axis_maximum_value', $item->dimensions_x_axis_maximum_value, $post_id);
    update_field('dimensions_y_axis_minimum_value', $item->dimensions_y_axis_minimum_value, $post_id);
    update_field('dimensions_reversed_x_axis_minimum_value', $item->dimensions_reversed_x_axis_minimum_value, $post_id);
    update_field('dimensions_reversed_x_axis_maximum_value', $item->dimensions_reversed_x_axis_maximum_value, $post_id);
    update_field('dimensions_reversed_y_axis_maximum_value', $item->dimensions_reversed_y_axis_maximum_value, $post_id);
    foreach ($item->dimensions as $dimension) {
        add_row('dimensions', (array)$dimension, $post_id);
    }
}

/*
|--------------------------------------------------------------------------
| Import color sets
|--------------------------------------------------------------------------
*/
$json = file_get_contents('../data/color_sets.json');
$items = json_decode($json);

foreach ($items as $item) {
    // create new post
    $post_id = wp_insert_post([
        'post_title'  => $item->title,
        'post_type'   => 'dhwec_color_set',
        'post_status' => 'publish'
    ]);

    // set relation between the old and new post ID
    $color_set_relations[$item->id] = $post_id;

    // update fields
    $rows = [];

    foreach ($item->color_set as $entry) {
        $url = $entry->dhwec_color_set_image->url;
        $media_id = saveImageToMediaLibrary($url);

        $row = [
            'dhwec_color_set_image'            => $media_id,
            'dhwec_color_set_name'             => $entry->dhwec_color_set_name,
            'dhwec_color_set_ral'              => $entry->dhwec_color_set_ral,
            'dhwec_color_set_recommended'      => $entry->dhwec_color_set_recommended,
            'dhwec_color_set_price_difference' => $entry->dhwec_color_set_price_difference
        ];

        $rows[] = $row;
    }

    update_field('dhwec_color_set', $rows, $post_id);
}

/*
|--------------------------------------------------------------------------
| Import products
|--------------------------------------------------------------------------
*/
$json = file_get_contents('../data/products.json');
$items = json_decode($json);

// stores repeater field values for later use
$option_select_entries = [];
$option_select_visual_entries = [];
$checkboxes_entries = [];

foreach ($items as $item) {
    // create new post
    $post_id = wp_insert_post([
        'post_title'  => $item->wp_title,
        'post_type'   => 'dhwec_product',
        'post_status' => 'publish'
    ]);

    // update fields
    update_field('dhwec_export_code', $item->export_code, $post_id);
    update_field('dhwec_display_title', $item->display_title, $post_id);
    update_field('dhwec_title', $item->title, $post_id);
    update_field('dhwec_type', $item->type, $post_id);
    update_field('dhwec_description', $item->description, $post_id);
    update_field('dhwec_image', saveImageToMediaLibrary($item->image->url), $post_id);

    // keeps track of field index
    $count = 1;

    foreach ($item->fields as $field) {
        $row = [];
        $row['dhwec_field'] = $field->dhwec_field;
        $row['dhwec_section_title'] = $field->dhwec_section_title;
        $row['dhwec_section_description'] = $field->dhwec_section_description;
        $row['dhwec_section_margin'] = $field->dhwec_section_margin;
        $row['dhwec_measurements_f1_handle'] = $field->dhwec_measurements_f1_handle;
        $row['dhwec_measurements_f1_name'] = $field->dhwec_measurements_f1_name;
        $row['dhwec_measurements_f1_label'] = $field->dhwec_measurements_f1_label;
        $row['dhwec_measurements_f1_min_value'] = $field->dhwec_measurements_f1_min_value;
        $row['dhwec_measurements_f1_max_value'] = $field->dhwec_measurements_f1_max_value;
        $row['dhwec_measurements_f1_info_window'] = $field->dhwec_measurements_f1_info_window;
        $row['dhwec_measurements_f2_handle'] = $field->dhwec_measurements_f2_handle;
        $row['dhwec_measurements_f2_name'] = $field->dhwec_measurements_f2_name;
        $row['dhwec_measurements_f2_label'] = $field->dhwec_measurements_f2_label;
        $row['dhwec_measurements_f2_min_value'] = $field->dhwec_measurements_f2_min_value;
        $row['dhwec_measurements_f2_max_value'] = $field->dhwec_measurements_f2_max_value;
        $row['dhwec_measurements_f2_info_window'] = $field->dhwec_measurements_f2_info_window;
        $row['dhwec_measurements_f3_handle'] = $field->dhwec_measurements_f3_handle;
        $row['dhwec_measurements_f3_name'] = $field->dhwec_measurements_f3_name;
        $row['dhwec_measurements_f3_label'] = $field->dhwec_measurements_f3_label;
        $row['dhwec_measurements_f3_min_value'] = $field->dhwec_measurements_f3_min_value;
        $row['dhwec_measurements_f3_max_value'] = $field->dhwec_measurements_f3_max_value;
        $row['dhwec_measurements_f3_info_window'] = $field->dhwec_measurements_f3_info_window;

        $dimensions = false;
        if (!empty($field->dhwec_measurements_dimensions)) {
            $relation = $dimension_relations[$field->dhwec_measurements_dimensions];
            if (!empty($relation)) {
                $dimensions = $relation;
            }
        }
        $row['dhwec_measurements_dimensions'] = $dimensions;

        $row['dhwec_measturements_exceeding_allowed'] = $field->dhwec_measturements_exceeding_allowed;
        $row['dhwec_measurements_margin'] = $field->dhwec_measurements_margin;
        $row['dhwec_design_select_handle'] = $field->dhwec_design_select_handle;
        $row['dhwec_design_select_name'] = $field->dhwec_design_select_name;
        $row['dhwec_design_select_label'] = $field->dhwec_design_select_label;
        $row['dhwec_design_select_info_window'] = $field->dhwec_design_select_info_window;

        $color_set = false;
        if (!empty($field->dhwec_design_select_color_set)) {
            $relation = $color_set_relations[$field->dhwec_design_select_color_set];
            if (!empty($relation)) {
                $color_set = $relation;
            }
        }
        $row['dhwec_design_select_color_set'] = $color_set;

        $row['dhwec_design_select_show_ral_input'] = $field->dhwec_design_select_show_ral_input;
        $row['dhwec_design_select_margin'] = $field->dhwec_design_select_margin;
        $row['dhwec_toggle_handle'] = $field->dhwec_toggle_handle;
        $row['dhwec_toggle_name'] = $field->dhwec_toggle_name;
        $row['dhwec_toggle_label'] = $field->dhwec_toggle_label;
        $row['dhwec_toggle_info_window'] = $field->dhwec_toggle_info_window;
        $row['dhwec_toggle_o1_label'] = $field->dhwec_toggle_o1_label;
        $row['dhwec_toggle_o1_value'] = $field->dhwec_toggle_o1_value;
        $row['dhwec_toggle_o1_recommended'] = $field->dhwec_toggle_o1_recommended;
        $row['dhwec_toggle_o1_price_difference'] = $field->dhwec_toggle_o1_price_difference;
        $row['dhwec_toggle_o2_label'] = $field->dhwec_toggle_o2_label;
        $row['dhwec_toggle_o2_value'] = $field->dhwec_toggle_o2_value;
        $row['dhwec_toggle_o2_recommended'] = $field->dhwec_toggle_o2_recommended;
        $row['dhwec_toggle_o2_price_difference'] = $field->dhwec_toggle_o2_price_difference;
        $row['dhwec_toggle_margin'] = $field->dhwec_toggle_margin;
        $row['dhwec_option_select_handle'] = $field->dhwec_option_select_handle;
        $row['dhwec_option_select_name'] = $field->dhwec_option_select_name;
        $row['dhwec_option_select_label'] = $field->dhwec_option_select_label;
        $row['dhwec_option_select_info_window'] = $field->dhwec_option_select_info_window;

        if ($field->dhwec_field === 'dhwec_field_option_select') {
            $entry = [
                'post'    => $post_id,
                'row_idx' => $count,
                'rows'    => $field->dhwec_option_select_options
            ];

            $option_select_entries[] = $entry;
        }

        $row['dhwec_option_select_margin'] = $field->dhwec_option_select_margin;
        $row['dhwec_option_select_visual_handle'] = $field->dhwec_option_select_visual_handle;
        $row['dhwec_option_select_visual_name'] = $field->dhwec_option_select_visual_name;
        $row['dhwec_option_select_visual_label'] = $field->dhwec_option_select_visual_label;
        $row['dhwec_option_select_visual_info_window'] = $field->dhwec_option_select_visual_info_window;

        if ($field->dhwec_field === 'dhwec_field_option_select_visual') {
            $entry = [
                'post'    => $post_id,
                'row_idx' => $count,
                'rows'    => $field->dhwec_option_select_visual_options
            ];

            $option_select_visual_entries[] = $entry;
        }

        $row['dhwec_option_select_visual_margin'] = $field->dhwec_option_select_visual_margin;
        $row['dhwec_checkboxes_label'] = $field->dhwec_checkboxes_label;
        $row['dhwec_checkboxes_info_window'] = $field->dhwec_checkboxes_info_window;

        if ($field->dhwec_field === 'dhwec_field_checkboxes') {
            $entry = [
                'post'    => $post_id,
                'row_idx' => $count,
                'rows'    => $field->dhwec_checkboxes_options
            ];

            $checkboxes_entries[] = $entry;
        }

        $row['dhwec_checkboxes_margin'] = $field->dhwec_checkboxes_margin;
        $row['dhwec_conditional_logic'] = $field->dhwec_conditional_logic;

        add_row('dhwec_fields', $row, $post_id);


        $count++;
    }
}

/*
|--------------------------------------------------------------------------
| Import repeater fields for 'option_select'
|--------------------------------------------------------------------------
*/
foreach ($option_select_entries as $entry) {
    $repeater = new WP_Query([
        'p'         => $entry['post'],
        'post_type' => 'any'
    ]);

    if ($repeater->have_posts()) {
        while ($repeater->have_posts()) {
            $repeater->the_post();

            if (have_rows('dhwec_fields')) {
                while (have_rows('dhwec_fields')) {
                    the_row();

                    if (get_row_index() === $entry['row_idx']) {
                        foreach ($entry['rows'] as $row) {
                            $converted = (array)$row;
                            add_sub_row('dhwec_option_select_options', $converted);
                        }
                    }
                }
            }
        }
    }

    wp_reset_postdata();
}

/*
|--------------------------------------------------------------------------
| Import repeater fields for 'option_select_visual'
|--------------------------------------------------------------------------
*/
foreach ($option_select_visual_entries as $entry) {
    $repeater = new WP_Query([
        'p'         => $entry['post'],
        'post_type' => 'any'
    ]);

    if ($repeater->have_posts()) {
        while ($repeater->have_posts()) {
            $repeater->the_post();

            if (have_rows('dhwec_fields')) {
                while (have_rows('dhwec_fields')) {
                    the_row();

                    if (get_row_index() === $entry['row_idx']) {
                        foreach ($entry['rows'] as $row) {
                            $converted = (array)$row;

                            $image = saveImageToMediaLibrary(
                                $converted['dhwec_option_select_visual_options_image']->url
                            );

                            $converted['dhwec_option_select_visual_options_image'] = $image;

                            add_sub_row('dhwec_option_select_visual_options', $converted);
                        }
                    }
                }
            }
        }
    }

    wp_reset_postdata();
}

/*
|--------------------------------------------------------------------------
| Import repeater fields for 'checkboxes'
|--------------------------------------------------------------------------
*/
foreach ($checkboxes_entries as $entry) {
    $repeater = new WP_Query([
        'p'         => $entry['post'],
        'post_type' => 'any'
    ]);

    if ($repeater->have_posts()) {
        while ($repeater->have_posts()) {
            $repeater->the_post();

            if (have_rows('dhwec_fields')) {
                while (have_rows('dhwec_fields')) {
                    the_row();

                    if (get_row_index() === $entry['row_idx']) {
                        foreach ($entry['rows'] as $row) {
                            $converted = (array)$row;
                            add_sub_row('dhwec_checkboxes_options', $converted);
                        }
                    }
                }
            }
        }
    }

    wp_reset_postdata();
}

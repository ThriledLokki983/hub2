<?php
// start session
session_set_cookie_params([
    'secure'   => true,
    'samesite' => 'None'
]);

session_start();

// check if ACF Pro is installed
if (!class_exists('ACF')) {
    wp_die('DHW eCommerce needs ACF Pro to be installed in order to work. Please install ACF Pro and retry.');
}

// register post types
function dhwec_register_post_types()
{
    register_post_type('dhwec_product', array(
        'labels' => array(
            'name' => 'Products',
            'singular_name' => 'Product',
            'all_items' => 'All products',
            'menu_name' => 'DHW eCommerce',
            'add_new' => 'Add new',
            'add_new_item' => 'Add new product',
            'edit' => 'Edit',
            'edit_item' => 'Edit product',
            'new_item' => 'New product',
            'view_item' => 'View product',
            'view_items' => 'View products',
            'search_items' => 'Search products',
            'not_found' => 'No products found',
            'not_found_in_trash' => 'No products found in trash',
            'parent' => 'Parent product',
            'featured_image' => 'Product image',
            'set_featured_image' => 'Set product image',
            'remove_featured_image' => 'Remove product image',
            'use_featured_image' => 'Use as product image',
            'insert_into_item' => 'Insert into product',
            'uploaded_to_this_item' => 'Uploaded to this product',
            'filter_items_list' => 'Filter products',
            'items_list_navigation' => 'Products navigation',
            'items_list' => 'Products list'
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-store',
        'supports' => array('title')
    ));

    register_post_type('dhwec_color_set', array(
        'labels' => array(
            'name' => 'Color sets',
            'singular_name' => 'Color set',
            'all_items' => 'All color sets',
            'menu_name' => 'Color sets',
            'add_new' => 'Add new',
            'add_new_item' => 'Add new color set',
            'edit' => 'Edit',
            'edit_item' => 'Edit color set',
            'new_item' => 'New color set',
            'view_item' => 'View color set',
            'view_items' => 'View color sets',
            'search_items' => 'Search color sets',
            'not_found' => 'No color sets found',
            'not_found_in_trash' => 'No color sets found in trash',
            'parent' => 'Parent color set',
            'featured_image' => 'Color set image',
            'set_featured_image' => 'Set color set image',
            'remove_featured_image' => 'Remove color set image',
            'use_featured_image' => 'Use as color set image',
            'insert_into_item' => 'Insert into color set',
            'uploaded_to_this_item' => 'Uploaded to this color set',
            'filter_items_list' => 'Filter color sets',
            'items_list_navigation' => 'Color set navigation',
            'items_list' => 'Color set list'
        ),
        'public' => true,
        'has_archive' => false,
        'show_in_menu' => false,
        'supports' => array('title')
    ));

    register_post_type('dhwec_request', array(
        'labels' => array(
            'name' => 'Requests',
            'singular_name' => 'Request',
            'all_items' => 'All requests',
            'menu_name' => 'Request',
            'add_new' => 'Add new',
            'add_new_item' => 'Add new request',
            'edit' => 'Edit',
            'edit_item' => 'Edit request',
            'new_item' => 'New request',
            'view_item' => 'View request',
            'view_items' => 'View requests',
            'search_items' => 'Search requests',
            'not_found' => 'No requests found',
            'not_found_in_trash' => 'No requests found in trash',
            'parent' => 'Parent request',
            'featured_image' => 'Request image',
            'set_featured_image' => 'Set request image',
            'remove_featured_image' => 'Remove request image',
            'use_featured_image' => 'Use as request image',
            'insert_into_item' => 'Insert into request',
            'uploaded_to_this_item' => 'Uploaded to this request',
            'filter_items_list' => 'Filter requests',
            'items_list_navigation' => 'Requests navigation',
            'items_list' => 'Requests list'
        ),
        'public' => true,
        'has_archive' => false,
        'show_in_menu' => false,
        'supports' => array('title')
    ));

    register_post_type('dhwec_dimensions', array(
        'labels' => array(
            'name' => 'Dimensions',
            'singular_name' => 'Dimensions',
            'all_items' => 'All dimensions',
            'menu_name' => 'Dimensions',
            'add_new' => 'Add new',
            'add_new_item' => 'Add new dimension',
            'edit' => 'Edit',
            'edit_item' => 'Edit dimension',
            'new_item' => 'New dimension',
            'view_item' => 'View dimension',
            'view_items' => 'View dimensions',
            'search_items' => 'Search dimensions',
            'not_found' => 'No dimensions found',
            'not_found_in_trash' => 'No dimensions found in trash',
            'parent' => 'Parent dimension',
            'featured_image' => 'Dimension image',
            'set_featured_image' => 'Set dimension image',
            'remove_featured_image' => 'Remove dimension image',
            'use_featured_image' => 'Use as dimension image',
            'insert_into_item' => 'Insert into dimension',
            'uploaded_to_this_item' => 'Uploaded to this dimension',
            'filter_items_list' => 'Filter dimensions',
            'items_list_navigation' => 'Dimensions navigation',
            'items_list' => 'Dimensions list'
        ),
        'public' => true,
        'has_archive' => false,
        'show_in_menu' => false,
        'supports' => array('title')
    ));

    register_post_type('dhwec_employees', array(
        'labels' => array(
            'name' => 'Employees',
            'singular_name' => 'Employees',
            'all_items' => 'All employees',
            'menu_name' => 'Employees',
            'add_new' => 'Add new',
            'add_new_item' => 'Add new employee',
            'edit' => 'Edit',
            'edit_item' => 'Edit employee',
            'new_item' => 'New employee',
            'view_item' => 'View employee',
            'view_items' => 'View employees',
            'search_items' => 'Search employees',
            'not_found' => 'No employees found',
            'not_found_in_trash' => 'No employees found in trash',
            'parent' => 'Parent employee',
            'featured_image' => 'Request employee',
            'set_featured_image' => 'Set employee image',
            'remove_featured_image' => 'Remove employee image',
            'use_featured_image' => 'Use as employee image',
            'insert_into_item' => 'Insert into employee',
            'uploaded_to_this_item' => 'Uploaded to this employee',
            'filter_items_list' => 'Filter employees',
            'items_list_navigation' => 'Employees navigation',
            'items_list' => 'Employees list'
        ),
        'public' => true,
        'has_archive' => false,
        'show_in_menu' => false,
        'supports' => array('title')
    ));
}

add_action('init', 'dhwec_register_post_types');

// add custom links to 'dhwec_product' admin menu item
function dhwec_add_admin_menu_links()
{
    add_submenu_page('edit.php?post_type=dhwec_product', 'Color sets', 'Color sets', 'manage_options', 'edit.php?post_type=dhwec_color_set');
    add_submenu_page('edit.php?post_type=dhwec_product', 'Requests', 'Requests', 'manage_options', 'edit.php?post_type=dhwec_request');
    add_submenu_page('edit.php?post_type=dhwec_product', 'Dimensions', 'Dimensions', 'manage_options', 'edit.php?post_type=dhwec_dimensions');
    add_submenu_page('edit.php?post_type=dhwec_product', 'Employees', 'Employees', 'manage_options', 'edit.php?post_type=dhwec_employees');
}

add_action('admin_menu', 'dhwec_add_admin_menu_links');

// add options page for catalog
if (function_exists('acf_add_options_page')) {
    acf_add_options_sub_page(array(
        'page_title' => 'Catalog',
        'menu_title' => 'Catalog',
        'parent_slug' => 'edit.php?post_type=dhwec_product',
    ));
}

// enqueue assets
function dhwec_enqueue_assets()
{
    $version = 'V51';

    // CSS
    wp_enqueue_style('dhw-ecommerce', plugins_url('/dhw-ecommerce/assets/css/dhw-ecommerce.css'), false, $version);

    // JS
    wp_enqueue_script('dhw-ecommerce', plugins_url('/dhw-ecommerce/assets/js/dhw-ecommerce.js'), array('jquery'), $version);
    wp_localize_script('dhw-ecommerce', 'dhwec_ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
}

add_action('wp_enqueue_scripts', 'dhwec_enqueue_assets');

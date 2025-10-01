<?php
// define constants
define('TPL_DIR_URI', get_template_directory_uri());

// include required files
require 'includes/functions.php';
require 'includes/enqueue.php';
require 'includes/theme-support.php';
require 'includes/theme-options.php';
require 'includes/nav-menus.php';
require 'includes/content-builder.php';
require 'includes/breadcrumbs.php';

// include AJAX handlers
require 'includes/ajax/calculate-price-by-square-meters.php';
require 'includes/ajax/calculate-price-by-number-of-packs.php';

function custom_override_checkout_fields( $fields ) {

    // unset($fields['billing']['billing_first_name']);
     unset($fields['billing']['billing_last_name']);
    unset($fields['billing']['billing_company']);

    unset($fields['billing']['billing_address_1']);
    unset($fields['billing']['billing_address_2']);
//    unset($fields['billing']['billing_city']);
    unset($fields['billing']['billing_postcode']);
    unset($fields['billing']['billing_country']);
    unset($fields['billing']['billing_state']);
//    unset($fields['billing']['billing_phone']);
//    unset($fields['order']['order_comments']);
    unset( $fields['additional_information'] );

    // unset($fields['billing']['billing_email']);
    // unset($fields['account']['account_username']);
    // unset($fields['account']['account_password']);
    // unset($fields['account']['account_password-2']);

    $fields['billing']['billing_city']['placeholder'] = 'Woonplaats';
    $fields['billing']['billing_city']['label'] = 'Woonplaats';
    $fields['billing']['billing_city']['priority'] = 71;
    $fields['billing']['billing_email']['placeholder'] = 'E-mail adres';
    $fields['billing']['billing_email']['label'] = 'E-mail adres';
    $fields['billing']['billing_email']['priority'] = 15;
    $fields['billing']['billing_phone']['placeholder'] = 'Telefoon';
    $fields['billing']['billing_phone']['label'] = 'Telefoon';
    $fields['billing']['billing_phone']['priority'] = 70;
    $fields['billing']['billing_first_name']['placeholder'] = 'Voor- en Achternaam';
    $fields['billing']['billing_first_name']['label'] = 'Voor- en Achternaam';
    $fields['order']['order_comments']['placeholder'] = 'Opmerking of vraag';
    $fields['order']['order_comments']['label'] = 'Opmerking/Vraag';

    return $fields;
}

add_filter( 'woocommerce_form_field' , 'remove_checkout_optional_text', 10, 4 );
function remove_checkout_optional_text( $field, $key, $args, $value ) {
    if( is_checkout() && ! is_wc_endpoint_url() ) {
        $optional = '&nbsp;<span class="optional">(' . esc_html__( 'optional', 'woocommerce' ) . ')</span>';
        $field = str_replace( $optional, '', $field );
    }
    return $field;
}

add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

function add_cart_on_checkout() {
    if ( is_wc_endpoint_url('order-received') ) return;
    echo do_shortcode('[woocommerce_cart]');
}

add_action('woocommerce_before_checkout_form', 'add_cart_on_checkout', 5);

// 2. Redirect cart page to checkout
add_action( 'template_redirect', function() {

// Replace "cart"  and "checkout" with cart and checkout page slug if needed
    if ( is_page( 'winkelwagen' ) ) {
        wp_redirect( '/offerte-aanvragen/' );
        die();
    }
} );

add_action('woocommerce_before_cart', function() {
    $str = '<h1>Offerte Aanvraag</h1>';

    return $str;
});

add_action('woocommerce_cart_calculate_fees', function() {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    WC()->cart->add_fee(__('Montage kosten', 'txtdomain'), 50);
});

// Redirect to home url from empty Woocommerce checkout page

add_filter( 'woocommerce_checkout_redirect_empty_cart', '__return_false' );
add_filter( 'woocommerce_checkout_update_order_review_expired', '__return_false' );
add_filter( 'woocommerce_cart_needs_payment', '__return_false' );

remove_action( 'woocommerce_checkout_order_review', 'woocommerce_checkout_payment', 20 );
add_action( 'woocommerce_checkout_after_order_review', 'woocommerce_checkout_payment', 10 );

add_action('woocommerce_checkout_init', 'disable_checkout_terms_and_conditions', 10 );
function disable_checkout_terms_and_conditions(){
    remove_action( 'woocommerce_checkout_terms_and_conditions', 'wc_checkout_privacy_policy_text', 20 );
    remove_action( 'woocommerce_checkout_terms_and_conditions', 'wc_terms_and_conditions_page_content', 30 );
}
//add_action( 'template_redirect', 'redirect_empty_checkout' );
//
//function redirect_empty_checkout() {
//    if ( is_checkout() && 0 == WC()->cart->get_cart_contents_count() && ! is_wc_endpoint_url( 'order-pay' ) && ! is_wc_endpoint_url( 'order-received' ) ) {
//        wp_safe_redirect(get_permalink( get_page_by_path( 'home' )->ID));
//        exit;
//    }
//}


remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);

remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
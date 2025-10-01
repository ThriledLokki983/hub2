<?php
// shortcode catalog
function dhwec_shortcode_catalog() {
    ob_start();
    include __DIR__ . '/../views/catalog.php';
    return ob_get_clean();
}

add_shortcode('dhwec-catalog', 'dhwec_shortcode_catalog');

// shortcode product
function dhwec_shortcode_product($atts) {
    $a = shortcode_atts(array(
        'code' => ''
    ), $atts);

    if (!empty($a['code'])) {
        ob_start();
        $id = get_product_id_by_export_code($a['code']);
        $data = get_fields($id);
        include __DIR__ . '/../views/product.php';
        return ob_get_clean();
    }
}

add_shortcode('dhwec-product', 'dhwec_shortcode_product');

// shortcode basket
function dhwec_shortcode_basket() {
    ob_start();
    include __DIR__ . '/../views/basket.php';
    return ob_get_clean();
}

add_shortcode('dhwec-basket', 'dhwec_shortcode_basket');

// shortcode details
function dhwec_shortcode_details() {
    ob_start();
    include __DIR__ . '/../views/details.php';
    return ob_get_clean();
}

add_shortcode('dhwec-details', 'dhwec_shortcode_details');

// shortcode endpoint
function dhwec_shortcode_endpoint() {
    ob_start();
    include __DIR__ . '/../views/endpoint.php';
    return ob_get_clean();
}

add_shortcode('dhwec-endpoint', 'dhwec_shortcode_endpoint');

// shortcode authorize
function dhwec_shortcode_authorize() {
    ob_start();
    include __DIR__ . '/../views/authorize.php';
    return ob_get_clean();
}

add_shortcode('dhwec-authorize', 'dhwec_shortcode_authorize');

// shortcode sales
function dhwec_shortcode_sales() {
    ob_start();
    include __DIR__ . '/../views/sales.php';
    return ob_get_clean();
}

add_shortcode('dhwec-sales', 'dhwec_shortcode_sales');

// shortcode sales bar
function dhwec_shortcode_sales_bar() {
    ob_start();
    include __DIR__ . '/../views/sales-bar.php';
    return ob_get_clean();
}

add_shortcode('dhwec-sales-bar', 'dhwec_shortcode_sales_bar');

<?php
function vr_ajax_calculate_price_by_square_meters()
{
    $calculation = calculatePriceBySquareMeters($_POST['productId'], $_POST['squareMeters']);

    header('Content-Type: application/json');
    echo json_encode($calculation);

    exit();
}

add_action('wp_ajax_vr_ajax_calculate_price_by_square_meters', 'vr_ajax_calculate_price_by_square_meters');
add_action('wp_ajax_nopriv_vr_ajax_calculate_price_by_square_meters', 'vr_ajax_calculate_price_by_square_meters');
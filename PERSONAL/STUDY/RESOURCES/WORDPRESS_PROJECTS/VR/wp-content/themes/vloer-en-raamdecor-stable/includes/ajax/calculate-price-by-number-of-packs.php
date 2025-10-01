<?php
function vr_ajax_calculate_price_by_number_of_packs()
{
    $calculation = calculatePriceByNumberOfPacks($_POST['productId'], $_POST['packsCount']);

    header('Content-Type: application/json');
    echo json_encode($calculation);

    exit();
}

add_action('wp_ajax_vr_ajax_calculate_price_by_number_of_packs', 'vr_ajax_calculate_price_by_number_of_packs');
add_action('wp_ajax_nopriv_vr_ajax_calculate_price_by_number_of_packs', 'vr_ajax_calculate_price_by_number_of_packs');
<?php
require_once '../wp-load.php';

function deleteUserIfExists($werknemersnummer) {
    $query = new WP_Query([
        'post_type'  => 'dhwec_employees',
        'meta_query' => array(
            array(
                'key'     => 'dhwec_employees_code',
                'value'   => $werknemersnummer,
                'compare' => '='
            )
        )
    ]);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            wp_delete_post(get_the_id(), true);
        }
    }

    wp_reset_postdata();
}

$input = $_POST;

// file_put_contents("post.log", print_r($_POST, true));

if ($input['actie'] === 'create') {
    // delete employee if exists (when performing an update)
     $werknemersnummer = $input['werknemersnummer'];
     deleteUserIfExists($werknemersnummer);

    $employee = [
        'post_title'   => $input['voornaam'] . ' ' . $input['achternaam'],
        'post_content' => '',
        'post_type'    => 'dhwec_employees',
        'post_status'  => 'publish'
    ];

    $employee_id = wp_insert_post($employee);
    update_field('dhwec_employees_code', $input['werknemersnummer'], $employee_id);
    update_field('dhwec_employees_password', $input['wachtwoord'], $employee_id);
	update_field('dhwec_employees_access', $input['toegang'], $employee_id);
    update_field('dhwec_employees_can_access_showroom_screen', false, $employee_id);

    if ($input['showroom'] === 'J') {
        update_field('dhwec_employees_is_showroom_employee', true, $employee_id);
    } elseif ($input['showroom'] === 'N') {
        update_field('dhwec_employees_is_showroom_employee', false, $employee_id);
    }

    $products = [];
    foreach ($input as $k => $v) {
        if (substr($k, 0, 3) === 'WEB') {
            if ($v === 'J') {
                $products[] = $k;
            }
        }
    }
    $products_json = json_encode($products);
    update_field('dhwec_employees_product_visibility', $products_json, $employee_id);
} elseif ($input['actie'] === 'delete') {
    // delete employee if exists
    $werknemersnummer = $input['werknemersnummer'];
    deleteUserIfExists($werknemersnummer);
}

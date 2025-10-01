<?php
// check measurements
function dhwec_check_measurements()
{
    // parameters
    $f1_value = $_POST['f1_value'];
    $f2_value = $_POST['f2_value'];
    $dimensions_id = $_POST['dimensions_id'];

    // check parameters
    if (!empty($f1_value) && !empty($f2_value) && !empty($dimensions_id)) {
        $table_type = strtolower(get_field('dimensions_table_type', $dimensions_id));
        $x_axis_label = strtolower(get_field('dimensions_x_axis_data_label', $dimensions_id));
        $y_axis_label = strtolower(get_field('dimensions_y_axis_data_label', $dimensions_id));
        $dimensions = get_field('dimensions', $dimensions_id);
        if ($table_type === 'regular') {
            $x_axis_min_val = get_field('dimensions_x_axis_minimum_value', $dimensions_id);
            $x_axis_max_val = get_field('dimensions_x_axis_maximum_value', $dimensions_id);
            $y_axis_min_val = get_field('dimensions_y_axis_minimum_value', $dimensions_id);

            if ($f1_value <= $x_axis_max_val) {
                if ($f1_value >= $x_axis_min_val && $f2_value >= $y_axis_min_val) {
                    foreach ($dimensions as $row) {
                        if ($row['dimensions_x_axis'] >= $f1_value) {
                            if ($row['dimensions_y_axis'] >= $f2_value) {
                                $response = [
                                    'error' => false,
                                    'error_code' => 'OK',
                                    'status' => 'Given measurements are possible.'
                                ];
                            } else {
                                $status = ' Op basis van de door u opgegeven ' . $x_axis_label;
                                $status .= ' moet de ' . $y_axis_label . ' tussen de ' . $y_axis_min_val;
                                $status .= ' mm en ' . $row['dimensions_y_axis'] . ' mm zijn.';

                                $response = [
                                    'error' => true,
                                    'error_code' => 'VALUES_NOT_POSSIBLE',
                                    'status' => $status
                                ];
                            }

                            break;
                        }
                    }
                } else {
                    $status = 'Voer een minimale ' . $x_axis_label . ' in van ' . $x_axis_min_val . ' mm ';
                    $status .= 'en een minimale ' . $y_axis_label . ' van ' . $y_axis_min_val . ' mm.';

                    $response = [
                        'error' => true,
                        'error_code' => 'VALUES_TOO_LOW',
                        'status' => $status
                    ];
                }
            } else {
                $response = [
                    'error' => true,
                    'error_code' => 'X_AXIS_VALUE_EXCEEDED',
                    'status' => 'De door u ingevoerde ' . $x_axis_label . ' is groter dan toegestaan (' . $x_axis_max_val . ' mm).'
                ];
            }
        } elseif ($table_type === 'reversed') {
            $x_axis_min_val = get_field('dimensions_reversed_x_axis_minimum_value', $dimensions_id);
            $x_axis_max_val = get_field('dimensions_reversed_x_axis_maximum_value', $dimensions_id);
            $y_axis_max_val = get_field('dimensions_reversed_y_axis_maximum_value', $dimensions_id);

            if ($f1_value >= $x_axis_min_val && $f1_value <= $x_axis_max_val) {
                $iterations = 0;
                $dimensions_count = count($dimensions);

                foreach ($dimensions as $row) {
                    $iterations++;

                    if ($row['dimensions_x_axis'] >= $f1_value || $iterations === $dimensions_count) {
                        if ($f2_value >= $row['dimensions_y_axis'] && $f2_value <= $y_axis_max_val) {
                            $response = [
                                'error' => false,
                                'error_code' => 'OK',
                                'status' => 'Given measurements are possible.'
                            ];
                        } else {
                            $status = ' Op basis van de door u opgegeven ' . $x_axis_label;
                            $status .= ' moet de ' . $y_axis_label . ' tussen de ' . $row['dimensions_y_axis'];
                            $status .= ' mm en ' . $y_axis_max_val . ' mm zijn.';

                            $response = [
                                'error' => true,
                                'error_code' => 'VALUES_NOT_POSSIBLE',
                                'status' => $status
                            ];
                        }

                        break;
                    }
                }
            } else {
                if ($f1_value > $x_axis_max_val) {
                    $error_code = 'X_AXIS_VALUE_EXCEEDED';
                } else {
                    $error_code = 'X_AXIS_VALUE_TOO_LOW';
                }

                $status = 'Voer een minimale ' . $x_axis_label . ' in van ' . $x_axis_min_val . ' mm ';
                $status .= 'en een maximale ' . $x_axis_label . ' van ' . $x_axis_max_val . ' mm.';

                $response = [
                    'error' => true,
                    'error_code' => $error_code,
                    'status' => $status
                ];
            }
        }
    } else {
        $response = [
            'error' => false,
            'error_code' => 'CHECK_INPUT',
            'status' => 'Not all required fields are filled.'
        ];
    }

    // return response as json
    wp_send_json($response);

    // exit
    exit();
}

add_action('wp_ajax_dhwec_check_measurements', 'dhwec_check_measurements');
add_action('wp_ajax_nopriv_dhwec_check_measurements', 'dhwec_check_measurements');

// checks the current request whether there is already a product with a control box or not
function dhwec_request_has_control_box()
{
    // parameters
    $identifier = $_POST['identifier'];

    // initiate $has_control_box and initially set to false
    $has_control_box = false;

    // check for control boxes in current request
    $items = $_SESSION['dhwec']['items'];

    if (!empty($identifier)) {
        if (!empty($items) && !empty($items[$identifier])) {
            unset($items[$identifier]);
        }
    }

    if (!empty($items)) {
        foreach ($items as $item) {
            $appbediening = $item['values']['appbediening'];
            if (!empty($appbediening)) {
                if ($appbediening['value'] === 'CO' || $appbediening['value'] === 'TA') {
                    $has_control_box = true;
                }
            }
        }
    }

    // return response
    $response = [
        'result' => $has_control_box
    ];

    header('Content-Type: application/json');
    echo json_encode($response);

    // exit
    exit();
}

add_action('wp_ajax_dhwec_request_has_control_box', 'dhwec_request_has_control_box');
add_action('wp_ajax_nopriv_dhwec_request_has_control_box', 'dhwec_request_has_control_box');

// checks the current request whether there is already a product having a remote control or not
function dhwec_request_has_remote_control()
{
    // parameters
    $identifier = $_POST['identifier'];

    // initiate $has_remote_control and initially set to false
    $has_remote_control = false;

    // check for remote controls in current request
    $items = $_SESSION['dhwec']['items'];

    if (!empty($identifier)) {
        if (!empty($items) && !empty($items[$identifier])) {
            unset($items[$identifier]);
        }
    }

    if (!empty($items)) {
        foreach ($items as $item) {
            $afstandsbediening = $item['values']['afstandsbediening'];
            if (!empty($afstandsbediening)) {
                if ($afstandsbediening['value'] === 'SITUO1' || $afstandsbediening['value'] === 'SITUO5') {
                    $has_remote_control = true;
                }
            }
        }
    }

    // return response
    $response = [
        'result' => $has_remote_control
    ];

    header('Content-Type: application/json');
    echo json_encode($response);

    // exit
    exit();
}

add_action('wp_ajax_dhwec_request_has_remote_control', 'dhwec_request_has_remote_control');
add_action('wp_ajax_nopriv_dhwec_request_has_remote_control', 'dhwec_request_has_remote_control');

// add item to basket handler
function dhwec_add_item_to_basket()
{
    // parameters
    $export_code = $_POST['export_code'];
    $display_title = $_POST['display_title'];
    $return_url = $_POST['return_url'];
    $identifier = $_POST['identifier'];
    $values = $_POST['values'];

    if (!empty($export_code) && !empty($display_title) && !empty($return_url) && !empty($values)) {
        // get session before update
        $sessionBeforeUpdate = $_SESSION;

        // index $values by handle
        $values = array_column($values, null, 'handle');

        // set session variables
        $_SESSION['dhwec']['php_session_id'] = session_id();

        $_SESSION['dhwec']['inmeetservice'] = $values['inmeetservice']['value'];
        $_SESSION['dhwec']['inmeetservice_label'] = $values['inmeetservice']['value_name'];

        $_SESSION['dhwec']['montageservice'] = $values['montageservice']['value'];
        $_SESSION['dhwec']['montageservice_label'] = $values['montageservice']['value_name'];

        $_SESSION['dhwec']['afhalen'] = $values['afhalen']['value'];
        $_SESSION['dhwec']['afhalen_label'] = $values['afhalen']['value_name'];

        $_SESSION['dhwec']['hulpmiddel'] = $values['hulpmiddel']['value'];
        $_SESSION['dhwec']['hulpmiddel_label'] = $values['hulpmiddel']['value_name'];

        $_SESSION['dhwec']['demontageservice_keuze'] = $values['demontageservice-keuze']['value'];
        $_SESSION['dhwec']['demontageservice_keuze_label'] = $values['demontageservice-keuze']['value_name'];

        $_SESSION['dhwec']['demontageservice'] = $values['demontageservice']['value'];
        $_SESSION['dhwec']['demontageservice_label'] = $values['demontageservice']['value_name'];

        // unset values from $values
        unset($values['inmeetservice']);
        unset($values['montageservice']);
        unset($values['afhalen']);
        unset($values['hulpmiddel']);
        unset($values['demontageservice-keuze']);
        unset($values['demontageservice']);

        if (!empty($identifier)) {
            $_SESSION['dhwec']['items'][$identifier]['values'] = $values;

            // log session activity
            logSessionActivity(
                session_id(),
                'Changed product in basket',
                $sessionBeforeUpdate,
                'Entered data: ' . print_r($values, true) . ' on product with identifier: ' . $identifier . '.',
                $_SESSION
            );
        } else {
            // build item
            $item = [
                'quantity' => 1,
                'export_code' => $export_code,
                'display_title' => $display_title,
                'return_url' => $return_url,
                'placement' => '',
                'values' => $values
            ];

            // set $uuid
            $uuid = uniqid();

            // set item
            $_SESSION['dhwec']['items'][$uuid] = $item;

            // log session activity
            logSessionActivity(
                session_id(),
                'Added product to basket',
                $sessionBeforeUpdate,
                'Entered data: ' . print_r($item, true) . '. Generated identifier: ' . $uuid . '.',
                $_SESSION
            );
        }
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_add_item_to_basket', 'dhwec_add_item_to_basket');
add_action('wp_ajax_nopriv_dhwec_add_item_to_basket', 'dhwec_add_item_to_basket');

// change quantity handler
function dhwec_change_quantity()
{
    // parameters
    $identifier = $_POST['identifier'];
    $quantity = $_POST['quantity'];

    if (!empty($identifier) && is_numeric($quantity)) {
        // get session before update
        $sessionBeforeUpdate = $_SESSION;

        if ($quantity >= 1) {
            // set new quantity
            $_SESSION['dhwec']['items'][$identifier]['quantity'] = $quantity;
        } else {
            unset($_SESSION['dhwec']['items'][$identifier]);
        }

        // log session activity
        logSessionActivity(
            session_id(),
            'Changed quantity of product',
            $sessionBeforeUpdate,
            'Set quantity of "' . $identifier . '" to ' . $quantity,
            $_SESSION
        );
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_change_quantity', 'dhwec_change_quantity');
add_action('wp_ajax_nopriv_dhwec_change_quantity', 'dhwec_change_quantity');

// clone item
function dhwec_clone_item()
{
    // get identifier
    $identifier = $_POST['identifier'];

    if (!empty($identifier)) {
        // get session before update
        $sessionBeforeUpdate = $_SESSION;

        // get item which to be cloned
        $clone = $_SESSION['dhwec']['items'][$identifier];

        // generate unique ID
        $uuid = uniqid();

        // create clone
        $_SESSION['dhwec']['items'][$uuid] = $clone;

        // log session activity
        logSessionActivity(
            session_id(),
            'Cloned item',
            $sessionBeforeUpdate,
            'Cloned: ' . $identifier . ' to ' . $uuid . '.',
            $_SESSION
        );
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_clone_item', 'dhwec_clone_item');
add_action('wp_ajax_nopriv_dhwec_clone_item', 'dhwec_clone_item');

// delete item handler
function dhwec_delete_item_from_basket()
{
    // get identifier
    $identifier = $_POST['identifier'];

    // unset item
    if (!empty($identifier)) {
        // get session before update
        $sessionBeforeUpdate = $_SESSION;

        unset($_SESSION['dhwec']['items'][$identifier]);

        // log session activity
        logSessionActivity(
            session_id(),
            'Deleted product from basket',
            $sessionBeforeUpdate,
            'Deleted product from basket with identifier: ' . $identifier . '.',
            $_SESSION
        );
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_delete_item_from_basket', 'dhwec_delete_item_from_basket');
add_action('wp_ajax_nopriv_dhwec_delete_item_from_basket', 'dhwec_delete_item_from_basket');

// change placement handler
function dhwec_change_placement()
{
    // get parameters from request
    $identifier = $_POST['identifier'];
    $placement = $_POST['placement'];

    // set new placement
    if (!empty($identifier) && !empty($placement)) {
        // get session before update
        $sessionBeforeUpdate = $_SESSION;

        $_SESSION['dhwec']['items'][$identifier]['placement'] = substr($placement, 0, 50);

        // log session activity
        logSessionActivity(
            session_id(),
            'Changed placement of a product',
            $sessionBeforeUpdate,
            'Set placement to: ' . $placement . '.',
            $_SESSION
        );
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_change_placement', 'dhwec_change_placement');
add_action('wp_ajax_nopriv_dhwec_change_placement', 'dhwec_change_placement');

// save request handler
function dhwec_save_request()
{
    // get session and details before any updates
    $sessionBeforeUpdate = $_SESSION;
    $detailsBeforeUpdate = json_decode(stripslashes($_POST['details']), true);

    // parameters
    $details = json_decode(stripslashes($_POST['details']), true);
    $session = $_SESSION['dhwec'];

    if (!empty($details) && !empty($session)) {
        // set "referentie" column to custom reference if set
        $reference_txt = $details['referentie-txt'];
        if (!empty($reference_txt)) {
            $details['referentie'] = $reference_txt;
            unset($details['referentie-txt']);
        }

        // replaces line breaks with a space in 'opmerkingen'
        // 20220314 Jaco: Commented the following two lines, because they do not correctly replace
        //      line breaks. They replace all occurrences of multiple consecutive whitespace
        //      characters.
        //$notes = trim(preg_replace('/\s\s+/', '<br>', $details['opmerkingen']));
        //$details['opmerkingen'] = $notes;

        // set salutation
        if ($details['aanhef'] === 'M') {
            $salutation = 'meneer';
        } elseif ($details['aanhef'] === 'V') {
            $salutation = 'mevrouw';
        }

        // set greeting
        $greeting = $salutation . ' ' . $details['achternaam'];
        if (!empty($details['bedrijf'])) {
            $greeting = $details['bedrijf'];
        }

        // build request
        $request = [
            'post_title' => 'Aanvraag van: ' . $greeting,
            'post_content' => '',
            'post_type' => 'dhwec_request',
            'post_status' => 'publish'
        ];

        // save request
        $request_id = wp_insert_post($request);
        // 20220311 Jaco: Added addslashes to the following two lines, because update_field calls
        //      stripslashes on the value passed to it.
        update_field('dhwec_request_details', addslashes(json_encode($details, JSON_UNESCAPED_UNICODE)), $request_id);
        update_field('dhwec_request_session', addslashes(json_encode($session, JSON_UNESCAPED_UNICODE)), $request_id);

        // update address
        $employee_code = $_SESSION['dhwec']['employee']['employee_code'];
        if (!empty($employee_code)) {
            $can_access_showroom = $_SESSION['dhwec']['employee']['employee_showroom'];
            if (!$can_access_showroom) {
                $employee_id = get_employee_id_by_code($employee_code);

                if (!empty($employee_id)) {
                    update_field('dhwec_employees_street', $details['straat'], $employee_id);
                    update_field('dhwec_employees_house_number', $details['huisnummer'], $employee_id);
                    update_field('dhwec_employees_house_number_addition', $details['toevoeging'], $employee_id);
                    update_field('dhwec_employees_postal_code', $details['postcode'], $employee_id);
                    update_field('dhwec_employees_city', $details['plaats'], $employee_id);
                    update_field('dhwec_employees_country', $details['land'], $employee_id);
                }
            }
        }

        // send confirmation email (if not in showroom)
        $showroom_employee = $_SESSION['dhwec']['employee']['employee_showroom'];
        $is_showroom_employee = (!empty($showroom_employee) ? $showroom_employee : false);
        if (!$is_showroom_employee) {
            $pdf = generate_pdf($request_id, $details, $session);
            if (!empty($pdf)) {
                send_confirmation_email($greeting, $request_id, $details['email'], $pdf);

                // delete PDF file
                unlink($pdf);
            }
        }

        // unset session variables
        unset($_SESSION['dhwec']['items']);
        unset($_SESSION['dhwec']['php_session_id']);
        unset($_SESSION['dhwec']['inmeetservice']);
        unset($_SESSION['dhwec']['inmeetservice_label']);
        unset($_SESSION['dhwec']['montageservice']);
        unset($_SESSION['dhwec']['montageservice_label']);
        unset($_SESSION['dhwec']['afhalen']);
        unset($_SESSION['dhwec']['afhalen_label']);
        unset($_SESSION['dhwec']['hulpmiddel']);
        unset($_SESSION['dhwec']['hulpmiddel_label']);
        unset($_SESSION['dhwec']['demontageservice_keuze']);
        unset($_SESSION['dhwec']['demontageservice_keuze_label']);
        unset($_SESSION['dhwec']['demontageservice']);
        unset($_SESSION['dhwec']['demontageservice_label']);
    }

    // log session activity
    logSessionActivity(
        session_id(),
        'Saved order',
        $sessionBeforeUpdate,
        print_r($detailsBeforeUpdate, true),
        $_SESSION
    );

    // exit
    exit();
}

add_action('wp_ajax_dhwec_save_request', 'dhwec_save_request');
add_action('wp_ajax_nopriv_dhwec_save_request', 'dhwec_save_request');

// update inmeetservice choice (from basket view)
function dhwec_update_inmeetservice_choice()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['inmeetservice'] = $value;
        $_SESSION['dhwec']['inmeetservice_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_inmeetservice_choice', 'dhwec_update_inmeetservice_choice');
add_action('wp_ajax_nopriv_dhwec_update_inmeetservice_choice', 'dhwec_update_inmeetservice_choice');

// update montageservice choice (from basket view)
function dhwec_update_montageservice_choice()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['montageservice'] = $value;
        $_SESSION['dhwec']['montageservice_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_montageservice_choice', 'dhwec_update_montageservice_choice');
add_action('wp_ajax_nopriv_dhwec_update_montageservice_choice', 'dhwec_update_montageservice_choice');

// update pickup location choice (from basket view)
function dhwec_update_pickup_location_choice()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['afhalen'] = $value;
        $_SESSION['dhwec']['afhalen_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_pickup_location_choice', 'dhwec_update_pickup_location_choice');
add_action('wp_ajax_nopriv_dhwec_update_pickup_location_choice', 'dhwec_update_pickup_location_choice');

// update floor choice (from basket view)
function dhwec_update_floor_choice()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['hulpmiddel'] = $value;
        $_SESSION['dhwec']['hulpmiddel_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_floor_choice', 'dhwec_update_floor_choice');
add_action('wp_ajax_nopriv_dhwec_update_floor_choice', 'dhwec_update_floor_choice');

// update demontageservice_keuze (from basket view)
function dhwec_update_demontageservice_keuze()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['demontageservice_keuze'] = $value;
        $_SESSION['dhwec']['demontageservice_keuze_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_demontageservice_keuze', 'dhwec_update_demontageservice_keuze');
add_action('wp_ajax_nopriv_dhwec_update_demontageservice_keuze', 'dhwec_update_demontageservice_keuze');

// update demontageservice (from basket view)
function dhwec_update_demontageservice()
{
    // parameters
    $value = $_POST['value'];
    $value_name = $_POST['value_name'];

    if (!empty($value) && !empty($value_name)) {
        $_SESSION['dhwec']['demontageservice'] = $value;
        $_SESSION['dhwec']['demontageservice_label'] = $value_name;
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_update_demontageservice', 'dhwec_update_demontageservice');
add_action('wp_ajax_nopriv_dhwec_update_demontageservice', 'dhwec_update_demontageservice');

// authorize
function dhwec_authorize()
{
    // parameters
    $code = $_POST['code'];
    $password = $_POST['password'];

    if (!empty($code) && !empty($password)) {
        $query = new WP_Query([
            'post_type' => 'dhwec_employees',
            'meta_query' => array(
                array(
                    'key' => 'dhwec_employees_code',
                    'value' => $code,
                    'compare' => '='
                )
            )
        ]);

        if ($query->have_posts()) {
            $query->the_post();

            $dbPass = get_field('dhwec_employees_password');

            if (verifyPassword($dbPass, $password)) {
                $can_access_showroom_screen = get_field('dhwec_employees_can_access_showroom_screen');

                // sign in employee
                $_SESSION['dhwec']['employee'] = array(
                    'employee_name' => get_the_title(),
                    'employee_code' => get_field('dhwec_employees_code'),
                    'employee_showroom' => $can_access_showroom_screen
                );

                // set redirect
                if ($can_access_showroom_screen === true) {
                    $redirect = '/inloggen-showroom/';
                } else {
                    $redirect = '/offerte/';
                }

                $response = [
                    'result' => true,
                    'redirect' => $redirect
                ];
            } else {
                $response = [
                    'result' => false,
                    'status' => 'Het ingevoerde wachtwoord is onjuist.'
                ];
            }
        } else {
            $response = [
                'result' => false,
                'status' => 'Er bestaat geen account onder dit werknemersnummer.'
            ];
        }

        wp_reset_postdata();
    } else {
        $response = [
            'result' => false,
            'status' => 'Voer alle verplichte velden in.'
        ];
    }

    // send response
    wp_send_json($response);

    // exit
    exit();
}

add_action('wp_ajax_dhwec_authorize', 'dhwec_authorize');
add_action('wp_ajax_nopriv_dhwec_authorize', 'dhwec_authorize');

// sign in sales employee
function dhwec_sign_in_sales_employee()
{
    // parameters
    $employee_name = $_POST['employee_name'];
    $employee_code = $_POST['employee_code'];

    if (!empty($employee_name) && !empty($employee_code)) {
        $_SESSION['dhwec']['employee'] = array(
            'employee_name' => $employee_name,
            'employee_code' => $employee_code,
            'employee_showroom' => true
        );
    }

    // exit
    exit();
}

add_action('wp_ajax_dhwec_sign_in_sales_employee', 'dhwec_sign_in_sales_employee');
add_action('wp_ajax_nopriv_dhwec_sign_in_sales_employee', 'dhwec_sign_in_sales_employee');

// sign out sales employee
function dhwec_sign_out_sales_employee()
{
    unset($_SESSION['dhwec']['employee']);

    // exit
    exit();
}

add_action('wp_ajax_dhwec_sign_out_sales_employee', 'dhwec_sign_out_sales_employee');
add_action('wp_ajax_nopriv_dhwec_sign_out_sales_employee', 'dhwec_sign_out_sales_employee');

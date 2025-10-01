<?php
// set up WordPress environment
require_once '../wp-load.php';
require_once 'functions.php';

// get last exported request ID
$last_id = intval(getLastExportedRequestID());

// for debugging purposes
echo 'Last exported request has ID: <b>' . $last_id . '</b><br>';

// get requests
global $wpdb;
$table_prefix = $wpdb->prefix;
$q = '';
$q .= "SELECT ID FROM {$table_prefix}posts ";
$q .= "WHERE post_type = 'dhwec_request' ";
$q .= "AND post_status = 'publish'";
$q .= "AND id = 35907";
$requests = $wpdb->get_results($q);

// check if there are new requests
if (!empty($requests)) {
    // $products stores all newly requested products (including customer details) grouped by their export code
    $products = [];

    // store all newly requested products in $products (grouped by export code)
    foreach ($requests as $request) {
        // get request id
        $id = $request->ID;

        // get customer details and products for this request
        $field_details = get_field('dhwec_request_details', $id);
        // $field_details = str_replace('\'', '"', $field_details);
        $field_details = json_decode($field_details, true);
        $field_session = json_decode(get_field('dhwec_request_session', $id), true);

        // write products to $products (grouped by export code)
        foreach ($field_session['items'] as $k => $v) {
            // get values, quantity and export code for this product
            $values = $v['values'];
            $quantity = $v['quantity'];
            $export_code = $v['export_code'];
            $placement = $v['placement'];

            // change $values to a simple key/value structure
            $export_values = [];
            foreach ($values as $value) {
                $export_values[$value['handle']] = $value['value'];
            }

            // unset referentie txt field if set
            if (isset($field_details['referentie-txt'])) {
                unset($field_details['referentie-txt']);
            }

            // merge details and values to one array called $product
            $product = array_merge($field_details, $export_values);

            // add column 'id' to $product
            $product['id'] = $id;

            // add column 'referentiecode' to $product
            $product['referentiecode'] = 'WO-' . date('Y') . $id;

            // add column 'offerte-referentie' to $product it's empty
            if (empty($product['offertereferentie'])) {
                $product['offertereferentie'] = '';
            }

            // add column 'product-referentie' to $product
            $product['productreferentie'] = $placement;

            // add columns for employee details to $product
            if (!empty($field_session['employee'])) {
                $product['gebruiker'] = $field_session['employee']['employee_code'];
                $product['bedrijf'] = 'GRA';

                if ($field_session['employee']['employee_showroom'] === false) {
                    $product['personeelsnummer'] = $field_session['employee']['employee_code'];
                } else {
                    $product['personeelsnummer'] = '';
                }
            } else {
                $product['gebruiker'] = 1;
                $product['bedrijf'] = 'GRA';
                $product['personeelsnummer'] = '';
            }

            $product['inmeetservice'] = $field_session['inmeetservice'];
            $product['montageservice'] = $field_session['montageservice'];
            $product['afhalen'] = $field_session['afhalen'];

			$hulpmiddel = $field_session['hulpmiddel'];
			if (!empty($hulpmiddel)) {
				$product['hulpmiddel'] = $hulpmiddel;
			} else {
				$product['hulpmiddel'] = 'GEEN';
			}

            $product['demontageservice'] = $field_session['demontageservice'];

            // add fixed columns if they are not already present
            $fixed_columns = [
                'breedte',
                'hoogteuitvaldiepte',
                'bediening',
                'afstandsbediening',
                'bedieningszijde',
                'appbediening',
                'zonsensor',
                'windmeter',
                'omkastingkleur'
            ];

            foreach ($fixed_columns as $column) {
                if (!isset($product[$column])) {
                    $product[$column] = '';
                }
            }

			// add default field value for 'kabeldoorvoer' when missing
            // for selected products in $export_codes array
            // we should look into a different solution in the future
            $export_codes = [
                'WEB_SS-XS',
                'WEB_SS',
                'WEB_ES',
                'WEB_SS-XL',
                'WEB_ZS-BMZ',
                'WEB_RL-RS38',
                'WEB_RL-RS55'
            ];

            if (in_array($export_code, $export_codes)) {
                if (empty($product['kabeldoorvoer'])) {
                    $product['kabeldoorvoer'] = 'TBBI';
                }
            }

            // add product to $products for one or multiple times (depending on the given quantity)
            for ($i = 0; $i < $quantity; $i++) {
                $products[$export_code][] = $product;
            }
        }

        // for debugging purposes
        echo 'Exported request with ID: <b>' . $id . '</b><br>';

        // update last exported request ID
        $last_id = $id;
    }

    // loop over $products and write each group to an export file
    foreach ($products as $export_code => $rows) {
        writeCSV('export-debug', $export_code, $rows);
		// writeCSV('export-backup', $export_code, $rows);
    }
	
	// set last exported request ID
    // setLastExportedRequestID($last_id);
} else {
    echo 'There are no new requests.';
}

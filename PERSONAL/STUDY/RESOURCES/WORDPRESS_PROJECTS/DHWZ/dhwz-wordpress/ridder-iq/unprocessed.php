<?php
// set up WordPress environment
require_once '../wp-load.php';

// get requests
global $wpdb;
$table_prefix = $wpdb->prefix;
$q = '';
$q .= "SELECT ID FROM {$table_prefix}posts ";
$q .= "WHERE post_type = 'dhwec_request' ";
$q .= "AND post_status = 'publish'";
$q .= "AND id > 31062"; // 31062 is the ID we started checking from
$requests = $wpdb->get_results($q);

// remove last three requests from $requests
$requests = array_reverse($requests);
unset($requests[0]);
unset($requests[1]);
unset($requests[2]);

if (!empty($requests)) {
    $unprocessed = [];

    foreach ($requests as $request) {
        $id = $request->ID;
		
		$processed = get_field('dhwec_request_processed', $id);

        if ($processed === null || $processed === false) {
            $unprocessed[] = $id;
        }
    }
	
    if (!empty($unprocessed)) {
        // to & subject
        // $to = 'reinder@wiersma-ict.nl,marketing@dhwz.nl';
		$to = 'reinder@wiersma-ict.nl,oleh@wiersma-ict.nl';
        $subject = 'DHW eCommerce - Ridder IQ import mislukt';

        // message
        $message = 'Beste medewerker van De Haan Westerhoff,<br><br>';

        $message .= 'Je ontvangt deze e-mail omdat er aanvragen zijn binnengekomen via de website van De Haan Westerhoff die niet kunnen worden ingelezen in Ridder IQ.<br><br>';

        $message .= '<b>Het importeren van de volgende aanvragen is mislukt</b><br>';

        foreach ($unprocessed as $item) {
            $message .= 'Aanvraag met ID: ' . $item . '<br>';
        }

        $message .= '<br>Met vriendelijke groet,<br>';
        $message .= 'De website van De Haan Westerhoff';

        // headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8 \r\n";
        $headers .= "From: De Haan Westerhoff <info@dhwz.nl> \r\n";

        // send mail
        mail($to, $subject, $message, $headers);
	} else {
        echo 'All requests are processed.';
    }
}

<?php
// get ID from GET
$id = $_GET['id'];

// die if ID is empty or not numeric
if (!empty($id) && is_numeric($id)) {
	// set up WordPress environment
	require_once '../wp-load.php';

	// update field
	update_field('dhwec_request_processed', 1, $id);

	echo 'Updated status of request with id: ' . $id;
}

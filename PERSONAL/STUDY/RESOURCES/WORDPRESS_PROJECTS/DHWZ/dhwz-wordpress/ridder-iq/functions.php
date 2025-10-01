<?php
// get last exported request ID
function getLastExportedRequestID() {
    return get_option('dhwec-last-exported-request-id');
}

// set last exported request ID
function setLastExportedRequestID($id) {
    if (!empty($id) && is_numeric($id)) {
        update_option('dhwec-last-exported-request-id', $id);
    }
}

// write CSV
function writeCSV($dir, $export_code, $rows) {
    // create file
    $name = $export_code . '_' . date('YmdHis') . '.txt';
    $path = '../../export-tmp/' . $name;
    $file = fopen($path, 'w');

    // write headers (based on array keys of the first item)
    $headers = [];
    foreach ($rows[0] as $key => $value) {
        $headers[] = $key;
    }
    fputcsv($file, $headers, "\t");

    // write rows
    foreach ($rows as $row) {
		// 20220314 Jaco: Replaced fwrite by fputcsv
		//fwrite($file, implode("\t", $row) . PHP_EOL);
		fputcsv($file, array_values($row), "\t", '"');
    }

    // close file
    fclose($file);

    // move file to given dir
    rename($path, '../../' . $dir . '/' . $name);
}

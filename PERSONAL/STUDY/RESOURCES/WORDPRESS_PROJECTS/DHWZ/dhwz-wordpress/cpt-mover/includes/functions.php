<?php
/**
 * Write output to file
 *
 * @param $path
 * @param $output
 */
function writeOutputToFile($path, $output) {
    $file = fopen($path, 'w');
    fwrite($file, json_encode($output, JSON_PRETTY_PRINT));
    fclose($file);
}

/**
 * Save image to media library
 *
 * @param $url
 * @return int ID of the added media
 */
function saveImageToMediaLibrary($url) {
    $file = [];
    $file['name'] = $url;
    $file['tmp_name'] = download_url($url);

    return media_handle_sideload($file);
}

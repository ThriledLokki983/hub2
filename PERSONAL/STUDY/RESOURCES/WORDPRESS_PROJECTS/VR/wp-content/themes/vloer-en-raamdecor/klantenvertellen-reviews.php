<?php
/**
 * Get the content of the provided URL and encode the results to json-format
 * If request fails, terminate/die  from this exec
 * FInally write the results to a file (reviews.json) and close the writing process
 */
$data = file_get_contents('https://www.klantenvertellen.nl/v1/review/feed.xml?hash=bhldrx8vfkiz1ol');
if ($data === FALSE) {
    # code...
    echo 'Could not open the file on www.klantenvertellen.nl';
    die;
}
$xml = simplexml_load_string($data);
$json = json_encode($xml);
$file = fopen(__DIR__ . '/reviews.json', 'w');
fwrite($file, $json);
fclose($file);
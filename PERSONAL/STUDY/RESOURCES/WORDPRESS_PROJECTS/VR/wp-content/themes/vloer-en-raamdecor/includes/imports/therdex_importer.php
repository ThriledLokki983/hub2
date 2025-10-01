<?php

function csv_to_multidimensional_array($filename='', $delimiter=',')
{
    if(!file_exists($filename) || !is_readable($filename)) {
        return false;
    }

    $data = array();

    if (($handle = fopen($filename, 'r')) !== false) {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== false ) {
            $data[] = $row;
        }
        fclose($handle);
    }
    return $data;
}

function get_number_from_sku($sku) {
    $number = $sku;
    $number = str_replace(array('TC'), '', $number);
    $number = str_replace(array('LL'), '', $number);
    return str_replace(array('T'), '', $number);
}

$arr = csv_to_multidimensional_array('therdex_importlijst.csv', ';');
$products = [];

for($c = 1; $c < count($arr) - 1; $c++) {
    $title = $arr[$c][0];
    $sku = $arr[$c][7];
    $articleNumber = get_number_from_sku($arr[$c][7]);
    $wordToSearch = str_replace($articleNumber, '',$title);

    $relatedProducts = [];

    foreach ($arr as $index => $searchEl) {
        $searchSku = $searchEl[7];
        $number = get_number_from_sku($searchEl[7]);

        if (strstr($searchEl[0], $wordToSearch) && $sku !== $searchSku && abs((int) $number - (int) $articleNumber) <= 50 && $index > 0) {
            $relatedProducts[] = $searchSku;
        }
    }
    $products[] = $relatedProducts;
}

$file_Path = fopen('therdex_import.csv', 'w');
$arr[0][] = 'Cross-sells';

foreach ( $arr as $index => $data )
{
    if ($index > 0) {
        $data[21] = implode(', ',$products[$index - 1]);
    }

    fputcsv($file_Path, $data, ',');
}
fclose($file_Path);

?>
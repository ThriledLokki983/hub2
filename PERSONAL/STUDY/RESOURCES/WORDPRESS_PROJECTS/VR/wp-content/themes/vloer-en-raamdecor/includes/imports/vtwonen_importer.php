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

$arr = csv_to_multidimensional_array('vtwonen_importlijst.csv', ';');
$products = [];

for($c = 1; $c < count($arr) - 1; $c++) {
    $title = $arr[$c][0];
    $collection =  $arr[$c][18];

    $relatedProducts = [];

    foreach ($arr as $index => $searchEl) {
        $searchTitle = $searchEl[0];
        $searchCollection = $searchEl[18];

        if ( $collection === $searchCollection && $title !== $searchTitle ) {
            $relatedProducts[] = (string) $searchEl[7];
        }
    }
    $products[] = $relatedProducts;
}

$file_Path = fopen('vtwonen_import.csv', 'w');
$arr[0][21] = 'Cross-sells';

foreach ( $arr as $index => $data )
{
    if ($index > 0) {
        $data[21] = implode(', ',$products[$index - 1]);
    }

    fputcsv($file_Path, $data, ',');
}
fclose($file_Path);

?>
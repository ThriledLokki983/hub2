<?php
/**
 * Function for converting a double to Euro format.
 *
 * @param double $double The double which to convert to Euro format
 * @return string The rendered string
 */
function toEuroFormat($double)
{
    $result = number_format($double, 2, ',', '.');
    return '&euro;' . $result;
}

/**
 * Function for calculation the discount percentage.
 *
 * @param double $price The regular price
 * @param double $salePrice The sale price
 *
 * @return int The discount percentage
 */
function calculateDiscountPercentage($price, $salePrice)
{
    return ceil(($price - $salePrice) / $price * 100);
}

/**
 * Get ACF image alt.
 *
 * @param array $imageObj An ACF image object as array
 *
 * @return string The content for the alt attribute of the image
 */
function getAcfImageAlt($imageObj)
{
    $alt = $imageObj['title'];

    if (!empty($imageObj['alt'])) {
        $alt = $imageObj['alt'];
    }

    return $alt;
}

/**
 * Function for calculation the price by the number of square meters.
 *
 * @param int $productId The ID of the product
 * @param int $squareMeters The number of square meters
 *
 * @return array The results of the calculation
 */
function calculatePriceBySquareMeters($productId, $squareMeters)
{
    // get the square meters per pack
    $squareMetersPerPack = get_field('sqm_per_unit', $productId);
    $unit = get_field('unit', $productId);

    // get the product
    $productFactory = new WC_Product_Factory();
    $product = $productFactory->get_product($productId);

    // determine the price of a pack
    $regularPrice = $product->get_regular_price();
    $salePrice = $product->get_sale_price();
    $price = (float) (!empty($salePrice) ? $salePrice : $regularPrice);

    // calculate the number of packs needed
    $packsCount = ceil(((float) $squareMeters * 1.10) / (float) $squareMetersPerPack);

    // calculate the total price
    $totalPrice = round($packsCount * $price, 2);

    $unitText = $unit === 'pack' ? 'pakken' : 'rollen';

    // render message
    $message = "Je hebt aangegeven voor <span class=\"bold\">{$squareMeters} vierkante meter</span> nodig te hebben. ";
    $message .= "Hiervoor heb je <span class=\"bold\">{$packsCount} {$unitText}</span> nodig. ";
    $message .= "We houden daarbij rekening met 10% snijverlies.";

    // return results of calculations
    return [
        'productId' => $productId,
        'squareMeters' => $squareMeters,
        'squareMetersPerPack' => $squareMetersPerPack,
        'regularPrice' => $regularPrice,
        'salePrice' => $salePrice,
        'packsCount' => $packsCount,
        'totalPrice' => $totalPrice,
        'message' => $message
    ];
}

/**
 * Function for calculation the price by the number of packs.
 *
 * @param int $productId The ID of the product
 * @param int $packsCount The number of packs
 *
 * @return array The results of the calculation
 */
function calculatePriceByNumberOfPacks($productId, $packsCount)
{
    // get the square meters per pack
    $squareMetersPerPack = get_field('sqm_per_unit', $productId);
    $unit = get_field('unit', $productId);

    // calculate square meters
    $squareMeters = round(((float) $packsCount * (float) $squareMetersPerPack) * 0.9, 2);

    // get the product
    $productFactory = new WC_Product_Factory();
    $product = $productFactory->get_product($productId);

    // determine the price of a pack
    $regularPrice = $product->get_regular_price();
    $salePrice = $product->get_sale_price();
    $price = (!empty($salePrice) ? $salePrice : $regularPrice);

    // calculate the total price
    $totalPrice = round($packsCount * $price, 2);

    $unitText = $unit === 'pack' ? 'pakken' : 'rollen';

    // render message
    $message = "Je hebt aangegeven <span class=\"bold\">{$packsCount} {$unitText}</span> nodig te zijn. ";
    $message .= "Dit is voldoende voor <span class=\"bold\">{$squareMeters} m2</span>. ";
    $message .= "We houden daarbij rekening met 10% snijverlies.";

    // return results of calculations
    return [
        'productId' => $productId,
        'squareMeters' => $squareMeters,
        'squareMetersPerPack' => $squareMetersPerPack,
        'regularPrice' => $regularPrice,
        'salePrice' => $salePrice,
        'packsCount' => $packsCount,
        'totalPrice' => $totalPrice,
        'message' => $message
    ];
}
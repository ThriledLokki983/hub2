<?php
/**
 * Single Product Price
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/price.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product;

$tpl = TPL_DIR_URI;
$terms = get_the_terms( $product->get_id(), 'product_cat' );
$category_name = count($terms) > 0 && strtolower($terms[0]->name) !== 'geen categorie' ? $terms[0]->name : null;
?>

<input type="hidden" name="productId" id="productId" value="<?php echo $product->get_id(); ?>">

<article class="item__content__right">
    <div class="item__header">
        <div class="product-card-title-primary">
            <span class="product-text"><?php echo $category_name; ?></span>
            <h2 class="product-text"><?php the_title(); ?></h2>
            <?php if ($product->is_on_sale()): ?>
            <div class="faded-price">
                <span>van</span>
                <h2><?php echo strip_tags(wc_price($product->get_regular_price())); ?>&nbsp;<span>m<sup>2</sup></span></h2>
            </div>
            <?php endif ?>
        </div>
        <div class="deal--box">
            <h2 class="title">All-in <span>Deal</span></h2>
        </div>
    </div>
    <div class="item__info">
        <div class="product-card-title-primary">
            <span class="product-text">ALL IN DEAL</span>
            <h2 class="product-text"><?php echo strip_tags(wc_price($product->is_on_sale() ? $product->get_sale_price() : $product->get_regular_price())); ?>&nbsp;<span class="metre">m<sup>2</sup></span></h2>
            <div class="other__colors">
                <h4>Andere kleuren</h4>
                <ul class="other__colors--lists">
                    <?php
                        foreach ($product->get_cross_sell_ids() as $id) {
                        $crosssellProduct  = wc_get_product($id); ?>
                        <li class="other__colors--lists-item">
                            <a href="<?php echo $crosssellProduct->get_permalink(); ?>">
                                <img class="" src="<?php echo wp_get_attachment_image_src( get_post_thumbnail_id( $id ), 'single-post-thumbnail' )[0]; ?>" alt="<?php echo $crosssellProduct->get_title(); ?>" />
                            </a>
                        </li>
                    <?php }
                    ?>
                </ul>
            </div>
        </div>
        <div class="price__include">
            <h4>Deze prijs is inclusief: </h4>
            <ul class="price__include--lists">
                <li class="price__include--lists--item">Inmeten</li>
                <li class="price__include--lists--item">Egaliseren</li>
                <li class="price__include--lists--item">Leggen van de vloer</li>
                <li class="price__include--lists--item">
                    <svg class="icon">
                        <use xlink:href="<?= get_site_url() ?>/wp-content/themes/vloer-en-raamdecor/public/assets/icons/sprite.svg#icon-chevron-right"></use>
                    </svg>
                    <a href="<?= site_url('/all-in-deal/'); ?>">Meer over de All-in Deal</a>
                </li>
            </ul>
        </div>
    </div>
    <details class="more__info space-borders" open>
        <summary>
            <h4>Meer productspecificaties</h4>
            <svg class="icon">
                <use xlink:href="<?= get_site_url() ?>/wp-content/themes/vloer-en-raamdecor/public/assets/icons/sprite.svg#icon-chevron-down"></use>
            </svg>
        </summary>
        <p class="small-text">
            Vloeren &amp; raamdecor.nl is een specialist in complete woninginrichting. Wij leveren tevens vloerverwarming in combinatie met een nieuwe vloer. Geen gedoe met verschillende partijen en niet op elkaar aansluitende planningen. Maar gewoon één aanspreekpunt voor het gehele project.
        </p></details>

    <div class="calculate__price">
        <div class="product-card-title-primary">
            <span class="product-text">MAAK HET JEZELF MAKKELIJK</span>
            <h2 class="product-text">BEREKEN JE PRIJS</h2>
        </div>
        <form class="cart show" method="post" enctype="multipart/form-data">
            <div class="calculate__price--content">
                <div class="form__container">
                    <div class="form__group">
                        <label for="m-square">Hoeveel <span>m<sup>2</sup></span> heb je nodig?</label>
                        <input type="text" id="m-square" class="m-square" placeholder="56.40 m²">
                    </div>
                    <div class="form__group">
                        <label for="m-square">Aantal pakketten?</label>
                        <input id="packs" type="number" name="quantity" class="m-square" placeholder="15">
<!--                        <input id="packs" type="number" step="1" min="1" max="" name="quantity" value="1" title="Quantity" class="m-square" size="4" pattern="[0-9]*" inputmode="numeric">-->
                    </div>
                    <div class="product-card-title-primary">
                        <span class="product-text total-price-text">Complete prijs</span>
                        <h2 class="product-text" id="total-price"></h2>
                    </div>
                </div>
                <div class="right">
                    <div class="product-card-title-primary">
                        <span class="product-text">AUTOMATISCH BEREKEND</span>
                    </div>
                    <p id="automatic-calculation-text" class="paragraph">Geef in de het veld hiernaast op hoeveel vierkante meter je nodig denkt te hebben. Dan rekenen wij direct voor je uit om hoeveel pakketten het gaat. Wel zo handig!</p>
                </div>
            </div>
<!--            <div class="quantity">-->
<!--                <input type="number" step="1" min="1" max="" name="quantity" value="1" title="Quantity" class="input-text qty text" size="4" pattern="[0-9]*" inputmode="numeric">-->
<!--            </div>-->

            <input type="hidden" name="add-to-cart" value="<?php echo get_the_ID(); ?>">

            <button type="submit" class="single_add_to_cart_button button alt btn primary"><svg class="icon">
                    <use xlink:href="<?= get_site_url() ?>/wp-content/themes/vloer-en-raamdecor/public/assets/icons/sprite.svg#icon-chevron-right"></use>
                </svg> vraag een offerte aan</button>
        </form>
    </div>
</article>



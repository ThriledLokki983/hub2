<?php $products = get_sub_field('collection_products'); ?>

<section class="collection size">
    <h2 class="section--title"><?= get_sub_field('collection_title'); ?></h2>
    <ul class="collection__items">
        <?php foreach (array_slice($products, 0, 3) as $item) : ?>
            <?php $product = wc_get_product($item->ID); ?>
            <li class="collection__items--item">
                <a href="<?= get_permalink($item->ID) ?>" class="collection__items--item-link-right">
                    <figure>
                        <img src="<?= get_the_post_thumbnail_url($item->ID, 'large') ?>" alt="<?= get_the_title($item->ID) ?>" loading="lazy"/>
                        <figcaption>
                            <h3>
                                <span class="product-tag">all in deal</span>
                                <span class="product-price">
                                    <?= toEuroFormat($product->get_price()) ?>
                                    <span>m<sup>2</sup></span>
                                </span>
                            </h3>
                        </figcaption>
                    </figure>
                </a>
            </li>
        <?php endforeach; ?>

        <li class="collection__items--item">
            <a href="<?= get_sub_field('collection_b1_link'); ?>" class="collection__items--item-link-right">
                <figure>
                    <?php
                    $img = get_sub_field('collection_b1_background');
                    $src = $img['url'];
                    $alt = getAcfImageAlt($img);
                    ?>
                    <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                    <div class="collection__items--item-link-info">
                        <div class="product-card-title-secondary">
                            <span class="product-text"><?= get_sub_field('collection_b1_title_1'); ?></span>
                            <h2 class="product-text"><?= get_sub_field('collection_b1_title_2'); ?></h2>
                        </div>
                        <p class="product-text"><?= get_sub_field('collection_b1_title_3'); ?></p>
                    </div>
                </figure>
            </a>
        </li>

        <li class="collection__items--item special">
            <a href="<?= get_sub_field('collection_b2_button_link'); ?>" class="collection__items--item-link-left">
                <figure>
                    <div class="collection__items--item-link-info-1">
                        <div class="product-card-title-primary">
                            <span class="product-text"><?= get_sub_field('collection_b2_title_1'); ?></span>
                            <h2 class="product-text align-left"><?= get_sub_field('collection_b2_title_2'); ?></h2>
                        </div>
                        <div class="bottom-content">
                            <p class="product-text small-text"><?= get_sub_field('collection_b2_text'); ?></p>
                            <a class="btn small primary" href="<?= get_sub_field('collection_b2_button_link'); ?>"><?= get_sub_field('collection_b2_button_label'); ?></a>
                        </div>
                    </div>
                </figure>
            </a>
        </li>

        <?php foreach (array_slice($products, 3, 3) as $item) : ?>
            <?php $product = wc_get_product($item->ID); ?>
            <li class="collection__items--item">
                <a href="<?= get_permalink($item->ID) ?>" class="collection__items--item-link-right">
                    <figure>
                        <img src="<?= get_the_post_thumbnail_url($item->ID, 'large') ?>" alt="<?= get_the_title($item->ID) ?>" loading="lazy"/>
                        <figcaption>
                            <h3>
                                <span class="product-tag">all in deal</span>
                                <span class="product-price">
                                    <?= toEuroFormat($product->get_price()) ?>
                                    <span>m<sup>2</sup></span>
                                </span>
                            </h3>
                        </figcaption>
                    </figure>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>

    <a href="<?= get_sub_field('collection_button_link'); ?>" class="btn primary"><?= get_sub_field('collection_button_label'); ?></a>
</section>
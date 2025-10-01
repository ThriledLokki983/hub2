<?php if ($productsQuery->have_posts()) : ?>
    <ul class="collection__items">
        <?php while ($productsQuery->have_posts()) : $productsQuery->the_post(); ?>
            <?php $product = wc_get_product(get_the_id()); ?>
            <li class="collection__items--item">
                <a href="<?= the_permalink() ?>" class="collection__items--item-link-right">
                    <figure>
                        <img src="<?= the_post_thumbnail_url('medium') ?>" alt="<?= get_the_title() ?>" loading="lazy"/>
                        <figcaption>
                            <?php if ($product->is_on_sale()) : ?>
                                <div class="discount">
                                    <span>actie prijs</span>
                                    <span>
                                        <?= calculateDiscountPercentage(
                                            $product->get_regular_price(),
                                            $product->get_sale_price()
                                        ) ?>%
                                    </span>
                                    <span>korting</span>
                                </div>
                            <?php endif; ?>
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
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
    </ul>
<?php else : ?>
    <?= get_template_part('parts/part', 'no-products'); ?>
<?php endif; ?>
<section class="products">
    <?php foreach (get_sub_field('products') as $product) : ?>
        <article class="products__card">
            <div class="products__card--photo">
                <picture class="products__card--photo-picture">
                    <?php
                    $src = $product['image']['url'];
                    $alt = getAcfImageAlt($product['image']);
                    ?>
                    <img
                            class="products__card--photo-picture-img"
                            loading="lazy"
                            decoding="async"
                            width="300"
                            height="200"
                            src="<?= $src ?>"
                            alt="<?= $alt ?>"
                    />
                </picture>
            </div>
            <div class="products__card--text">
                <h3 class="products__card--text-header"><?= $product['title']; ?></h3>
                <p class="products__card--text-description"><?= $product['text']; ?></p>
                <a href="<?= $product['button_link']; ?>" class="btn products__card--text-description-btn">
                    <span class="products__card--text-description-btn-label"><?= $product['button_label']; ?></span>
                    <svg class="icon">
                        <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                    </svg>
                </a>
            </div>
        </article>
    <?php endforeach; ?>
</section>
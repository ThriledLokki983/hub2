<section class="furnishing">
    <article class="text span-3">
        <div class="product-card-title-primary">
            <span class="product-text"><?= get_sub_field('furnishing_title_1'); ?></span>
            <h2 class="product-text"><?= get_sub_field('furnishing_title_2'); ?></h2>
        </div>
        <div class="furnishing__content">
            <p class="paragraph text-bold"><?= get_sub_field('furnishing_lead_in'); ?></p>
            <?= get_sub_field('furnishing_main_text'); ?>
        </div>
    </article>
    <article class="photo">
        <figure>
            <?php
            $img = get_sub_field('furnishing_image');
            $src = $img['url'];
            $alt = getAcfImageAlt($img);
            ?>
            <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
        </figure>
    </article>
</section>
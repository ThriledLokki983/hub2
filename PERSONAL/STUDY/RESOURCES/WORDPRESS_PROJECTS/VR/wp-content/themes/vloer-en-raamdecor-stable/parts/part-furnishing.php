<section class="furnishing">
    <article class="text span-3">
        <div class="product-card-title-primary">
            <?php if (get_sub_field('furnishing_title_1')) : ?>
                <span class="product-text"><?= get_sub_field('furnishing_title_1'); ?></span>
            <?php endif; ?>
            <?php if (get_sub_field('furnishing_title_2')) : ?>
                <h2 class="product-text"><?= get_sub_field('furnishing_title_2'); ?></h2>
            <?php endif; ?>
        </div>
        <div class="furnishing__content">
            <?php if (get_sub_field('furnishing_lead_in')) : ?>
                <p class="paragraph text-bold"><?= get_sub_field('furnishing_lead_in'); ?></p>
            <?php endif; ?>
            <p><?= get_sub_field('furnishing_main_text'); ?></p>
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
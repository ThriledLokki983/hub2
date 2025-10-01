<section class="support container--full">
    <article class="support__content">
        <ul class="support__content--list">
            <?php $brands = get_field('brands', 'option'); ?>
            <?php foreach ($brands as $brand) : ?>
                <li class="support__content--list-item">
                    <figure>
                        <?php
                        $img = $brand['logo'];
                        $src = $img['url'];
                        $alt = getAcfImageAlt($img);
                        ?>
                        <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy"/>
                    </figure>
                </li>
            <?php endforeach; ?>
        </ul>
    </article>
</section>
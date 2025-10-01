<section class="categories size">
    <?php $categories = get_sub_field('categories'); ?>
    <?php foreach ($categories as $category) : ?>
    <a href="<?= $category['link'] ?>" class="categories__item">
        <picture class="categories__item--img">
            <?php
                 $img = $category['image'];
                 $src = $img['url'];
                 $alt = getAcfImageAlt($img);
                 ?>
            <source media="(max-width: 767px)" srcset="<?= $src ?>" />
            <source media="(min-width: 768px)" srcset="<?= $src ?>" />
            <img src="<?= $src ?>" alt="<?= $alt ?>" loading="lazy" />
        </picture>
        <div class="categories__item--text">
            <h2><?= $category['title'] ?></h2>
        </div>
    </a>
    <?php endforeach; ?>
</section>

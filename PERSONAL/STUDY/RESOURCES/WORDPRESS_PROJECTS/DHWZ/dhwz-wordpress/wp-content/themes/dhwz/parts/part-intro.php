<section class="intro">
    <article class="intro__left">
        <picture>
            <?php
            $img = get_sub_field('image');
            $src = $img['url'];
            $alt = getAcfImageAlt($img);
            ?>
            <img
                loading="lazy"
                decoding="async"
                width="300"
                height="200"
                src="<?= $src ?>"
                alt="<?= $alt ?>"
            />
        </picture>
    </article>
    <article class="intro__right">
        <div class="intro__right--content">
            <h2 class="title"><?= get_sub_field('title'); ?></h2>
            <?= get_sub_field('text'); ?>
        </div>
    </article>
</section>
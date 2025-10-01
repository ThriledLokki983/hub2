<section class="news">
    <?php
    $postsQuery = new WP_Query([
        'post_type' => 'post',
        'posts_per_page' => 2,
        'category__in' => [91]
    ]);

    $i = 1;
    ?>

    <?php if ($postsQuery->have_posts()) : ?>
        <?php while ($postsQuery->have_posts()) : $postsQuery->the_post(); ?>
            <?php if ($i === 1) : ?>
                <article class="news__left">
                    <div class="news__left--photo" style="background-image: url('<?= get_the_post_thumbnail_url() ?>');"></div>
                    <div class="news__left--text">
                        <h2><?= get_the_title() ?></h2>
                        <p><?= trimExcerpt(get_the_excerpt(), 300) ?></p>
                        <a href="<?= get_the_permalink(); ?>" class="btn">
                            <?php $label = get_field('button_title'); ?>
                            <span><?= !empty($label) ? $label : 'Lees meer' ?></span>
                            <svg class="icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                            </svg>
                        </a>
                    </div>
                </article>
            <?php elseif ($i === 2) : ?>
                <article class="news__right">
                    <div class="news__right--photo" style="background-image: url('<?= get_the_post_thumbnail_url() ?>');"></div>
                    <div class="news__right--text">
                        <h2><?= get_the_title() ?></h2>
                        <p><?= trimExcerpt(get_the_excerpt(), 150) ?></p>
                        <a href="<?= get_the_permalink(); ?>" class="btn">
                            <?php $label = get_field('button_title'); ?>
                            <span><?= !empty($label) ? $label : 'Lees meer' ?></span>
                            <svg class="icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-chevron-right"></use>
                            </svg>
                        </a>
                    </div>
                </article>
            <?php endif; ?>
            <?php $i++; ?>
        <?php endwhile; ?>

        <?php wp_reset_postdata(); ?>
    <?php endif; ?>
</section>
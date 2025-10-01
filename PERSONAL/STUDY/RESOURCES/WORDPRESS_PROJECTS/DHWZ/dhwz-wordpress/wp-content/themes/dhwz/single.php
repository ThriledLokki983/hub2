<?php get_header(); ?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>
        <?php dhwz_content_builder() ?>

        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <?php if (!empty(get_the_content())) : ?>
                    <section class="content-wide wysiwyg">
                        <h1><?php the_title(); ?></h1>
                        <?php the_content(); ?>
                    </section>
                <?php endif; ?>
            <?php endwhile; ?>
        <?php endif; ?>
    </main>

    <section class="divider"></section>
<?php get_footer(); ?>
<?php
/*
 * Template Name: DHW eCommerce
 */
get_header();
?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>
        <?php dhwz_content_builder() ?>

        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <?php if (!empty(get_the_content())) : ?>
                    <section class="content-wide">
                        <div class="wysiwyg">
                            <?php if (get_the_id() !== 13093 && get_the_id() !== 13095) : ?>
                                <h1><?php the_title(); ?></h1>
                            <?php endif; ?>
                        </div>
                        <?php the_content(); ?>
                    </section>
                <?php endif; ?>
            <?php endwhile; ?>
        <?php endif; ?>
    </main>

<?php if (empty($_SESSION['dhwec']['employee'])) : ?>
    <?php if (get_the_id() !== 13093) : ?>
<section class="divider"></section>
    <?php endif; ?>
<?php endif; ?>
<?php get_footer(); ?>
<?php
/**
 * Template Name: Berichten
 */

?>

<?php get_header(); ?>
<main class="main">
    <?php
            if ( have_posts() ) {
                while ( have_posts() ) {
                    the_post();

                    if ( has_post_thumbnail() ) { ?>
    <div class="hero"><?= the_post_thumbnail(); ?></div>
    <?php } ?>
    <!-- title was here but I removed it bcos we don't need it -->
    <?php }
            } ?>
    <?php vr_content_builder(); ?>
    <section class="container">
        <?= the_content(); ?>
    </section>
</main>
<?php get_footer(); ?>

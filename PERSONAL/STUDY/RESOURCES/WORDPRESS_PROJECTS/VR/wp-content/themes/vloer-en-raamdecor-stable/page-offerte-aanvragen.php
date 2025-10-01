<?php get_header(); ?>
<main class="main">
    <!-- <div class="container content-page"> -->
    <?php
            if ( have_posts() ) {
                while ( have_posts() ) {
                    the_post();

                    if ( has_post_thumbnail() ) { ?>
    <div class="hero"><?= the_post_thumbnail(); ?></div>
    <?php } ?>
    <section class="container--small offerte-aanvragen">
        <?php the_content() ?>
    </section>
    <?php }
            } ?>
    <!-- </div> -->
    <?php vr_content_builder(); ?>
</main>
<?php get_footer(); ?>

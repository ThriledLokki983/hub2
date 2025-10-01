<?php get_header(); ?>
    <main class="main">
        <main class="container content-page">
            <?php
            if ( have_posts() ) {
                while ( have_posts() ) {
                    the_post();

                    if ( has_post_thumbnail() ) { ?>
                        <div class="hero"><?= the_post_thumbnail(); ?></div>
                    <?php } ?>
                    <div class="page-content-container">
                        <div class="title__head">
                            <?php the_title() ?>
                        </div>
                        <div class="content">
                            <?php the_content() ?>
                        </div>
                    </div>
                <?php }
            } ?>
        <?php vr_content_builder(); ?>
    </main>
<?php get_footer(); ?>
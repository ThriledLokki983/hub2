<?php
get_header();
$fields = get_fields('options');
?>
    <main class="container content-page">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14789.78798115806!2d4.631936793269193!3d51.7924600572526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c42f24cbe8dbbd%3A0x7c135d87c2330f16!2sVloer%20%26%20Raamdecor!5e0!3m2!1snl!2snl!4v1660654325948!5m2!1snl!2snl" width="600" height="450" style="border:0; width:100%; margin-bottom:20px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                    <div class="contact-container">
                        <div class="contact-form">
                            <?php echo do_shortcode("[ninja_form id=3]"); ?>
                        </div>
                        <div class="contact-info">
                            <h2 class="footer__column--title"><?= $fields['footer_address_title'] ?></h2>
                            <ul class="content__lists">
                                <?php foreach ($fields['footer_address_lines'] as $item) : ?>
                                    <li class="content__lists--item">
                                        <span><?= $item['line'] ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            <?php }
        } ?>
    </main>
<?php
get_footer();
?>
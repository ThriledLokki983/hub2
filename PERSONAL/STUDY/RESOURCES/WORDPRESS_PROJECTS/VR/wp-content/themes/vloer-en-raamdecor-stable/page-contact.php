<?php
get_header();
$fields = get_fields('options');
?>
    <main>
        <section class="contact container maps">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14789.78798115806!2d4.631936793269193!3d51.7924600572526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c42f24cbe8dbbd%3A0x7c135d87c2330f16!2sVloer%20%26%20Raamdecor!5e0!3m2!1snl!2snl!4v1660654325948!5m2!1snl!2snl" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <iframe src="https://www.google.com/maps/embed?pb=!4v1661513948556!6m8!1m7!1s9_mQklfRd9l0oDt9DtnlYg!2m2!1d51.79209670749204!2d4.64691303975431!3f24.40197367709951!4f-2.952406091268017!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </section>
        <?php
        if ( have_posts() ) {
            while ( have_posts() ) {
                the_post();

                if ( has_post_thumbnail() ) { ?>
                    <div class="hero"><?= the_post_thumbnail(); ?></div>
                <?php } ?>
                <section class="contact__content container">
                    <h1>
                        <?php the_title() ?>
                    </h1>
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
                </section>
            <?php }
        } ?>
    </main>
<?php
get_footer();
?>
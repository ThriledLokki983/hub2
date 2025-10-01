<?php
get_header();

$fields = get_fields();
?>

    <main class="main">
        <section class="modulo__select">
            <article class="select__results span-3">
                <?php if (empty($_GET['s'])) : ?>
                    <?= get_template_part('parts/part', 'no-products'); ?>
                <?php else : ?>
                    <?php
                    $args = [
                        'post_type' => 'product',
                        's' => $_GET['s'],
                        'posts_per_page' => -1
                    ];
                    $productsQuery = new WP_Query($args);
                    global $productsQuery;
                    require 'parts/part-products-loop.php'
                    ?>
                <?php endif; ?>
            </article>
        </section>
    </main>

<?php get_footer(); ?>
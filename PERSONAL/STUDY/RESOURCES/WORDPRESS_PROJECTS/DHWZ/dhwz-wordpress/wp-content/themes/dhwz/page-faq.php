<?php
get_header();
?>
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
    <section class="content-wide">
        <?php $faqs = get_field('faq_items'); ?>
        <?php foreach ($faqs as $faq) : ?>
            <div class="faq">
                <div class="faq-title">
                    <?php echo $faq['faq_item_title']; ?>
                    <i class="fa fa-angle-down faq-arrow"></i>
                </div>
                <div class="faq-content">
                    <?php echo $faq['faq_item_content']; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </section>
</main>

<?php if (empty($_SESSION['dhwec']['employee'])) : ?>
    <?php if (get_the_id() !== 13093) : ?>
        <section class="divider"></section>
    <?php endif; ?>
<?php endif; ?>
<?php get_footer(); ?>

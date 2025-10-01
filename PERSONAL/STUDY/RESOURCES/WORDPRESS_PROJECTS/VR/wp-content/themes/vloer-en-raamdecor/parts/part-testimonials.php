<?php $fields = get_fields('options'); ?>

<section class="container--full">
    <section class="main__reviews">
        <article class="main__reviews--content">
            <h2 class="section--title"><?= $fields['testimonials_main_title'] ?>
            </h2>
            <ul class="main__review--list">
                <?php foreach ($fields['testimonials'] as $testimonial) : ?>
                <li class="review-item">
                    <p class="main__reviews--content--review-text">
                        <?= $testimonial['text'] ?>
                        <span class="reviewer">
                            <span class="header-reviews__icon-box">
                                <?php for ($i = 0; $i < $testimonial['rating']; $i++) : ?>
                                <svg class="header-reviews__icon-box-icon icon">
                                    <use
                                        xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-star-full">
                                    </use>
                                </svg>
                                <?php endfor; ?>
                            </span><?= $testimonial['author'] ?>
                        </span>
                    </p>
                </li>
                <?php endforeach; ?>
            </ul>
        </article>

        <article class="main__reviews--controls">
            <div class="dots"></div>
            <a href="<?= $fields['testimonials_button_link'] ?>"
                class="btn green"><?= $fields['testimonials_button_label'] ?></a>
        </article>
    </section>
</section>

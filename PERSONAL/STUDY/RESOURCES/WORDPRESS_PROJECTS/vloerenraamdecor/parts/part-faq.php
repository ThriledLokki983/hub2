<section class="faq container--full">
    <div class="faq__content">
        <h2 class="section--title"><?= get_sub_field('faq_title'); ?></h2>
        <ul class="faq__content--list">
            <?php $items = get_sub_field('faq_items'); ?>
            <?php foreach ($items as $item) : ?>
                <li class="faq__content--list-item">
                    <details class="faq__item">
                        <summary>
                            <svg class="icon">
                                <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-chevron-right"></use>
                            </svg>

                            <?= $item['question'] ?>
                        </summary>
                        <p class="paragraph"><?= $item['answer'] ?></p>
                    </details>
                </li>
            <?php endforeach; ?>
        </ul>
        <a class="btn secondary" href="<?= get_sub_field('faq_button_link'); ?>"><?= get_sub_field('faq_button_label'); ?></a>
    </div>
</section>
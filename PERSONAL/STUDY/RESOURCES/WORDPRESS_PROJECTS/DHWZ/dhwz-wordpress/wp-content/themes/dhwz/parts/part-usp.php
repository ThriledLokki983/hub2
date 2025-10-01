<section class="usp" id="usp" data-usp>
    <?php foreach (get_field('usps', 'option') as $usp) : ?>
        <article class="usp__item">
            <div class="usp__item--top">
                <svg class="icon">
                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprites.svg#icon-<?= $usp['icon'] ?>"></use>
                </svg>
            </div>
            <div class="usp__item--middle">
                <h3><?= $usp['count'] ?></h3>
            </div>
            <div class="usp__item--bottom"><?= $usp['property'] ?></div>
        </article>
    <?php endforeach; ?>
</section>
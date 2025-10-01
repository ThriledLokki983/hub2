<section class="services container--small">
    <ul class="services__lists">
        <?php $usps = get_field('usps', 'option'); ?>
        <?php foreach ($usps as $usp) : ?>
            <li class="services__lists--item">
                <svg class="icon">
                    <use xlink:href="<?= TPL_DIR_URI ?>/public/assets/icons/sprite.svg#icon-<?= $usp['icon'] ?>"></use>
                </svg>
                <a href="#" class="services__lists--item-link"><?= $usp['usp'] ?></a>
            </li>
        <?php endforeach; ?>
    </ul>
</section>
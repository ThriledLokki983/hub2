<?php
// get employee code from session
$employee_code = $_SESSION['dhwec']['employee']['employee_code'];

// check if employee code is set
if (!empty($employee_code)) {
    // get employee id by code
    $employee_id = get_employee_id_by_code($employee_code);
} elseif (!empty($employee_code) && $employee_code === 'showroom') {
    // set $employee_id to null
    $employee_id = null;
} else {
    // get employee id by code for default user if employee code is not set
    $employee_id = get_employee_id_by_code('E100');
}

if (!empty($employee_id)) {
    // get product visibility for this employee
    $visibility_json = get_field(
        'dhwec_employees_product_visibility',
        $employee_id
    );

    // decode JSON
    if (!empty($visibility_json)) {
        $visibility_arr = json_decode($visibility_json);
        if (!empty($visibility_arr)) {
            $visibility = $visibility_arr;
        }
    }
}
?>

<div id="dhwec-catalog">
    <div class="blocks">
        <?php $products = get_field('dhwec_catalog', 'option'); ?>
        <?php if (!empty($products)) : ?>
            <?php foreach ($products as $product) : ?>
                <?php
                if (!empty($visibility)) {
                    $links = [];
                    foreach ($product['dhwec_catalog_group_items'] as $item) {
                        $code = $item['dhwec_catalog_group_item_code'];
                        if (in_array($code, $visibility) || empty($code)) {
                            $links[] = $item;
                        }
                    }
                } else {
                    $links = $product['dhwec_catalog_group_items'];
                }
                ?>

                <?php if (!empty($links)) : ?>
                    <div class="block">
                        <h2><?= $product['dhwec_catalog_group_title']; ?></h2>
                        <ul>
                            <?php foreach ($links as $link) : ?>
                                <?php
                                $post_link = $link['dhwec_catalog_group_item_link'];
                                $post_permalink = get_the_permalink($post_link->ID);
                                $note = $link['dhwec_catalog_group_item_note'];
                                ?>
                                <li>
                                    <a href="<?= $post_permalink; ?>">
                                        <?= $post_link->post_title; ?>
                                    </a>
                                    <?php if (!empty($note)) : ?>
                                        <?= $note; ?>
                                    <?php endif; ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <?php if (!empty($_SESSION['dhwec']['employee'])) : ?>
        <div class="notice">Al onze elektrische producten worden voorzien van een Somfy® motor, met uitzondering van de RS38 Solar en
            de By Michel Zip Solar.
        </div>

        <?php if (!empty($employee_code)) : ?>
            <?php $employee_id = get_employee_id_by_code($employee_code); ?>

            <?php if (!empty($employee_id)) : ?>
                <?php
                $access = get_field(
                    'dhwec_employees_access',
                    $employee_id
                );

                if (!empty($access)) {
                    if ($access === 'INTRANET' || $access === 'ALLES') {
                        echo '<a class="button" href="' . get_site_url() . '/praktische-informatie/">Praktische informatie voor monteurs</a>';
                    }
                }
                ?>
            <?php endif; ?>
        <?php endif; ?>
    <?php endif; ?>
</div>
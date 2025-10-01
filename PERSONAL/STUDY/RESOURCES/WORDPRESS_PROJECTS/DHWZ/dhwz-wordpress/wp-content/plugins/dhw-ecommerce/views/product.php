<?php
// get export code, display title and return URL
$export_code = $data['dhwec_export_code'];
$display_title = $data['dhwec_display_title'];
$return_url = get_the_permalink();

// check if product is being edited. If so, set 'identifier' data attribute
$identifier = $_GET['identifier'];
if (!empty($identifier)) {
    if (isset($_SESSION['dhwec']['items'][$identifier])) {
        $identifier = ' data-identifier="' . $identifier . '"';
    } else {
        $identifier = '';
    }
}
?>

<div id="dhwec-product" data-export-code="<?= $export_code; ?>" data-display-title="<?= $display_title; ?>" data-return-url="<?= $return_url; ?>"<?= $identifier; ?>>
    <?php if (!empty($_SESSION['dhwec']['items'])) : ?>
        <!-- start .basket-button -->
        <div class="basket-button">
            <a class="link" href="<?= get_site_url(); ?>/aanvraag/">Bekijk offerteaanvraag</a>
        </div>
        <!-- end .basket-button -->
    <?php endif; ?>

    <div class="row equal-column-heights">
        <div class="column-left">
            <div class="spinner">
                <div class="spinner-circle"></div>
                <div class="spinner-text">Laden...</div>
            </div>

            <?php
            foreach ($data['dhwec_fields'] as $field) {
                echo call_user_func($field['dhwec_field'], $field);
            }
            ?>

            <?php include 'services.php'; ?>

            <?php $label = (empty($_GET['identifier']) ? 'Toevoegen aan aanvraag' : 'Aanvraag bijwerken'); ?>
            <div class="add-to-basket-mobile"><?= $label; ?></div>
        </div>

        <div class="column-right">
            <!-- start .selection -->
            <div class="selection">
                <div class="title">Status offerte aanvraag</div>
                <ul class="items"></ul>
                <?php $label = (empty($_GET['identifier']) ? 'Toevoegen aan aanvraag' : 'Aanvraag bijwerken'); ?>
                <div class="add-to-basket"><?= $label; ?></div>
                <div class="show-selection"><i class="fa fa-shopping-basket"></i> Bekijk aanvraag</div>
                <div class="hide-selection"><i class="fa fa-times"></i> Sluiten</div>
            </div>
            <!-- end .selection -->

            <?php include 'sidebar.php'; ?>
        </div>
    </div>
</div>

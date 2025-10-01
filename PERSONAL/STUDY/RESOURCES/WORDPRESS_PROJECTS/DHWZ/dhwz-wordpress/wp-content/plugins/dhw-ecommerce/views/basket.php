<div id="dhwec-basket">
    <?php $items = $_SESSION['dhwec']['items']; ?>

    <?php if (!empty($items)) : ?>
        <!-- start .items -->
        <div class="items">
            <?php foreach ($items as $id => $item) : ?>
                <?php $return_url = $item['return_url'] . '?identifier=' . $id; ?>

                <div class="item" data-identifier="<?= $id; ?>">
                    <div class="row clearfix">
                        <div class="col-left">
                            <a class="product" href="<?= $return_url; ?>"><?= $item['display_title']; ?></a>
                            <div class="values">
                                <?php
                                $values = $item['values'];
                                foreach ($values as $value) {
                                    $name = $value['name'];
                                    $value_name = strtolower($value['value_name']);
                                    if (!empty($value_name)) {
                                        echo '<span class="value">' . $name . ': ' . $value_name . '</span>';
                                    }
                                }
                                ?>
                            </div>
                        </div>

                        <div class="col-center">
                            <span class="change-quantity" data-method="decrement">-</span>
                            <input class="amount" type="number" value="<?= $item['quantity']; ?>">
                            <span class="change-quantity" data-method="increment">+</span>
                        </div>

                        <div class="col-right">
                            <div class="clone"><i class="fa fa-clone"></i> Kopiëren</div>
                            <a class="edit" href="<?= $return_url; ?>"><i class="fa fa-pencil-square-o"></i> Bewerken</a>
                            <div class="delete"><i class="fa fa-trash-o"></i></div>
                            <?= info_window('Door op "Kopiëren" te klikken kunt u een kopie maken van dit product welke u vervolgens kunt aanpassen. Dit is bijvoorbeeld handig als u meerdere producten wilt bestellen met dezelfde eigenschappen, maar met verschillende maten. Klik op "Bewerken" om het product te bewerken. Klik op het prullenmand-icoontje om het product uit uw aanvraag te verwijderen.'); ?>
                            <?php if ($item['quantity'] > 1) : ?>
                                <div class="placement-txt">Plaatsing van deze producten</div>
                            <?php else : ?>
                                <div class="placement-txt">Plaatsing van dit product</div>
                            <?php endif; ?>
                            <?php $val_attr = (!empty($item['placement']) ? ' value="' . $item['placement'] . '"' : ''); ?>
                            <input class="placement" type="text" placeholder="Bijv. keukenraam/slaapkamer" maxlength="50"<?= $val_attr ?>>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <!-- end .items -->

        <!-- start #add-new-product -->
        <a id="add-new-product" href="<?= get_site_url(); ?>/offerte/">Nog een product toevoegen<i class="fa fa-undo"></i></a>
        <!-- end #add-new-product -->

        <?php include 'services.php'; ?>

        <!-- start .actions -->
        <div class="actions">
            <a class="link" href="<?php echo get_site_url(); ?>/aanvraag/gegevens/">Offerte aanvragen<i class="fa fa-long-arrow-right"></i></a>
        </div>
        <!-- end .actions -->
    <?php else : ?>
        <div class="no-items">U heeft nog geen producten toegevoegd aan uw aanvraag. Ga terug naar
            <a href="<?php echo get_site_url(); ?>">home</a>.
        </div>
    <?php endif; ?>
</div>

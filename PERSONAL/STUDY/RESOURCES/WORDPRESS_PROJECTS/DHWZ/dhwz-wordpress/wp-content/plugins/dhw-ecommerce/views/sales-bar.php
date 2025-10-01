<?php if (!empty($_SESSION['dhwec']['employee'])) : ?>
    <div id="dhwec-sales-bar" class="clearfix">
        <div class="row">
            <div class="small-6 columns">
                <div class="data">
                    <i class="icon fa fa-user-o"></i>
                    <?= $_SESSION['dhwec']['employee']['employee_name']; ?>
                </div>

                <div class="data">
                    <i class="icon fa fa-id-card-o"></i>
                    <?= $_SESSION['dhwec']['employee']['employee_code']; ?>
                </div>
            </div>
            <div class="small-6 columns">
                <div class="sign-out">
                    <i class="icon fa fa-sign-out"></i>Uitloggen
                </div>

                <a href="<?= get_site_url(); ?>/aanvraag/" class="request">
                    <i class="icon fa fa-file-text-o"></i>Aanvraag
                </a>

                <a href="<?= get_site_url(); ?>/offerte/" class="overview">
                    <i class="icon fa fa-th"></i>Producten
                </a>
            </div>
        </div>
    </div>
<?php endif; ?>
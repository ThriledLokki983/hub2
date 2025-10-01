<div id="dhwec-endpoint">
    <div class="row">
        <div class="column-left">
            <p class="text">Bedankt voor uw aanvraag, wij hebben uw aanvraag in goede orde ontvangen. Onze collega’s gaan voor u aan de slag, u ontvangt zo snel mogelijk een offerte van ons. In uw mailbox vindt u een bevestiging van uw aanvraag.</p>
            <a class="home" href="<?php echo get_site_url(); ?>">Terug naar de homepage</a>
        </div>
        <div class="column-right">
            <?php include 'sidebar.php'; ?>
        </div>
    </div>

    <script src="<?php echo plugins_url('/dhw-ecommerce/assets/js/confetti.js'); ?>"></script>

    <script>
        confetti.start();

        setInterval(function () {
            confetti.stop()
        }, 2000);
    </script>
</div>
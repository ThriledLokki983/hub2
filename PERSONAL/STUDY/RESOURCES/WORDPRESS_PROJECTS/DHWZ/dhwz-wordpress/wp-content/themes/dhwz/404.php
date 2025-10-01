<?php get_header(); ?>

    <main class="main">
        <section class="p404 wysiwyg">
            <h1>Pagina niet gevonden</h1>

            <p>De door u opgevraagde pagina is niet beschikbaar. Mogelijk wordt dit veroorzaakt door één van de onderstaande redenen.</p>

            <ul>
                <li>De pagina bestaat niet</li>
                <li>De pagina kan tijdelijk niet worden weergegeven</li>
                <li>U heeft een typefout gemaakt</li>
                <li>U gebruikt een verouderde link</li>
            </ul>

            <p>Klik <a href="<?= get_site_url() ?>">hier</a> om terug te gaan naar de homepage.</p>
        </section>
    </main>

    <section class="divider"></section>

<?php get_footer(); ?>
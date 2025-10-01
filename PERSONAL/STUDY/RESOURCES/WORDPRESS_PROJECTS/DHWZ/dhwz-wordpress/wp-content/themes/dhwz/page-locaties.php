<?php get_header(); ?>

    <main class="main">
        <?php get_template_part('parts/part', 'page-header'); ?>

        <section class="products">
            <ul class="products__lists">
                <?php
                $locations = get_field('locations');
                $firstTwo = array_slice($locations, 0, 2);
                $nextTwo = array_slice($locations, 2, 2);
                $remaining = array_slice($locations, 4);
                ?>

                <?php foreach ($firstTwo as $location) : ?>
                    <?= dhwz_location_html($location); ?>
                <?php endforeach; ?>

                <li class="products__lists--item">
                    <div class="products__lists--item--info bg-sec">
                        <?php foreach (get_field('contact_details') as $detail) : ?>
                            <div class="content contact-details">
                                <span>De Haan Westerhoff</span>
                                <h2><?= $detail['department'] ?></h2>
                                <a href="tel:<?= $detail['phone_link'] ?>"><?= $detail['phone'] ?></a>
                                <a href="mailto:<?= $detail['phone_email'] ?>">Mail naar
                                    DHW <?= $detail['department'] ?> ›</a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </li>

                <?php foreach ($nextTwo as $location) : ?>
                    <?= dhwz_location_html($location); ?>
                <?php endforeach; ?>

                <li class="products__lists--item">
                    <div class="products__lists--item--info jc-start">
                        <div class="content">
                            <h4><?= get_field('locations_info_title') ?></h4>
                        </div>
                        <div class="content"><?= get_field('locations_info_text') ?></div>
                    </div>
                </li>

                <?php foreach ($remaining as $location) : ?>
                    <?= dhwz_location_html($location); ?>
                <?php endforeach; ?>
            </ul>
        </section>

        <section class="prefooter grid-2-1">
            <article class="prefooter__text">
                <h2 class="header"><?= get_field('seo_title'); ?></h2>
                <?= get_field('seo_text'); ?>
            </article>
            <article class="prefooter__photo">
                <div id="locations-map"></div>

                <script>
                    function initMap() {
                        var mapOptions = {
                            center: {lat: 52.3246582516218, lng: 5.551994805793281},
                            zoom: 7.0,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var map = new google.maps.Map(document.getElementById('locations-map'), mapOptions);

                        <?php if ( !empty($locations) ) : ?>
                        var locations = [
                            <?php foreach ($locations as $location) : ?>
                            <?php
                            $v1 = $location['city'];
                            $v2 = $location['latitude'];
                            $v3 = $location['longitude'];
                            ?>
                            ['<?= $v1; ?>', '<?= $v2; ?>', '<?= $v3; ?>'],
                            <?php endforeach; ?>
                        ];
                        <?php endif; ?>

                        for (var i = 0; i < locations.length; i++) {
                            var data = locations[i];
                            var latLng = new google.maps.LatLng(data[1], data[2]);
                            new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: data[0],
                                icon: '/wp-content/themes/dhwz/public/assets/img/dhw-pointer.png'
                            });
                        }
                    }
                </script>

                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkcTZ2t9Tsxh6Coxy0o_0rC7NqkAVxKZk&callback=initMap" async defer></script>
            </article>
        </section>

<section class="divider"></section>
    </main>

<?php get_footer(); ?>
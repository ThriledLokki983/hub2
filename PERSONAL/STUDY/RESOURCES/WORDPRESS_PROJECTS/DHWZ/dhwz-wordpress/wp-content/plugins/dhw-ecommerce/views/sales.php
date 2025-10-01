<?php if (!empty($_SESSION['dhwec']['employee']) && $_SESSION['dhwec']['employee']['employee_showroom'] === true) : ?>
    <div id="dhwec-sales">
        <form class="form">
            <!-- start employee -->
            <div class="box">
                <div class="box-header">Selecteer een medewerker</div>
                <div class="box-content">
                    <select class="input input-employee" required>
                        <option value="" selected disabled hidden>Selecteer een medewerker *</option>
                        <?php
                        $args = [
                            'post_type'      => 'dhwec_employees',
                            'posts_per_page' => -1,
                            'orderby'        => 'title',
                            'order'          => 'ASC',
                            'meta_query'     => array(
                                array(
                                    'key'     => 'dhwec_employees_is_showroom_employee',
                                    'value'   => true,
                                    'compare' => '='
                                )
                            )
                        ];
                        ?>

                        <?php $showrooms = new WP_Query($args); ?>
                        <?php if ($showrooms->have_posts()) : ?>
                            <?php while ($showrooms->have_posts()) : $showrooms->the_post(); ?>
                                <option value="<?= get_field('dhwec_employees_code'); ?>"><?php the_title(); ?></option>
                            <?php endwhile; ?>
                            <?php wp_reset_postdata(); ?>
                        <?php endif; ?>
                    </select>
                </div>
            </div>
            <!-- end employee -->

            <!-- start login -->
            <button type="submit" class="login">Inloggen</button>
            <!-- end login -->
        </form>
    </div>
<?php else : ?>
    <b>Authorization required!</b> Please visit <a href="<?= get_site_url(); ?>/inloggen/">this page</a> first.
<?php endif; ?>

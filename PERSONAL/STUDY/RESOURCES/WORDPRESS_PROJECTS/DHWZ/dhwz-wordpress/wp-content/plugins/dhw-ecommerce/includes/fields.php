<?php
/**
 * Field section
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_section($field) {
    // parameters
    $title = $field['dhwec_section_title'];
    $description = $field['dhwec_section_description'];
    $margin = $field['dhwec_section_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = array(
        'class'     => 'field field-section',
        'data-type' => 'field-section',
        'style'     => 'margin-bottom: ' . $margin . 'px'
    );

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="title"><?= $title; ?></div>
        <p class="description"><?= $description; ?></p>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field measurements
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_measurements($field) {
    // f1 parameters
    $f1_handle = $field['dhwec_measurements_f1_handle'];
    $f1_name = $field['dhwec_measurements_f1_name'];
    $f1_label = $field['dhwec_measurements_f1_label'];
    $f1_min_val = $field['dhwec_measurements_f1_min_value'];
    $f1_max_val = $field['dhwec_measurements_f1_max_value'];
    $f1_info_window = $field['dhwec_measurements_f1_info_window'];

    // f2 parameters
    $f2_handle = $field['dhwec_measurements_f2_handle'];
    $f2_name = $field['dhwec_measurements_f2_name'];
    $f2_label = $field['dhwec_measurements_f2_label'];
    $f2_min_val = $field['dhwec_measurements_f2_min_value'];
    $f2_max_val = $field['dhwec_measurements_f2_max_value'];
    $f2_info_window = $field['dhwec_measurements_f2_info_window'];

    // f3 parameters
    $f3_handle = $field['dhwec_measurements_f3_handle'];
    $f3_name = $field['dhwec_measurements_f3_name'];
    $f3_label = $field['dhwec_measurements_f3_label'];
    $f3_min_val = $field['dhwec_measurements_f3_min_value'];
    $f3_max_val = $field['dhwec_measurements_f3_max_value'];
    $f3_info_window = $field['dhwec_measurements_f3_info_window'];

    // other parameters
    $dimensions = $field['dhwec_measurements_dimensions'];
    $exceeding_allowed = $field['dhwec_measturements_exceeding_allowed'];
    $margin = $field['dhwec_measurements_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'                  => 'field field-measurements',
        'data-type'              => 'field-measurements',
        'data-exceeding-allowed' => $exceeding_allowed,
        'style'                  => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($dimensions)) {
        $attributes['data-dimensions'] = $dimensions;
    }

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="fields-wrap">
            <?php $selected_value = get_session_item_field_value($f1_handle); ?>
            <div class="f1" data-handle="<?= $f1_handle; ?>" data-name="<?= $f1_name; ?>">
                <div class="label">
                    <?= $f1_label; ?>
                    <?= (!empty($f1_info_window) ? info_window($f1_info_window) : ''); ?>
                </div>
                <?php $min_attr = (!empty($f1_min_val) ? ' min="' . $f1_min_val . '"' : ''); ?>
                <?php $max_attr = (!empty($f1_max_val) ? ' max="' . $f1_max_val . '"' : ''); ?>
                <?php $value_attr = (!empty($selected_value) ? ' value="' . $selected_value . '"' : ''); ?>
                <input class="input" type="number"<?= $min_attr; ?><?= $max_attr; ?><?= $value_attr; ?>>
            </div>

            <?php if (!empty($f2_handle) && !empty($f2_name) && !empty($f2_label)) : ?>
                <?php $selected_value = get_session_item_field_value($f2_handle); ?>
                <div class="f2" data-handle="<?= $f2_handle; ?>" data-name="<?= $f2_name; ?>">
                    <div class="label">
                        <?= $f2_label; ?>
                        <?= (!empty($f2_info_window) ? info_window($f2_info_window) : ''); ?>
                    </div>
                    <?php $min_attr = (!empty($f2_min_val) ? ' min="' . $f2_min_val . '"' : ''); ?>
                    <?php $max_attr = (!empty($f2_max_val) ? ' max="' . $f2_max_val . '"' : ''); ?>
                    <?php $value_attr = (!empty($selected_value) ? ' value="' . $selected_value . '"' : ''); ?>
                    <input class="input" type="number"<?= $min_attr; ?><?= $max_attr; ?><?= $value_attr; ?>>
                </div>
            <?php endif; ?>

            <?php if (!empty($f3_handle) && !empty($f3_name) && !empty($f3_label)) : ?>
                <?php $selected_value = get_session_item_field_value($f3_handle); ?>
                <div class="f3" data-handle="<?= $f3_handle; ?>" data-name="<?= $f3_name; ?>">
                    <div class="label">
                        <?= $f3_label; ?>
                        <?= (!empty($f3_info_window) ? info_window($f3_info_window) : ''); ?>
                    </div>
                    <?php $min_attr = (!empty($f3_min_val) ? ' min="' . $f3_min_val . '"' : ''); ?>
                    <?php $max_attr = (!empty($f3_max_val) ? ' max="' . $f3_max_val . '"' : ''); ?>
                    <?php $value_attr = (!empty($selected_value) ? ' value="' . $selected_value . '"' : ''); ?>
                    <input class="input" type="number"<?= $min_attr; ?><?= $max_attr; ?><?= $value_attr; ?>>
                </div>
            <?php endif; ?>
        </div>

        <div class="error">N/A</div>

        <div class="info-popup">
            <div class="header">
                <div class="title">Maatvoering</div>
                <div class="close">
                    <i class="close-icon fa fa-times"></i>
                    <span class="close-text">Sluiten</span>
                </div>
            </div>
            <div class="content">
                Let op! De door u aangegeven maatvoering kan niet worden uitgevoerd in één systeem, door twee (of
                meerdere) systemen te koppelen lukt dit wel. Het systeem wordt symetrisch gekoppeld. Een breedte van 15
                meter wordt een gekoppeld systeem van 3 x 5 meter. Een breedte van 12 meter wordt 2 x 6 meter. Liever
                anders? Geef dit aan bij de opmerkingen in het vervolg formulier.
            </div>
        </div>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field design select
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_design_select($field) {
    // parameters
    $handle = $field['dhwec_design_select_handle'];
    $name = $field['dhwec_design_select_name'];
    $label = $field['dhwec_design_select_label'];
    $info_window = $field['dhwec_design_select_info_window'];
    $color_set = $field['dhwec_design_select_color_set'];
    $show_ral_input = $field['dhwec_design_select_show_ral_input'];
    $margin = $field['dhwec_design_select_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'       => 'field field-design-select',
        'data-handle' => $handle,
        'data-name'   => $name,
        'data-type'   => 'field-design-select',
        'style'       => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    // selected value
    $selected_value = get_session_item_field_value($handle);

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="label">
            <?= $label; ?>
            <?= (!empty($info_window) ? info_window($info_window) : ''); ?>
        </div>

        <div class="samples">
            <div class="row small-up-4 medium-up-4 large-up-4 clearfix">
                <?php
                $items = get_field('dhwec_color_set', $color_set);
                $items_count = count($items);
                if ($items_count < 8) {
                    $iterations = $items_count;
                } else {
                    $iterations = 8;
                }
                ?>

                <?php for ($i = 0; $i < $iterations; $i++) : ?>
                    <?php
                    $src = $items[$i]['dhwec_color_set_image']['url'];
                    $alt = $items[$i]['dhwec_color_set_name'];
                    $title = $items[$i]['dhwec_color_set_name'];
                    $value = $items[$i]['dhwec_color_set_ral'];
                    $value_name = $items[$i]['dhwec_color_set_name'];

					if ($items[$i]['dhwec_color_set_recommended'] === 'y') {
						$class = ' recommended';
					} elseif ($items[$i]['dhwec_color_set_recommended'] === 'p') {
						$class = ' popular';
					} else {
						$class = '';
					}
	
                    $selected = ($selected_value === $value ? ' selected' : '');
                    $price_diff = $items[$i]['dhwec_color_set_price_difference'];

                    $price_diff_el = '';
                    if ($price_diff === 'more' || $price_diff  === 'less') {
                        $sign = ($price_diff === 'more' ? '+' : '-');
                        $price_diff_el = ' <span class="price-diff ' . $price_diff . '">&euro; ' . $sign . '</span>';
                    }
                    ?>

                    <div class="column column-block">
                        <div class="sample-holder<?= $class; ?>">
                            <img class="sample<?= $selected; ?>" src="<?= $src; ?>" alt="<?= $alt; ?>" title="<?= $title; ?>" data-value="<?= $value; ?>" data-value-name="<?= $value_name; ?>">
                            <?= $price_diff_el; ?>
                        </div>
                    </div>
                <?php endfor; ?>
            </div>

            <div class="actions">
                <?php if ($show_ral_input === 'y') : ?>
                    <span class="show-ral-input"><i class="fa fa-tint"></i>eigen RAL-kleur <span class="ral-color-surcharge">(&euro; +)</span></span>
                <?php endif; ?>

                <?php if ($items_count > 8) : ?>
                    <span class="show-more-button"><i class="fa fa-th"></i>toon alle variaties</span>
                <?php endif; ?>
            </div>

            <div class="popup">
                <div class="header">
                    <div class="title"><?= $name; ?> selecteren</div>
                    <div class="close">
                        <i class="close-icon fa fa-times"></i>
                        <span class="close-text">sluiten</span>
                    </div>
                </div>

                <div class="scroll-tip">
                    <img class="scroll-img" src="<?php echo plugins_url('/dhw-ecommerce/assets/img/scroll.png'); ?>" role="presentation">
                    Scroll naar beneden om meer variaties te bekijken
                </div>

                <div class="content">
                    <div class="variations clearfix">
                        <?php foreach ($items as $item) : ?>
                            <?php
                            $src = $item['dhwec_color_set_image']['url'];
                            $alt = $item['dhwec_color_set_name'];
                            $title = $item['dhwec_color_set_name'];
                            $value = $item['dhwec_color_set_ral'];
                            $value_name = $item['dhwec_color_set_name'];

							if ($item['dhwec_color_set_recommended'] === 'y') {
								$class = ' recommended';
							} elseif ($item['dhwec_color_set_recommended'] === 'p') {
								$class = ' popular';
							} else {
								$class = '';
							}
	
                            $selected = ($selected_value === $value ? ' selected' : '');
                            $price_diff = $item['dhwec_color_set_price_difference'];

                            $price_diff_el = '';
                            if ($price_diff === 'more' || $price_diff  === 'less') {
                                $sign = ($price_diff === 'more' ? '+' : '-');
                                $price_diff_el = ' <span class="price-diff ' . $price_diff . '">(&euro; ' . $sign . ')</span>';
                            }
                            ?>

                            <div class="sample-holder<?= $class; ?>">
                                <img class="sample<?= $selected; ?>" src="<?= $src; ?>" alt="<?= $alt; ?>" title="<?= $title; ?>" data-value="<?= $value; ?>" data-value-name="<?= $value_name; ?>">
                                <?= $price_diff_el; ?>
                                <div class="sample-color-code"><?= $title; ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="select-wrap">
                    <div class="select">Selecteer <?= $name; ?></div>
                </div>
            </div>

            <div class="choice">
                <div class="choice-inner">
                    <img class="choice-image" src="" role="presentation">
                    <div class="choice-text">Geselecteerd</div>
                </div>
            </div>

            <div class="change-choice">Selectie wijzigen <i class="fa fa-edit"></i></div>
        </div>

        <?php if ($show_ral_input === 'y') : ?>
            <?php
            if (substr($selected_value, 0, 1) === '#') {
                $value_attr = ' value="' . substr($selected_value, 1) . '"';
            } else {
                $value_attr = '';
            }
            ?>
            <div class="ral-color">
                <input class="ral-color-input" type="number" placeholder="Bijv. 6009" step="1"<?= $value_attr; ?>>
                <span class="ral-color-label">
                    Liever uw eigen kleur? Voer dan hier de RAL-code in
                    <span class="ral-color-surcharge">(&euro; +)</span>
                </span>
            </div>
        <?php endif; ?>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field toggle
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_toggle($field) {
    // parameters
    $handle = $field['dhwec_toggle_handle'];
    $name = $field['dhwec_toggle_name'];
    $label = $field['dhwec_toggle_label'];
    $info_window = $field['dhwec_toggle_info_window'];
    $option_1_label = $field['dhwec_toggle_o1_label'];
    $option_1_value = $field['dhwec_toggle_o1_value'];
    $option_1_recommended = $field['dhwec_toggle_o1_recommended'];
    $option_1_price_diff = $field['dhwec_toggle_o1_price_difference'];
    $option_2_label = $field['dhwec_toggle_o2_label'];
    $option_2_value = $field['dhwec_toggle_o2_value'];
    $option_2_recommended = $field['dhwec_toggle_o2_recommended'];
    $option_2_price_diff = $field['dhwec_toggle_o2_price_difference'];
    $margin = $field['dhwec_toggle_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'       => 'field field-toggle',
        'data-handle' => $handle,
        'data-name'   => $name,
        'data-type'   => 'field-toggle',
        'style'       => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    // selected value
    $selected_value = get_session_item_field_value($handle);

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="label">
            <?= $label; ?>
            <?= (!empty($info_window) ? info_window($info_window) : ''); ?>
        </div>
        <ul class="options">
            <?php
            $selected = ($selected_value === $option_1_value ? ' selected' : '');
            $recommended = ($option_1_recommended === 'y' ? ' <span class="recommended">aanbevolen</span>' : '');

            $price_diff = '';
            if ($option_1_price_diff === 'more' || $option_1_price_diff === 'less') {
                $sign = ($option_1_price_diff === 'more' ? '+' : '-');
                $price_diff = ' <span class="price-diff ' . $option_1_price_diff . '">&euro; ' . $sign . '</span>';
            }
            ?>
            <li class="option<?= $selected; ?>" data-value="<?= $option_1_value; ?>" data-value-name="<?= $option_1_label; ?>"><?= $option_1_label; ?><?= $recommended; ?><?= $price_diff; ?></li>

            <?php
            $selected = ($selected_value === $option_2_value ? ' selected' : '');
            $recommended = ($option_2_recommended === 'y' ? ' <span class="recommended">aanbevolen</span>' : '');

            $price_diff = '';
            if ($option_2_price_diff === 'more' || $option_2_price_diff === 'less') {
                $sign = ($option_2_price_diff === 'more' ? '+' : '-');
                $price_diff = ' <span class="price-diff ' . $option_1_price_diff . '">&euro; ' . $sign . '</span>';
            }
            ?>
            <li class="option<?= $selected; ?>" data-value="<?= $option_2_value; ?>" data-value-name="<?= $option_2_label; ?>"><?= $option_2_label; ?><?= $recommended; ?><?= $price_diff; ?></li>
        </ul>

        <?php // check if fields has handle 'appbediening'. If so, load popup
        if ($handle === 'appbediening') : ?>
            <div class="info-popup">
                <div class="header">
                    <div class="title">U heeft al appbediening</div>
                    <div class="close">
                        <i class="close-icon fa fa-times"></i>
                        <span class="close-text">sluiten</span>
                    </div>
                </div>
                <div class="content">
                    Let op! U heeft al één of meerdere connexoon/tahomabox in uw aanvraag. U heeft aan één systeem
                    genoeg.
                </div>
            </div>
        <?php endif; ?>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field option select
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_option_select($field) {
    // parameters
    $handle = $field['dhwec_option_select_handle'];
    $name = $field['dhwec_option_select_name'];
    $label = $field['dhwec_option_select_label'];
    $info_window = $field['dhwec_option_select_info_window'];
    $options = $field['dhwec_option_select_options'];
    $margin = $field['dhwec_option_select_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'       => 'field field-option-select',
        'data-handle' => $handle,
        'data-name'   => $name,
        'data-type'   => 'field-option-select',
        'style'       => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    // selected value
    $selected_value = get_session_item_field_value($handle);

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="label">
            <?= $label; ?>
            <?= (!empty($info_window) ? info_window($info_window) : ''); ?>
        </div>

        <?php $random = rand(0, 9999); // used to give each field a unique name tag ?>

        <?php foreach ($options as $option) : ?>
            <?php
            $value = $option['dhwec_option_select_options_value'];
            $value_name = $option['dhwec_option_select_options_name'];
            $recommended = $option['dhwec_option_select_options_recommended'];
            $price_diff = $option['dhwec_option_select_options_price_difference'];
            $cl = $option['dhwec_option_select_options_cl'];

            $price_diff_el = '';
            if ($price_diff === 'more' || $price_diff  === 'less') {
                $sign = ($price_diff === 'more' ? '+' : '-');
                $price_diff_el = ' <span class="price-diff ' . $price_diff . '">&euro; ' . $sign . '</span>';
            }
            ?>

            <?php $cl = (!empty($cl) ? ' data-conditional-logic="' . $cl . '"' : ''); ?>

            <div class="option-wrap"<?= $cl; ?>>
                <label class="option-label">
                    <?php $checked = ($selected_value === $value ? ' checked="checked"' : ''); ?>
                    <input class="option" type="radio" name="<?= $handle . '-' . $random; ?>" data-value="<?= $value; ?>" data-value-name="<?= $value_name; ?>"<?= $checked; ?>>
                    <?= $value_name; ?>
                    <?php echo($recommended === 'y' ? ' <span class="recommended">aanbevolen</span>' : ''); ?>
                    <?= $price_diff_el; ?>
                </label>
            </div>
        <?php endforeach; ?>

        <?php // check if fields has handle 'afstandsbediening'. If so, load popup
        if ($handle === 'afstandsbediening') : ?>
            <div class="info-popup">
                <div class="header">
                    <div class="title">U heeft al een afstandsbediening</div>
                    <div class="close">
                        <i class="close-icon fa fa-times"></i>
                        <span class="close-text">sluiten</span>
                    </div>
                </div>
                <div class="content">Let op: U heeft al één of meerdere afstandsbediening(en) in uw aanvraag. U kunt
                    kiezen voor twee losse "situo 1" afstandsbedieningen of om meerdere zonwering op één "Situo 5"
                    afstandsbediening in te stellen. Hier kunt u 4 aparte en 1 gezamelijk kanaal mee bedienen.
                </div>
            </div>
        <?php endif; ?>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field option select (using visuals)
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_option_select_visual($field) {
    // parameters
    $handle = $field['dhwec_option_select_visual_handle'];
    $name = $field['dhwec_option_select_visual_name'];
    $label = $field['dhwec_option_select_visual_label'];
    $info_window = $field['dhwec_option_select_visual_info_window'];
    $options = $field['dhwec_option_select_visual_options'];
    $margin = $field['dhwec_option_select_visual_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'       => 'field field-option-select-visual',
        'data-handle' => $handle,
        'data-name'   => $name,
        'data-type'   => 'field-option-select-visual',
        'style'       => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    // selected value
    $selected_value = get_session_item_field_value($handle);

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="label">
            <?= $label; ?>
            <?= (!empty($info_window) ? info_window($info_window) : ''); ?>
        </div>
        <ul class="options clearfix">
            <?php foreach ($options as $option) : ?>
                <?php
                $image = $option['dhwec_option_select_visual_options_image']['url'];
                $value_name = $option['dhwec_option_select_visual_options_name'];
                $value = $option['dhwec_option_select_visual_options_value'];
                $cl = $option['dhwec_option_select_visual_options_cl'];
                $selected = ($selected_value === $value ? ' selected' : '');
                $recommended = ($option['dhwec_option_select_visual_options_recommended'] === 'y' ? ' recommended' : '');
                $price_diff = $option['dhwec_option_select_visual_options_price_difference'];
                $visibility = $option['dhwec_option_select_visual_options_visibility'];

                $price_diff_el = '';
                if ($price_diff === 'more' || $price_diff  === 'less') {
                    $sign = ($price_diff === 'more' ? '+' : '-');
                    $price_diff_el = ' <span class="price-diff ' . $price_diff . '">&euro; ' . $sign . '</span>';
                }
                ?>

                <?php if ($visibility === false || $visibility === 'extern' || $visibility === 'intern' && $_SESSION['dhwec']['employee']['employee_showroom'] === true) : ?>
                    <?php $cl = (!empty($cl) ? ' data-conditional-logic="' . $cl . '"' : ''); ?>

                    <li class="option<?= $selected; ?><?= $recommended; ?>" data-value="<?= $value; ?>" data-value-name="<?= $value_name; ?>"<?= $cl; ?>>
                        <img src="<?= $image; ?>" title="<?= $value_name; ?>" role="presentation">
                        <?= $price_diff_el; ?>
                    </li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </div>

    <?php return ob_get_clean();
}

/**
 * Field checkboxes
 *
 * @param $field
 * @return false|string
 */
function dhwec_field_checkboxes($field) {
    // parameters
    $label = $field['dhwec_checkboxes_label'];
    $info_window = $field['dhwec_checkboxes_info_window'];
    $options = $field['dhwec_checkboxes_options'];
    $margin = $field['dhwec_checkboxes_margin'];
    $conditional_logic = $field['dhwec_conditional_logic'];

    // attributes
    $attributes = [
        'class'     => 'field field-checkboxes',
        'data-type' => 'field-checkboxes',
        'style'     => 'margin-bottom: ' . $margin . 'px'
    ];

    if (!empty($conditional_logic)) {
        $attributes['data-conditional-logic'] = $conditional_logic;
    }

    ob_start(); ?>

    <div <?= field_attributes($attributes); ?>>
        <div class="label">
            <?= $label; ?>
            <?= (!empty($info_window) ? info_window($info_window) : ''); ?>
        </div>

        <?php foreach ($options as $option) : ?>
            <?php
            $handle = $option['dhwec_checkboxes_options_handle'];
            $label = $option['dhwec_checkboxes_options_label'];
            $name = $option['dhwec_checkboxes_options_name'];
            $value = $option['dhwec_checkboxes_options_value'];
            $value_name = $option['dhwec_checkboxes_options_value_name'];
            $recommended = $option['dhwec_checkboxes_options_recommended'];
            $recommended = ($recommended === 'y' ? ' recommended' : '');
            $price_diff = $option['dhwec_checkboxes_options_price_difference'];
            $info_box = $option['dhwec_checkboxes_options_info_box'];

            $price_diff_el = '';
            if ($price_diff === 'more' || $price_diff  === 'less') {
                $sign = ($price_diff === 'more' ? '+' : '-');
                $price_diff_el = ' <span class="price-diff ' . $price_diff . '">&euro; ' . $sign . '</span>';
            }
            ?>

            <div class="checkbox-wrap">
                <label class="checkbox-label">
                    <?php $selected_value = get_session_item_field_value($handle); ?>
                    <?php $checked = ($selected_value === $value ? ' checked' : ''); ?>
                    <input class="checkbox" type="checkbox" data-handle="<?= $handle; ?>" data-name="<?= $name; ?>" data-value="<?= $value; ?>" data-value-name="<?= $value_name; ?>"<?= $checked; ?>>
                    <?= $label; ?>
                    <?php echo($recommended === 'y' ? ' <span class="recommended">aanbevolen</span>' : ''); ?>
                    <?= $price_diff_el; ?>
                    <?php echo(!empty($info_box) ? info_window($info_box) : ''); ?>
                </label>
            </div>
        <?php endforeach; ?>
    </div>

    <?php return ob_get_clean();
}

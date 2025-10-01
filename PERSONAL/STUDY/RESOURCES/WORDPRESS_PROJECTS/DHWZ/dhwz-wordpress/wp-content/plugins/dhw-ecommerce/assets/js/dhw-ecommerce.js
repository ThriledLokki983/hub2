/*
|--------------------------------------------------------------------------
| Global functions
|--------------------------------------------------------------------------
*/
/**
 * Input delay
 *
 * Function for executing a function after
 * the user has stopped typing for a specified amount of time
 *
 * @param fn The function which to execute
 * @param ms Time of delay in ms
 *
 * @return function
 */
function input_delay(fn, ms) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

/**
 * Get field values
 *
 * @param all (1 = all fields, 0 = only visible fields)
 *
 * @return {Object}
 */
function get_field_values(all) {
    // get all fields
    var fields = jQuery('#dhwec-product, #dhwec-basket').find('.field');

    // declare 'values' variable
    var values = new Object();

    // loop over fields
    for (i = 0; i < fields.length; i++) {
        // set base element
        var element = jQuery(fields[i]);

        // check if field value should be saved in variable 'values'
        if (all === 0 && element.is(':visible') === false) {
            continue;
        }

        // get field type
        var type = element.data('type');

        // get values
        var value = window['get_' + type.replace(/-/g, '_') + '_value'](element);

        // push to list of values
        if (value !== false) {
            for (x = 0; x < value.length; x++) {
                if (all === 1 && !element.is(':visible')) {
                    value[x].value = '';
                    value[x].value_name = '';
                }

                var handle = value[x].handle;
                if (values[handle] !== undefined) {
                    if (element.is(':visible')) {
                        values[handle] = value[x];
                    }
                } else {
                    values[handle] = value[x];
                }
            }
        }
    }

    // return values
    return values;
}

/**
 * Toggle conditional fields
 */
function toggle_conditional_fields() {
    // get field values
    var values = get_field_values(1);

    // loop over fields
    jQuery('#dhwec-product, #dhwec-basket').find('.field, .option, .option-wrap').each(function () {
        var field = jQuery(this);

        field.hide();

        var conditional_logic = field.data('conditional-logic');

        if (conditional_logic) {
            statements_valid = true;

            var statements = conditional_logic.split('|');
            for (var i = 0; i < statements.length; i++) {
                var handle = statements[i].split(':')[0];
                var triggers = statements[i].split(':')[1].split(',');

                var operator = '==';

                if (handle.charAt(0) === '!') {
                    handle = handle.substr(1);
                    operator = '!=';
                }

                if (handle.charAt(0) === '<') {
                    handle = handle.substr(1);
                    operator = '<';
                }

                if (handle.charAt(0) === '>') {
                    handle = handle.substr(1);
                    operator = '>';
                }

                var statement_valid = false;

                if (operator === '==') {
                    statement_valid = (values[handle] !== undefined && triggers.indexOf(values[handle].value + '') >= 0);
                } else if (operator === '!=') {
                    statement_valid = (values[handle] !== undefined && values[handle].value !== undefined && triggers.indexOf(values[handle].value + '') < 0);
                } else if (operator === '<') {
                    statement_valid = (values[handle] !== undefined && values[handle].value !== '' && parseInt(values[handle].value) <= parseInt(triggers[0]));
                } else if (operator === '>') {
                    statement_valid = (values[handle] !== undefined && values[handle].value !== '' && parseInt(values[handle].value) >= parseInt(triggers[0]));
                }

                if (!statement_valid) {
                    statements_valid = false;
                    break;
                }
            }

            if (statements_valid) {
                field.show();
            }
        } else {
            field.show();
        }
    });
}

/**
 * Update selection
 */
function update_selection() {
    // select base element
    var elem = jQuery('#dhwec-product').find('.selection').find('.items');

    // clear list
    elem.empty();

    // get field values
    var values = get_field_values(0);

    // fill list
    jQuery.each(values, function (k, v) {
        // select icon and value presentation
        if (v.value_name !== undefined && v.value_name !== '') {
            var icon = '<i class="fa fa-check"></i> ';
            var value = '<span class="spec">' + v.value_name + '</span>';
        } else {
            var icon = '<i class="fa fa-times"></i> ';

            if (v.type === 'field-measurements') {
                var value = 'nog in te vullen';
            } else {
                var value = 'nog te selecteren';
            }
        }

        // append item to list
        var item = '<li class="item">' + icon + v.name + ': ' + value + '</li>';
        elem.append(item);
    });
}

/**
 * Validate product form
 *
 * @return {boolean}
 */
function validate() {
    // remove 'field-invalid' classes
    jQuery('.field-invalid').removeClass('field-invalid');

    // get all fields
    var fields = get_field_values(0);

    // set 'success' variable which indicates whether there are empty fields or not
    var success = true;

    // loop over fields
    jQuery.each(fields, function (k, v) {
        if (v.value === undefined || v.value === '') {
            jQuery('[data-handle=' + v.handle + ']').addClass('field-invalid');
            success = false;
        }
    });

    // return result
    return success;
}

/*
|--------------------------------------------------------------------------
| Functions for retrieving field values
|--------------------------------------------------------------------------
*/

// get field section value
function get_field_section_value(el) {
    return false;
}

// get field measurements value
function get_field_measurements_value(el) {
    var values = [];

    var has_error = el.find('.error').is(':visible');

    var value = {};
    value.handle = el.find('.f1').data('handle');
    value.name = el.find('.f1').data('name');
    value.type = el.data('type');

    if (!has_error) {
        value.value = el.find('.f1').find('.input').val();
        value.value_name = el.find('.f1').find('.input').val();
    } else {
        value.value = '';
        value.value_name = '';
    }

    values.push(value);

    if (el.find('.f2').length) {
        var value = {};
        value.handle = el.find('.f2').data('handle');
        value.name = el.find('.f2').data('name');
        value.type = el.data('type');

        if (!has_error) {
            value.value = el.find('.f2').find('.input').val();
            value.value_name = el.find('.f2').find('.input').val();
        } else {
            value.value = '';
            value.value_name = '';
        }

        values.push(value);
    }

    if (el.find('.f3').length) {
        var value = {};
        value.handle = el.find('.f3').data('handle');
        value.name = el.find('.f3').data('name');
        value.type = el.data('type');

        if (!has_error) {
            value.value = el.find('.f3').find('.input').val();
            value.value_name = el.find('.f3').find('.input').val();
        } else {
            value.value = '';
            value.value_name = '';
        }

        values.push(value);
    }

    return values;
}

// get field design select value
function get_field_design_select_value(el) {
    var values = [];

    var value = {};

    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');

    var ral = el.find('.ral-color-input').val();
    if (ral !== '' && ral !== undefined) {
        value.value = '#' + ral;
        value.value_name = ral;
    } else {
        value.value = el.find('.selected').data('value');
        value.value_name = el.find('.selected').data('value-name');
    }

    values.push(value);

    return values;
}

// get field toggle value
function get_field_toggle_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.selected').data('value');
    value.value_name = el.find('.selected').data('value-name');
    values.push(value);

    return values;
}

// get field option select value
function get_field_option_select_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');

    if (el.find('.option:checked').is(':visible')) {
        value.value = el.find('.option:checked').data('value');
        value.value_name = el.find('.option:checked').data('value-name');
    } else {
        value.value = '';
        value.value_name = '';
    }

    values.push(value);

    return values;
}

// get field option select (using visuals) value
function get_field_option_select_visual_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.selected').data('value');
    value.value_name = el.find('.selected').data('value-name');
    values.push(value);

    return values;
}

// get field checkboxes value
function get_field_checkboxes_value(el) {
    var values = [];

    // set type
    var type = jQuery(el).data('type');

    // loop over checkboxes
    var checkboxes = el.find('.checkbox-wrap');
    jQuery(checkboxes).each(function (index) {
        // set checkbox element
        var checkbox = jQuery(this).find('.checkbox');

        // set value
        var value = {};
        value.handle = checkbox.data('handle');
        value.name = checkbox.data('name');
        value.type = type;
        if (checkbox.is(':checked')) {
            value.value = checkbox.data('value');
            value.value_name = checkbox.data('value-name');
        } else {
            value.value = 'N';
            value.value_name = 'Nee';
        }
        values.push(value);
    });

    return values;
}

// get field inmeetservice value
function get_field_inmeetservice_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.radio:checked').data('value');
    value.value_name = el.find('.radio:checked').data('value-name');
    values.push(value);

    return values;
}

// get field montageservice value
function get_field_montageservice_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.radio:checked').data('value');
    value.value_name = el.find('.radio:checked').data('value-name');
    values.push(value);

    return values;
}

// get field pickup location value
function get_field_pickup_location_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.select').find('option:selected').data('value');
    value.value_name = el.find('.select').find('option:selected').data('value-name');
    values.push(value);

    return values;
}

// get field floor value
function get_field_floor_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.select').find('option:selected').data('value');
    value.value_name = el.find('.select').find('option:selected').data('value-name');
    values.push(value);

    return values;
}

// get field demontageservice-keuze value
function get_field_demontageservice_keuze_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.radio:checked').data('value');
    value.value_name = el.find('.radio:checked').data('value-name');
    values.push(value);

    return values;
}

// get field demontageservice value
function get_field_demontageservice_value(el) {
    var values = [];

    var value = {};
    value.handle = el.data('handle');
    value.name = el.data('name');
    value.type = el.data('type');
    value.value = el.find('.input').val();
    value.value_name = el.find('.input').val();
    values.push(value);

    return values;
}

/*
|--------------------------------------------------------------------------
| On page load
|--------------------------------------------------------------------------
*/
jQuery(document).ready(function () {
    // hide spinner
    jQuery('#dhwec-product').find('.spinner').hide();

    // show all fields that do not use conditional logic
    jQuery('#dhwec-product').find('.field').each(function () {
        if (!jQuery(this).data('conditional-logic')) {
            jQuery(this).show();
        }
    });

    // toggle conditional fields
    toggle_conditional_fields();

    // update selection
    update_selection();

    // set choices for design select fields when an item is being edited
    jQuery('#dhwec-product').find('.field-design-select').each(function () {
        if (jQuery(this).find('.selected').length) {
            // set choice image src attribute
            var src = jQuery(this).find('.selected').attr('src');
            jQuery(this).find('.choice-image').attr('src', src);

            // show choice
            jQuery(this).addClass('state-selected');
        }
    });

    // show ral color if its field has a value when an item is being edited
    jQuery('#dhwec-product').find('.field-design-select').each(function () {
        var value = jQuery(this).find('.ral-color-input').val();
        if (value !== '') {
            jQuery(this).find('.ral-color').show();
        }
    });
});

/*
|--------------------------------------------------------------------------
| Event handlers
|--------------------------------------------------------------------------
*/
jQuery(document).ready(function () {
    // show/hide selection window
    jQuery('#dhwec-product .show-selection, #dhwec-product .hide-selection').on('click', function () {
        jQuery(this).parent().toggleClass('open');
    });

    // info window toggle
    jQuery('.info-window').on('mouseenter', function () {
        jQuery(this).find('.info-window-content').toggle();
    });

    jQuery('.info-window').on('mouseleave', function () {
        jQuery(this).find('.info-window-content').toggle();
    });

    // close info popup
    jQuery('.info-popup').find('.close').on('click', function () {
        jQuery(this).closest('.info-popup').toggle();
    });

    // check if entered measurements are allowed
    jQuery('#dhwec-product').find('.field-measurements .f1 .input, .field-measurements .f2 .input').on('change', function () {
        // set base el
        var base_el = jQuery(this).closest('.field-measurements');

        // get values from data attributes
        var dimensions_id = base_el.data('dimensions');
        var exceeding_allowed = base_el.attr('data-exceeding-allowed');

        // get export code
        var export_code = jQuery(this).closest('#dhwec-product').data('export-code');

        // get field values
        var f1_value = base_el.find('.f1 .input').val();
        var f2_value = base_el.find('.f2 .input').val();

        // decide if dimensions should be checked
        if (dimensions_id) {
            // start - quick fix for a problem which will be fixed in the near future
            if (f1_value !== '' && f2_value !== '') {
                if (export_code === 'WEB_LD-B200') { // B200 XL
                    if (f1_value > 7000 || f2_value > 7000) {
                        base_el.find('.info-popup').show();
                    }
                } else if (export_code === 'WEB_PG-B128') { // Pergola
                    if (f1_value > 6000) {
                        base_el.find('.info-popup').show();
                    }
                } else if (export_code === 'WEB_VZ-B128') { // Veranda
                    if (f1_value > 6000) {
                        base_el.find('.info-popup').show();
                    }
                } else if (export_code === 'WEB_CS') { // Cubola
                    if (f1_value > 6000) {
                        base_el.find('.info-popup').show();
                    }
                }
            }
            // end - quick fix for a problem which will be fixed in the near future

            // do request
            request = jQuery.ajax({
                type: 'POST',
                url: dhwec_ajax_object.ajax_url,
                async: false,
                data: {
                    action: 'dhwec_check_measurements',
                    f1_value: f1_value,
                    f2_value: f2_value,
                    dimensions_id: dimensions_id
                }
            });

            // if request was successful
            request.done(function (data) {
                // hide error
                base_el.find('.error').hide();

                if (data.error) {
                    if (exceeding_allowed === 'true' && data.error_code === 'X_AXIS_VALUE_EXCEEDED') {
                        // show popup containing information about chaining multiple systems
                        base_el.find('.info-popup').show();
                    } else {
                        // show error
                        base_el.find('.error').text(data.status);
                        base_el.find('.error').show();
                    }

                    // toggle conditional fields
                    toggle_conditional_fields();

                    // update selection
                    update_selection();
                }
            });

            // if request failed
            request.fail(function (data) {
                alert('Error. Please try again.');
            });
        }
    });

    // field measurements on change
    jQuery('#dhwec-product').find('.field-measurements').find('.input').on('change', function () {
        // set base el
        var el = jQuery(this).closest('.field-measurements');

        if (!el.data('dimensions')) {
            // hide error
            el.find('.error').hide();

            // start - quick fix for a problem which will be fixed in the near future
            var export_code = jQuery(this).closest('#dhwec-product').data('export-code');
            var f1_value = el.find('.f1 .input').val();
            var f2_value = el.find('.f2 .input').val();

            if (f1_value !== '' && f2_value !== '') {
                if (export_code === 'WEB_HO-PHDA') { // Plisse hordeur Allure
                    var hortype_el = jQuery('.field[data-handle=hortype]');
                    var hortype = get_field_option_select_value(hortype_el)[0]['value'];

                    if (hortype === 'E') {
                        if (f2_value - f1_value < 200) {
                            el.find('.error').text('Let op! De hoogte per deur moet minimaal 200 mm groter zijn dan de breedte.');
                            el.find('.error').show();
                        }
                    } else {
                        if (f2_value - (f1_value / 2) < 200) {
                            el.find('.error').text('Let op! Bij een gekoppelde of dubbele deur moet de hoogte minimaal 200 mm groter zijn dan de helft van de breedte.');
                            el.find('.error').show();
                        }
                    }
                }
            }
            // end - quick fix for a problem which will be fixed in the near future

            var i = 1;
            var fields_valid = true;
            var message = '';

            while (i <= 2) {
                // get value + min/max data attributes
                var val = el.find('.f' + i).find('.input').val();
                var min_val = el.find('.f' + i).find('.input').attr('min');
                var max_val = el.find('.f' + i).find('.input').attr('max');
                var label = el.find('.f' + i).data('name');

                if (min_val !== undefined && max_val === undefined) {
                    if (parseInt(val) < parseInt(min_val)) {
                        fields_valid = false;
                        // message += 'Het veld "' + label + '" dient een minimale waarde te hebben van "' + min_val + '". ';
                        message += 'Voer een minimale ' + label.toLowerCase() + ' in van ' + min_val + ' mm. ';
                        el.find('.f' + i).find('.input').val('');
                    }
                } else if (min_val === undefined && max_val !== undefined) {
                    if (parseInt(val) > parseInt(max_val)) {
                        fields_valid = false;
                        // message += 'Het veld "' + label + '" dient een maximale waarde te hebben van "' + max_val + '". ';
                        message += 'Voer een maximale ' + label.toLowerCase() + ' in van ' + max_val + ' mm. ';
                        el.find('.f' + i).find('.input').val('');
                    }
                } else if (min_val !== undefined && max_val !== undefined) {
                    if (parseInt(val) < parseInt(min_val) || parseInt(val) > parseInt(max_val)) {
                        fields_valid = false;
                        // message += 'Het veld "' + label + '" dient een minimale waarde te hebben van "' + min_val + '" en een maximale waarde van "' + max_val + '". ';
                        message += 'Voer een minimale ' + label.toLowerCase() + ' in van ' + min_val + ' mm en een maximale ' + label.toLowerCase() + ' in van ' + max_val + ' mm. ';
                        el.find('.f' + i).find('.input').val('');
                    }
                }

                // increment i
                i++;
            }

            if (!fields_valid) {
                // write error
                el.find('.error').text(message);

                // show error
                el.find('.error').show();
            }
        }

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field design select on change (samples)
    jQuery('#dhwec-product').find('.field-design-select').find('.sample').on('click', function () {
        // change selected item
        jQuery(this).closest('.field-design-select').find('.selected').removeClass('selected');
        jQuery(this).addClass('selected');

        // set choice image src attribute
        var src = jQuery(this).attr('src');
        jQuery(this).closest('.field-design-select').find('.choice-image').attr('src', src);

        // show choice
        jQuery(this).closest('.field-design-select').addClass('state-selected');

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field design select - show popup (using show all button @ desktop & mobile)
    jQuery('#dhwec-product').find('.field-design-select').find('.show-more-button').on('click', function () {
        // set base el
        var el = jQuery(this).closest('.actions').next('.popup');

        // show popup
        el.toggle();

        // get heights
        var window_height = jQuery(window).height();
        var header_height = el.find('.header').outerHeight();
        var scroll_tip_height = el.find('.scroll-tip').outerHeight();
        var select_wrap_height = el.find('.select-wrap').outerHeight();

        // set height for .variations
        el.find('.variations').height(window_height - header_height - scroll_tip_height - select_wrap_height);
    });

    // field design select - show popup (using change selection button @ mobile)
    jQuery('#dhwec-product').find('.field-design-select').find('.change-choice').on('click', function () {
        jQuery(this).closest('.field-design-select').find('.popup').toggle();
    });

    // field design select - close popup (using close button in popup @ desktop & mobile)
    jQuery('#dhwec-product').find('.field-design-select').find('.close').on('click', function () {
        jQuery(this).closest('.popup').toggle();
    });

    // field design select - close popup (using save button in popup @ desktop & mobile)
    jQuery('#dhwec-product').find('.field-design-select').find('.select').on('click', function () {
        jQuery(this).closest('.popup').toggle();
    });

    // field design select RAL color toggle (RAL color)
    jQuery('#dhwec-product').find('.field-design-select').find('.show-ral-input').on('click', function () {
        jQuery(this).closest('.field-design-select').find('.ral-color').slideToggle();
    });

    // field design select on change (RAL color)
    jQuery('#dhwec-product').find('.field-design-select').find('.ral-color-input').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field design select on change (RAL color)
    jQuery('#dhwec-product').find('.field-design-select').find('.ral-color-input').on('keyup', function () {
        var value = jQuery(this).val();
        if (value.length > 4) {
            jQuery(this).val(value.slice(0, 4));
            alert('De ingevoerde RAL-code is te lang. Deze bestaat uit 4 cijfers.');
        }
    });

    // field design select on wheel (RAL color)
    jQuery('#dhwec-product').find('.field-design-select').find('.ral-color-input').on('wheel', function () {
        jQuery(this).blur();
    });

    // field toggle on change
    jQuery('#dhwec-product').find('.field-toggle').find('.option').on('click', function () {
        // set base el
        var el = jQuery(this).closest('.field-toggle');

        // check if field has handle 'appbediening'. If so, checks the current request
        // whether there is already a product having a control box or not
        if (el.data('handle') === 'appbediening') {
            var popup = el.find('.info-popup');
            var identifier = jQuery('#dhwec-product').data('identifier');

            if (popup.length) {
                var request = jQuery.ajax({
                    type: 'POST',
                    url: dhwec_ajax_object.ajax_url,
                    async: false,
                    data: {
                        action: 'dhwec_request_has_control_box',
                        identifier: (identifier !== undefined ? identifier : false)
                    }
                });

                // if request was successful
                request.done(function (data) {
                    if (data.result === true) {
                        popup.show();
                    }
                });

                // if request failed
                request.fail(function (data) {
                    alert('Error. Please try again.');
                });
            }
        }

        // change selected item
        el.find('.selected').removeClass('selected');
        jQuery(this).addClass('selected');

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field option select on change
    jQuery('#dhwec-product').find('.field-option-select').find('.option').on('change', function () {
        // set base el
        var el = jQuery(this).closest('.field-option-select');

        // check if field has handle 'afstandsbediening'. If so, checks the current request
        // whether there is already a product having a remote control or not
        if (el.data('handle') === 'afstandsbediening') {
            var popup = el.find('.info-popup');
            var identifier = jQuery('#dhwec-product').data('identifier');

            if (popup.length) {
                var value = jQuery(this).data('value');

                if (value === 'SITUO1' || value === 'SITUO5') {
                    var request = jQuery.ajax({
                        type: 'POST',
                        url: dhwec_ajax_object.ajax_url,
                        async: false,
                        data: {
                            action: 'dhwec_request_has_remote_control',
                            identifier: (identifier !== undefined ? identifier : false)
                        }
                    });

                    // if request was successful
                    request.done(function (data) {
                        if (data.result === true) {
                            popup.show();
                        }
                    });

                    // if request failed
                    request.fail(function (data) {
                        alert('Error. Please try again.');
                    });
                }
            }
        }

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field option select (using visuals) on change
    jQuery('#dhwec-product').find('.field-option-select-visual').find('.option').on('click', function () {
        // change selected item
        jQuery(this).closest('.field-option-select-visual').find('.selected').removeClass('selected');
        jQuery(this).addClass('selected');

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field checkboxes on change
    jQuery('#dhwec-product').find('.field-checkboxes').find('.checkbox').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field inmeetservice on change
    jQuery('#dhwec-product').find('.field-inmeetservice').find('.radio').on('change', function () {
        // enable inmeetservice if customer has already enabled montageservice
        var montageservice_element = jQuery('#dhwec-product .field-montageservice');
        var montageservice = get_field_montageservice_value(montageservice_element);

        if (montageservice[0].value === 'MO') {
            // set base element
            var el = jQuery('#dhwec-product .field-inmeetservice .radio');

            // uncheck radio buttons
            el.prop('checked', false);

            // loop over buttons and enable inmeetservice
            el.each(function () {
                // get value data attribute of this radio button
                var value = jQuery(this).data('value');

                if (value === 'J') {
                    jQuery(this).prop('checked', true);
                }
            });

            // show popup
            jQuery(this).closest('.field-inmeetservice').find('.info-popup').show();
        }

        // update selection
        update_selection();
    });

    // field montageservice on change
    jQuery('#dhwec-product').find('.field-montageservice').find('.radio').on('change', function () {
        // enable inmeetservice if customer enables montageservice
        if (jQuery(this).data('value') === 'MO') {
            // show popup if inmeetservice is not set to 'J'
            var el_value = get_field_inmeetservice_value(jQuery('#dhwec-product .field-inmeetservice'));
            if (el_value[0].value !== 'J') {
                // show popup
                jQuery(this).closest('.field-montageservice').find('.info-popup').show();
            }

            // set base element
            var el = jQuery('#dhwec-product .field-inmeetservice .radio');

            // uncheck radio buttons
            el.prop('checked', false);

            // loop over buttons and enable inmeetservice
            el.each(function () {
                // get value data attribute of this radio button
                var value = jQuery(this).data('value');

                if (value === 'J') {
                    jQuery(this).prop('checked', true);
                }
            });
        }

        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field pickup location on change
    jQuery('#dhwec-product').find('.field-pickup-location').find('.select').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field floor on change
    jQuery('#dhwec-product').find('.field-floor').find('.select').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field demontageservice-keuze on change
    jQuery('#dhwec-product').find('.field-demontageservice-keuze').find('.radio').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // field demontageservice on change
    jQuery('#dhwec-product').find('.field-demontageservice').find('.input').on('change', function () {
        // toggle conditional fields
        toggle_conditional_fields();

        // update selection
        update_selection();
    });

    // add product to basket
    jQuery('#dhwec-product .add-to-basket, #dhwec-product .add-to-basket-mobile').on('click', function () {
        // validate fields
        if (validate()) {
            // get export code, display title, return url and identifier
            var export_code = jQuery('#dhwec-product').data('export-code');
            var display_title = jQuery('#dhwec-product').data('display-title');
            var return_url = jQuery('#dhwec-product').data('return-url');
            var identifier = jQuery('#dhwec-product').data('identifier');

            // get field values
            var values = get_field_values(1);

            // do request
            var request = jQuery.ajax({
                type: 'POST',
                url: dhwec_ajax_object.ajax_url,
                async: false,
                data: {
                    action: 'dhwec_add_item_to_basket',
                    export_code: export_code,
                    display_title: display_title,
                    return_url: return_url,
                    identifier: identifier,
                    values: values
                }
            });

            // if request was successful
            request.done(function (data) {
                window.location.href = '/aanvraag/';
            });

            // if request failed
            request.fail(function (data) {
                alert('Error. Please try again.');
            });
        } else {
            // scroll to first invalid field
            var invalid = jQuery('.field-invalid');
            jQuery(document).scrollTop(jQuery(invalid[0]).offset().top);
        }
    });

    // change quantity (using controls)
    jQuery('#dhwec-basket').find('.change-quantity').on('click', function () {
        // get data
        var identifier = jQuery(this).closest('.item').data('identifier');
        var method = jQuery(this).data('method');
        var quantity = jQuery(this).closest('.item').find('.amount').val();

        // calculate new quantity
        if (method === 'decrement') {
            quantity--;
        } else if (method === 'increment') {
            quantity++;
        }

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_change_quantity',
                identifier: identifier,
                quantity: quantity
            }
        });

        // if request was successful
        request.done(function (data) {
            location.reload();
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });

    // change quantity (by manual input)
    jQuery('#dhwec-basket').find('.amount').on('change', function () {
        // get data
        var identifier = jQuery(this).closest('.item').data('identifier');
        var quantity = jQuery(this).val();

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_change_quantity',
                identifier: identifier,
                quantity: quantity
            }
        });

        // if request was successful
        request.done(function (data) {
            location.reload();
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });

    // clone item
    jQuery('#dhwec-basket').find('.clone').on('click', function () {
        // get indentifier
        var identifier = jQuery(this).closest('.item').data('identifier');

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_clone_item',
                identifier: identifier
            }
        });

        // if request was successful
        request.done(function (data) {
            location.reload();
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });

    // delete product from basket
    jQuery('#dhwec-basket').find('.delete').on('click', function () {
        if (confirm('Weet u zeker dat u dit product wilt verwijderen?')) {
            // get indentifier
            var identifier = jQuery(this).closest('.item').data('identifier');

            // do request
            var request = jQuery.ajax({
                type: 'POST',
                url: dhwec_ajax_object.ajax_url,
                async: false,
                data: {
                    action: 'dhwec_delete_item_from_basket',
                    identifier: identifier
                }
            });

            // if request was successful
            request.done(function (data) {
                location.reload();
            });

            // if request failed
            request.fail(function (data) {
                alert('Error. Please try again.');
            });
        }
    });

    // change product placement
    jQuery('#dhwec-basket').find('.placement').on('keyup', input_delay(function () {
        // collect data
        var identifier = jQuery(this).closest('.item').data('identifier');
        var placement = jQuery(this).val();

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: true,
            data: {
                action: 'dhwec_change_placement',
                identifier: identifier,
                placement: placement,
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    }, 500));

    // change inmeetservice choice (from basket view)
    jQuery('#dhwec-basket').find('.field-inmeetservice').find('.radio').on('change', function () {
        // enable inmeetservice if customer has already enabled montageservice
        var montageservice_element = jQuery('#dhwec-basket .field-montageservice');
        var montageservice = get_field_montageservice_value(montageservice_element);

        if (montageservice[0].value === 'MO') {
            // set base element
            var el = jQuery('#dhwec-basket .field-inmeetservice .radio');

            // uncheck radio buttons
            el.prop('checked', false);

            // loop over buttons and enable inmeetservice
            el.each(function () {
                // get value data attribute of this radio button
                var value = jQuery(this).data('value');

                if (value === 'J') {
                    jQuery(this).prop('checked', true);
                }
            });

            // show popup
            jQuery(this).closest('.field-inmeetservice').find('.info-popup').show();
        }

        // get field value
        var field_element = jQuery(this).closest('.field-inmeetservice');
        var field = get_field_inmeetservice_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_inmeetservice_choice',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // change montageservice choice (from basket view)
    jQuery('#dhwec-basket').find('.field-montageservice').find('.radio').on('change', function () {
        // get field value
        var field_element = jQuery(this).closest('.field-montageservice');
        var field = get_field_montageservice_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_montageservice_choice',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // enable inmeetservice if customer enables montageservice
        if (value === 'MO') {
            // set base element
            var el = jQuery('#dhwec-basket .field-inmeetservice .radio');

            // uncheck radio buttons
            el.prop('checked', false);

            // loop over radio buttons and enable inmeetservice
            el.each(function () {
                if (jQuery(this).data('value') === 'J') {
                    jQuery(this).prop('checked', true);
                }
            });

            // do request
            var request = jQuery.ajax({
                type: 'POST',
                url: dhwec_ajax_object.ajax_url,
                data: {
                    action: 'dhwec_update_inmeetservice_choice',
                    value: 'J',
                    value_name: 'Ja'
                }
            });

            // if request failed
            request.fail(function (data) {
                alert('Error. Please try again.');
            });

            // show popup
            jQuery(this).closest('.field-montageservice').find('.info-popup').show();
        }

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // change pickup location choice (from basket view)
    jQuery('#dhwec-basket').find('.field-pickup-location').find('.select').on('change', function () {
        // get field value
        var field_element = jQuery(this).closest('.field-pickup-location');
        var field = get_field_pickup_location_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_pickup_location_choice',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // change floor choice (from basket view)
    jQuery('#dhwec-basket').find('.field-floor').find('.select').on('change', function () {
        // get field value
        var field_element = jQuery(this).closest('.field-floor');
        var field = get_field_floor_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_floor_choice',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // change demontageservice-keuze choice (from basket view)
    jQuery('#dhwec-basket').find('.field-demontageservice-keuze').find('.radio').on('change', function () {
        // get field value
        var field_element = jQuery(this).closest('.field-demontageservice-keuze');
        var field = get_field_demontageservice_keuze_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_demontageservice_keuze',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // change demontageservice choice (from basket view)
    jQuery('#dhwec-basket').find('.field-demontageservice').find('.input').on('change', function () {
        // get field value
        var field_element = jQuery(this).closest('.field-demontageservice');
        var field = get_field_demontageservice_value(field_element)[0];
        var value = field['value'];
        var value_name = field['value_name'];

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            data: {
                action: 'dhwec_update_demontageservice',
                value: value,
                value_name: value_name
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });

        // toggle conditional fields
        toggle_conditional_fields();
    });

    // toggle .field-reference-other field if reference is set to 'anders'
    jQuery('#dhwec-details').find('.form').find('.field-reference').on('change', function () {
        const ref_other_el = jQuery('#dhwec-details').find('.form').find('.field-reference-other');

        if (jQuery(this).val() === 'anders') {
            ref_other_el.show();
        } else {
            ref_other_el.hide();
        }
    });

    // save request
    jQuery('#dhwec-details').find('.form').on('submit', function (e) {
        // prevent default form behaviour
        e.preventDefault();

        // set base element
        const el = jQuery('#dhwec-details');

        // disable button
        el.find('.complete').attr('disabled', 'disabled');

        // set fields which to be processed
        const fields = [
            ['.field-salutation', 'aanhef', false],
            ['.field-initials', 'voorletters', true],
            ['.field-name', 'voornaam', false],
            ['.field-affix', 'tussenvoegsel', false],
            ['.field-surname', 'achternaam', true],
            ['.field-country', 'land', true],
            ['.field-street', 'straat', true],
            ['.field-house-number', 'huisnummer', true],
            ['.field-house-number-addition', 'toevoeging', false],
            ['.field-zip-code', 'postcode', true],
            ['.field-city', 'plaats', true],
            ['.field-phone', 'telefoonnummer', true],
            ['.field-email', 'email', true],
            ['.field-reference', 'referentie', true],
            ['.field-reference-other', 'referentie-txt', false],
            ['.field-offer-reference', 'offertereferentie', false],
            ['.field-comments', 'opmerkingen', false]
        ];

        // check if required fields are filled in and push values to var details
        let validated = true;
        let details = {};

        for (let i = 0; i < fields.length; i++) {
            // stores any errors which to show by the field
            let field_errors = [];

            // load details of field
            const field = fields[i];
            const field_element = el.find(field[0]);
            let field_value = field_element.val();
            const field_handle = field[1];
            const field_required = field[2];
            const field_maxlength = field_element.attr('maxlength');

            // check if field is required and if so, also filled in
            if (field_required === true && field_value === '' || field_value === null) {
                field_errors.push('Dit veld is verplicht.');
            }

            // check if field value does not exceeds the maximum allowed number of characters
            if (field_maxlength !== undefined && field_value.length > field_maxlength) {
                field_errors.push('Dit veld mag maximaal ' + field_maxlength + ' karakters bevatten.');
            }

            // check if dutch zipcode is formatted correctly
            if (field_handle === 'postcode') {
                const country = jQuery('.field-country').val();
                if (country === 'NL') {
                    const regex = /^(?:NL-)?(\d{4})\s*([A-Z]{2})$/i;
                    if (!regex.test(field_value)) {
                        field_errors.push('Het formaat van de postcode is onjuist. Voer de postcode als volgt in: 1234 AB.');
                    } else {
                        const zc = field_value.replace(/\s/g, '');
                        field_value = zc.substring(0, 4) + ' ' + zc.substring(4, zc.length);
                    }
                }
            }

            if (field_handle === 'opmerkingen') {
                const stripEmojis = (str) =>
                    str
                        .replace(
                            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                            ''
                        )
                        .replace(/\s+/g, ' ')
                        .trim();

                field_value = stripEmojis(field_value);
            }

            // check if email address is formatted correctly
            if (field_handle === 'email') {
                const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regex.test(field_value.toLowerCase())) {
                    field_errors.push('Het ingevoerde e-mailadres is mogelijk incorrect.');
                }
            }

            // remove any previous errors
            field_element.nextAll('.field-error-msg').remove();

            if (field_errors.length > 0) {
                validated = false;

                for (let x = 0; x < field_errors.length; x++) {
                    field_element.after('<div class="field-error-msg">' + field_errors[x] + '</div>');
                }
            } else {
                details[field_handle] = field_value;
            }
        }

        if (validated) {
            // get details
            var detailsStringified = JSON.stringify(details);

            // do request
            var request = jQuery.ajax({
                type: 'POST',
                url: dhwec_ajax_object.ajax_url,
                async: false,
                data: {
                    action: 'dhwec_save_request',
                    details: detailsStringified
                }
            });

            // if request was successful
            request.done(function (data) {
                window.location.href = '/aanvraag/bedankt/';
            });

            // if request failed
            request.fail(function (data) {
                alert('Error. Please try again.');
            });
        } else {
            // enable button
            el.find('.complete').removeAttr('disabled');
        }
    });

    // authorize form
    jQuery('#dhwec-authorize').find('.form').on('submit', function (e) {
        // prevent default form behaviour
        e.preventDefault();

        // get data
        var code = jQuery(this).find('.input-code').val();
        var password = jQuery(this).find('.input-password').val();

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_authorize',
                code: code,
                password: password
            }
        });

        // if request was successful
        request.done(function (data) {
            if (data.result) {
                window.location.href = data.redirect;
            } else {
                jQuery('#dhwec-authorize').find('.error').show();
                jQuery('#dhwec-authorize').find('.error').text(data.status);
            }
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });

    // sales form
    jQuery('#dhwec-sales').find('.form').on('submit', function (e) {
        // prevent default form behaviour
        e.preventDefault();

        // get data
        var employee_name = jQuery(this).find('.input-employee option:selected').text();
        var employee_code = jQuery(this).find('.input-employee').val();

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_sign_in_sales_employee',
                employee_name: employee_name,
                employee_code: employee_code
            }
        });

        // if request was successful
        request.done(function (data) {
            window.location.href = '/offerte/';
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });

    // sales bar sign out
    jQuery('#dhwec-sales-bar').find('.sign-out').on('click', function (e) {
        // prevent default form behaviour
        e.preventDefault();

        // do request
        var request = jQuery.ajax({
            type: 'POST',
            url: dhwec_ajax_object.ajax_url,
            async: false,
            data: {
                action: 'dhwec_sign_out_sales_employee'
            }
        });

        // if request was successful
        request.done(function (data) {
            window.location.href = '/inloggen/';
        });

        // if request failed
        request.fail(function (data) {
            alert('Error. Please try again.');
        });
    });
});

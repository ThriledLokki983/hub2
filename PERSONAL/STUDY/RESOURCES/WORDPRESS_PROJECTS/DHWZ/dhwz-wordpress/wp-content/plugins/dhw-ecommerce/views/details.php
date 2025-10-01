<div id="dhwec-details">
    <div class="row">
        <div class="column-left">
            <?php $items = $_SESSION['dhwec']['items']; ?>
            <?php if (!empty($items)) : ?>
                <!-- start .intro -->
                <div class="details-intro">
                    <p class="text">Om uw offerteaanvraag op de juiste manier af te handelen, hebben we een aantal
                        gegevens van u nodig. Wij gebruiken deze gegevens alleen om u op de hoogte te houden van de
                        afhandeling van de offerteaanvraag.</p>
                </div>
                <!-- end .intro -->

                <!-- start .form -->
                <form class="form">
                    <div class="field-group">
                        <h2 class="title title-address">Adresgegevens voor offerteaanvraag</h2>

                        <div class="row">
                            <div class="large-3 columns">
                                <div class="field-wrap">
                                    <select class="field field-salutation">
                                        <option value="" selected disabled hidden>Aanhef *</option>
                                        <option value="M">Dhr.</option>
                                        <option value="V">Mevr.</option>
                                    </select>
                                </div>
                            </div>

                            <div class="large-3 columns">
                                <div class="field-wrap">
                                    <input type="text" class="field field-initials" placeholder="Voorletters *"
                                           maxlength="50" autocomplete="honorific-prefix">
                                </div>
                            </div>

                            <div class="large-6 columns end">
                                <div class="field-wrap">
                                    <input type="text" class="field field-name" placeholder="Voornaam" maxlength="50"
                                           autocomplete="given-name">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="large-6 columns">
                                <div class="field-wrap">
                                    <input type="text" class="field field-affix" placeholder="Tussenvoegsel"
                                           maxlength="50" autocomplete="additional-name">
                                </div>
                            </div>

                            <div class="large-6 columns end">
                                <div class="field-wrap">
                                    <input type="text" class="field field-surname" placeholder="Achternaam *"
                                           maxlength="50" autocomplete="family-name">
                                </div>
                            </div>
                        </div>
                    </div>

                    <?php
                    // get employee data if logged in
                    $employee_code = $_SESSION['dhwec']['employee']['employee_code'];
                    $employee_showroom = $_SESSION['dhwec']['employee']['employee_showroom'];
                    if (!empty($employee_code)) {
                        if (!$employee_showroom) {
                            $employee_id = get_employee_id_by_code($employee_code);

                            if (!empty($employee_id)) {
                                $employee_data = get_fields($employee_id);
                            }
                        }
                    }
                    ?>

                    <div class="field-group">
                        <div class="row">
                            <div class="large-6 columns">
                                <div class="field-wrap">
                                    <select class="field field-country">
                                        <?php
                                        $countries = [
                                            'NL' => 'Nederland',
                                            'BE' => 'België',
                                            'DE' => 'Duitsland'
                                        ];
                                        ?>

                                        <?php foreach ($countries as $k => $v) : ?>
                                            <?php
                                            $saved = $employee_data['dhwec_employees_country'];
                                            $selected = (!empty($saved) && $saved === $k ? ' selected' : '');
                                            ?>
                                            <option value="<?= $k; ?>"<?= $selected; ?>><?= $v; ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="large-6 columns">
                                <?php
                                if (!empty($employee_data['dhwec_employees_street'])) {
                                    $value = ' value="' . $employee_data['dhwec_employees_street'] . '"';
                                } else {
                                    $value = '';
                                }
                                ?>
                                <div class="field-wrap">
                                    <input type="text" class="field field-street" placeholder="Straat *" maxlength="50"
                                           autocomplete="street-address"<?= $value; ?>>
                                </div>
                            </div>

                            <div class="large-3 columns">
                                <?php
                                if (!empty($employee_data['dhwec_employees_house_number'])) {
                                    $value = ' value="' . $employee_data['dhwec_employees_house_number'] . '"';
                                } else {
                                    $value = '';
                                }
                                ?>
                                <div class="field-wrap">
                                    <input type="text" class="field field-house-number" placeholder="Huisnummer *"
                                           maxlength="50"<?= $value; ?>>
                                </div>
                            </div>

                            <div class="large-3 columns end">
                                <?php
                                if (!empty($employee_data['dhwec_employees_house_number_addition'])) {
                                    $value = ' value="' . $employee_data['dhwec_employees_house_number_addition'] . '"';
                                } else {
                                    $value = '';
                                }
                                ?>
                                <div class="field-wrap">
                                    <input type="text" class="field field-house-number-addition"
                                           placeholder="Toevoeging" maxlength="50"<?= $value; ?>>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="large-6 columns">
                                <?php
                                if (!empty($employee_data['dhwec_employees_postal_code'])) {
                                    $value = ' value="' . $employee_data['dhwec_employees_postal_code'] . '"';
                                } else {
                                    $value = '';
                                }
                                ?>
                                <div class="field-wrap">
                                    <input type="text" class="field field-zip-code" placeholder="Postcode *"
                                           maxlength="50" autocomplete="postal-code"<?= $value; ?>>
                                </div>
                            </div>

                            <div class="large-6 columns end">
                                <?php
                                if (!empty($employee_data['dhwec_employees_city'])) {
                                    $value = ' value="' . $employee_data['dhwec_employees_city'] . '"';
                                } else {
                                    $value = '';
                                }
                                ?>
                                <div class="field-wrap">
                                    <input type="text" class="field field-city" placeholder="Plaats *" maxlength="50"
                                           autocomplete="address-level2"<?= $value; ?>>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field-group">
                        <h2 class="title">Telefoonummer en e-mailadres</h2>
                        <p class="text">Als we een vraag of opmerking over uw aanvraag hebben, laten we dat graag
                            persoonlijk weten.</p>
                        <div class="row">
                            <div class="large-6 columns">
                                <div class="field-wrap">
                                    <input type="tel" class="field field-phone"
                                           placeholder="Telefoonnummer (bijv. 0183820370) *" maxlength="50"
                                           autocomplete="phone" pattern="[0-9\-]+">
                                </div>
                            </div>
                            <div class="large-6 columns end">
                                <div class="field-wrap">
                                    <input type="email" class="field field-email" placeholder="E-mailadres *"
                                           maxlength="50" autocomplete="email">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field-group">
                        <h2 class="title">Referentie</h2>
                        <p class="text">Waar kent u ons van?</p>
                        <div class="row">
                            <div class="large-6 columns">
                                <div class="field-wrap">
                                    <select class="field field-reference">
                                        <?php if ($_SESSION['dhwec']['employee']) : ?>
                                            <?php
                                            $employee_showroom = $_SESSION['dhwec']['employee']['employee_showroom'];
                                            $is_showroom_employee = (!empty($employee_showroom) ? $employee_showroom : false);
                                            ?>
                                            <?php if ($is_showroom_employee) : ?>
                                                <option value="" selected disabled hidden>Waar kent u ons van? *
                                                </option>
                                                <option value="zoekmachine">Via een zoekmachine</option>
                                                <option value="marktplaats">Via marktplaats</option>
                                                <option value="advertentie">Via een offline advertentie</option>
                                                <option value="vriendkennisfamilie">Via een vriend/kennis/familielid
                                                </option>
                                                <option value="showroom">Via de showroom</option>
                                                <option value="bestaandeklant">Bestaande klant</option>
                                                <option value="homestudios">Homestudios</option>
                                                <option value="coolyellow">CoolYellow</option>
                                                <option value="anders">Anders</option>
                                            <?php else : ?>
                                                <?php
                                                $employee_code = $_SESSION['dhwec']['employee']['employee_code'];
                                                $first_char = substr($employee_code, 0, 1);
                                                ?>

                                                <?php if ($first_char === 'W') : ?>
                                                    <option value="W">Deze optie is uitgeschakeld voor je account
                                                    </option>
                                                <?php endif; ?>

                                                <?php if ($first_char === 'E') : ?>
                                                    <option value="E">Deze optie is uitgeschakeld voor je account
                                                    </option>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                        <?php else : ?>
                                            <option value="" selected disabled hidden>Waar kent u ons van? *</option>
                                            <option value="zoekmachine">Via een zoekmachine</option>
                                            <option value="marktplaats">Via marktplaats</option>
                                            <option value="advertentie">Via een offline advertentie</option>
                                            <option value="vriendkennisfamilie">Via een vriend/kennis/familielid
                                            </option>
                                            <option value="showroom">Via de showroom</option>
                                            <option value="bestaandeklant">Bestaande klant</option>
                                            <option value="anders">Anders</option>
                                        <?php endif; ?>
                                    </select>
                                </div>

                                <div class="field-wrap">
                                    <textarea class="field field-textarea field-reference-other"
                                              placeholder="Ik ken De Haan Westerhoff via (maximaal 140 karakters) ..."
                                              maxlength="140"></textarea>
                                </div>
                            </div>
                            <div class="large-6 columns end">
                                <div class="field-wrap">
                                    <input type="text" class="field field-offer-reference"
                                           placeholder="Offerte referentie (niet verplicht)" maxlength="50">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field-group">
                        <h2 class="title">Opmerkingen</h2>
                        <p class="text">Heeft u opmerkingen aangaande uw aanvraag of moeten we misschien ergens rekening
                            mee houden?</p>
                        <div class="row">
                            <div class="large-12 columns end">
                                <div class="field-wrap">
                                    <textarea class="field field-textarea field-comments"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="complete">Aanvraag afronden</button>
                </form>
                <!-- end .form -->
            <?php else : ?>
                <div class="no-items">U heeft nog geen producten toegevoegd aan uw aanvraag. Ga terug naar
                    <a href="<?php echo get_site_url(); ?>">home</a>.
                </div>
            <?php endif; ?>
        </div>
        <div class="column-right">
            <?php include 'sidebar.php'; ?>
        </div>
    </div>
</div>

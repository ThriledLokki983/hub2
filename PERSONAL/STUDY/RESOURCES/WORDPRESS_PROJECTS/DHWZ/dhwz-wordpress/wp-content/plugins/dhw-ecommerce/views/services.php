<div id="services">
    <div class="field field-inmeetservice" data-handle="inmeetservice" data-name="Inmeetservice" data-type="field-inmeetservice">
        <?php $inmeetservice = $_SESSION['dhwec']['inmeetservice']; ?>
        <div class="label">Inmeetservice</div>
        <p>De kosten voor het inmeten worden bij het afrekenen in de totaalprijs berekend.</p>

        <div class="radio-wraps">
            <div class="radio-wrap">
                <label>
                    <?php $checked = ($inmeetservice === 'J' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="inmeetservice" data-value="J" data-value-name="Ja"<?= $checked; ?>>
                    Ja, ik wil graag gebruik maken van de inmeetservice.
                </label>
            </div>

            <div class="radio-wrap">
                <label>
                    <?php $checked = ($inmeetservice === 'N' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="inmeetservice" data-value="N" data-value-name="Nee"<?= $checked; ?>>
                    Nee, ik neem zelf de maten op en aanvaard de risico's.
                </label>
            </div>
        </div>

        <div class="info-popup">
            <div class="header">
                <div class="title">Uitschakelen niet mogelijk</div>
                <div class="close">
                    <i class="close-icon fa fa-times"></i>
                    <span class="close-text">Sluiten</span>
                </div>
            </div>
            <div class="content">
                De inmeetservice kan niet worden uitgeschakeld omdat de montageservice is ingeschakeld. Deze services
                worden altijd in combinatie met elkaar aangeboden. Schakel eventueel de montageservice uit om de
                inmeetservice te kunnen uitschakelen.
            </div>
        </div>
    </div>

    <div class="field field-montageservice" data-handle="montageservice" data-name="Montageservice" data-type="field-montageservice">
        <?php $montageservice = $_SESSION['dhwec']['montageservice']; ?>
        <div class="label">Montageservice</div>
        <p>De kosten voor het monteren worden bij het afrekenen in de totaalprijs berekend.</p>

        <div class="radio-wraps">
            <div class="radio-wrap">
                <label>
                    <?php $checked = ($montageservice === 'MO' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="montageservice" data-value="MO" data-value-name="Ja"<?= $checked; ?>>
                    Ja, ik wil graag gebruik maken van de montageservice.
                </label>
            </div>

            <div class="radio-wrap">
                <label>
                    <?php $checked = ($montageservice === 'BE' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="montageservice" data-value="BE" data-value-name="Nee, laten bezorgen"<?= $checked; ?>>
                    Nee, ik wil de producten laten bezorgen. Ik monteer de producten zelf en aanvaard de risico's.
                </label>
            </div>

            <div class="radio-wrap">
                <label>
                    <?php $checked = ($montageservice === 'AF' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="montageservice" data-value="AF" data-value-name="Nee, zelf afhalen"<?= $checked; ?>>
                    Nee, ik wil de producten afhalen. Ik monteer de producten zelf en aanvaard de risico’s.
                </label>
            </div>
        </div>

        <div class="info-popup">
            <div class="header">
                <div class="title">Inmeetservice ingeschakeld</div>
                <div class="close">
                    <i class="close-icon fa fa-times"></i>
                    <span class="close-text">Sluiten</span>
                </div>
            </div>
            <div class="content">
                U heeft de montageservice ingeschakeld. Hierdoor is ook automatisch de inmeetservice ingeschakeld.
                Schakel eventueel de montageservice uit om de inmeetservice te kunnen uitschakelen.
            </div>
        </div>

        <div class="field field-pickup-location" data-handle="afhalen" data-name="Afhaallocatie" data-type="field-pickup-location" data-conditional-logic="montageservice:AF">
            <?php $afhalen = $_SESSION['dhwec']['afhalen']; ?>
            <div class="title">Selecteer een afhaallocatie</div>
            <select class="select">
                <?php
                $options = [
                    'GO' => 'Gorinchem',
                    'DR' => 'Drachten',
                    'EL' => 'Elst',
                    'GR' => 'Groningen',
                    'VE' => 'Veldhoven (alleen op afspraak)',
                    'WE' => 'Weert'
                ];
                ?>

                <?php foreach ($options as $k => $v) : ?>
                    <?php $selected = ($afhalen === $k ? ' selected' : ''); ?>
                    <option data-value="<?= $k; ?>" data-value-name="<?= $v; ?>"<?= $selected; ?>><?= $v; ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="field field-floor" data-handle="hulpmiddel" data-name="1e verdieping of hoger?" data-type="field-floor" data-conditional-logic="montageservice:MO">
            <?php $hulpmiddel = $_SESSION['dhwec']['hulpmiddel']; ?>
            <div class="title">
                Wij werken conform de VCA- en veiligheidsregels, hierin staat dat werken vanaf een ladder niet toegestaan is. Dient één van de producten op de 1e verdieping of hoger gemonteerd te worden?
            </div>
            <select class="select">
                <?php if (empty($hulpmiddel)) : ?>
                    <option selected disabled hidden>Maak een keuze...</option>
                <?php endif; ?>

                <?php
                $options = [
                    'J' => 'Ja',
                    'N' => 'Nee'
                ];
                ?>

                <?php foreach ($options as $k => $v) : ?>
                    <?php $selected = ($hulpmiddel === $k ? ' selected' : ''); ?>
                    <option data-value="<?= $k; ?>" data-value-name="<?= $v; ?>"<?= $selected; ?>><?= $v; ?></option>
                <?php endforeach; ?>
            </select>

            <div class="floor-annotation">
                Wij zullen in de offerte rekening houden met een steiger of hoogwerker.
            </div>
        </div>
    </div>

    <div class="field field-demontageservice-keuze" data-handle="demontageservice-keuze" data-name="Demontageservice" data-type="field-demontageservice-keuze">
        <?php $demontageservice_keuze = $_SESSION['dhwec']['demontageservice_keuze']; ?>
        <div class="label">Demontageservice</div>
        <p>Heeft u zonwering welke gedemonteerd moet worden door onze collega’s?</p>

        <div class="radio-wraps">
            <div class="radio-wrap">
                <label>
                    <?php $checked = ($demontageservice_keuze === 'j' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="demontageservice" data-value="j" data-value-name="Ja"<?= $checked; ?>>
                    Ja, ik wil graag gebruik maken van de demontageservice.
                </label>
            </div>

            <div class="radio-wrap">
                <label>
                    <?php $checked = ($demontageservice_keuze === 'n' ? ' checked' : ''); ?>
                    <input class="radio" type="radio" name="demontageservice" data-value="n" data-value-name="Nee"<?= $checked; ?>>
                    Nee, demonteren is niet nodig (ik demonteer zelf de producten).
                </label>
            </div>
        </div>

        <div class="field field-demontageservice" data-handle="demontageservice" data-name="Aantal te demonteren producten" data-type="field-demontageservice" data-conditional-logic="demontageservice-keuze:j">
            <?php $demontageservice = $_SESSION['dhwec']['demontageservice']; ?>
            <div class="title">Hoeveel producten moeten er worden gedemonteerd?</div>
            <?php $value = (!empty($demontageservice) ? $demontageservice : ''); ?>
            <input class="input" type="number" value="<?= $value; ?>" min="1" max="999" step="1">
        </div>
    </div>
</div>

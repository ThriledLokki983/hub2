<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Info window
 *
 * @param $content
 * @return string
 */
function info_window($content)
{
    $html = '<span class="info-window">';
    $html .= '<i class="info-window-icon fa fa-info"></i>';
    $html .= '<span class="info-window-content">' . $content . '</span>';
    $html .= '</span>';

    return $html;
}

/**
 * Field attributes
 *
 * @param $attributes
 * @return string
 */
function field_attributes($attributes)
{
    $str = '';
    foreach ($attributes as $k => $v) {
        $str .= $k . '="' . $v . '" ';
    }
    return $str;
}

/**
 * Get field value from an item in session by handle
 *
 * @param $handle
 * @return bool
 */
function get_session_item_field_value($handle)
{
    $identifier = $_GET['identifier'];
    if (!empty($handle) && !empty($identifier)) {
        $value = $_SESSION['dhwec']['items'][$identifier]['values'][$handle]['value'];
        if (!empty($value)) {
            return $value;
        }
    } else {
        return false;
    }
}

/**
 * Get employee ID by code
 *
 * @param $employee_code
 * @return id The ID of the employee
 */
function get_employee_id_by_code($employee_code)
{
    $employee = new WP_Query([
        'post_type' => 'dhwec_employees',
        'meta_query' => array(
            array(
                'key' => 'dhwec_employees_code',
                'value' => $employee_code,
                'compare' => '='
            )
        )
    ]);

    if ($employee->have_posts()) {
        while ($employee->have_posts()) {
            $employee->the_post();

            $result = get_the_id();
        }

        wp_reset_postdata();
    } else {
        $result = null;
    }

    return $result;
}

/**
 * Get product ID by export code
 *
 * @param $export_code
 * @return id The ID of the product
 */
function get_product_id_by_export_code($export_code)
{
    $product = new WP_Query([
        'post_type' => 'dhwec_product',
        'meta_query' => array(
            array(
                'key' => 'dhwec_export_code',
                'value' => $export_code,
                'compare' => '='
            )
        )
    ]);

    $result = null;

    if ($product->have_posts()) {
        while ($product->have_posts()) {
            $product->the_post();

            $result = get_the_id();
        }

        wp_reset_postdata();
    }

    return $result;
}

/**
 * Generate PDF
 *
 * @param $request_id
 * @param $details
 * @param $session
 * @return string
 */
function generate_pdf($request_id, $details, $session)
{
    if (!empty($request_id) && !empty($details) && !empty($session)) {
        // load TCPDF
        $path = ABSPATH . 'wp-content/plugins/dhw-ecommerce/';
        require $path . '/libraries/tcpdf/tcpdf.php';

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // remove default header/footer
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        $pdf->SetFont('dejavusans', '', 10);

        // add a page
        $pdf->AddPage();

        // logo
        $pdf->setCellHeightRatio(0.4);

        $src = ABSPATH . 'wp-content/plugins/dhw-ecommerce/assets/img/pdf-logo.png';

        $html = '
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td><img src="' . $src . '" style="height: 80px;"></td>
            </tr>
        </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 30px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // title
        $html = '<h1>Uw aanvraag bij De Haan Westerhoff</h1>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 20px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // reference code & order date
        $pdf->setCellHeightRatio(1.5);

        $html = '
        <table cellspacing="0" cellpadding="0" width="350">
            <tr>
                <td width="200"><b>Referentienummer:</b></td>
                <td>' . 'WO-' . date('Y') . $request_id . '</td>
            </tr>
            <tr>
                <td width="200"><b>Datum van aanvraag:</b></td>
                <td>' . date('d-m-Y') . '</td>
            </tr>
        </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 1px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // personal details title
        $pdf->setCellHeightRatio(0.4);

        $html = '
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td><b>Persoonlijke gegevens</b></td>
            </tr>
        </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 2px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // personal details table
        $pdf->setCellHeightRatio(1.5);

        $first_col_width = 200;

        $html = '<table cellspacing="0" cellpadding="0">';
        $html .= '<tr>';

        if ($details['aanhef'] === 'M') {
            $aanhef = 'Dhr. ';
        } elseif ($details['aanhef'] === 'V') {
            $aanhef = 'Mevr. ';
        }

        $tussenvoegsel = (!empty($details['tussenvoegsel']) ? $details['tussenvoegsel'] . ' ' : '');

        $name = $aanhef . $tussenvoegsel . $details['achternaam'];

        $html .= '<td width="' . $first_col_width . '">' . $name . '</td>';
        $html .= '<td>T: ' . $details['telefoonnummer'] . '</td>';
        $html .= '</tr>';
        $html .= '<tr>';
        $txt = $details['straat'] . ' ' . $details['huisnummer'];
        $txt = (!empty($details['toevoeging']) ? $txt . $details['toevoeging'] : $txt);
        $html .= '<td width="' . $first_col_width . '">' . $txt . '</td>';
        $html .= '<td>E: ' . $details['email'] . '</td>';
        $html .= '</tr>';
        $html .= '<tr>';
        $html .= '<td colspan="2">' . $details['postcode'] . ' ' . $details['plaats'] . '</td>';
        $html .= '</tr>';
        $html .= '</table>';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 2px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // products table
        $pdf->setCellHeightRatio(1.5);

        $first_col_width = 100;
        $center_col_width = 460;
        $last_col_width = 75;

        $html = '<table cellspacing="0" cellpadding="10">';

        $html .= '
        <tr style="background-color: #094FA3; color: #FFFFFF;">
            <td width="' . $first_col_width . '"><b>Product</b></td>
            <td width="' . $center_col_width . '"><b>Eigenschappen</b></td>
            <td width="' . $last_col_width . '"><b>Aantal</b></td>
        </tr>
        ';

        $count = 1;

        if (!empty($session['items'])) {
            foreach ($session['items'] as $item) {
                if ($count % 2 == 0) {
                    $bg = '#FFFFFF';
                } else {
                    $bg = '#F6F6F6';
                }

                $html .= '<tr style="background-color: ' . $bg . ';">';
                $html .= '<td><b>' . $item['display_title'] . '</b></td>';
                $html .= '<td style="font-size: 10px;">';

                $properties = '';

                foreach ($item['values'] as $value) {
                    if (!empty($value['value_name'])) {
                        $properties .= $value['name'] . ': ' . $value['value_name'] . ' - ';
                    }
                }

                $html .= substr($properties, 0, -2);

                $html .= '</td>';
                $html .= '<td style="font-size: 10px; text-align: center;"><b>' . $item['quantity'] . '</b></td>';
                $html .= '</tr>';

                $count++;
            }
        }

        $html .= '</table>';

        $pdf->writeHTML($html, true, false, true, false, '');

        $opmerkingen = $details['opmerkingen'];
        if (!empty($opmerkingen)) {
            // notes title
            $pdf->setCellHeightRatio(0.4);

            $html = '
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td><b>Opmerkingen</b></td>
                </tr>
            </table>
            ';

            $pdf->writeHTML($html, true, false, true, false, '');

            // white space
            $html = '<table style="padding-top: 2px;"></table>';
            $pdf->writeHTML($html, true, false, true, false, '');

            // notes
            $pdf->setCellHeightRatio(1.5);

            $html = '
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td>' . $opmerkingen . '</td>
                </tr>
            </table>
            ';

            $pdf->writeHTML($html, true, false, true, false, '');

            // white space
            $html = '<table style="padding-top: 2px;"></table>';
            $pdf->writeHTML($html, true, false, true, false, '');
        }

        // services title
        $pdf->setCellHeightRatio(0.4);

        $html = '
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td><b>Geselecteerde diensten</b></td>
            </tr>
        </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 2px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // services table
        $pdf->setCellHeightRatio(1.5);

        $first_col_width = 230;

        $html = '<table cellspacing="0" cellpadding="0">';

        $html .= '<tr>';
        $html .= '<td width="' . $first_col_width . '">Inmeetservice:</td>';
        $html .= '<td>' . $session['inmeetservice_label'] . '</td>';
        $html .= '</tr>';

        $html .= '<tr>';
        $html .= '<td width="' . $first_col_width . '">Montageservice:</td>';
        $html .= '<td>' . $session['montageservice_label'] . '</td>';
        $html .= '</tr>';

        if ($session['montageservice'] === 'AF') {
            $html .= '<tr>';
            $html .= '<td width="' . $first_col_width . '">Afhaallocatie:</td>';
            $html .= '<td>' . $session['afhalen_label'] . '</td>';
            $html .= '</tr>';
        }

        if ($session['demontageservice-keuze'] === 'j') {
            $number = $session['demontageservice'];
        } else {
            $number = 0;
        }

        $html .= '<tr>';
        $html .= '<td width="' . $first_col_width . '">Aantal te demonteren producten:</td>';
        $html .= '<td>' . $number . '</td>';
        $html .= '</tr>';

        $html .= '</table>';

        $pdf->writeHTML($html, true, false, true, false, '');

        // white space
        $html = '<table style="padding-top: 2px;"></table>';
        $pdf->writeHTML($html, true, false, true, false, '');

        // goodbye
        $pdf->setCellHeightRatio(0.4);

        $html = '
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td><b>Bedankt voor uw vertrouwen in De Haan Westerhoff!</b></td>
            </tr>
        </table>
        ';

        $pdf->writeHTML($html, true, false, true, false, '');

        $file = ABSPATH . 'wp-content/plugins/dhw-ecommerce/requests/dhw-aanvraag-WO-' . date('Y') . $request_id . '.pdf';

        $pdf->Output($file, 'F');

        return $file;
    }
}

/**
 * Send confirmation email
 *
 * @param $greeting
 * @param $request_id
 * @param $email
 * @param $attachment
 * @throws Exception
 */
function send_confirmation_email($greeting, $request_id, $email, $attachment)
{
    $template = '<img src="' . plugins_url('/dhw-ecommerce/assets/img/email-logo.png') . '"><br><br>';
    $template .= 'Beste {{NAME}},<br><br>';
    $template .= 'Hartelijk dank voor uw offerteaanvraag bij De Haan Westerhoff.<br><br>';
    $template .= 'Uw referentienummer is: {{REQUESTID}}<br><br>';
    $template .= 'Wanneer u vragen heeft, kunt u ons bellen op (+31) 0512 35 13 33.<br><br>';
    $template .= 'Met vriendelijke groet,<br>';
    $template .= 'Team De Haan Westerhoff';

    $params = array(
        '{{NAME}}' => $greeting,
        '{{REQUESTID}}' => 'WO-' . date('Y') . $request_id
    );

    $message = str_replace(array_keys($params), array_values($params), $template);

    // load PHPMailer
    $path = ABSPATH . 'wp-content/plugins/dhw-ecommerce/';
    require $path . '/libraries/phpmailer/src/Exception.php';
    require $path . '/libraries/phpmailer/src/PHPMailer.php';
    require $path . '/libraries/phpmailer/src/SMTP.php';

    // instantiate PHPMailer
    $mail = new PHPMailer(true);

    // recipients
    $mail->setFrom('no-reply@dhwz.nl', 'De Haan Westerhoff');
    $mail->addReplyTo('no-reply@dhwz.nl', 'De Haan Westerhoff');
    $mail->addAddress($email);

    // attachments
    if (!empty($attachment)) {
        $mail->addAttachment($attachment);
    }

    // content
    $mail->isHTML(true);
    $mail->Subject = 'Bevestiging offerteaanvraag De Haan Westerhoff';
    $mail->Body = $message;

    $mail->send();
}

/**
 * Hash password
 *
 * @param string $value
 * @param string|null $salt
 * @return void
 */
function hashPassword(string $value, string $salt = null)
{
    $saltBytes = $salt === null ? random_bytes(24) : hex2bin($salt);
    return hash_pbkdf2('sha1', $value, $saltBytes, 1000) . '$' . ($salt
            ?? bin2hex($saltBytes));
}

/**
 * Verify password
 *
 * @param [type] $hash
 * @param [type] $value
 * @return void
 */
function verifyPassword($hash, $value)
{
    if (empty($hash) || empty($value)) {
        return false;
    }
    try {
        list($expectedHash, $salt) = explode('$', $hash);
    } catch (Exception $e) {
        return false;
    }

    $valueHash = hashPassword($value, $salt);
    $result = true;
    for ($i = strlen($expectedHash) - 1; $i >= 0; $i--) {
        $result = $valueHash[$i] === $expectedHash[$i] && $result;
    }
    return $result;
}

/**
 * Function for tracking the activity in a session.
 *
 * @return void
 */
function logSessionActivity($sessionID, $type, $sessionBefore, $data, $sessionAfter)
{
    $log = 'Date: ' . date('d-m-Y H:i:s') . "\n";
    $log .= 'Type: ' . $type . "\n";
    $log .= 'Session before update: ' . print_r($sessionBefore, true) . "\n";
    $log .= 'Data: ' . $data . "\n";
    $log .= 'Session after update: ' . print_r($sessionAfter, true) . "\n\n";

    $file = ABSPATH . 'wp-content/plugins/dhw-ecommerce/session-logs/' . $sessionID . '.txt';
    file_put_contents($file, $log, FILE_APPEND | LOCK_EX);
}
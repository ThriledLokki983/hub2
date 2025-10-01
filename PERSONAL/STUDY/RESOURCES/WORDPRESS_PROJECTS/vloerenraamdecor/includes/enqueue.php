<?php
// enqueue assets
function vr_enqueue_assets()
{
    // get version of theme and set it as an asset version
    $myTheme = wp_get_theme();
    // $version = $myTheme->version;
    $version = 2.01;

    // CSS
    wp_enqueue_style('vloer-en-raamdecor', get_theme_file_uri('/public/css/styles.css'), false, $version);


    // JS
    wp_enqueue_script('vloer-en-raamdecor', get_theme_file_uri('/public/js/script.js'), false, $version);
}

add_action('wp_enqueue_scripts', 'vr_enqueue_assets');

// set custom script tag for script.js which contains all the scripts for this theme
function vr_custom_script_tag($tag, $handle, $src)
{
    if ($handle !== 'vloer-en-raamdecor') {
        return $tag;
    }

    return '<script defer type="module" src="' . esc_url($src) . '"></script>';
}

add_filter('script_loader_tag', 'vr_custom_script_tag', 10, 3);
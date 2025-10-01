<?php
// enqueue assets
function dhwz_enqueue_assets()
{
    // get version of theme and set it as asset version
    $theme = wp_get_theme();
    $version = $theme->version;

    // fonts
    wp_enqueue_style('myriad', get_theme_file_uri('/public/assets/fonts/Myriad-Pro-Regular.ttf'), false, $version);

    // CSS
    wp_enqueue_style('dhwz', get_theme_file_uri('/public/css/styles.css'), false, $version);
    wp_enqueue_style('fontawesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.0.2', false, $version);

    // JS
    wp_enqueue_script('dhwz', get_theme_file_uri('/public/js/script.js'), false, $version);
}

add_action('wp_enqueue_scripts', 'dhwz_enqueue_assets');

// set custom script tags
function dhwz_custom_script_tags($tag, $handle, $src)
{
    if ($handle !== 'dhwz') {
        return $tag;
    }

    return '<script defer type="module" src="' . esc_url($src) . '"></script>';
}

add_filter('script_loader_tag', 'dhwz_custom_script_tags', 10, 3);

// set custom style tags
function dhwz_custom_style_tags($tag, $handle, $src)
{
    if ($handle !== 'myriad') {
        return $tag;
    }

    return '<link href="' . esc_url($src) . '" type="font/ttf" rel="preload" as="font" crossorigin/>';
}

add_filter('style_loader_tag', 'dhwz_custom_style_tags', 10, 3);
<?php
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title' => 'Thema instellingen',
        'menu_title' => 'Thema instell.',
        'menu_slug' => 'theme-general-settings',
        'capability' => 'edit_posts',
        'redirect' => false
    ]);
}
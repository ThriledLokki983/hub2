<?php
function vr_register_nav_menus()
{
    register_nav_menu('mega-menu', 'Mega menu');
    register_nav_menu('footer', 'Footer');
}

add_action('init', 'vr_register_nav_menus');
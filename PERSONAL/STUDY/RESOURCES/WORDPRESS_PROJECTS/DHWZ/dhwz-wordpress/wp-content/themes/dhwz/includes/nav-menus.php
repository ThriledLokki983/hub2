<?php
function dhwz_register_nav_menus()
{
    register_nav_menu('mega-menu', 'Mega menu');
    register_nav_menu('footer-left', 'Footer (links)');
    register_nav_menu('footer-right', 'Footer (rechts)');
    register_nav_menu('footer-locations-left', 'Footer locaties (links)');
    register_nav_menu('footer-locations-right', 'Footer locaties (rechts)');
    register_nav_menu('footer-legal', 'Legale informatie in footer');
}

add_action('init', 'dhwz_register_nav_menus');
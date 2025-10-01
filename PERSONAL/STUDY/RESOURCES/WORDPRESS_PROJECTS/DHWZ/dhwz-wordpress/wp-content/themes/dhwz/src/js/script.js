'use strict';
import './navigation.js';
import { observeHeader, observeUSP} from './observeables.js';

document.addEventListener('DOMContentLoaded', () => {
    observeHeader();
    observeUSP();

    const menuLinks = document.querySelectorAll('.sub__menu--lists--item-link');
    menuLinks.forEach((element) => {
        element.addEventListener('mouseover', (event) => {
            const src = element.getAttribute('data-image');
            document.querySelectorAll('.nav-image')[0].setAttribute('src', src);
        });
    });
});

// cookie notice
jQuery(document).ready(function ($) {
    var status = localStorage.cookies;
    var notice = jQuery('.consent');

    if (status != 'agreed') {
        notice.show();
    }

    $('.consent').find('.btn').on('click', function (e) {
        e.preventDefault();
        notice.hide();
        localStorage.cookies = 'agreed';
    });

    $('.faq-title').on('click', function () {
        $(this).find('.fa').toggleClass('fa-angle-down fa-angle-up');
        $(this).next('.faq-content').slideToggle();
    });
});

'use strict';
import Navigation from './navigation.js';
import { observeHeader, observeUSP } from './observeables.js';
// import MyFun from './compressImages.js'

document.addEventListener('DOMContentLoaded', () => {
	const toggle = document.querySelector('.toggle.mobile-nav-toggle');
	const toggleBtn = document.querySelector('.toggle-btn');
	const primaryNav = document.querySelector('.primary-navigation');
	const NavList = Array.from(
		document.querySelector('.primary-navigation ul').querySelectorAll('li')
	);

	// toggleNavigation();
	Navigation.toggleDataExpanded(NavList);
	Navigation.togglePrimaryNav(toggle, primaryNav, toggleBtn, NavList);

	// MyFun()
	observeHeader();
	observeUSP();
});

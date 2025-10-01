import Navigation from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
	const toggle = document.querySelector('.toggle.mob-menu');
	const toggleBtn = document.querySelector('.menu__btn');
	const primaryNav = document.querySelector('.mobile--menu');
	const NavList = Array.from(
		document.querySelector('.mobile--menu ul').querySelectorAll('li')
	);

	Navigation.toggleDataExpanded(NavList);
	Navigation.togglePrimaryNav(toggle, primaryNav, toggleBtn, NavList);
});
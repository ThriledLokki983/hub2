import trapFocus from './inert.js';

const nav = document.querySelector('#primary-navigation');
const list = nav.querySelector('ul');
const navItems = Array.from(list?.querySelectorAll('li.nav__lists--item'));
const burgerClone = document.querySelector('#burger-template').content.cloneNode(true);
const button = burgerClone.querySelector('button');
const productsPage = document.querySelector('.main.products-page');

button.addEventListener('click', () => {
	const isOpen = button.getAttribute('aria-expanded') === 'false';
	button.setAttribute('aria-expanded', isOpen);
	isOpen ? disableBodyScroll() : enableBodyScroll();
	resetNavLinks(null);
});

function disableBodyScroll() {
	document.body.style.overflow = 'hidden';
	if (productsPage) productsPage.style.opacity = 0;
	if (productsPage) productsPage.classList.add('hide-main');
}

function enableBodyScroll() {
	document.body.style.overflow = 'auto';
	if (productsPage) productsPage.style.opacity = 1;
	if (productsPage) productsPage.classList.remove('hide-main');
}

nav.addEventListener('keydown', (event) => {
	if (event.code === 'Escape') {
		button.setAttribute('aria-expanded', false);
	}
});

nav.insertBefore(burgerClone, list);

button.addEventListener('click', () => {
	trapFocus(nav);
});

const resetNavLinks = (item) => {
	navItems.forEach((navItem) => {
		const icon = navItem.querySelector('svg.icon');
		const dropDownContent = navItem.querySelector('.dropdown-content');

		if (item && navItem.contains(item)) {
			if (icon.classList.contains('icon--open'))
				icon.classList.remove('icon--open');
			else icon.classList.add('icon--open');
			if (dropDownContent.getAttribute('style'))
				dropDownContent.removeAttribute('style');
			else return;
		} else {
			navItem.querySelector('svg.icon')?.classList.remove('icon--open');
			navItem
				.querySelector('.dropdown-content')
				?.removeAttribute('style');
		}
	});
};

const setActiveLink = (navItem) => {
	const link = navItem.querySelector('a');

	if (link) {
		link.classList.toggle('active-page');
		link.setAttribute('aria-current', 'page');
		resetNavLinks(link);
	}
};

const handleNavClick = (event) => {
	const content = 'nav__lists--item--link-content';
	const item =
		event.target.classList.contains(content || icon) ||
		event.target.closest('.icon');
	const target = event.target.closest('.nav__lists--item');

	if (item) {
		setActiveLink(target);
		toggleAccordion(event.target);
	} // else {
		// event.preventDefault();
	// }
};

const toggleAccordion = (trigger) => {
	const parentItem = trigger.closest('.nav__lists--item');
	const dropdownContent = parentItem.querySelector('.dropdown-content');

	if (dropdownContent.offsetHeight > 0) dropdownContent.style = `height: 0px`;
	else dropdownContent.style = `height: ${dropdownContent.scrollHeight}px`;
};

navItems.forEach((navItem) => {
	navItem.addEventListener('click', handleNavClick);
});

import trapFocus from './inert.js';

const mainNav = document.querySelector('#mainnav');
const list = mainNav.querySelector('ul');
const navItems = Array.from(list?.querySelectorAll('li.header__nav__list--item'))
const burgerClone = document
	.querySelector('#burger-template')
	.content.cloneNode(true);
const button = burgerClone.querySelector('button');

const resetNavLinks = (removeHeight = false) => {
	navItems.forEach((navItem) => {
		navItem.classList.remove('dropdown')
		navItem.querySelector('a')?.classList.remove('active-page');
		navItem.querySelector('a')?.removeAttribute('aria-current');
		if(removeHeight) navItem.querySelector('.dropdown--content').style.height = '0';
	});
};

const setActiveLink = (navItem) => {
	const link = navItem.querySelector('a');
	navItem.addEventListener('click', (e) => {
		e.preventDefault();
		resetNavLinks();
		link.classList.add('active-page');
		link.setAttribute('aria-current', 'page');
		link.parentElement.classList.add('dropdown')
	});
}

const handleNavClick = (event) => {
	const item = event.target.parentElement || event.target.parentNode;
	if (item.classList.contains('header__nav__list--item')) toggleAccordion(item);
}

const toggleAccordion = (trigger) => {
	resetNavLinks(true);
	setActiveLink(trigger);
	const dropdownContent = trigger.querySelector('.dropdown--content');

	if (dropdownContent.offsetHeight > 0) dropdownContent.style = `height: 0px`;
		else dropdownContent.style = `height: ${dropdownContent.scrollHeight}px`;
}

button.addEventListener('click', () => {
	const isOpen = button.getAttribute('aria-expanded') === 'false';
	button.setAttribute('aria-expanded', isOpen);
});

mainNav.addEventListener('keydown', (event) => {
	if (event.code === 'Escape') button.setAttribute('aria-expanded', false);
});

mainNav.insertBefore(burgerClone, list);

button.addEventListener('click', () => {
	trapFocus(mainNav);
});

navItems.forEach((navItem) =>{
	navItem.addEventListener('click', handleNavClick);
	setActiveLink(navItem);
});



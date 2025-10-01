const mobileNavHandler = () => {
	const mobileNavigation = document.querySelector('.menu__icon');
	const menu = document.querySelector('.mobile--menu');
	const filterMenu = document.querySelector('.filter-box');
	const main = document.querySelector('main');
	const footer = document.querySelector('footer');
	const allSubMenu = Array.from(document.querySelectorAll('.sub__menu'));
	const allNavLinks = Array.from(
		document.querySelectorAll('.nav__list--item-link')
	);
	let currentpage = '/';

	allNavLinks?.forEach((link) => {
		link.setAttribute(
			'data-link',
			link.textContent.toLowerCase().replace(/\s/g, '-')
		);

		link.addEventListener('click', (e) => {
			currentpage = e.target.textContent.toLowerCase();
			removeActiveClass('nav__list--item', 'active');
			const parentElement = link.parentElement.parentElement;

			parentElement.classList.add('active');
			main.classList.add('mb-9');

			currentpage = '';
		});
	});

	const checkbox = document.querySelector('.menu__btn');

	allSubMenu?.forEach(function (subMenu) {
		const div = document.createElement('div');
		const div2 = document.createElement('div');
		const span = document.createElement('span');
		const link = subMenu.parentElement.querySelector('a');

		span.classList.add('sub__menu--icon');
		span.innerHTML = `<svg aria-hidden="true"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" fill="#5e657c">
    						<path d="M16.594 8.578l1.406 1.406-6 6-6-6 1.406-1.406 4.594 4.594z"></path> </svg>`;
		subMenu.parentElement.insertBefore(span, subMenu);

		div.classList.add('sub__menu--container');
		div2.classList.add('dropdown--content');
		div.appendChild(link);
		div.appendChild(span);
		subMenu.parentElement.insertAdjacentElement('afterbegin', div2);
		subMenu.parentElement.insertAdjacentElement('afterbegin', div);
		div2.appendChild(subMenu);

		subMenu.setAttribute('data-expand', 'false');
		subMenu.setAttribute('data-desktop', 'true');

		span.addEventListener('click', function (e) {
			const target = e.target.closest('.nav__list--item');
			const dropdownContent = target.querySelector('.dropdown--content');

			document
				.querySelectorAll('.nav__list--item')
				.forEach((nav) => nav.setAttribute('mobile-state', 'false'));

			if (e.target.closest('.sub__menu--icon')) {
				if (subMenu.getAttribute('data-expand') === 'false') {
					subMenu.setAttribute('data-expand', 'true');
					subMenu.setAttribute('data-desktop', 'false');
					target.setAttribute('mobile-state', 'true');
					span.classList.add('rotate');

					dropdownContent.style.height =
						subMenu.scrollHeight + 10 + 'px';
				} else {
					subMenu.setAttribute('data-expand', 'false');
					subMenu.setAttribute('data-desktop', 'true');
					span.classList.remove('rotate');

					dropdownContent.removeAttribute('style');
				}
			}
		});
	});

	menu.setAttribute('data-expanded', 'false');
	main.setAttribute('data-expanded', 'false');
	footer.setAttribute('data-expanded', 'false');

	mobileNavigation.addEventListener('click', () => {
		const menuBackground = document.querySelector('.mob-menu');
		const mobMenu = document.querySelector('.mob-menu');
		const logoBox = document.querySelector('picture.logo');

		logoBox.classList.toggle('push-down');
		mobMenu.classList.toggle('down');

		allNavLinks?.forEach((link) => {
			const subMenuIcon = link.nextElementSibling;
			const dropdownContent = link.parentElement.nextElementSibling;

			if (subMenuIcon && subMenuIcon.classList.contains('rotate')) {
				subMenuIcon.classList.toggle('rotate');
				dropdownContent.removeAttribute('style');
			}
		});

		if (menu.getAttribute('data-expanded') === 'false') {
			disableScroll();
			menu.setAttribute('data-expanded', 'true');
			main.setAttribute('data-expanded', 'true');
			main.addEventListener('wheel', preventScroll);
			footer.setAttribute('data-expanded', 'true');
			menuBackground.classList.add('bck_change');
			checkbox.checked = true;
		} else {
			enableScroll();
			menu.setAttribute('data-expanded', 'false');
			main.setAttribute('data-expanded', 'false');
			main.removeEventListener('wheel', preventScroll);
			footer.setAttribute('data-expanded', 'false');
			menuBackground.classList.remove('bck_change');
			checkbox.checked = false;
		}
	});

	const removeActiveClass = (elementList, className) => {
		Array.from(document.querySelectorAll(`.${elementList}`)).forEach(
			function (element) {
				element.classList.remove(`${className}`);
			}
		);
	};

	filterMenu?.addEventListener('click', () => {
		const selectOptions = document.querySelector('.select__options');

		if (selectOptions.getAttribute('data-expanded') === 'true') {
			selectOptions.setAttribute('data-expanded', 'false');
		} else {
			selectOptions.setAttribute('data-expanded', 'true');
		}
	});

	const preventScroll = (e) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	function disableScroll() {
		document.body.style.overflow = 'hidden';
	}

	function enableScroll() {
		document.body.style.overflow = 'auto';
	}

	const lastNavItem = document.querySelector('.nav__container.mobile--menu');
	const lastNavCallback = (entries) => {
		const [entry] = entries;
	};
	const filterBoxObserver = new IntersectionObserver(lastNavCallback, {
		root: null,
		threshold: 1,
	});

	filterBoxObserver.observe(lastNavItem);
};

const setActiveOnCurrentPage = () => {
	const allUrlItems = window.location.href.split('/');
	const navLinks = document.querySelectorAll('.nav__list--item-link');
	navLinks.forEach((link) => {
		const currentLink = link.getAttribute('data-link')?.toLowerCase();
		if (allUrlItems.includes(currentLink)) {
			link.closest('li').classList.add('active');
		}
	});
};

export default {
	mobileNavHandler,
	setActiveOnCurrentPage,
};

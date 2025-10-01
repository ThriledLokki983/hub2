const toggleDataExpanded = (NavList) => {
	const mainNav = document.querySelector('.nav__lists');

	NavList.forEach((item) => {
		item.removeAttribute('data-expanded');
		item.querySelector('.mobile-icon')?.classList.remove('rotate');

		item.addEventListener('click', (event) => {
			const target = event.target.closest('.nav__lists--item');
			const subMenu = target.querySelector('.sub__menu');

			target.toggleAttribute('data-expanded');
			target?.querySelector('.mobile-icon')?.classList.toggle('rotate');
			subMenu?.toggleAttribute('data-active');
			mainNav?.toggleAttribute('data-visible');
		});

	});
};

const togglePrimaryNav = (toggle, primaryNav, toggleBtn, NavList) => {
	const mainNav = document.querySelector('.nav__lists');

	toggle?.addEventListener('click', () => {
		removeAllDataActive();

		primaryNav.toggleAttribute('data-visible');
		toggleBtn.toggleAttribute('checked');

		primaryNav.hasAttribute('data-visible')
			? disableScroll()
			: enableScroll();

		mainNav.toggleAttribute('data-visible');

		// if (primaryNav.hasAttribute('data-visible')) {
		// 	NavList.forEach((item) => {
		// 		item.classList.add('open');
		// 	});
		// } else {
		// 	NavList.forEach((item) => {
		// 		item.classList.remove('open');
		// 	});
		// }
	});
};

const removeAllDataActive = () => {
	const allNavItems = Array.from(
		document.querySelectorAll('.nav__lists--item.open')
	);

	allNavItems.forEach((item) => {
		item.classList.remove('open');
	});
};

function disableScroll() {
	document.body.style.overflow = 'hidden';
}

function enableScroll() {
	document.body.style.overflow = 'auto';
}

export default {
	toggleDataExpanded,
	togglePrimaryNav,
};

/**
 * This handles click events on the navigation links and sets an attribute [data-expanded="true"]
 * then add a rotate class to the arrow icon as well
 */
const toggleDataExpanded = () => {
	//
	const navList = Array.from(document.querySelectorAll('.nav__lists--item'))

	navList?.forEach((item) => {
		wrapLink(item);

		item.addEventListener('click', (event) => {
			const target = event.target?.parentElement
			target?.toggleAttribute('aria-expanded');
			target?.querySelector('.sub__menu')?.toggleAttribute('data-expanded');
			target?.querySelector('.mobile-icon')?.classList.toggle('rotate');

			navList.forEach(
				(otherItem) => {
					if (otherItem !== item) {
						otherItem.removeAttribute('aria-expanded');
						otherItem.querySelector('.mobile-icon')?.classList.remove('rotate');
						otherItem.querySelector('.sub__menu').removeAttribute('data-expanded');

					}
				}
			);
		});
	});
};


// given an li - check if the li has a sub menu and if it does, wrap the a tag in a div and make sure it is before the sub menu
const wrapLink = (li) => {
	const subMenu = li.querySelector('.sub__menu');
	if (subMenu) {
		const a = li.querySelector('a');
		const svg = li.querySelector('.mobile-icon');
		const div = document.createElement('div');
		div.classList.add('nav__lists--link-container');
		div.appendChild(a);
		div.appendChild(svg);
		li.insertBefore(div, subMenu);
	}
};


const togglePrimaryNav = (toggle, primaryNav, toggleBtn, NavList) => {
	const mainNav = document.querySelector('.nav__lists');

	toggle?.addEventListener('click', () => {
		const isOpen = toggleBtn.getAttribute('aria-expanded') === 'false';
		toggleBtn.setAttribute('aria-expanded', isOpen);
		toggle.setAttribute('aria-expanded', isOpen);
		removeAllDataActive();

		primaryNav.toggleAttribute('data-visible');
		toggleBtn.toggleAttribute('btn-clicked');

		primaryNav.hasAttribute('data-visible')
			? disableScroll()
			: enableScroll();

		mainNav.toggleAttribute('data-visible');

		if (primaryNav.hasAttribute('data-visible')) {
			NavList.forEach((item) => {
				item.classList.add('open');

				item.addEventListener('click', (e) => {
					e.stopPropagation()

				});
			});
		} else {
			NavList.forEach((item) => {
				item.classList.remove('open');
			});
		}
	});

	mainNav.addEventListener('keydown', (event) => {
		if (event.code === 'Escape') {
			toggleBtn.setAttribute('aria-expanded', false);
		}
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



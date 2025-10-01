
const links = [
	{ label: 'Home', id: 'home'},
	{ label: 'Projects', id: 'projects'},
	{ label: 'Experience', id: 'experience'},
	{ label: 'About me', id: 'about'},
	{ label: 'Contact', id: 'contact'},
];

export const navigation = (isProjectsPage: boolean = false) => {
	// Determine the base URL and link format based on current page
	const getHref = (id: string) => {
		if (isProjectsPage) {
			// If on projects page, navigate back to main page with hash
			return `/#${id}`;
		} else {
			// If on main page, use regular hash navigation
			return `#${id}`;
		}
	};

	const navContent = `
		<nav class="nav" role="navigation" aria-label="Page sections">
			<ul class="nav__list" role="list">
				${links.map(({ label, id }, index) => `
					<li class="nav__item" role="listitem">
						<a href="${getHref(id)}" class="nav__link" ${index === 0 ? 'aria-selected="true" aria-current="page"' : 'aria-selected="false"'} aria-describedby="nav-desc-${index}">
							<span aria-hidden="true">0${index + 1}.</span> ${label}
							<span id="nav-desc-${index}" class="sr-only">Navigate to ${label} section</span>
						</a>
					</li>`).join('')
				}
			</ul>
		</nav>
	`

	return navContent;
};
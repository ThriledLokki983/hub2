interface Link {
	url: string;
	icon: string;
	label?: string;
}
interface Project {
	id: number;
	label: string;
	name: string;
	icon: string;
	description: string;
	photo: string;
	className: string
	technologies: string[];
	links: Link[];
}

// Import images dynamically for better Vite handling
const getImageUrl = (imageName: string, isSmall: boolean = false) => {
	const suffix = isSmall ? '-small.png' : '.jpg';
	return new URL(`../assets/img/${imageName}${suffix}`, import.meta.url).href;
};

export const projectModule = (project: Project) => {
	const imageUrl = getImageUrl(project.photo);
	const imageUrlSmall = getImageUrl(project.photo, true);
	
	return `
		<li class="${project.className}">
			<div class="${project.className}-content">
				<div class="${project.className}-label">${project.label}</div>
				<h4 class="${project.className}-title">${project.name}</h4>
				<div class="${project.className}-details">
					<p>${project.description}</p>
					 <ul>
                        ${project.technologies
                            .map((tech) => `<li>${tech}</li>`)
                            .join("")}
					</ul>
					<ul>
						${project.links.map((link: Link) => `
							<li class="${project.className}-link">
								<a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${link.label} page (opens in new tab)">
									<svg class="icon">
										<use xlink:href="/src/assets/svg/sprite.svg#icon-${link.icon}"></use>
									</svg>
								</a>
							</li>`
						).join('')}
					</ul>
				</div>
			</div>
			<div class="${project.className}-img">
				<img srcset="${imageUrlSmall} 600w, ${imageUrl} 1000w"
					sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw 300px"
					alt="Photo ${project.name}"
					src="${imageUrl}"
					width="300px" height="350px"/>
			</div>
		</li>
	
	`
}


export const projectsPage = (projects: Project[]) => {
	// Show only first 2 projects on the main page
	const featuredProjects = projects.slice(0, 2);
	
	const projectsContent = `
		<h1 id="projects-heading">Featured Projects</h1>
		<ul data-project-lists class="projects">
			${featuredProjects.map(project => projectModule(project)).join('')}
		</ul>
		<div class="projects-cta">
			<a href="/projects.html" class="projects-view-all-btn" aria-label="View all projects">
				<span>View More</span>
			</a>
		</div>
	`;

	return projectsContent;
};

// Full projects page (for the dedicated projects page)
export const allProjectsPage = (projects: Project[]) => {
	const projectsContent = `
		<h1 id="projects-heading">All Projects</h1>
		<ul data-project-lists class="projects projects--full">
			${projects.map(project => projectModule(project)).join('')}
		</ul>
		<div class="projects-cta">
			<a href="/" class="projects-view-all-btn" aria-label="Back to home">
				<span>← Back to Home</span>
			</a>
		</div>
	`;

	return projectsContent;
};
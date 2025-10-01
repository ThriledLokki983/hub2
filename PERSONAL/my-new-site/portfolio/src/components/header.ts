// Create a header here and inject it into the DOM

const links = ['About', 'Experience', 'Projects', 'Contact'];

`
	<a href="#home" class="logo__link">
			<svg width="102" height="93" viewBox="0 0 102 93" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M44.9662 26.0286C44.7073 24.9731 44.2991 24.0472 43.7415 23.2506C43.184 22.4342 42.487 21.7472 41.6506 21.1896C40.8342 20.6121 39.8783 20.184 38.7831 19.9052C37.7078 19.6065 36.5229 19.4571 35.2285 19.4571C32.4407 19.4571 30.061 20.1242 28.0896 21.4584C26.1381 22.7926 24.6446 24.7143 23.6091 27.2234C22.5935 29.7324 22.0857 32.7593 22.0857 36.3039C22.0857 39.8883 22.5736 42.955 23.5493 45.5039C24.5251 48.0528 25.9788 50.0043 27.9104 51.3584C29.842 52.7125 32.2415 53.3896 35.1091 53.3896C37.3031 53.3896 39.1749 53.1123 40.7245 52.5578V67.4077C38.8979 67.7004 36.9862 67.8467 34.9896 67.8467C29.0355 67.8467 23.8082 66.5822 19.3078 64.0532C14.8074 61.5242 11.2926 57.9199 8.76363 53.2402C6.25454 48.5606 5 42.9948 5 36.5428C5 31.4848 5.76667 27.0043 7.3 23.1013C8.85324 19.1983 11.0039 15.9026 13.7519 13.2143C16.5 10.5061 19.6762 8.46493 23.2805 7.09091C26.8848 5.69697 30.748 5 34.8701 5C38.4943 5 41.8597 5.51775 44.9662 6.55325C48.0926 7.56883 50.8506 9.02251 53.2402 10.9143C55.6497 12.7861 57.5913 15.0065 59.0649 17.5753C60.5385 20.1441 61.4346 22.9619 61.7532 26.0286H44.9662Z"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M40.605 45.3999H35.2285V33.5713H62.3506V33.6625L81.7269 62.1212H82.1541V33.5714H96.9999V88.1142H84.6106L64.8519 59.4579H64.5315V88.1142H49.6857V42.1144H40.605V45.3999Z"/>
			</svg>
		</a>
			<li class="nav__item">
				<button class="theme-toggle" id="theme-toggle" title="Toggles light & dark" aria-label="auto" aria-live="polite">
					<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
						<mask class="moon" id="moon-mask">
							<rect x="0" y="0" width="100%" height="100%" fill="white" />
							<circle cx="24" cy="10" r="6" fill="black" />
						</mask>
						<circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
						<g class="sun-beams" stroke="currentColor">
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</g>
					</svg>
				</button>
			</li>
`;

`
	<nav class="nav">
		<ul class="nav__list">
			${links.map(link => `
				<li class="nav__item">
					<a href="${link.toLowerCase()}" class="nav__link">
						<span>0${links.indexOf(link) + 1}.</span> ${link}
					</a>
				</li>`).join('')
			}
		</ul>
	</nav>
`

export const headerContent = `
	<div class="logo">
		<a></a>
		<a href="#home" aria-label="Gideon Nimoh - Go to home page">
			<span>gdn.</span>
		</a>
	</div>
	<nav class="resume">
		<a href="/resume.html" aria-label="View resume page">Resume</a>
		<span aria-hidden="true"></span>
	</nav>
`;
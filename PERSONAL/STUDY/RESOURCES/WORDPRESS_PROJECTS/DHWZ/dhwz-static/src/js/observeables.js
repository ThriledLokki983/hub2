// observe the header and apply class sticky when it goes completely out of the viewport
import { startCountUp } from './countdown.js';

export const observeHeader = () => {
	const hero = document.querySelector('body');
	const header = document.querySelector('.header');
	const headerOptions = {
		root: null,
		threshold: [1, 0.87],
	};
	const headerObserver = new IntersectionObserver(function (entries) {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				header.classList.add('sticky');
			} else {
				header.classList.remove('sticky');
			}
		});
	}, headerOptions);

	headerObserver.observe(hero);
};

export const observeUSP = () => {
	const usp = document.querySelector('.usp');
	const hero = document.querySelector('body');

	const uspOptions = {
		root: null,
		threshold: [0, 1],
	};
	const uspObserver = new IntersectionObserver(function (entries) {
		const [entry] = entries;

		if (!entry.isIntersecting) {
			startCountUp(true);
		} else {
			startCountUp(false);
		}
	}, uspOptions);

	uspObserver.observe(hero);
};

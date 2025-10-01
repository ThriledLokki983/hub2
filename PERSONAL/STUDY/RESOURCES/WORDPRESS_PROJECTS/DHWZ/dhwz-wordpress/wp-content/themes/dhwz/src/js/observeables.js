// observe the header and apply class sticky when it goes completely out of the viewport
export const observeHeader = () => {
	const header = document.querySelector('[data-header]');
	const root = document.querySelector('body');
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

	headerObserver.observe(root);
};


// Observe the USPs
export const observeUSP = () => {
	const usp = document.querySelector('[data-usp]');
	const root = document.querySelector('[data-main]');

	const uspOptions = {
		root: null,
		threshold: 1,
	}

	const uspObserver = new IntersectionObserver((entries) => {
		entries.forEach(_entry => {
			if(_entry.isIntersecting) {
				startNumberAnimation();
			}
		})
	}, uspOptions)

	if(usp) uspObserver.observe(usp);
}

/**
 * Function for animating a numeric text content.
 *
 * @param obj The object which to animate
 * @param start The number where to start from
 * @param end The number where to stop animation
 * @param duration Duration of the animation
 */
	function animateTextContent(obj, start, end, duration) {
	var isComma = /[0-9]+,[0-9]+/.test(end);
	end = end.replace(/,/g, '');

	var range = end - start;
	var minTimer = 50;
	var stepTime = Math.abs(Math.floor(duration / range));

	stepTime = Math.max(stepTime, minTimer);

	var startTime = new Date().getTime();
	var endTime = startTime + duration;
	var timer;

	function run() {
		var now = new Date().getTime();
		var remaining = Math.max((endTime - now) / duration, 0);
		var value = Math.round(end - remaining * range);
		obj.innerHTML = value;
		if (value == end) {
			clearInterval(timer);
		}

		if (isComma) {
			while (/(\d+)(\d{3})/.test(value.toString())) {
				value = value
					.toString()
					.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
			}
		}
	}

	var timer = setInterval(run, stepTime);
	run();
}

// code which fires the counters when #usp is within viewport
function startNumberAnimation() {
	let fired = false;

	if (!fired) {
		const allValues = document.querySelectorAll(
			'.usp__item--middle h3'
		);
		allValues?.forEach((element) => {
			animateTextContent(element, 0, element.textContent, 3000);
		});
		fired = true;
	}
}
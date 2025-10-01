// and function that takes a value and runs a countdown from that value every 500ms until it reaches 0

const allValues = document.querySelectorAll(`.usp__item--middle`);

export const countUp = (value, element, clear = false) => {
	let count = 0;
	let interval = 50;

	var timer = setInterval(
		() => {
			value > 1000 ? (count += 10) : count++;
			element.textContent = count;
			// if (clear === true) clearInterval(timer);
			if (value === count) clearInterval(timer);
		},
		value > 1000 ? 0.001 : interval
	);

	clear ? clearInterval(timer) : null;
};

export function startCountUp(clear) {
	allValues?.forEach((element) => {
		const value = Number(element.querySelector('h3').textContent);
		// countUp(value, element.querySelector('h3'), clear);
	});
}

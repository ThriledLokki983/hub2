export const rangeController = () => {
	document.querySelectorAll('input[type="range"').forEach((input) => {
		input.addEventListener(
			"input",
			(event) => {
				let _t = event.target;
				_t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
			},
			false
		);
	});
};

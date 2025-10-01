let start, previousTimeStamp;
let done = false;

export function getPositionX(event) {
	return event.type.includes('mouse')
		? event.touches[0].pageX
		: event.touches[0].clientX;
}

export function setSliderPosition(slider, translate) {
	slider.style.transform = `translateX(${translate}px)`;
}

export function setPositionByIndex(index, slider, translate) {
	const translateValue = index * -window.innerWidth;
	setSliderPosition(slider, translate);
	return translateValue;
}

export function animation(slider, currentTranslate, isDragging) {
	setSliderPosition(slider, currentTranslate);
	if (isDragging) requestAnimationFrame(animation);
}

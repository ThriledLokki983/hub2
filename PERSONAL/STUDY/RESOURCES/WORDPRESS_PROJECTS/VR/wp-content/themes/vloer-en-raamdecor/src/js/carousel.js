'use-strict';

// export default class Slider {
// 	slider;
// 	allSlideItems = [];
// 	nextButton;
// 	isDragging = false;
// 	startPos = 0;
// 	currentTranslate = 0;
// 	prevTranslate = 0;
// 	animationID = 0;
// 	currentSlide = 0;

// 	constructor(slider, sliderItems, nextButton) {
// 		this.slider = document.querySelector(`.${slider}`);
// 		this.allSlideItems = Array.from(
// 			document.querySelectorAll(`.${sliderItems}`)
// 		);
// 		this.nextButton = document.querySelector(`.${nextButton}`);
// 		this.init();
// 	}

// 	init() {
// 		this.allSlideItems.forEach((slide, index) => {
// 			const slideImage = slide.querySelector('img');
// 			slideImage.addEventListener('dragstart', (e) => e.preventDefault());

// 			// Touch events
// 			slide.addEventListener('touchstart', (event) =>
// 				this.touchStart(index, event)
// 			);
// 			slide.addEventListener('touchend', this.touchEnd);
// 			slide.addEventListener('touchmove', this.touchMove);

// 			// Mouse events
// 			slide.addEventListener('mousedown', this.touchStart(index));
// 			slide.addEventListener('mouseup', this.touchEnd);
// 			slide.addEventListener('mouseleave', this.touchEnd);
// 			slide.addEventListener('mousemove', (e) => this.touchMove(e));
// 		});
// 	}

// 	touchStart(index, event) {
// 		return () => {
// 			this.currentSlide = index;
// 			this.startPos = getPositionX(event);
// 			this.isDragging = true;

// 			this.animationID = requestAnimationFrame(this.animation);
// 			this.slider.classList.add('grabbing');
// 		};
// 	}

// 	touchMove(event) {
// 		if (this.isDragging) {
// 			const currentPosition = this.getPositionX(event);
// 			currentTranslate =
// 				this.prevTranslate + currentPosition - this.startPos;
// 		}
// 	}

// 	getPositionX(e) {
// 		return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
// 	}

// 	touchEnd() {
// 		this.isDragging = false;
// 		cancelAnimationFrame(this.animationID);

// 		const movedBy = this.currentTranslate - this.prevTranslate;
// 		if (movedBy < -100 && this.currentSlide < this.allSlideItems.length - 1)
// 			currentSlide += 1;
// 		if (movedBy > 100 && this.currentSlide > 0) this.currentSlide -= 1;
// 		console.log(movedBy);

// 		this.setSliderPositionByIndex();

// 		this.slider.classList.remove('grabbing');
// 	}

// 	animation() {
// 		this.setSliderPosition();
// 		if (this.isDragging) requestAnimationFrame(this.animation);
// 	}

// 	setSliderPositionByIndex() {
// 		this.currentTranslate = this.currentSlide * -window.innerWidth;
// 		this.prevTranslate = this.currentTranslate;
// 		this.setSliderPosition();
// 	}

// 	setSliderPosition() {
// 		this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
// 		if (this.nextButton)
// 			this.nextButton.style.transform = `translateX(${-this
// 				.currentTranslate}px)`;
// 	}
// }

const slider = document.querySelector('.js-slider-container'),
	slides = Array.from(document.querySelectorAll('.js-slide') || []),
	nextButton = document.querySelector('.js-hero-next');

let isDragging = false,
	startPos = 0,
	currentTranslate = 0,
	prevTranslate = 0,
	animationID = 0,
	currentSlide = 0;

slides.forEach((slide, index) => {
	const slideImage = slide.querySelector('img');
	slideImage.addEventListener('dragstart', (e) => e.preventDefault());

	// Touch events
	slide.addEventListener('touchstart', touchStart(index));
	slide.addEventListener('touchend', touchEnd);
	slide.addEventListener('touchmove', touchMove);

	// Mouse events
	slide.addEventListener('mousedown', touchStart(index));
	slide.addEventListener('mouseup', touchEnd);
	slide.addEventListener('mouseleave', touchEnd);
	slide.addEventListener('mousemove', touchMove);
});

function touchStart(index) {
	return function (e) {
		currentSlide = index;
		startPos = getPositionX(e);
		isDragging = true;

		animationID = requestAnimationFrame(animation);
		slider.classList.add('grabbing');
	};
}

function touchEnd() {
	isDragging = false;
	cancelAnimationFrame(animationID);

	const movedBy = currentTranslate - prevTranslate;
	if (movedBy < -100 && currentSlide < slides.length - 1) currentSlide += 1;
	if (movedBy > 100 && currentSlide > 0) currentSlide -= 1;

	setSliderPositionByIndex();

	slider.classList.remove('grabbing');
}

function touchMove(event) {
	if (isDragging) {
		const currentPosition = getPositionX(event);
		currentTranslate = prevTranslate + currentPosition - startPos;
	}
}

function getPositionX(e) {
	return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
	setSliderPosition();
	if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
	slider.style.transform = `translateX(${currentTranslate}px)`;
	nextButton.style.transform = `translateX(${-currentTranslate}px)`;
}

function setSliderPositionByIndex() {
	currentTranslate = currentSlide * -window.innerWidth;
	prevTranslate = currentTranslate;
	setSliderPosition();
}

function autoScroll() {
	setInterval(() => {
		if (currentSlide < slides.length - 1) currentSlide += 1;
		else currentSlide = 0;
		setSliderPositionByIndex();
	}, 5000);
}

// autoScroll();

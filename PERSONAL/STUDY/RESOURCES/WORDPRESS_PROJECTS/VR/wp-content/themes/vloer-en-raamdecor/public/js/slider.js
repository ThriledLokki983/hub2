// REVIEW SLIDER
const reviewSlider = () => {
	const reviews = document.querySelectorAll('.review-item');
	const dotContainer = document.querySelector('.dots');

	let currentReview = 0;
	const maxSlide = reviews.length;

	reviews.forEach((rev, i) => {
		rev.setAttribute('data-review', i);
	});

	// function for the dots
	const createDots = () => {
		reviews.forEach(function (_, i) {
			dotContainer?.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-review="${i}" aria-label="Review button to go back and forth"></button>`
			);
		});
	};

	// Function to make the current review correspond to a dot with an active class
	const activateDot = function (review) {
		document
			.querySelectorAll('.dots__dot')
			.forEach((dot) => dot.classList.remove('active'));

		document
			.querySelector(`.dots__dot[data-review="${review}"]`)
			?.classList.add('active');
	};

	// Refactoring
	const goToReview = (review) => {
		reviews.forEach((s, i) => {
			s.style.transform = `translateX(${100 * (i - review)}%)`;
		});
	};

	// Function to control a button to go to the next review
	const nextSlide = () => {
		currentReview === maxSlide - 1 ? (currentReview = 0) : currentReview++;
		goToReview(currentReview);
		activateDot(currentReview);
	};

	// Function to control a button to go to the previous review
	const prevSlide = () => {
		currentReview === 0 ? (currentReview = maxSlide - 1) : currentReview--;
		goToReview(currentReview);
		activateDot(currentReview);
	};

	const init = () => {
		goToReview(0);
		createDots();
		activateDot(0);
		setInterval(nextSlide, 5000);
	};
	init();

	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') prevSlide();
		e.key === 'ArrowRight' && nextSlide();
	});

	// Add event handlers to all the dots
	dotContainer?.addEventListener('click', (e) => {
		if (e.target.classList.contains('dots__dot')) {
			const { review } = e.target.dataset;
			goToReview(review);
			activateDot(review);
		}
	});

	//  add drag functionality to the slider
	// const draggable = (el) => {
	// 	let pos1 = 0,
	// 		pos2 = 0,
	// 		pos3 = 0,
	// 		pos4 = 0;
	// 	let drag = false;
	// 	el.onmousedown = (e) => {
	// 		drag = true;
	// 		pos3 = e.clientX;
	// 		pos4 = e.clientY;
	// 		pos1 = pos3 - el.offsetLeft;
	// 		pos2 = pos4 - el.offsetTop;
	// 		document.onmousemove = (e) => {
	// 			if (drag) {
	// 				el.style.left = e.clientX - pos1 + 'px';
	// 				el.style.top = e.clientY - pos2 + 'px';
	// 			}
	// 		};
	// 		document.onmouseup = () => {
	// 			drag = false;
	// 		};
	// 	};
	// };
	// draggable(document.querySelector('.review-item'));

	// add swipe functionality to the slider
	const swipe = (el) => {
		let startX = 0,
			startY = 0,
			distX = 0,
			distY = 0;
		el.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		});
		el.addEventListener('touchmove', (e) => {
			distX = e.touches[0].clientX - startX;
			distY = e.touches[0].clientY - startY;
		});
		el.addEventListener('touchend', () => {
			if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 40) {
				distX > 0 ? prevSlide() : nextSlide();
			}
		});
	};
	document.querySelectorAll('.review-item').forEach((el) => swipe(el));

	// const draggable = (el) => {
	// 	const container = document.querySelector('.main__review--list');
	// 	const theSlider = document.querySelectorAll('.review-item');
	// };
};

// PHOTO SLIDER
const photoSlider = () => {
	const photos = document.querySelector('.inspiration__scroller');
	if (photos) {
		$('.inspiration__scroller').slick({
			dots: false,
			adaptiveHeight: true,
			prevArrow: $('.left-btn'),
			nextArrow: $('.right-btn'),
			infinite: true,
			speed: 700,
			slidesToShow: 5.5,
			slidesToScroll: 1,
			// autoplay: true,
			autoplaySpeed: 2000,
			responsive: [
				{
					breakpoint: 1901,
					settings: {
						slidesToShow: 4.5,
						slidesToScroll: 1,
						infinite: true,
						dots: true,
					},
				},
				{
					breakpoint: 1441,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
						infinite: true,
						dots: true,
					},
				},
				{
					breakpoint: 901,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 601,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		});
	}
};

const SponsorsSlider = () => {
	const sponsors = document.querySelector('.support__content');
	if (sponsors) {
		$('.support__content--list').slick({
			dots: false,
			adaptiveHeight: true,
			autoplay: true,
			autoplaySpeed: 2000,
			slidesToShow: 5,
			slidesToScroll: 1,

			responsive: [
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		});
	}
};

// HERO IMAGES SLIDER

class HeroSlider {
	target;
	_imageList = [];
	_currentImage = 0;
	_nextImageButton = '';
	isDragging = false;
	startPos = 0;
	currentTranslate = 0;
	prevTranslate = 0;
	animationID;
	currentIndex = 0;

	constructor(currentImageClass) {
		this.target = document.querySelector(`.${currentImageClass}`);
		if (this.target) {
			this._imageList = Array.from(
				document
					.querySelector(`.${currentImageClass}`)
					?.querySelectorAll('article')
			);
			this._nextImageButton = document
				.querySelector(`.${currentImageClass}`)
				?.querySelector('.btn.home-hero-caro');

			this.init();
		}
	}

	init() {
		this.addDatasetIndex();

		if (this._nextImageButton) {
			this._nextImageButton?.addEventListener('click', (e) => {
				this.nextImage(e);
			});
		}

		window.addEventListener('resize', this.setPositionByIndex);

		window.oncontextmenu = function (event) {
			event.preventDefault();
			event.stopPropagation();
			return false;
		};

		this.draggable(this._imageList);
	}

	addDatasetIndex() {
		this._imageList.forEach((image, i) => {
			image.dataset.index = i;
		});
	}

	nextImage(e) {
		this.currentIndex =
			this.currentIndex === this._imageList.length - 1
				? 0
				: this.currentIndex + 1;

		this.changeImage(e, 'next');
	}

	changeImage(e, direction) {
		// this.removeActiveClass();
		const label = e.target
			.closest('button')
			.getAttribute('aria-label')
			.toLowerCase();
		const container = this.target;
		const containerWidth = container.getBoundingClientRect().width;
		const scrollWidth = container.scrollWidth;
		const scrollLeft = container.scrollLeft;
		const scrollRight = scrollWidth - containerWidth - scrollLeft;
		console.log(label);

		for (let i = 0; i < this._imageList.length; i++) {
			const item = this._imageList[i];

			if (direction === 'next' || label === 'next') {
				console.log(scrollRight);
				if (scrollRight === 0) {
					container.append(this._imageList[i]);
					container.scrollTo(0, containerWidth);
				} else {
					container.scrollBy({
						left: scrollRight / 2,
						behavior: 'auto',
					});
				}
			}
		}

		this.target.scrollTo({
			left: containerWidth * this.currentIndex,
			behavior: 'smooth',
		});

		this._imageList.forEach((image) => {
			const theImage = this._imageList[this.currentIndex];

			if (Number(image.dataset.index) === this.currentIndex) {
				// this.target?.scrollBy({
				// 	left: this.target.scrollLeft / this._imageList.length,
				// 	behavior: 'auto',
				// });

				theImage.classList.remove('hero__small');
				theImage.classList.add('hero__big', 'span-2');
				if (theImage.classList.contains('hide-hero')) {
					// if (Number(theImage.dataset.index) === 0) {
					// 	// get the image with index 2 and set the transform to -300px
					// 	const theImage = this._imageList[2];
					// 	theImage.style.transform = 'translateX(-300px)';
					// }
					// use scrollTo to scroll to the image
					// this.target.scrollTo({
					// 	left: this.target.scrollLeft / this._imageList.length,
					// 	behavior: 'smooth',
					// });
					// if (this.currentIndex === this._imageList.length - 1) {
					// 	this._imageList.forEach((image) => {
					// 		image.style.transform = `translateX(-${
					// 			(this.currentIndex + 1) * 100
					// 		}%)`;
					// 	});
					// 	theImage.style.transform = `translateX(0%)`;
					// 	this._imageList[2].style.transform = `translateX(200%)`;
					// 	theImage.classList.remove('hide-hero');
					// 	theImage.classList.add('show-hero', 'span-2');
					// }
					// theImage.classList.remove('hide-hero');
					// theImage.classList.add('show-hero');
					// theImage.style.transform = `translateX(-${
					// 	this.currentIndex * 100
					// }%)`;
				}
			}
		});
	}

	removeActiveClass() {
		this._imageList.forEach((image) => {
			image.classList.remove('hero__big', 'span-2', 'show-hero');
			image.classList.add('hero__small', 'hide-hero');

			this.resetChildElementClass(image);
		});
	}

	resetChildElementClass(image) {
		image.querySelector('picture').classList.remove('hero__small--img');
		image.querySelector('picture').classList.add('hero__big--img');
	}

	draggable(slides) {
		slides.forEach((slide, index) => {
			const slideImage = slide.querySelector('img');
			slideImage.addEventListener('dragstart', (e) => e.preventDefault());
			slide.addEventListener('touchstart', (e) =>
				this.touchStart(e, index)
			);
			slide.addEventListener('touchend', (e) => this.touchEnd(e));
			slide.addEventListener('touchmove', (e) => this.touchMove(e));
			slide.addEventListener('mousedown', (e) =>
				this.touchStart(e, index)
			);
			slide.addEventListener('mouseup', (e) => this.touchEnd(e));
			slide.addEventListener('mousemove', (e) => this.touchMove(e));
			slide.addEventListener('mouseleave', (e) => this.touchEnd(e));
		});
	}

	getPositionX(event) {
		return event.type.includes('mouse')
			? event.touches[0].pageX
			: event.touches[0].clientX;
	}

	touchStart(event, index) {
		this.currentIndex = index;
		this.startPos = this.getPositionX(event);
		this.isDragging = true;
		this.animationID = requestAnimationFrame(this.animation);
		this.target.classList.add('grabbing');
	}

	touchMove(event) {
		if (this.isDragging) {
			const currentPosition = this.getPositionX(event);
			this.currentTranslate =
				this.prevTranslate + currentPosition - this.startPos;
		}
	}

	touchEnd() {
		cancelAnimationFrame(this.animationID);
		this.isDragging = false;
		const movedBy = this.currentTranslate - this.prevTranslate;

		if (movedBy < -100 && this.currentIndex < this._imageList.length - 1)
			this.currentIndex += 1;
		// scroll to the next image
		this.nextImage();

		if (movedBy > 100 && this.currentIndex > 0) {
			this.currentIndex -= 1;
			this.nextImage();
		}

		this.setPositionByIndex();

		this.target.classList.remove('grabbing');
	}

	animation() {
		const container = document.querySelector('section.hero.grid');
		console.log(container);

		if (container) this.setSliderPosition(container);
		if (this.isDragging) requestAnimationFrame(animation);
	}

	setPositionByIndex() {
		this.currentTranslate = this.currentIndex * -window.innerWidth;
		this.prevTranslate = this.currentTranslate;

		const container = document.querySelector('section.hero.grid');

		if (container) this.setSliderPosition(container);
	}

	setSliderPosition(container) {
		if (container)
			container.style.transform = `translateX(${this.currentTranslate}px)`;
	}
}

export default {
	reviewSlider,
	photoSlider,
	HeroSlider,
	SponsorsSlider,
};

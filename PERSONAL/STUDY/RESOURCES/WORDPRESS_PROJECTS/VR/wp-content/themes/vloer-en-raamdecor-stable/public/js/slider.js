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
				`<button class="dots__dot" data-review="${i}"></button>`
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
};

// PHOTO SLIDER
const photoSlider = () => {
	const photos = document.querySelector('.inspiration__content');
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
					breakpoint: 1441,
					settings: {
						slidesToShow: 3.5,
						slidesToScroll: 1,
						infinite: true,
						dots: true,
					},
				},
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

	// const sponsors = document.querySelector(".support__content");
	// if (sponsors) {
	//   $(".support__content--list").slick({
	//     dots: false,
	//     adaptiveHeight: true,
	//     autoplay: true,
	//     autoplaySpeed: 2000,
	//     slidesToShow: 5,
	//     slidesToScroll: 1,

	//     responsive: [
	//       {
	//         breakpoint: 600,
	//         settings: {
	//           slidesToShow: 2,
	//           slidesToScroll: 1,
	//         },
	//       },
	//       {
	//         breakpoint: 480,
	//         settings: {
	//           slidesToShow: 1,
	//           slidesToScroll: 1,
	//         },
	//       },
	//     ],
	//   });
	// }
};

// HERO IMAGES SLIDER

class HeroSlider {
	_imageList = [];
	_currentImage = 0;
	_nextImageButton = '';

	constructor(currentImageClass) {
		const target = document.querySelector(`.${currentImageClass}`);
		if (target) {
			this._imageList = Array.from(
				document
					.querySelector(`.${currentImageClass}`)
					?.querySelectorAll('article')
			);
			this._nextImageButton = document
				.querySelector(`.${currentImageClass}`)
				?.querySelector('.btn.home-hero-caro');
		} else {
			console.log('No target found');
		}

		this.init();
	}

	init() {
		this.addDatasetIndex();
		if (this._nextImageButton) {
			this._nextImageButton?.addEventListener('click', () => {
				this.nextImage();
			});
		}
	}

	addDatasetIndex() {
		this._imageList.forEach((image, i) => {
			image.dataset.index = i;
		});
	}

	nextImage() {
		this._currentImage =
			this._currentImage === this._imageList.length - 1
				? 0
				: this._currentImage + 1;
		this.changeImage();
	}

	changeImage() {
		this.removeActiveClass();

		this._imageList.forEach((image) => {
			const theImage = this._imageList[this._currentImage];
			if (Number(image.dataset.index) === this._currentImage) {
				theImage.classList.remove('hero__small');
				theImage.classList.add('hero__big', 'span-2');
				if (theImage.classList.contains('hide-hero')) {
					theImage.classList.remove('hide-hero');
					theImage.classList.add('show-hero');
				} else if (theImage.classList.contains('show-hero')) {
					theImage.classList.remove('show-hero');
					theImage.classList.add('hide-hero');
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
}

export default {
	reviewSlider,
	photoSlider,
	HeroSlider,
};

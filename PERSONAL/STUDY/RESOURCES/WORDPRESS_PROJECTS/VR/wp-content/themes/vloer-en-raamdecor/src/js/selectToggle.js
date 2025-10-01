// This script is for the going through the images the user selects
// and displaying them in the image gallery.

export default class Gallery {
	_imageList = [];
	_mainImage = '';
	_mainImageNextButton = '';
	_mainImagePreviousButton = '';
	_imageListNextButton = '';
	_imageListPreviousButton = '';
	_currentImage = 0;

	constructor(mainImage, imagesClass) {
		if (document.querySelector(`.${imagesClass}`)) {
			this._mainImage = document.querySelector(`.${mainImage}`);
			this._imageList = Array.from(
				document
					.querySelector(`.${imagesClass}`)
					?.querySelectorAll('li')
			);
			this._mainImageNextButton = document
				.querySelector('.item__content__left--main-image')
				?.querySelector('.icon.right');
			this._mainImagePreviousButton = document
				.querySelector('.item__content__left--main-image')
				?.querySelector('.icon.left');
			this._imageListNextButton = document
				.querySelector('.related__image--lists')
				?.querySelector('.icon.go-next');
			this._imageListPreviousButton = document
				.querySelector('.related__image--lists')
				?.querySelector('.icon.go-previous');
			this.init();
		}
	}

	init() {
		this.addDatasetIndex();
		this.handleImageClick();
		this._mainImageNextButton?.addEventListener(
			'click',
			this.nextImage.bind(this)
		);
		this._mainImagePreviousButton?.addEventListener(
			'click',
			this.nextImage.bind(this)
		);
		this._imageListNextButton?.addEventListener(
			'click',
			this.nextImage.bind(this)
		);
		this._imageListPreviousButton?.addEventListener(
			'click',
			this.nextImage.bind(this)
		);
	}

	addDatasetIndex() {
		this._imageList?.forEach((el, index) => {
			el.dataset.index = index + 1;
		});
	}

	nextImage(e) {
		const target = e.target?.closest('.icon');

		if (
			target.classList.contains('go-next') ||
			target.classList.contains('right')
		) {
			this._currentImage++;
			if (this._currentImage - 1 === this._imageList.length) {
				this._currentImage = 1;
			}
			this.showImage();
			this.setActiveImage(this._currentImage - 1);
		} else if (
			target.classList.contains('go-previous') ||
			target.classList.contains('left')
		) {
			this._currentImage--;
			if (this._currentImage < 0) {
				this._currentImage = this._imageList.length - 1;
			} else if (this._currentImage === 0) {
				this._currentImage = this._imageList.length;
			}
			this.showImage();
			this.setActiveImage(this._currentImage - 1);
		}
	}

	showImage() {
		let mainImageSrc = this._mainImage.src;
		let currentImage = this._imageList[this._currentImage - 1];
		let currentImageSrc = currentImage.querySelector('img').src;

		mainImageSrc = mainImageSrc.replace('http://localhost:3000/', '');
		currentImageSrc = currentImageSrc.replace('http://localhost:3000/', '');

		if (mainImageSrc !== currentImageSrc) {
			this._mainImage.src = currentImageSrc;
		} else {
			return;
		}
	}

	handleImageClick(e) {
		this._imageList.forEach((el) => {
			el.addEventListener('click', (e) => {
				this.removeActiveImageClass();
				e.target.closest('li').classList.add('active-image');
				this._currentImage = e.target.closest('li').dataset.index;
				this.showImage();
			});
		});
	}

	removeActiveImageClass() {
		this._imageList.forEach((el) => {
			el.classList.remove('active-image');
		});
	}

	setActiveImage(index) {
		this.removeActiveImageClass();
		this._imageList[index].classList.add('active-image');
	}
}

export class Color {
	_colorList = [];
	_currentColor = 0;

	constructor(colorListClass) {
		if (document.querySelector(`.${colorListClass}`)) {
			this._colorList = Array.from(
				document
					.querySelector(`.${colorListClass}`)
					?.querySelectorAll('li')
			);
			this.init();
		}
	}

	init() {
		this.addDatasetIndex();
		this.handleColorClick();
	}

	addDatasetIndex() {
		this._colorList.forEach((el, index) => {
			el.dataset.index = index + 1;
		});
	}

	handleColorClick(e) {
		this._colorList.forEach((el) => {
			el.addEventListener('click', (e) => {
				this.removeActiveColorClass();
				e.target.closest('li').classList.add('active-color');
				this._currentColor = e.target.closest('li').dataset.index;
			});
		});
	}

	removeActiveColorClass() {
		this._colorList.forEach((el) => {
			el.classList.remove('active-color');
		});
	}
}

export class AdvertCard {
	_target = '';
	_targetCloseButton = '';

	constructor(advertCardClass) {
		this._target = document.querySelector(`.${advertCardClass}`);
		if (this._target && localStorage.getItem('hideAdvert')) {
			this._target.remove();
		} else if (this._target) {
			this._targetCloseButton = this._target
				?.querySelector('.close-btn')
				.querySelector('.icon');

			this.init();
		}
	}

	init() {
		this._targetCloseButton.addEventListener(
			'click',
			this.closeAdvertCard.bind(this)
		);
	}

	closeAdvertCard(e) {
		const target = e.target.closest('.icon');

		if (target) {
			target.closest('.advert').remove();
			localStorage.setItem('hideAdvert', 'true');
		}
	}
}

const modal = document.getElementById('myModal');

const img = document.querySelector('.main-image');
const modalImg = document.getElementById('img01');
// var captionText = document.getElementById('caption');
if (img) {
	img.onclick = function () {
		modal.style.display = 'flex';
		modalImg.src = this.src;
		modalImg.alt = this.alt;
		// captionText.innerHTML = this.alt;
	};
}

// When the user clicks on <span> (x), close the modal // that is if and only if we show that :-)
if (modal) {
	modal.onclick = function () {
		img01.className += ' out';
		setTimeout(function () {
			modal.style.display = 'none';
			img01.className = 'modal-content';
		}, 400);
	};
}

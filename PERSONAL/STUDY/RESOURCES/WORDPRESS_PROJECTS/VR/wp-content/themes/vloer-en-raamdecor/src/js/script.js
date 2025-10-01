import Slider from './slider.js';
import Mobile from './navigation.js';
import Input from './inputController.js';
import Dropdown from './dropDown.js';
import { rangeController } from './rangeController.js';
import Galery, { Color, AdvertCard } from './selectToggle.js';
import WooCommerce from './woocommerce.js';
import woocommerce from './woocommerce.js';
import { changeFaqContent } from './polyfill.js';
import './carousel.js';

document.addEventListener('DOMContentLoaded', function () {
	const allScrollItems = document.querySelectorAll(
		'.inspiration__scroller--item'
	);

	allScrollItems?.forEach((item) => {
		item.addEventListener('mouseover', (e) => {
			const currentItem = e.currentTarget;
			allScrollItems.forEach((item) => {
				item.classList.remove('active');
			});
			currentItem.classList.add('active');
		});
	});

	// MobileNavigation
	Mobile.mobileNavHandler();
	Mobile.setActiveOnCurrentPage();

	// Activate the review slider
	Slider.reviewSlider();
	Slider.photoSlider();

	// Activate the input controller
	Input.radioClickHandler();
	Input.searchInputHandler();
	Input.filterBoxHandler();

	// Activate Dropdown functionality
	document.querySelectorAll('.faq__item').forEach((el) => {
		new Dropdown(el);
	});
	const moreInfo = document.querySelector('.more__info.space-borders');
	moreInfo && new Dropdown(moreInfo);

	//  Control the range inputs
	rangeController();

	// Activate the image gallery
	new Galery('main-image', 'related__image--lists');
	new Color('other__colors--lists');
	new Color('colors--lists');
	new AdvertCard('advert');

	const inspirationScrollerItems = document.querySelectorAll(
		'.inspiration__scroller--item'
	);
	const inspirationControls = document.querySelector(
		'.inspiration__controls'
	);

	inspirationScrollerItems.forEach((item, key) => {
		item.addEventListener('mouseover', function () {
			//   inspirationControls.style.display = "none";
		});

		item.addEventListener('mouseout', function () {
			inspirationControls.style.display = 'grid';
		});
	});

	const activeMidSlick = document.querySelector(
		'.slick-slide.slick-active.slick-current'
	);

	activeMidSlick?.classList.add('active');

	document.querySelectorAll('.container').forEach((el) => {
		if (el.innerHTML.trim().length === 0) {
			el.style.margin = '0 ';
		}
	});

	const filterBox = document.querySelector('.filter-box');
	const filterSectionContainer = document.querySelector(
		'.categories__header'
	);

	const stickyFilter = (entries) => {
		const [entry] = entries;
		if (!entry.isIntersecting && entry.rootBounds.top === 0) {
			filterBox?.classList.add('sticky');
		}
	};

	const filterSectionCallback = (entries) => {
		const [entry] = entries;
		if (
			entry.isIntersecting &&
			entry.boundingClientRect.top > 0 &&
			entry.intersectionRatio === 1
		) {
			filterBox?.classList.remove('sticky');
		}
	};

	const filterSectionContainerObserver = new IntersectionObserver(
		filterSectionCallback,
		{
			root: null,
			threshold: [0, 1],
		}
	);

	const filterBoxObserver = new IntersectionObserver(stickyFilter, {
		root: null,
		threshold: 1,
	});
	filterBox && filterBoxObserver.observe(filterBox);
	filterSectionContainer &&
		filterSectionContainerObserver.observe(filterSectionContainer);

	WooCommerce.changeDiscountContent();
	WooCommerce.handleMeterCalculation();
	WooCommerce.handlePackCalculation();
	WooCommerce.changeZoomImage();
	woocommerce.showPriceBreakdown();
	WooCommerce.resizeZoomButton();

	changeFaqContent();

	function hasTouch() {
		return (
			'ontouchstart' in document.documentElement ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0
		);
	}

	if (hasTouch()) {
		try {
			for (var si in document.styleSheets) {
				var styleSheet = document.styleSheets[si];
				if (!styleSheet.rules) continue;

				for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
					if (!styleSheet.rules[ri].selectorText) continue;

					if (styleSheet.rules[ri].selectorText.match(':hover')) {
						styleSheet.deleteRule(ri);
					}
				}
			}
		} catch (ex) {}
	}
});

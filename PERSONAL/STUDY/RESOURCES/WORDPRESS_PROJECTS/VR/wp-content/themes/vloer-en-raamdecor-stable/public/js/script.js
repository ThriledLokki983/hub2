import Slider from './slider.js';
import Mobile from './navigation.js';
import Input from './inputController.js';
import Dropdown from './dropDown.js';
import { rangeController } from './rangeController.js';
import Galery, { Color, AdvertCard } from './selectToggle.js';
import WooCommerce from './woocommerce.js';

// load script once the page is loaded
document.addEventListener('DOMContentLoaded', function () {
	// MObileNavigation
	Mobile.mobileNavHandler();
	Mobile.setActiveOnCurrentPage();

	// Activate the review slider
	Slider.reviewSlider();
	Slider.photoSlider();
	new Slider.HeroSlider('hero.grid.size'); // check this bcos it stop working

	// Activate the input controller
	Input.radioClickHandler();
	Input.searchInputHandler();

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
		".slick-slide.slick-active[data-slick-index='2']"
	);

	// set hover to active on this item
	activeMidSlick?.classList.add('active-mid');

	document.querySelectorAll('.slick-slide.slick-active').forEach((el) => {
		el.addEventListener('mouseenter', (e) => {
			document
				.querySelectorAll('.slick-slide.slick-active')
				.forEach((el) => {
					el.classList.remove('active-mid');
				});
		});

		el.addEventListener('mouseleave', (e) => {
			activeMidSlick.classList.add('active-mid');
		});
	});

	// select all sections.container and check if no content inside then hide the section
	document.querySelectorAll('.container').forEach((el) => {
		if (el.innerHTML.trim().length === 0) {
			el.style.margin = '0 ';
		}
	});

	// Activate the woocommerce functionality
	WooCommerce.changeDiscountContent();
	WooCommerce.handleMeterCalculation();
	WooCommerce.handlePackCalculation();
});

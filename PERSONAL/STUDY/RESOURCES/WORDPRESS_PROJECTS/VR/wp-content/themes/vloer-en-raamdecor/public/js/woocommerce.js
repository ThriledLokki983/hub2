function input_delay(fn, ms) {
	let timer = 0;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(fn.bind(this, ...args), ms || 0)
	}
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

const changeDiscountContent = () => {
	if (document.querySelector('.single-product')) return;

	const allOnsale = Array.from(document.querySelectorAll('span.onsale'));

	allOnsale?.forEach((productElement) => {
		productElement.innerHTML = `<span>actie prijs</span><span>50%</span><span>korting</span>`;
	});
};

const handleMeterCalculation = () => {
	document
		?.querySelector('#m-square')
		?.addEventListener('keyup', input_delay(function (e) {
			// let packets = Number(document.querySelector("#packets").value);
			// if (packets) {
			let formData = new FormData();

			formData.append(
				'action',
				'vr_ajax_calculate_price_by_square_meters'
			);
			formData.append(
				'productId',
				document.querySelector('#productId').value
			);
			formData.append('squareMeters', Number(e.target.value));

			fetch('/wp-admin/admin-ajax.php', {
				method: 'POST',
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					const totalPriceText = document.querySelector('.total-price-text');
					if (data?.totalPrice !== undefined && window.getComputedStyle(totalPriceText).display === 'none') {
						totalPriceText.style.display = "block";
					}

					document.querySelector(
						'#automatic-calculation-text'
					).innerHTML = data.message;
					document.querySelector('#total-price').textContent =
						'€ ' + data.totalPrice.toFixed(2).toString().replace(".", ",");
					document.querySelector('#packs').value = data.packsCount;
				})
				.catch((err) => console.log(err));
		}),500);
};

const handlePackCalculation = () => {
	document?.querySelector('#packs')?.addEventListener('keyup', input_delay(function (e) {
		// let packets = Number(document.querySelector("#packets").value);
		// if (packets) {
		let formData = new FormData();

		formData.append('action', 'vr_ajax_calculate_price_by_number_of_packs');
		formData.append(
			'productId',
			document.querySelector('#productId').value
		);
		formData.append('packsCount', Number(e.target.value));

		fetch('/wp-admin/admin-ajax.php', {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				const totalPriceText = document.querySelector('.total-price-text');
				if (data?.totalPrice !== undefined && window.getComputedStyle(totalPriceText).display === 'none') {
					totalPriceText.style.display = "block";
				}

				document.querySelector(
					'#automatic-calculation-text'
				).innerHTML = data.message;
				document.querySelector('#total-price').textContent =
					'€ ' + data.totalPrice.toFixed(2).toString().replace(".", ",");
				document.querySelector('#m-square').value = data.squareMeters;
			})
			.catch((err) => console.log(err));
		// }
	}),500);
};

const changeZoomImage = () => {
	const trigger = document.querySelector(
		'.woocommerce-product-gallery__trigger'
	);

	const zoomImage =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.3 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M319.8 204v8c0 6.6-5.4 12-12 12h-84v84c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12v-84h-84c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h84v-84c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12zm188.5 293L497 508.3c-4.7 4.7-12.3 4.7-17 0l-129-129c-2.3-2.3-3.5-5.3-3.5-8.5v-8.5C310.6 395.7 261.7 416 208 416 93.8 416 1.5 324.9 0 210.7-1.5 93.7 93.7-1.5 210.7 0 324.9 1.5 416 93.8 416 208c0 53.7-20.3 102.6-53.7 139.5h8.5c3.2 0 6.2 1.3 8.5 3.5l129 129c4.7 4.7 4.7 12.3 0 17zM384 208c0-97.3-78.7-176-176-176S32 110.7 32 208s78.7 176 176 176 176-78.7 176-176z"/></svg>';

	if (trigger) {
		const image = trigger.querySelector('img');
		trigger.style.backgroundColor = 'transparent';

		image.remove();

		trigger.innerHTML = zoomImage;
	} else {
		const parent = document.querySelector('.woocommerce-product-gallery');

		if (parent) {
			const anchor = document.createElement('a');
			anchor.classList.add('woocommerce-product-gallery__trigger');
			anchor.innerHTML = zoomImage;
			anchor.href = 'javascript:void();';

			parent.appendChild(anchor);
		}
	}
};

const showPriceBreakdown = () => {
	const breakDownContainer = document.querySelector(
		'.calculate__price--content'
	);

	const rightContent = breakDownContainer?.querySelector('.right');

	if (rightContent) {
		if (rightContent.querySelector('p').innerText === '') {
			rightContent.remove();
			breakDownContainer.classList.add('no-breakdown');
		}
	}
};

const resizeZoomButton = () => {
	const zoomButton = document.querySelector('.woocommerce-product-gallery__trigger');
	const productImage = document.querySelector('.attachment-shop_single.size-shop_single.wp-post-image');
	const offsetTop = '54px';


	const resize = () => {
		let height = productImage.clientHeight;
		console.log('calc', `calc(${height}px - ${offsetTop}) !important`);
		zoomButton.style.setProperty('top', `calc(${(height.toString())}px - ${offsetTop})`, 'important');

		console.log('top', zoomButton.offsetTop);
	}

	resize();

	window.addEventListener('resize', resize, true);
}

export default {
	changeDiscountContent,
	handleMeterCalculation,
	handlePackCalculation,
	changeZoomImage,
	showPriceBreakdown,
	resizeZoomButton
};

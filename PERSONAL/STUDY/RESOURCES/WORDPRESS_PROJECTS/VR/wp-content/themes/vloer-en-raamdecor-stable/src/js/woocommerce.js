// Example POST method implementation:
async function postData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
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
	document.querySelector('#m-square').addEventListener('keyup', function(e) {
		// let packets = Number(document.querySelector("#packets").value);
		// if (packets) {
		let formData = new FormData();

		formData.append( 'action', 'vr_ajax_calculate_price_by_square_meters' );
		formData.append( 'productId', document.querySelector('#productId').value );
		formData.append( 'squareMeters', Number(e.target.value) );

		fetch( '/wp-admin/admin-ajax.php', {
			method: 'POST',
			body: formData,
		} )
			.then( res => res.json() )
			.then( data => {
					document.querySelector('#automatic-calculation-text').innerHTML = data.message;
					document.querySelector('#total-price').textContent = '€ ' + data.totalPrice;
					document.querySelector('#packs').value = data.packsCount;
				}
			)
			.catch( err => console.log( err ) );
		// }
	});
}

const handlePackCalculation = () => {
	document.querySelector('#packs').addEventListener('keyup', function(e) {
		// let packets = Number(document.querySelector("#packets").value);
		// if (packets) {
		let formData = new FormData();

		formData.append( 'action', 'vr_ajax_calculate_price_by_number_of_packs' );
		formData.append( 'productId', document.querySelector('#productId').value );
		formData.append( 'packsCount', Number(e.target.value) );

		fetch( '/wp-admin/admin-ajax.php', {
			method: 'POST',
			body: formData,
		} )
			.then( res => res.json() )
			.then( data => {
					document.querySelector('#automatic-calculation-text').innerHTML = data.message;
					document.querySelector('#total-price').textContent = '€ ' + data.totalPrice;
					document.querySelector('#m-square').value = data.squareMeters;
				}
			)
			.catch( err => console.log( err ) );
		// }
	});
}

export default {
	changeDiscountContent,
	handleMeterCalculation,
	handlePackCalculation
};

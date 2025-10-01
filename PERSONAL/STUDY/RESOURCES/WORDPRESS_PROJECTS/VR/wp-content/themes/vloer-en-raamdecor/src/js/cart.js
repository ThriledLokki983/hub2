/**
 * Anything Javascript related to the related to the cart.html page goes here.
 */

export class DeleteProduct {
	_productList = [];
	_productListContainer = document.querySelector('.details__lists');
	_deleteAllButton = document.querySelector('div.reload');

	constructor(productListClass = 'form__group') {
		const target = document.querySelector(`.${productListClass}`);

		if (target) {
			this._productList = Array.from(
				document.querySelectorAll(`.${productListClass}`)
			);

			this.init();
		}
	}

	init() {
		this.deleteProduct();
		this.deleteAllProducts();
	}

	deleteProduct() {
		this._productList.forEach((product) => {
			product.addEventListener('click', (e) => {
				const target = e.target.closest('svg.icon');
				this.deleteItem(target);
			});
		});
	}

	deleteAllProducts() {
		this._deleteAllButton?.addEventListener('click', () => {
			this._productList.forEach((product) => {
				const target = product.closest('.details__lists--item');
				this.deleteItem(target);
			});
			this.showNoProductsAvailable();
		});
	}

	deleteItem(item) {
		item?.closest('li')?.remove();
	}

	showNoProductsAvailable() {
		this.removeNoProductsMessage();

		const message = `<p class="no-products">No products available</p>`;
		this._productListContainer.insertAdjacentHTML('afterend', message);
	}

	removeNoProductsMessage() {
		const noProductMessage = Array.from(
			document.querySelectorAll('.no-products')
		);

		if (noProductMessage.length > 0) {
			noProductMessage.forEach((message) => {
				message.remove();
			});
		}
	}

	reCalculateTotal() {
		// TODO - re-calculate total
	}
}

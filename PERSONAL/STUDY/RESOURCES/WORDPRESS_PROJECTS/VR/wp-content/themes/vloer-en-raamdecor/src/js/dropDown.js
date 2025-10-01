export default class DropDown {
	_faqElement = ".faq__item";

	constructor(el) {
		this.el = el;
		this.summary = el.querySelector("summary");
		this.content = el.querySelector("p");

		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.summary.addEventListener("click", (e) => this.onClick(e));
	}

	onClick(e) {
		e.preventDefault();
		this.closeAll(this.el);

		this.el.style.overflow = "hidden";
		if (this.isClosing || !this.el.open) {
			this.open();
		} else if (this.isExpanding || this.el.open) {
			this.shrink();
		}
	}

	closeAll = (openDetails) => {
		let list = document.querySelectorAll(this._faqElement);
		for (var item of list)
			if (item != openDetails) item.removeAttribute("open");
	};

	closeAllOpen() {
		const elementList = document.querySelectorAll(this._faqElement);

		elementList.forEach((item) => {
			item.removeAttribute("open");
		});
	}

	shrink() {
		this.isClosing = true;

		const startHeight = `${this.el.offsetHeight}px`;

		const endHeight = `${this.summary.offsetHeight}px`;

		if (this.animation) {
			this.animation.cancel();
		}

		this.animation = this.el.animate(
			{
				height: [startHeight, endHeight],
			},
			{
				duration: 250,
				easing: "ease-out",
			}
		);

		this.animation.onfinish = () => this.onAnimationFinish(false);
		this.animation.oncancel = () => (this.isClosing = false);
	}

	open() {
		this.el.style.height = `${this.el.offsetHeight}px`;
		this.el.open = true;
		window.requestAnimationFrame(() => this.expand());
	}

	expand() {
		this.isExpanding = true;
		const startHeight = `${this.el.offsetHeight}px`;
		const endHeight = `${
			this.summary.offsetHeight + this.content.offsetHeight
		}px`;

		if (this.animation) {
			this.animation.cancel();
		}

		this.animation = this.el.animate(
			{
				height: [startHeight, endHeight],
			},
			{
				duration: 250,
				easing: "ease-out",
			}
		);
		this.animation.onfinish = () => this.onAnimationFinish(true);
		this.animation.oncancel = () => (this.isExpanding = false);
	}

	onAnimationFinish(open) {
		this.el.open = open;
		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.el.style.height = this.el.style.overflow = "";
	}
}

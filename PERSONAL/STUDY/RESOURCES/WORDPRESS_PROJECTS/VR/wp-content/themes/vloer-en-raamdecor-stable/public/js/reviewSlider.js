// REVIEW SLIDER
export default () => {
	const reviews = document.querySelectorAll(".review-item");
	const dotContainer = document.querySelector(".dots");

	let currentReview = 0;
	const maxSlide = reviews.length;

	reviews.forEach((rev, i) => {
		rev.setAttribute("data-review", i);
	});

	// function for the dots
	const createDots = () => {
		reviews.forEach(function (_, i) {
			dotContainer?.insertAdjacentHTML(
				"beforeend",
				`<button class="dots__dot" data-review="${i}"></button>`
			);
		});
	};

	// Function to make the current review correspond to a dot with an active class
	const activateDot = function (review) {
		document
			.querySelectorAll(".dots__dot")
			.forEach((dot) => dot.classList.remove("active"));

		document
			.querySelector(`.dots__dot[data-review="${review}"]`)
			?.classList.add("active");
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

	document.addEventListener("keydown", function (e) {
		if (e.key === "ArrowLeft") prevSlide();
		e.key === "ArrowRight" && nextSlide();
	});

	// Add event handlers to all the dots
	dotContainer?.addEventListener("click", (e) => {
		if (e.target.classList.contains("dots__dot")) {
			const { review } = e.target.dataset;
			goToReview(review);
			activateDot(review);
		}
	});
};

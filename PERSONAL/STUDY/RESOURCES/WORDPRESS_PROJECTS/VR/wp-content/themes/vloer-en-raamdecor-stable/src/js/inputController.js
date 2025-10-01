const radioClickHandler = () => {
	Array.from(document.querySelectorAll('input[type="radio"]'))?.forEach(
		(radioInput) => {
			const radioLabel = radioInput?.nextElementSibling;

			if (radioLabel) {
				radioLabel.addEventListener("click", () => {
					if (radioInput.getAttribute("checked") !== null) {
						radioInput.removeAttribute("checked");
					} else {
						radioInput.setAttribute("checked", "");
					}
				});
			}
		}
	);
};

const searchInputHandler = () => {
	const searchInput = document.querySelector(".moduleo-search.input");
	const resultsArea = document.querySelector(".form__group--results");
	let inputValue = "";

	if (searchInput) {
		searchInput.addEventListener("change", (event) => {
			inputValue = event.target.value;
			const html = `
           <li class="results-li">
                <span class="form__group--results-item">${inputValue} </span>
                <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"/>
                </svg>
           </li>
            `;
			resultsArea.insertAdjacentHTML("afterbegin", html);
			searchInput.value = "";
			handleCloseIcon();
		});
	}
};

const handleCloseIcon = () => {
	const closeIcons = Array.from(
		document.querySelectorAll(".results-li svg.close-icon")
	);
	closeIcons?.forEach((closeIcon) => {
		closeIcon.addEventListener("click", () => {
			closeIcon.parentElement.remove();
		});
	});
};

// Export all functions
export default {
	radioClickHandler,
	searchInputHandler,
};

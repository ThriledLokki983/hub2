// A function that will take an id and a content and renders it
class Renderer {
	constructor() {}

	render(id: string, content: string) {
		const container = document.getElementById(id);

		if (!container) {
			console.error(`Element with id "${id}" not found.`);
			return;
		}

		container.innerHTML = content;
	}

	renderWithEvent(id: string, content: string, event: string, callback: EventListener) {
		const container = document.getElementById(id);

		if (!container) {
			console.error(`Element with id "${id}" not found.`);
			return;
		}

		container.innerHTML = content;

		const element = document.getElementById(id);

		if (!element) {
			console.error(`Element with id "${id}" not found.`);
			return;
		}

		element.addEventListener(event, callback);
	}

	clear(id: string) {
		const container = document.querySelector(`#${id}`);

		if (!container) {
			console.error(`Element with id "${id}" not found.`);
			return;
		}

		container.innerHTML = '';
	}
};

export default Renderer;
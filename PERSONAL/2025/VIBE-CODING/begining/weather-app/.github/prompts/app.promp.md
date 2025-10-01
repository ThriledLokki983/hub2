# Instructions for Building a Weather App

1. **Set Up the Project**
	- Create a new project in this directory.
	- Initialize the project with a package manager (e.g., `npm init` for Node.js).

2. **Choose a Tech Stack**
	- Frontend: HTML, CSS, JavaScript (or frameworks like React, Vue, or Angular).
	- Backend (optional): Node.js, Express, or any backend framework.
	- API: Use a weather API like OpenWeatherMap or Weatherstack.

3. **Set Up with React, Vite, and Tailwind CSS**
	- Create a new React project using Vite:
		```bash
		yarn create vite weather-app --template react
		cd weather-app
		```
	- Install dependencies:
		```bash
		npm install
		```
	- Set up Tailwind CSS by following the [official Tailwind + Vite guide](https://tailwindcss.com/docs/guides/vite):
		```bash
		npm install -D tailwindcss postcss autoprefixer
		npx tailwindcss init -p
		```
	- Configure `tailwind.config.js` and add Tailwind directives to your `src/index.css`.

4. **Obtain an API Key**
	- Sign up for a weather API service (e.g., OpenWeatherMap).
	- Generate and securely store your API key (consider using environment variables).

5. **Design the User Interface**
	- Build your UI with React components.
	- Use Tailwind CSS utility classes for styling.
	- Include input fields for location and a section to display weather data.

6. **Fetch Weather Data**
	- Use `fetch` or `axios` within React components to call the weather API.
	- Parse and display weather data (e.g., temperature, humidity, conditions) in your components.

7. **Add Features**
	- Enable location-based weather using the browser's geolocation API.
	- Add error handling for invalid inputs or API failures.
	- Display additional data like forecasts or weather icons.

8. **Test the App**
	- Test the app on different devices and browsers.
	- Validate API responses and ensure proper error handling.

9. **Run the App Locally**
	- Start the development server:
		```bash
		npm run dev
		```
	- Ensure all features work as expected.

10. **Iterate and Improve**
	 - Gather user feedback.
	 - Add new features like dark mode (using Tailwind) or unit conversion (Celsius/Fahrenheit).

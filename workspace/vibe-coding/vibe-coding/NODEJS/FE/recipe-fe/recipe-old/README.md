# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)
for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

Design a high-end, elegant ghanaina recipe app. Use the colors attached also

The app should feel like it was crafted by a world-class designer, award-winning
design: ultra-clean layout, with some kente feel and sophisticated typography
(Inter or Neue Haas Grotesk). Use a thinner boldness and -4 letter spacing.

Use a refined, modern color palette: the pallete attached, Clean white text and
cosmic/futuristic colors like galaxy greys, oranges and no harsh contrasts. do
not use any style framework or any ui library also

these will; be the colors to use Emeraled Green: #317039 (RGB: 49, 112, 57)
Maximum Yellow: #F8E49 (RGB: 241, 190, 73) Antique White: #F8EDD9 (RGB: 248,
237, 217) Dark Pastel Red: #CC4B24 (RGB: 204, 75, 36) Papaya Whip: #FFFD4 (RGB:
255, 253, 212) Cosmic Latte: #FF8EB (RGB: 255, 251, 235)

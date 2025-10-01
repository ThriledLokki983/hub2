module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", {
      args: "none",
    }],
    "react/display-name": "off",
    "react/no-unknown-property": "off",
    "react/no-unescaped-entities": ["error", {
      "forbid": [
        {
          char: "<",
          alternatives: ["&lt;"]
        },
        {
          char: ">",
          alternatives: ["&gt;"]
        },
        {
          char: "{",
          alternatives: ["&#123;"]
        },
        {
          char: "}",
          alternatives: ["&#125;"]
        },
      ],
    }],
  },
};

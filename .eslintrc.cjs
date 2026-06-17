module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ["airbnb-typescript-prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "no-alert": "off",
  },
  ignorePatterns: ["build", "node_modules", "vite.config.ts"],
};

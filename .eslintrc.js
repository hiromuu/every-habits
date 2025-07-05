module.exports = {
  extends: ["expo", "@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jsdoc", "prettier"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "prettier/prettier": "error",
    "jsdoc/require-jsdoc": [
      "warn",
      {
        publicOnly: true,
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns-type": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};

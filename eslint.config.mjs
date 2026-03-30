import stylistic from "@stylistic/eslint-plugin"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"

export default [
  {
    languageOptions: { parser, parserOptions: { ecmaVersion: 2022, project: "./tsconfig.json" } },
    files: ["**/*.ts"],
    ignores: ["./src/types/**/*.ts", "./src/paypalTypes/**/*.ts", "./src/__tests__/**/*.ts", "./src/sdk/firefly/**/*.ts"],
    plugins: { "@typescript-eslint": typescriptPlugin, "@stylistic/js": stylistic, "@stylistic/ts": stylistic },
    settings: {
      "import/resolver": {
        node: {
          extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
          ],
        },
      },
    },
    rules: {
      "arrow-body-style": ["error", "as-needed"],
      "object-shorthand": ["error", "always"],
      "prefer-destructuring": [
        "error",
        { array: true, object: true },
        {},
      ],
      "prefer-template": "error",
      "no-useless-concat": "error",
      "@stylistic/js/quotes": ["error", "double"],
      "consistent-return": "off",
      "no-console": "error",
      "no-param-reassign": [
        "error",
        { props: true, ignorePropertyModificationsForRegex: [".*"] },
      ],
      "@stylistic/js/lines-between-class-members": ["error", "always"],
      "@stylistic/js/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: [
            "export",
            "class",
            "default",
            "function",
          ],
          next: [
            "export",
            "class",
            "default",
            "function",
          ],
        },
      ],
      // Linebreaks
      "no-underscore-dangle": [
        "error",
        { allowAfterThis: true, allow: ["_id"] },
      ],
    },
  },
  {
    languageOptions: { parser, parserOptions: { ecmaVersion: 2022, project: "./tsconfig.test.json" } },
    files: ["src/__tests__/**/*.ts"],
    plugins: { "@typescript-eslint": typescriptPlugin, "@stylistic/js": stylistic, "@stylistic/ts": stylistic },
    rules: {
      "@stylistic/js/quotes": ["error", "double"],
      "prefer-template": "error",
      "no-useless-concat": "error",
    },
  },
]

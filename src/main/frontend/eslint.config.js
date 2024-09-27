import globals from "globals"
import pluginJs from "@eslint/js"
import pluginTs from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import tailwind from "eslint-plugin-tailwindcss"
import stylistic from "@stylistic/eslint-plugin"

export default [
  stylistic.configs["recommended-flat"],
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      "@stylistic/quotes": ["error", "double"],
      "indent": ["error", 2],
      "react/jsx-sort-props": [1],
      "react/react-in-jsx-scope": 0,
      "react/prop-types": [0],
      // "sort-keys": ["error", "asc"],
    },
  },
  ...pluginTs.configs.recommended,
  ...tailwind.configs["flat/recommended"],
]

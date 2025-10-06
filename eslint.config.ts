import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "prefer-const": "off",
      "no-var": "off",
      // Disable the most common React rule; add more as needed
      "react/react-in-jsx-scope": "off",
      // Optionally, disable all react rules:
      // ...Object.fromEntries(
      //   Object.keys(pluginReact.rules).map((rule) => [`react/${rule}`, "off"])
      // )
    }
  },
]);
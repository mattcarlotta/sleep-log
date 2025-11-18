import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig({ ignores: ["dist"] }, js.configs.recommended, ...tseslint.configs.recommended, {
    files: ["**/*.{ts,tsx}"],
    plugins: {
        "@typescript-eslint": tseslint.plugin,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh
    },
    languageOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname
        }
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
    }
});

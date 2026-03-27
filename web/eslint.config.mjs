import nextEslintPluginNext from "@next/eslint-plugin-next";
import nx from "@nx/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import baseConfig from "../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      ...reactPlugin.configs.flat.recommended.settings,
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ...reactPlugin.configs.flat["jsx-runtime"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@next/next": nextEslintPluginNext,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      next: {
        rootDir: ["web"],
      },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextEslintPluginNext.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  ...nx.configs["flat/react-typescript"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    ignores: [".next/**/*", "next-env.d.ts"],
  },
];

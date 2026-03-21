import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores (flat config ignores are per-entry unless specified here)
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "next-env.d.ts",
    ],
  },

  // Base Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      prettier: eslintPluginPrettier,
      "unused-imports": eslintPluginUnusedImports,
    },

    rules: {
      // 🧹 Remove imports não usados
      "unused-imports/no-unused-imports": "error",

      // ⚠️ Marca variáveis não usadas (mas permite _prefixadas)
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      // 💅 Integração com Prettier
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
          singleQuote: true,
          semi: true,
          tabWidth: 2,
        },
      ],
    },
  },
];

export default eslintConfig;

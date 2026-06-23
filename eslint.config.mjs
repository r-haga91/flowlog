import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

const config = [
  { ignores: [".next/**", ".next-build/**", "node_modules/**", "public/sw*.js", "public/workbox-*.js", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { rules: { "react-hooks/set-state-in-effect": "off", "react-hooks/incompatible-library": "off" } },
];

export default config;

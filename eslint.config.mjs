import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", ".tabibdesk-ref/**"],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;

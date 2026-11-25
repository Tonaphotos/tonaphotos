import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const staticExportServesPrebuiltSrcsets = {
  rules: { "@next/next/no-img-element": "off" },
};

const mountEffectRunsOnceByDesign = {
  files: ["app/hooks/useMountEffect.ts"],
  rules: { "react-hooks/exhaustive-deps": "off" },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  staticExportServesPrebuiltSrcsets,
  mountEffectRunsOnceByDesign,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "studio/**", ".wrangler/**"]),
]);

export default eslintConfig;

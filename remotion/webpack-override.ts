import { WebpackOverrideFn } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

export const webpackOverride: WebpackOverrideFn = (currentConfig) => {
  return enableTailwind(currentConfig);
};

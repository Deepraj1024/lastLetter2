import type { CnOptions } from "tailwind-variants";
import { cnMerge as twcn } from "tailwind-variants";

export function cn(...args: CnOptions) {
  return twcn(args)({
    twMerge: true,
    twMergeConfig: {
      classGroups: {
        opacity: [{ opacity: ["disabled"] }],
      },
    },
  });
}

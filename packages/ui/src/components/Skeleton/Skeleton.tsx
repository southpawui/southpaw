/* ============================================================
 * Skeleton: server-safe entry (GEO-972)
 *
 * The parts live in ./Skeleton.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Skeleton.Text>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import * as React from "react";
import {
  SkeletonAvatar,
  SkeletonButton,
  SkeletonGroup,
  SkeletonImage,
  SkeletonInput,
  SkeletonRoot,
  SkeletonText,
} from "./Skeleton.parts";

export type * from "./Skeleton.parts";

/** A server-safe stand-in for the root, so `<Skeleton>` and `<Skeleton.Text>` both work. */
function SkeletonComponent(props: React.ComponentProps<typeof SkeletonRoot>) {
  return <SkeletonRoot {...props} />;
}
SkeletonComponent.displayName = "Skeleton";

export const Skeleton: typeof SkeletonComponent & {
  Text: typeof SkeletonText;
  Avatar: typeof SkeletonAvatar;
  Button: typeof SkeletonButton;
  Input: typeof SkeletonInput;
  Image: typeof SkeletonImage;
  Group: typeof SkeletonGroup;
} = Object.assign(SkeletonComponent, {
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Input: SkeletonInput,
  Image: SkeletonImage,
  Group: SkeletonGroup,
});

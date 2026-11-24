/* ============================================================
 * Avatar: server-safe entry (GEO-972)
 *
 * The parts live in ./Avatar.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Avatar.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import { AvatarFallback, AvatarGroup, AvatarImage, AvatarRoot, AvatarStatus } from "./Avatar.parts";

export type * from "./Avatar.parts";

export const Avatar: {
  Root: typeof AvatarRoot;
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
  Status: typeof AvatarStatus;
  Group: typeof AvatarGroup;
} = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Status: AvatarStatus,
  Group: AvatarGroup,
};

/* ============================================================
 * NavigationMenu: server-safe entry (GEO-972)
 *
 * The parts live in ./NavigationMenu.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<NavigationMenu.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  NavigationMenuContent,
  NavigationMenuFooter,
  NavigationMenuGroup,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from "./NavigationMenu.parts";

export type * from "./NavigationMenu.parts";

export const NavigationMenu: {
  Root: typeof NavigationMenuRoot;
  List: typeof NavigationMenuList;
  Item: typeof NavigationMenuItem;
  Trigger: typeof NavigationMenuTrigger;
  Content: typeof NavigationMenuContent;
  Link: typeof NavigationMenuLink;
  Group: typeof NavigationMenuGroup;
  Footer: typeof NavigationMenuFooter;
} = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Group: NavigationMenuGroup,
  Footer: NavigationMenuFooter,
};

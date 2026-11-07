import * as React from "react";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { cn } from "../../lib/cn";

export type MenubarProps = React.ComponentProps<typeof BaseMenubar>;

export const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseMenubar
        ref={ref}
        data-slot="menubar"
        className={cn(
          "flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1 shadow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);

Menubar.displayName = "Menubar";

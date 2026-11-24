"use client";

import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";

export type FormProps = React.ComponentProps<typeof BaseForm>;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(({ className, ...props }, ref) => {
  return (
    <BaseForm
      ref={ref}
      data-slot="form"
      className={mergeClassName(cn("space-y-4"), className)}
      {...props}
    />
  );
});

Form.displayName = "Form";

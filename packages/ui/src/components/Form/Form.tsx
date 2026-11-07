import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "../../lib/cn";

export type FormProps = React.ComponentProps<typeof BaseForm>;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(({ className, ...props }, ref) => {
  return <BaseForm ref={ref} data-slot="form" className={cn("space-y-4", className)} {...props} />;
});

Form.displayName = "Form";

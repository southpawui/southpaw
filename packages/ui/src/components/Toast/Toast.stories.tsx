import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CopyIcon } from "@phosphor-icons/react";
import {
  Toast,
  createToaster,
  toast,
  type ToastAppearance,
  type ToastOptions,
  type ToastPosition,
  type ToastType,
} from "./Toast";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Toast",
};

export default meta;
type Story = StoryObj;

const TYPES: ToastType[] = ["neutral", "info", "success", "warning", "danger", "loading"];

const COPY: Record<ToastType, { title: string; description: string }> = {
  neutral: { title: "Draft saved", description: "Last edited just now." },
  info: { title: "Update available", description: "Version 2.4 is ready to install." },
  success: { title: "Payment sent", description: "£240.00 to Acme Ltd." },
  warning: { title: "Storage almost full", description: "You have 200 MB left." },
  danger: { title: "Upload failed", description: "The file is larger than 10 MB." },
  loading: { title: "Uploading report.pdf", description: "This can take a minute." },
};

type ToastFn = ReturnType<typeof createToaster>["toast"];

function show(t: ToastFn, type: ToastType, options?: ToastOptions & { title?: string }) {
  const { title = COPY[type].title, ...rest } = options ?? {};
  const opts = { description: COPY[type].description, ...rest };
  switch (type) {
    case "info":
      return t.info(title, opts);
    case "success":
      return t.success(title, opts);
    case "warning":
      return t.warning(title, opts);
    case "danger":
      return t.error(title, opts);
    case "loading":
      return t.loading(title, opts);
    default:
      return t(title, opts);
  }
}

/* ------------------------------------------------------------
 * Static gallery — toasts rendered in place (not portalled, never dismissed)
 * so States / Density / Themes can show every combination at once.
 * ------------------------------------------------------------ */

interface Spec {
  type: ToastType;
  options?: ToastOptions & { title?: string };
}

function StaticList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => <Toast.Item key={t.id} toast={t} />);
}

function StaticToasts({
  specs,
  label,
  appearance,
  density,
}: {
  specs: Spec[];
  label: string;
  appearance?: ToastAppearance;
  density?: "compact" | "default" | "comfortable";
}) {
  const [toaster] = React.useState(createToaster);
  React.useEffect(() => {
    // Newest renders first, so add in reverse to keep the spec order.
    [...specs].reverse().forEach((spec, i) => {
      show(toaster.toast, spec.type, {
        timeout: 0,
        priority: "low",
        ...spec.options,
        id: `${label}-${specs.length - 1 - i}`,
      });
    });
  }, [specs, label, toaster]);
  return (
    <Toast.Provider toastManager={toaster.manager} limit={50}>
      <Toast.Viewport
        expand
        position="top-left"
        appearance={appearance}
        density={density}
        aria-label={label}
        className="static z-auto w-full sm:w-full"
      >
        <StaticList />
      </Toast.Viewport>
    </Toast.Provider>
  );
}

const ALL_TYPES: Spec[] = TYPES.map((type) => ({ type }));

const RICH: Spec[] = [
  {
    type: "danger",
    options: { action: { label: "Retry" }, cancel: { label: "Cancel" } },
  },
  {
    type: "success",
    options: {
      title: "Message archived",
      description: "Moved to Archive.",
      action: { label: "Undo" },
    },
  },
  {
    type: "info",
    options: {
      title: "New sign-in",
      description: "Chrome on macOS, London.",
      caption: "Today at 09:41",
    },
  },
  { type: "neutral", options: { title: "Title only", description: undefined } },
];

/* ------------------------------------------------------------
 * Default — mount <Toast.Toaster /> once, call toast.*() anywhere
 * ------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toast.Toaster />
      {TYPES.map((type) => (
        <Button key={type} variant="outline" onClick={() => show(toast, type)}>
          {type}
        </Button>
      ))}
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Dismiss all
      </Button>
    </div>
  ),
};

/* ------------------------------------------------------------
 * States — every type, both appearances, plus actions / caption
 * ------------------------------------------------------------ */

export const States: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="sm:max-w-md">
        <h3 className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          Subtle (default)
        </h3>
        <StaticToasts specs={ALL_TYPES} label="Subtle toasts" />
      </section>
      <section className="sm:max-w-md">
        <h3 className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">Solid</h3>
        <StaticToasts specs={ALL_TYPES} label="Solid toasts" appearance="solid" />
      </section>
      <section className="sm:max-w-md">
        <h3 className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          Action, cancel, caption
        </h3>
        <StaticToasts specs={RICH} label="Rich subtle toasts" />
      </section>
      <section className="sm:max-w-md">
        <h3 className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          Action, cancel, caption (solid)
        </h3>
        <StaticToasts specs={RICH} label="Rich solid toasts" appearance="solid" />
      </section>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Positions — six positions; swipe direction follows the edge
 * ------------------------------------------------------------ */

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function PositionsDemo() {
  const [toaster] = React.useState(createToaster);
  const [position, setPosition] = React.useState<ToastPosition>("bottom-right");
  return (
    <div className="grid grid-cols-3 gap-2 sm:max-w-md">
      <Toast.Toaster toastManager={toaster.manager} position={position} />
      {POSITIONS.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === position ? "solid" : "outline"}
          aria-pressed={p === position}
          onClick={() => {
            toaster.toast.dismiss();
            setPosition(p);
            toaster.toast.success(`Shown ${p.replace("-", " ")}`, {
              description: "Swipe it towards the edge to dismiss.",
            });
          }}
        >
          {p}
        </Button>
      ))}
    </div>
  );
}

export const Positions: Story = { render: () => <PositionsDemo /> };

/* ------------------------------------------------------------
 * Stacking — collapsed stack (default) vs expand
 * ------------------------------------------------------------ */

function StackingDemo() {
  const [toaster] = React.useState(createToaster);
  const [expand, setExpand] = React.useState(false);
  const count = React.useRef(0);
  return (
    <div className="flex flex-wrap gap-2">
      <Toast.Toaster toastManager={toaster.manager} expand={expand} />
      <Button
        variant="outline"
        onClick={() => {
          count.current += 1;
          toaster.toast.info(`Notification ${count.current}`, {
            description: "Hover or focus the stack to expand it.",
          });
        }}
      >
        Add toast
      </Button>
      <Button variant="outline" aria-pressed={expand} onClick={() => setExpand((e) => !e)}>
        {expand ? "Expanded: on" : "Expanded: off"}
      </Button>
      <Button variant="ghost" onClick={() => toaster.toast.dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export const Stacking: Story = { render: () => <StackingDemo /> };

/* ------------------------------------------------------------
 * Promise — loading → success / danger
 * ------------------------------------------------------------ */

function PromiseDemo() {
  const [toaster] = React.useState(createToaster);
  const run = (succeed: boolean) =>
    toaster.toast
      .promise(
        new Promise<string>((resolve, reject) =>
          setTimeout(
            () => (succeed ? resolve("report.pdf") : reject(new Error("Timed out"))),
            2000,
          ),
        ),
        {
          loading: { title: "Uploading…", description: "report.pdf" },
          success: (file) => ({ title: "Upload complete", description: `${file} is ready.` }),
          error: (error) => ({
            title: "Upload failed",
            description: error instanceof Error ? error.message : "Try again.",
          }),
        },
      )
      .catch(() => undefined);
  return (
    <div className="flex flex-wrap gap-2">
      <Toast.Toaster toastManager={toaster.manager} />
      <Button variant="outline" onClick={() => run(true)}>
        Upload (succeeds)
      </Button>
      <Button variant="outline" onClick={() => run(false)}>
        Upload (fails)
      </Button>
    </div>
  );
}

export const Promise_: Story = { name: "Promise", render: () => <PromiseDemo /> };

/* ------------------------------------------------------------
 * Actions — action + cancel; toasts with an action persist
 * ------------------------------------------------------------ */

function ActionsDemo() {
  const [toaster] = React.useState(createToaster);
  const [log, setLog] = React.useState("Nothing yet");
  return (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <Toast.Toaster toastManager={toaster.manager} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          color="danger"
          onClick={() =>
            toaster.toast("Message deleted", {
              description: "It stays in Trash for 30 days.",
              action: { label: "Undo", onClick: () => setLog("Undo clicked") },
            })
          }
        >
          Delete message
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toaster.toast.error("Couldn’t sync", {
              description: "Check your connection.",
              action: { label: "Retry", onClick: () => setLog("Retry clicked") },
              cancel: { label: "Cancel", onClick: () => setLog("Cancel clicked") },
            })
          }
        >
          Sync
        </Button>
      </div>
      <p className="text-fg-muted text-sm" aria-live="polite">
        Last: {log}
      </p>
    </div>
  );
}

export const Actions: Story = { render: () => <ActionsDemo /> };

/* ------------------------------------------------------------
 * Progress — remaining-time bar; pauses on hover/focus
 * ------------------------------------------------------------ */

function ProgressDemo() {
  const [toaster] = React.useState(createToaster);
  return (
    <div className="flex flex-wrap gap-2">
      <Toast.Toaster toastManager={toaster.manager} showProgress />
      {(["neutral", "success", "warning"] as const).map((type) => (
        <Button
          key={type}
          variant="outline"
          onClick={() => show(toaster.toast, type, { timeout: 8000 })}
        >
          {type} (8s)
        </Button>
      ))}
    </div>
  );
}

export const Progress: Story = { render: () => <ProgressDemo /> };

/* ------------------------------------------------------------
 * Anchored — a short toast next to its trigger (Positioner + Arrow)
 * ------------------------------------------------------------ */

function AnchoredList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => (
    <Toast.Positioner key={t.id} toast={t}>
      <Toast.Root toast={t}>
        <Toast.Content className="px-3 py-1.5 pe-3">
          <Toast.Title className="text-sm font-medium" />
        </Toast.Content>
        <Toast.Arrow />
      </Toast.Root>
    </Toast.Positioner>
  ));
}

function AnchoredDemo() {
  const [toaster] = React.useState(createToaster);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Toast.Provider toastManager={toaster.manager}>
      <div className="pt-12">
        <Button
          ref={buttonRef}
          variant="outline"
          icon={<CopyIcon />}
          onClick={() => {
            void navigator.clipboard?.writeText("npm i @southpawui/ui").catch(() => undefined);
            toaster.manager.add({
              id: "copied",
              title: "Copied",
              type: "success",
              timeout: 1500,
              positionerProps: { anchor: buttonRef.current, side: "top" },
            });
          }}
        >
          Copy install command
        </Button>
      </div>
      <Toast.Portal>
        <Toast.Viewport expand aria-label="Copy confirmations" className="static">
          <AnchoredList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

export const Anchored: Story = { render: () => <AnchoredDemo /> };

/* ------------------------------------------------------------
 * Density
 * ------------------------------------------------------------ */

const DENSITY_SPECS: Spec[] = [
  { type: "success" },
  { type: "danger", options: { action: { label: "Retry" } } },
];

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="grid gap-6 lg:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <section key={density}>
          <h3 className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
            {density}
          </h3>
          <StaticToasts specs={DENSITY_SPECS} label={`${density} toasts`} density={density} />
        </section>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Themes — every type × both appearances × three themes
 * ------------------------------------------------------------ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          className="bg-surface-sunken text-fg-default rounded-lg p-6"
        >
          <h3 className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">
            {theme}
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <StaticToasts
              specs={[...ALL_TYPES, RICH[0] as Spec]}
              label={`${theme} subtle toasts`}
            />
            <StaticToasts
              specs={[...ALL_TYPES, RICH[0] as Spec]}
              label={`${theme} solid toasts`}
              appearance="solid"
            />
          </div>
        </section>
      ))}
    </div>
  ),
};

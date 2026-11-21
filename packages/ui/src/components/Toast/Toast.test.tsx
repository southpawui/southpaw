import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Toast, createToaster, toast as globalToast, type ToasterProps } from "./Toast";

function setup(props: Partial<ToasterProps> = {}) {
  const toaster = createToaster();
  const utils = render(<Toast.Toaster toastManager={toaster.manager} {...props} />);
  return { ...toaster, ...utils };
}

const toastEl = () => document.querySelector<HTMLElement>('[data-slot="toast"]');
const toastEls = () => document.querySelectorAll<HTMLElement>('[data-slot="toast"]');
/** Close-type buttons are aria-hidden until the stack is expanded or focused (Base UI), so find them by label. */
const closeButton = async (label: string) => {
  await waitFor(() =>
    expect(document.querySelector(`button[aria-label="${label}"]`)).not.toBeNull(),
  );
  return document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
};
const textButton = async (text: string) => {
  const el = await screen.findByText(text, { selector: "button" });
  return el as HTMLButtonElement;
};

/** The toast card whose title is `text` (high-priority toasts also render a hidden announcement copy). */
const card = (text: string) =>
  screen
    .getAllByText(text)
    .map((el) => el.closest<HTMLElement>('[data-slot="toast"]'))
    .find(Boolean)!;
const findCard = async (text: string) => {
  await screen.findAllByText(text);
  return card(text);
};
const viewport = () => document.querySelector<HTMLElement>('[data-slot="toast-viewport"]')!;

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  describe("toast() helpers", () => {
    it("renders title, description and the success type", async () => {
      const { toast } = setup();
      act(() => {
        toast.success("Payment sent", { description: "£240.00 to Acme Ltd." });
      });
      expect(await screen.findByText("Payment sent")).toBeInTheDocument();
      expect(screen.getByText("£240.00 to Acme Ltd.")).toBeInTheDocument();
      expect(toastEl()).toHaveAttribute("data-type", "success");
      expect(toastEl()?.querySelector('[data-slot="toast-icon"]')).not.toBeNull();
    });

    it("maps each helper to its type", async () => {
      const { toast } = setup({ limit: 10 });
      act(() => {
        toast("a");
        toast.info("b");
        toast.warning("c");
        toast.error("d");
        toast.danger("e");
        toast.loading("f");
      });
      await screen.findByText("f");
      const types = [...toastEls()].map((el) => el.getAttribute("data-type")).sort();
      expect(types).toEqual(["danger", "danger", "info", "loading", "neutral", "warning"]);
    });

    it("gives neutral toasts no icon and loading toasts a spinner", async () => {
      const { toast } = setup();
      act(() => {
        toast("Draft saved");
      });
      await screen.findByText("Draft saved");
      expect(toastEl()?.querySelector('[data-slot="toast-icon"]')).toBeNull();
      act(() => {
        toast.dismiss();
        toast.loading("Uploading");
      });
      await screen.findByText("Uploading");
      await waitFor(() => expect(toastEls()).toHaveLength(1));
      expect(toastEl()?.querySelector('[data-slot="spinner"]')).not.toBeNull();
    });

    it("supports a custom icon and icon={false}", async () => {
      const { toast } = setup();
      act(() => {
        toast("Custom", { icon: <svg data-testid="custom-icon" /> });
        toast.success("No icon", { icon: false });
      });
      await screen.findByText("No icon");
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      const noIcon = screen.getByText("No icon").closest<HTMLElement>('[data-slot="toast"]')!;
      expect(noIcon.querySelector('[data-slot="toast-icon"]')).toBeNull();
    });

    it("renders a caption", async () => {
      const { toast } = setup();
      act(() => {
        toast.info("New sign-in", { caption: "Today at 09:41" });
      });
      expect(await screen.findByText("Today at 09:41")).toHaveAttribute(
        "data-slot",
        "toast-caption",
      );
    });

    it("updates a toast in place", async () => {
      const { toast } = setup();
      let id = "";
      act(() => {
        id = toast("Saving");
      });
      await screen.findByText("Saving");
      act(() => {
        toast.update(id, { title: "Saved", type: "success", caption: "Just now" });
      });
      expect(await screen.findByText("Saved")).toBeInTheDocument();
      expect(screen.getByText("Just now")).toBeInTheDocument();
      expect(toastEls()).toHaveLength(1);
      expect(toastEl()).toHaveAttribute("data-type", "success");
    });

    it("dismiss() with no id closes every toast", async () => {
      const { toast } = setup();
      act(() => {
        toast("One");
        toast("Two");
      });
      await screen.findByText("Two");
      act(() => toast.dismiss());
      await waitFor(() => expect(toastEls()).toHaveLength(0));
    });

    it("promise() goes from loading to success", async () => {
      const { toast } = setup();
      let resolve!: (v: string) => void;
      const p = new Promise<string>((r) => (resolve = r));
      act(() => {
        void toast.promise(p, {
          loading: "Uploading",
          success: (file) => ({ title: `Uploaded ${file}` }),
          error: "Failed",
        });
      });
      await screen.findByText("Uploading");
      expect(toastEl()).toHaveAttribute("data-type", "loading");
      await act(async () => {
        resolve("report.pdf");
        await p;
      });
      expect(await screen.findByText("Uploaded report.pdf")).toBeInTheDocument();
      expect(toastEl()).toHaveAttribute("data-type", "success");
    });

    it("promise() goes from loading to danger on rejection", async () => {
      const { toast } = setup();
      let reject!: (e: Error) => void;
      const p = new Promise<string>((_, r) => (reject = r));
      act(() => {
        toast
          .promise(p, { loading: "Uploading", success: "Done", error: "Upload failed" })
          .catch(() => undefined);
      });
      await screen.findByText("Uploading");
      await act(async () => {
        reject(new Error("x"));
        await p.catch(() => undefined);
      });
      expect(await findCard("Upload failed")).toHaveAttribute("data-type", "danger");
    });

    it("the global toast() talks to a default <Toast.Toaster />", async () => {
      render(<Toast.Toaster />);
      act(() => {
        globalToast.success("Global");
      });
      expect(await screen.findByText("Global")).toBeInTheDocument();
      act(() => globalToast.dismiss());
      await waitFor(() => expect(screen.queryByText("Global")).toBeNull());
    });
  });

  describe("timing (safe defaults)", () => {
    it("auto-dismisses after 5000ms by default", async () => {
      vi.useFakeTimers();
      const { toast } = setup();
      act(() => {
        toast.success("Saved");
      });
      expect(screen.getByText("Saved")).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(4900));
      expect(screen.getByText("Saved")).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(300));
      vi.useRealTimers();
      await waitFor(() => expect(screen.queryByText("Saved")).toBeNull());
    });

    it.each([
      ["danger", (t: ReturnType<typeof createToaster>["toast"]) => t.error("Persist")],
      ["loading", (t: ReturnType<typeof createToaster>["toast"]) => t.loading("Persist")],
      [
        "action",
        (t: ReturnType<typeof createToaster>["toast"]) =>
          t.success("Persist", { action: { label: "Undo" } }),
      ],
    ])("keeps %s toasts open", (_, fire) => {
      vi.useFakeTimers();
      const { toast } = setup();
      act(() => {
        fire(toast);
      });
      expect(card("Persist")).not.toHaveAttribute("data-ending-style");
      act(() => vi.advanceTimersByTime(60_000));
      const el = card("Persist");
      expect(el).toBeInTheDocument();
      expect(el).not.toHaveAttribute("data-ending-style");
      expect(el.getAttribute("style") ?? "").not.toContain("ending");
    });

    it("an explicit timeout overrides persistence", async () => {
      vi.useFakeTimers();
      const { toast } = setup();
      act(() => {
        toast.error("Brief", { timeout: 1000 });
      });
      act(() => vi.advanceTimersByTime(1100));
      vi.useRealTimers();
      await waitFor(() => expect(screen.queryByText("Brief")).toBeNull());
    });

    it("respects the Toaster timeout", async () => {
      vi.useFakeTimers();
      const { toast } = setup({ timeout: 8000 });
      act(() => {
        toast("Long");
      });
      act(() => vi.advanceTimersByTime(6000));
      expect(screen.getByText("Long")).toBeInTheDocument();
    });
  });

  describe("buttons", () => {
    it("always renders a labelled × that closes the toast", async () => {
      const { toast } = setup();
      act(() => {
        toast("Closable");
      });
      const close = await closeButton("Dismiss notification");
      fireEvent.click(close);
      await waitFor(() => expect(screen.queryByText("Closable")).toBeNull());
    });

    it("accepts a custom close label", async () => {
      const { toast } = setup({ closeLabel: "Close message" });
      act(() => {
        toast("Hi");
      });
      expect(await closeButton("Close message")).toHaveAttribute("data-slot", "toast-close-button");
    });

    it("action runs onClick, then closes the toast", async () => {
      const onClick = vi.fn();
      const { toast } = setup();
      act(() => {
        toast("Deleted", { action: { label: "Undo", onClick } });
      });
      fireEvent.click(await screen.findByRole("button", { name: "Undo" }));
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByText("Deleted")).toBeNull());
    });

    it("action stays open when onClick calls preventDefault", async () => {
      const { toast } = setup();
      act(() => {
        toast("Deleted", { action: { label: "Undo", onClick: (e) => e.preventDefault() } });
      });
      fireEvent.click(await screen.findByRole("button", { name: "Undo" }));
      await new Promise((r) => setTimeout(r, 50));
      expect(screen.getByText("Deleted")).toBeInTheDocument();
    });

    it("cancel runs onClick and closes the toast", async () => {
      const onClick = vi.fn();
      const { toast } = setup();
      act(() => {
        toast.error("Sync failed", {
          action: { label: "Retry" },
          cancel: { label: "Cancel", onClick },
        });
      });
      fireEvent.click(await textButton("Cancel"));
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryAllByText("Sync failed")).toHaveLength(0));
    });

    it("renders action and cancel as Southpaw Buttons", async () => {
      const { toast } = setup();
      act(() => {
        toast("Hi", { action: { label: "Undo" }, cancel: { label: "Cancel" } });
      });
      const undo = await screen.findByRole("button", { name: "Undo" });
      expect(undo).toHaveAttribute("data-slot", "toast-action");
      expect(undo.className).toContain("h-[var(--sp-control-height-sm)]");
      expect(await textButton("Cancel")).toHaveAttribute("data-slot", "toast-close");
    });
  });

  describe("/improve regressions (sign-off 2026-11-16)", () => {
    it("an action on a settled promise toast closes it", async () => {
      const { toast } = setup();
      let resolve!: (v: string) => void;
      const p = new Promise<string>((r) => (resolve = r));
      act(() => {
        void toast.promise(p, {
          loading: "Saving",
          success: { title: "Saved", action: { label: "View" } },
          error: "Failed",
        });
      });
      await screen.findByText("Saving");
      await act(async () => {
        resolve("ok");
        await p;
      });
      fireEvent.click(await screen.findByRole("button", { name: "View" }));
      await waitFor(() => expect(screen.queryByText("Saved")).toBeNull());
    });

    it("an action added through the raw manager closes its toast", async () => {
      const { manager } = setup();
      const onClick = vi.fn();
      act(() => {
        manager.add({ title: "Raw", actionProps: { children: "Do it", onClick } });
      });
      fireEvent.click(await screen.findByRole("button", { name: "Do it" }));
      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByText("Raw")).toBeNull());
    });

    it("settled promise toasts use the Toaster timeout, not a hard-coded 5000ms", async () => {
      const { toast } = setup({ timeout: 300 });
      act(() => {
        void toast.promise(Promise.resolve("x"), {
          loading: "Working",
          success: "Done",
          error: "Failed",
        });
      });
      expect(await screen.findByText("Done")).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText("Done")).toBeNull(), { timeout: 2000 });
    });

    it("queues toasts fired before the Toaster mounts", async () => {
      const toaster = createToaster();
      toaster.toast.success("Early bird");
      toaster.toast("Second");
      render(<Toast.Toaster toastManager={toaster.manager} />);
      expect(await screen.findByText("Early bird")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("queues promise toasts fired before the Toaster mounts", async () => {
      const toaster = createToaster();
      let resolve!: (v: string) => void;
      const p = toaster.toast.promise(new Promise<string>((r) => (resolve = r)), {
        loading: "Queued load",
        success: "Queued done",
        error: "Queued fail",
      });
      render(<Toast.Toaster toastManager={toaster.manager} />);
      expect(await screen.findByText("Queued load")).toBeInTheDocument();
      await act(async () => {
        resolve("ok");
        await p;
      });
      expect(await screen.findByText("Queued done")).toBeInTheDocument();
    });

    it("update() to danger makes the toast persistent and high priority", async () => {
      vi.useFakeTimers();
      const { toast } = setup();
      let id = "";
      act(() => {
        id = toast("Syncing");
      });
      act(() => {
        toast.update(id, { title: "Sync failed", type: "danger" });
      });
      act(() => vi.advanceTimersByTime(60_000));
      expect(card("Sync failed")).toHaveAttribute("role", "alertdialog");
    });

    it("update() from loading to success auto-dismisses again", async () => {
      vi.useFakeTimers();
      const { toast } = setup();
      let id = "";
      act(() => {
        id = toast.loading("Uploading");
      });
      act(() => vi.advanceTimersByTime(10_000));
      expect(screen.getByText("Uploading")).toBeInTheDocument();
      act(() => {
        toast.update(id, { title: "Uploaded", type: "success" });
      });
      act(() => vi.advanceTimersByTime(5200));
      vi.useRealTimers();
      await waitFor(() => expect(screen.queryByText("Uploaded")).toBeNull());
    });

    it("update() can add an action, which makes the toast persistent", async () => {
      vi.useFakeTimers();
      const { toast } = setup();
      let id = "";
      act(() => {
        id = toast("Deleted");
      });
      act(() => {
        toast.update(id, { action: { label: "Undo" } });
      });
      act(() => vi.advanceTimersByTime(60_000));
      expect(screen.getByText("Deleted")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    it("reserves room for the × only when a CloseButton is rendered", async () => {
      const { toast } = setup();
      act(() => {
        toast("Hi");
      });
      await screen.findByText("Hi");
      const content = document.querySelector('[data-slot="toast-content"]')!;
      expect(content.className).toContain("has-[>[data-slot=toast-close-button]]:pe-");
      expect(content.className).not.toMatch(/(^|\s)pe-\[/);
    });
  });

  describe("a11y", () => {
    it("viewport is a labelled region", async () => {
      const { toast } = setup();
      act(() => {
        toast("Hi");
      });
      await screen.findByText("Hi");
      expect(viewport()).toHaveAttribute("role", "region");
      expect(viewport()).toHaveAttribute("aria-label", "Notifications");
    });

    it("toasts are dialogs labelled by their title; danger is alertdialog", async () => {
      const { toast } = setup();
      act(() => {
        toast.info("Info title", { description: "Info body" });
      });
      const dialog = await screen.findByRole("dialog", { name: "Info title" });
      expect(dialog).toHaveAccessibleDescription("Info body");
      act(() => {
        toast.error("Error title");
      });
      expect(await findCard("Error title")).toHaveAttribute("role", "alertdialog");
    });

    it("danger defaults to high priority; priority can be overridden", async () => {
      const { toast } = setup();
      act(() => {
        toast.error("Quiet error", { priority: "low" });
      });
      await screen.findByText("Quiet error");
      expect(toastEl()).toHaveAttribute("role", "dialog");
    });

    it("icons and progress are hidden from assistive tech", async () => {
      const { toast } = setup({ showProgress: true });
      act(() => {
        toast.success("Saved");
      });
      await screen.findByText("Saved");
      expect(toastEl()?.querySelector('[data-slot="toast-icon"]')).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(toastEl()?.querySelector('[data-slot="toast-progress"]')).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  describe("appearance, position, layout", () => {
    it("defaults to subtle; Toaster and per-toast appearance override it", async () => {
      const { toast, unmount } = setup();
      act(() => {
        toast("Default");
        toast("Solid", { appearance: "solid" });
      });
      await screen.findByText("Solid");
      expect(screen.getByText("Default").closest('[data-slot="toast"]')).toHaveAttribute(
        "data-appearance",
        "subtle",
      );
      expect(screen.getByText("Solid").closest('[data-slot="toast"]')).toHaveAttribute(
        "data-appearance",
        "solid",
      );
      unmount();
      const second = setup({ appearance: "solid" });
      act(() => {
        second.toast("All solid");
      });
      expect((await screen.findByText("All solid")).closest('[data-slot="toast"]')).toHaveAttribute(
        "data-appearance",
        "solid",
      );
    });

    it.each([
      ["bottom-right", "bottom"],
      ["top-center", "top"],
      ["top-left", "top"],
    ] as const)("position %s sets data-position and side", async (position, side) => {
      const { toast } = setup({ position });
      act(() => {
        toast("Hi");
      });
      await screen.findByText("Hi");
      expect(viewport()).toHaveAttribute("data-position", position);
      expect(viewport()).toHaveAttribute("data-side", side);
    });

    it("stacks by default and lays out a list with expand", async () => {
      const { toast, unmount } = setup();
      act(() => {
        toast("Stacked");
      });
      await screen.findByText("Stacked");
      expect(toastEl()?.className).toContain("absolute");
      expect(viewport()).not.toHaveAttribute("data-expand");
      unmount();
      const second = setup({ expand: true });
      act(() => {
        second.toast("Listed");
      });
      await screen.findByText("Listed");
      expect(viewport()).toHaveAttribute("data-expand");
      expect(toastEl()?.className).not.toContain("absolute");
    });

    it("forwards density to the portalled viewport", async () => {
      const { toast } = setup({ density: "compact" });
      act(() => {
        toast("Hi");
      });
      await screen.findByText("Hi");
      expect(viewport()).toHaveAttribute("data-density", "compact");
    });

    it("shows a progress bar only for timed toasts when enabled", async () => {
      const { toast } = setup({ showProgress: true });
      act(() => {
        toast("Timed");
        toast.error("Persistent");
      });
      const persistent = await findCard("Persistent");
      const timed = card("Timed");
      expect(timed.querySelector('[data-slot="toast-progress"]')).not.toBeNull();
      expect(persistent.querySelector('[data-slot="toast-progress"]')).toBeNull();
    });

    it("renders data-slots on every part", async () => {
      const { toast } = setup();
      act(() => {
        toast.success("Title", {
          description: "Body",
          caption: "Now",
          action: { label: "Undo" },
          cancel: { label: "Cancel" },
        });
      });
      await screen.findByText("Title");
      for (const slot of [
        "toast-viewport",
        "toast",
        "toast-content",
        "toast-icon",
        "toast-body",
        "toast-title",
        "toast-description",
        "toast-caption",
        "toast-actions",
        "toast-action",
        "toast-close",
        "toast-close-button",
      ]) {
        expect(document.querySelector(`[data-slot="${slot}"]`), slot).not.toBeNull();
      }
    });
  });

  describe("composition", () => {
    it("children of Toaster can use useToastManager", async () => {
      const toaster = createToaster();
      function Inner() {
        const manager = Toast.useToastManager();
        const added = React.useRef(false);
        React.useEffect(() => {
          if (added.current) return;
          added.current = true;
          manager.add({ title: "From hook" });
        }, [manager]);
        return null;
      }
      render(
        <Toast.Toaster toastManager={toaster.manager}>
          <Inner />
        </Toast.Toaster>,
      );
      expect(await screen.findByText("From hook")).toBeInTheDocument();
    });

    it("forwards refs on Root", async () => {
      const toaster = createToaster();
      const ref = React.createRef<HTMLDivElement>();
      function List() {
        const { toasts } = Toast.useToastManager();
        return toasts.map((t) => (
          <Toast.Root key={t.id} toast={t} ref={ref}>
            <Toast.Content>
              <Toast.Title />
            </Toast.Content>
          </Toast.Root>
        ));
      }
      render(
        <Toast.Provider toastManager={toaster.manager}>
          <Toast.Viewport>
            <List />
          </Toast.Viewport>
        </Toast.Provider>,
      );
      act(() => {
        toaster.toast("Ref");
      });
      await screen.findByText("Ref");
      expect(ref.current).toBe(toastEl());
    });
  });
});

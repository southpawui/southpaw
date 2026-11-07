import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta: Meta = {
  title: "Components/Toast",
};

export default meta;

function ToastDemo() {
  const toastManager = Toast.useToastManager();

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
      onClick={() => {
        toastManager.add({
          title: "Event created",
          description: "Your event has been scheduled successfully.",
        });
      }}
    >
      Show toast
    </button>
  );
}

function ToastWithAction() {
  const toastManager = Toast.useToastManager();

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
      onClick={() => {
        toastManager.add({
          title: "Message deleted",
          description: "The message has been permanently removed.",
        });
      }}
    >
      Show toast with action
    </button>
  );
}

export const Default: StoryObj = {
  render: () => (
    <Toast.Provider>
      <ToastDemo />
      <Toast.Viewport>
        {(toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Content>
              <div className="flex-1">
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <Toast.Close aria-label="Close">
                <XIcon />
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        )}
      </Toast.Viewport>
    </Toast.Provider>
  ),
};

export const WithAction: StoryObj = {
  render: () => (
    <Toast.Provider>
      <ToastWithAction />
      <Toast.Viewport>
        {(toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Content>
              <div className="flex-1">
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </div>
              <div className="flex items-center gap-2">
                <Toast.Action altText="Undo deletion">Undo</Toast.Action>
                <Toast.Close aria-label="Close">
                  <XIcon />
                </Toast.Close>
              </div>
            </Toast.Content>
          </Toast.Root>
        )}
      </Toast.Viewport>
    </Toast.Provider>
  ),
};

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 3L3 11M3 3L11 11" />
    </svg>
  );
}

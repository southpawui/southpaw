import { Button } from "@southpawui/ui/Button";
import { Dialog } from "@southpawui/ui/Dialog";

const sizes = ["sm", "md", "lg", "full"] as const;

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger render={<Button variant="outline" />}>{size}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup size={size}>
              <Dialog.Header>
                <div>
                  <Dialog.Title>Size: {size}</Dialog.Title>
                  <Dialog.Description>This dialog uses the {size} size.</Dialog.Description>
                </div>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body>
                <p className="text-fg-default text-sm">
                  The maximum width changes with the size prop. Full fills the viewport.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="outline" />}>Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}

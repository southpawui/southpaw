import { Button } from "@southpawui/ui/Button";
import { Dialog } from "@southpawui/ui/Dialog";

export default function DialogLongContent() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Terms of service</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <div>
              <Dialog.Title>Terms of service</Dialog.Title>
              <Dialog.Description>Read the terms, then accept or decline.</Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body className="max-h-[60vh]">
            <div className="flex flex-col gap-4 text-sm">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-fg-default">
                  <strong>Section {i + 1}.</strong> Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              ))}
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" />}>Decline</Dialog.Close>
            <Dialog.Close render={<Button variant="solid" color="brand" />}>Accept</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

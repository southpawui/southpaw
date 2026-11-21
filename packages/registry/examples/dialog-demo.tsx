import { Button } from "@southpawui/ui/Button";
import { Dialog } from "@southpawui/ui/Dialog";
import { Field } from "@southpawui/ui/Field";
import { Input } from "@southpawui/ui/Input";

export default function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Edit profile</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <div>
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description>Make changes to your profile here.</Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-4">
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input defaultValue="Ada Lovelace" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input purpose="email" defaultValue="ada@example.com" />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="solid" />}>Save changes</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

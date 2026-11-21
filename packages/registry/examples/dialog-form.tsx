import { Button } from "@southpawui/ui/Button";
import { Dialog } from "@southpawui/ui/Dialog";
import { Field } from "@southpawui/ui/Field";
import { Input } from "@southpawui/ui/Input";
import { Separator } from "@southpawui/ui/Separator";

export default function DialogForm() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Create project</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup size="lg">
          <Dialog.Header>
            <div>
              <Dialog.Title>Create a project</Dialog.Title>
              <Dialog.Description>Fill in the details to set up your project.</Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-4">
              <Field.Root>
                <Field.Label>Project name</Field.Label>
                <Input placeholder="My project" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input placeholder="A short description" />
                <Field.Description>Optional. You can add this later.</Field.Description>
              </Field.Root>
              <Separator />
              <Field.Root>
                <Field.Label>Repository URL</Field.Label>
                <Input purpose="url" placeholder="https://github.com/..." />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
            <Dialog.Close render={<Button variant="solid" color="brand" />}>
              Create project
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

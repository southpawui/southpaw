/* ============================================================
 * GEO-972 check: every Southpaw component rendered from a Server Component
 *
 * This file has no "use client", so it is a React Server Component. `next
 * build` prerenders it: if any component is missing "use client", or a
 * compound component can't be dotted into (`Tabs.Root`), the build fails.
 * Only serialisable props are passed (no functions), as a Server Component must.
 * ============================================================ */
import { Accordion } from "@southpawui/ui/Accordion";
import { AlertDialog } from "@southpawui/ui/AlertDialog";
import { Autocomplete } from "@southpawui/ui/Autocomplete";
import { Avatar } from "@southpawui/ui/Avatar";
import { Badge } from "@southpawui/ui/Badge";
import { Button } from "@southpawui/ui/Button";
import { ButtonGroup } from "@southpawui/ui/ButtonGroup";
import { Card } from "@southpawui/ui/Card";
import { Checkbox } from "@southpawui/ui/Checkbox";
import { CheckboxGroup } from "@southpawui/ui/CheckboxGroup";
import { Collapsible } from "@southpawui/ui/Collapsible";
import { Combobox } from "@southpawui/ui/Combobox";
import { ContextMenu } from "@southpawui/ui/ContextMenu";
import { DescriptionList } from "@southpawui/ui/DescriptionList";
import { Dialog } from "@southpawui/ui/Dialog";
import { Drawer } from "@southpawui/ui/Drawer";
import { ErrorSummary } from "@southpawui/ui/ErrorSummary";
import { Field } from "@southpawui/ui/Field";
import { Fieldset } from "@southpawui/ui/Fieldset";
import { Form } from "@southpawui/ui/Form";
import { Indicator } from "@southpawui/ui/Indicator";
import { Input } from "@southpawui/ui/Input";
import { Kbd } from "@southpawui/ui/Kbd";
import { Link } from "@southpawui/ui/Link";
import { LoadingOverlay } from "@southpawui/ui/LoadingOverlay";
import { Menu } from "@southpawui/ui/Menu";
import { Menubar } from "@southpawui/ui/Menubar";
import { Meter } from "@southpawui/ui/Meter";
import { NavigationMenu } from "@southpawui/ui/NavigationMenu";
import { NumberField } from "@southpawui/ui/NumberField";
import { OTPField } from "@southpawui/ui/OTPField";
import { Popover } from "@southpawui/ui/Popover";
import { PreviewCard } from "@southpawui/ui/PreviewCard";
import { Progress } from "@southpawui/ui/Progress";
import { RadioGroup } from "@southpawui/ui/RadioGroup";
import { ScrollArea } from "@southpawui/ui/ScrollArea";
import { Select } from "@southpawui/ui/Select";
import { Separator } from "@southpawui/ui/Separator";
import { Skeleton } from "@southpawui/ui/Skeleton";
import { SkipLink } from "@southpawui/ui/SkipLink";
import { Slider } from "@southpawui/ui/Slider";
import { Spinner } from "@southpawui/ui/Spinner";
import { Switch } from "@southpawui/ui/Switch";
import { Tabs } from "@southpawui/ui/Tabs";
import { Textarea } from "@southpawui/ui/Textarea";
import { Toast } from "@southpawui/ui/Toast";
import { Toggle } from "@southpawui/ui/Toggle";
import { ToggleGroup } from "@southpawui/ui/ToggleGroup";
import { Toolbar } from "@southpawui/ui/Toolbar";
import { Tooltip } from "@southpawui/ui/Tooltip";
import { VisuallyHidden } from "@southpawui/ui/VisuallyHidden";

import type { Metadata } from "next";

// A build check, not a docs page: keep it out of search results
export const metadata: Metadata = { robots: { index: false, follow: false } };

const fruits = ["Apple", "Banana", "Cherry"];

export default function RscCheck() {
  return (
    <main className="flex flex-col gap-4 p-8">
      <SkipLink />
      <h1>Server Component check (every component)</h1>

      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      </AlertDialog.Root>

      <Autocomplete.Root items={fruits}>
        <Field.Root>
          <Field.Label>Tag</Field.Label>
          <Autocomplete.Input />
        </Field.Root>
        <Autocomplete.Content />
      </Autocomplete.Root>

      <Avatar.Root>
        <Avatar.Fallback>AK</Avatar.Fallback>
      </Avatar.Root>

      <Badge variant="success">Badge</Badge>
      <Button>Button</Button>

      <ButtonGroup.Root aria-label="Actions">
        <Button>One</Button>
        <ButtonGroup.Separator />
        <Button>Two</Button>
      </ButtonGroup.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Card</Card.Title>
        </Card.Header>
      </Card.Root>

      <Checkbox.Root aria-label="Accept terms" />

      <CheckboxGroup.Root aria-label="Fruit" defaultValue={["apple"]}>
        <Checkbox.Root value="apple" aria-label="Apple" />
      </CheckboxGroup.Root>

      <Collapsible.Root>
        <Collapsible.Trigger>More</Collapsible.Trigger>
        <Collapsible.Panel>Hidden</Collapsible.Panel>
      </Collapsible.Root>

      <Combobox.Root items={fruits}>
        <Field.Root>
          <Field.Label>Fruit</Field.Label>
          <Combobox.Input />
        </Field.Root>
        <Combobox.Content />
      </Combobox.Root>

      <ContextMenu.Root>
        <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
      </ContextMenu.Root>

      <DescriptionList.Root>
        <DescriptionList.Item>
          <DescriptionList.Term>Seats</DescriptionList.Term>
          <DescriptionList.Details value={12} />
        </DescriptionList.Item>
      </DescriptionList.Root>

      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
      </Dialog.Root>

      <Drawer.Root>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
      </Drawer.Root>

      <ErrorSummary.Root>
        <ErrorSummary.Title>There is a problem</ErrorSummary.Title>
        <ErrorSummary.List>
          <ErrorSummary.Item target="name">Enter your name</ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary.Root>

      <Form>
        <Fieldset.Root>
          <Fieldset.Legend>Details</Fieldset.Legend>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input id="name" />
            <Field.Description>As it appears on your card</Field.Description>
          </Field.Root>
          <Field.Root>
            <Field.Label>Notes</Field.Label>
            <Textarea />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input.Password />
          </Field.Root>
        </Fieldset.Root>
      </Form>

      <Indicator count={3} label="3 new">
        <Button>Inbox</Button>
      </Indicator>

      <Kbd keys="mod+k" />
      <Kbd.Group>
        <Kbd keys="shift" />
        <Kbd keys="enter" />
      </Kbd.Group>

      <Link href="/">Link</Link>

      <LoadingOverlay label="Loading">
        <p>Region</p>
      </LoadingOverlay>

      <Menu.Root>
        <Menu.Trigger>Menu</Menu.Trigger>
      </Menu.Root>

      <Menubar aria-label="Application">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
        </Menubar.Menu>
      </Menubar>

      <Meter.Root value={45}>
        <Meter.Label>Storage</Meter.Label>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>

      <NavigationMenu.Root aria-label="Main" collapseBelow="never">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <Field.Root>
        <Field.Label>Quantity</Field.Label>
        <NumberField.Root defaultValue={1}>
          <NumberField.Group>
            <NumberField.Input />
          </NumberField.Group>
        </NumberField.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Code</Field.Label>
        <OTPField.Root length={6} />
      </Field.Root>

      <Popover.Root>
        <Popover.Trigger>Popover</Popover.Trigger>
      </Popover.Root>

      <PreviewCard.Root>
        <PreviewCard.Trigger href="/">Preview</PreviewCard.Trigger>
      </PreviewCard.Root>

      <Progress.Root value={40}>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>

      <RadioGroup.Root aria-label="Size" defaultValue="s">
        <RadioGroup.Item value="s" aria-label="Small" />
      </RadioGroup.Root>

      <ScrollArea.Root className="h-20">
        <ScrollArea.Viewport>
          <ScrollArea.Content>Scrollable</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>

      <Field.Root>
        <Field.Label>Fruit</Field.Label>
        <Select.Root items={fruits.map((f) => ({ value: f, label: f }))}>
          <Select.Trigger>
            <Select.Value placeholder="Pick one" />
          </Select.Trigger>
        </Select.Root>
      </Field.Root>

      <Separator />

      <Skeleton.Group label="Loading">
        <Skeleton />
        <Skeleton.Text lines={2} />
        <Skeleton.Avatar />
      </Skeleton.Group>

      <Slider.Root defaultValue={40}>
        <Slider.Header>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>

      <Spinner label="Loading" />

      <Switch.Root aria-label="Notifications" />

      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>

      <Toast.Toaster />

      <Toggle label="Bold" />
      <ToggleGroup.Root aria-label="Alignment" defaultValue={["left"]}>
        <Toggle value="left" label="Left" />
        <Toggle value="right" label="Right" />
      </ToggleGroup.Root>

      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Toggle label="Bold" />
        <Toolbar.Button label="Heading" />
        <Toolbar.Separator />
        <Toolbar.Link href="/">Help</Toolbar.Link>
      </Toolbar.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip</Tooltip.Content>
      </Tooltip.Root>

      <VisuallyHidden>Hidden</VisuallyHidden>
      <SkipLink.Target />
    </main>
  );
}

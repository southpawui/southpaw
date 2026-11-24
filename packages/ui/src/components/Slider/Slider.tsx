/* ============================================================
 * Slider: server-safe entry (GEO-972)
 *
 * The parts live in ./Slider.parts ("use client"). This file has no
 * directive, so a Server Component gets a plain object of client
 * references and `<Slider.Root>` works there too (Base UI's pattern).
 * Keep it free of hooks, context and Base UI imports: the guard in
 * lib/use-client.test.ts checks.
 * ============================================================ */

import {
  SliderAddHandle,
  SliderBody,
  SliderControl,
  SliderHeader,
  SliderIndicator,
  SliderLabel,
  SliderMarkLabels,
  SliderMarks,
  SliderMinMax,
  SliderPartTrack,
  SliderRemoveHandle,
  SliderRoot,
  SliderThumb,
  SliderThumbs,
  SliderValue,
} from "./Slider.parts";

export type * from "./Slider.parts";

export const Slider: {
  Root: typeof SliderRoot;
  Header: typeof SliderHeader;
  Label: typeof SliderLabel;
  Value: typeof SliderValue;
  Body: typeof SliderBody;
  Control: typeof SliderControl;
  Track: typeof SliderPartTrack;
  Indicator: typeof SliderIndicator;
  Marks: typeof SliderMarks;
  MarkLabels: typeof SliderMarkLabels;
  MinMax: typeof SliderMinMax;
  Thumb: typeof SliderThumb;
  Thumbs: typeof SliderThumbs;
  AddHandle: typeof SliderAddHandle;
  RemoveHandle: typeof SliderRemoveHandle;
} = {
  Root: SliderRoot,
  Header: SliderHeader,
  Label: SliderLabel,
  Value: SliderValue,
  Body: SliderBody,
  Control: SliderControl,
  Track: SliderPartTrack,
  Indicator: SliderIndicator,
  Marks: SliderMarks,
  MarkLabels: SliderMarkLabels,
  MinMax: SliderMinMax,
  Thumb: SliderThumb,
  Thumbs: SliderThumbs,
  AddHandle: SliderAddHandle,
  RemoveHandle: SliderRemoveHandle,
};

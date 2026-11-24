"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { ImageIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { mergeClassName } from "../../lib/merge-class-name";
import { announce } from "../../lib/announce";
import { delayMs, type LoadingDelay } from "../../lib/delay";

/* ============================================================
 * Skeleton (GEO-963)
 *
 * Placeholder shapes that keep the layout while content loads: one shape,
 * a wrapper that stands in for real children, text lines, presets sized
 * from our tokens, and a Group that is the loading region.
 *
 * Silent by design: every shape is aria-hidden, wrapped children are inert.
 * The Group carries aria-busy and makes one announcement through the shared
 * announcer, so ten skeletons don't say "loading" ten times.
 *
 * Pure CSS (no measuring, no random widths), so server output matches the
 * client. The delay is CSS too: space stays reserved and it works without JS.
 * ============================================================ */

export type SkeletonShape = "text" | "circle" | "rectangle" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | "none";
type Size = number | string;

interface GroupContextValue {
  loading: boolean;
  animation?: SkeletonAnimation;
  delay?: LoadingDelay;
}
const GroupContext = React.createContext<GroupContextValue | null>(null);

/* ============================================================
 * Shared classes
 * ============================================================ */

// The fill, plus an outline that's transparent except in high contrast
// (border-control) and forced colours (where backgrounds are dropped).
const surface =
  "bg-skeleton outline outline-1 -outline-offset-1 outline-skeleton-outline pointer-events-none select-none";

// Literal class names: Tailwind can't see names built at runtime. Every
// animation also runs `sp-skeleton-appear` for the CSS delay. Loops use fixed
// durations: the motion tokens drop to 0ms under reduced motion, which would
// freeze a loop rather than calm it.
const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: cn(
    "[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-pulse_2s_ease-in-out_var(--sp-skeleton-delay,0s)_infinite]",
    "motion-reduce:[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-pulse-reduced_3s_ease-in-out_var(--sp-skeleton-delay,0s)_infinite]",
  ),
  wave: cn(
    "bg-[linear-gradient(90deg,transparent,var(--sp-skeleton-highlight),transparent)] bg-no-repeat [background-size:50%_100%]",
    "[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-wave_2s_linear_var(--sp-skeleton-delay,0s)_infinite]",
    // The sweep follows reading direction
    "rtl:[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-wave-rtl_2s_linear_var(--sp-skeleton-delay,0s)_infinite]",
    // Reduced motion: no sweep, the same calm pulse as `pulse`
    "motion-reduce:bg-none",
    "motion-reduce:[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-pulse-reduced_3s_ease-in-out_var(--sp-skeleton-delay,0s)_infinite]",
    "rtl:motion-reduce:[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards,sp-skeleton-pulse-reduced_3s_ease-in-out_var(--sp-skeleton-delay,0s)_infinite]",
  ),
  none: "[animation:sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards]",
};

const shapeClasses: Record<SkeletonShape, string> = {
  // 1em tall, centred in the line box (1lh), so lines follow the type around them
  text: "rounded-[0.25em]",
  circle: "rounded-full",
  rectangle: "rounded-none",
  rounded: "rounded-[var(--sp-nested-radius,var(--radius-sm))]",
};

// Without children or a size: what each shape looks like on its own
const standaloneSize: Record<SkeletonShape, string> = {
  text: "block h-[1em] my-[calc((1lh-1em)/2)] w-full",
  circle: "block size-10 shrink-0",
  rectangle: "block h-[var(--sp-control-height)] w-full",
  rounded: "block h-[var(--sp-control-height)] w-full",
};

// Fade loaded content in; the token is 0ms under reduced motion, so it's instant there
const fadeInClass =
  "animate-[sp-skeleton-fade-in_var(--sp-duration-normal)_var(--sp-easing-default)]";

function toCss(size: Size | undefined) {
  return typeof size === "number" ? `${size}px` : size;
}

function delayStyle(delay: LoadingDelay | undefined): React.CSSProperties | undefined {
  const ms = delayMs(delay);
  return ms ? ({ "--sp-skeleton-delay": `${ms}ms` } as React.CSSProperties) : undefined;
}

/** Resolve loading/animation/delay: the part's own prop, then the Group's, then the default. */
function useSkeletonOptions(
  loading: boolean | undefined,
  animation: SkeletonAnimation | undefined,
  delay: LoadingDelay | undefined,
) {
  const group = React.useContext(GroupContext);
  return {
    loading: loading ?? group?.loading ?? true,
    animation: animation ?? group?.animation ?? "pulse",
    delay: delay ?? group?.delay,
  };
}

/* ============================================================
 * Skeleton
 * ============================================================ */

export interface SkeletonProps extends Omit<React.ComponentPropsWithRef<"span">, "children"> {
  /**
   * Default `rounded`. `text` is a 1em bar in the line box. With children it
   * draws one bar per wrapped line. Wrap the whole heading or paragraph
   * (`<Skeleton shape="text"><h3>Title</h3></Skeleton>`), so it's hidden from
   * screen readers until it loads rather than exposed as an empty heading.
   */
  shape?: SkeletonShape;
  /** Default `pulse`. Under reduced motion every animation becomes a slow, gentle pulse. */
  animation?: SkeletonAnimation;
  /** Width in px (number) or any CSS length. Without it, a shape fills its container, or fits its children. */
  width?: Size;
  /** Height in px (number) or any CSS length. */
  height?: Size;
  /**
   * Default `true` (or the Group's). With children: while loading, they're
   * hidden and inert and the skeleton takes their size; when loaded, only the
   * children render, fading in. Without children, nothing renders when loaded.
   */
  loading?: boolean;
  /** Wait before showing: `true` 1000ms, `"short"` 300ms, or ms. Space stays reserved. */
  delay?: LoadingDelay;
  /** The real content. Its size becomes the skeleton's while loading. */
  children?: React.ReactNode;
  /** Replace the element, e.g. `render={<div />}`. */
  render?: useRender.RenderProp;
}

/** Internal: `decoration` is drawn inside the shape (Image's icon) without being treated as wrapped content. */
interface ShapeProps extends SkeletonProps {
  decoration?: React.ReactNode;
}

const Shape = React.forwardRef<HTMLSpanElement, ShapeProps>(
  (
    {
      shape = "rounded",
      decoration,
      animation: animationProp,
      width,
      height,
      loading: loadingProp,
      delay: delayProp,
      children,
      render,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const { loading, animation, delay } = useSkeletonOptions(loadingProp, animationProp, delayProp);
    const hasChildren = children != null && children !== false;
    const fadeIn = useFadeIn(loading);
    const textWrap = hasChildren && shape === "text";

    const element = useRender({
      defaultTagName: "span",
      render,
      ref,
      enabled: loading,
      props: {
        "aria-hidden": true,
        // Wrapped children: out of the tab order and the accessibility tree
        inert: hasChildren ? true : undefined,
        // A preset or a consumer can name its own slot
        "data-slot": "skeleton",
        ...props,
        "data-shape": shape,
        "data-animation": animation,
        style: { ...delayStyle(delay), width: toCss(width), height: toCss(height), ...style },
        className: mergeClassName(
          textWrap
            ? // The outer box only holds the layout; the inner span draws the bars
              "block max-w-full"
            : cn(
                surface,
                shapeClasses[shape],
                animationClasses[animation],
                hasChildren
                  ? "block w-fit max-w-full text-transparent [&_*]:invisible"
                  : standaloneSize[shape],
              ),
          className,
        ),
        children: textWrap ? (
          // Inline, so each wrapped line gets its own bar (box-decoration-break: clone).
          // A separate span because a flex or grid parent would make the outer box a block.
          <span
            data-slot="skeleton-bars"
            className={cn(
              surface,
              shapeClasses.text,
              animationClasses[animation],
              // Block children (a heading, a paragraph) flow inline here, so they
              // get line boxes for the bars while staying out of the a11y tree
              "box-decoration-clone text-transparent [&_*]:invisible [&_*]:!inline",
            )}
          >
            {children}
          </span>
        ) : hasChildren ? (
          children
        ) : (
          decoration
        ),
      },
    });

    if (loading) return element;
    if (!hasChildren) return null;
    return fadeIn ? withFade(children) : <>{children}</>;
  },
);
Shape.displayName = "Skeleton";

const Root = Shape as React.ForwardRefExoticComponent<SkeletonProps>;

/** True on the renders after `loading` turns false, so loaded content fades in once. */
function useFadeIn(loading: boolean) {
  const [prev, setPrev] = React.useState(loading);
  const [fade, setFade] = React.useState(false);
  if (prev !== loading) {
    setPrev(loading);
    setFade(!loading);
  }
  return fade && !loading;
}

/** Add the fade to a single element child; other children appear without one (no extra wrapper). */
function withFade(children: React.ReactNode) {
  // A Fragment can't take a className, so it appears without a fade
  if (!React.isValidElement<{ className?: unknown }>(children) || children.type === React.Fragment)
    return <>{children}</>;
  const childClass = children.props.className as Parameters<typeof mergeClassName>[1];
  return React.cloneElement(children, {
    className: mergeClassName(fadeInClass, childClass),
  } as Record<string, unknown>);
}

/* ============================================================
 * Text
 * ============================================================ */

export interface SkeletonTextProps extends Omit<React.ComponentPropsWithRef<"span">, "children"> {
  /** Number of lines. Default 3. */
  lines?: number;
  /** Width of each line, in order (px or CSS length). Missing entries fall back to the defaults. */
  widths?: Size[];
  /** Width of the last line when there's more than one. Default `60%`. */
  lastLineWidth?: Size;
  animation?: SkeletonAnimation;
  loading?: boolean;
  delay?: LoadingDelay;
}

const Text = React.forwardRef<HTMLSpanElement, SkeletonTextProps>(
  (
    {
      lines = 3,
      widths,
      lastLineWidth = "60%",
      animation: animationProp,
      loading: loadingProp,
      delay: delayProp,
      className,
      ...props
    },
    ref,
  ) => {
    const { loading, animation, delay } = useSkeletonOptions(loadingProp, animationProp, delayProp);
    if (!loading) return null;
    const count = Math.max(1, Math.floor(lines));
    return (
      <span
        ref={ref}
        aria-hidden="true"
        {...props}
        data-slot="skeleton-text"
        className={mergeClassName("block w-full", className)}
      >
        {Array.from({ length: count }, (_, i) => (
          <Root
            key={i}
            data-slot="skeleton-line"
            shape="text"
            animation={animation}
            delay={delay}
            width={widths?.[i] ?? (count > 1 && i === count - 1 ? lastLineWidth : undefined)}
          />
        ))}
      </span>
    );
  },
);
Text.displayName = "Skeleton.Text";

/* ============================================================
 * Presets
 * ============================================================ */

type PresetSize = "sm" | "md" | "lg";

interface PresetBase extends Omit<React.ComponentPropsWithRef<"span">, "children"> {
  animation?: SkeletonAnimation;
  loading?: boolean;
  delay?: LoadingDelay;
}

/* ---- Avatar: Avatar's sizes and shapes ---- */

export interface SkeletonAvatarProps extends PresetBase {
  /** Avatar's sizes: sm 32px, md 40px, lg 56px. Default `md`. */
  size?: PresetSize;
  /** Default `circle`. */
  shape?: "circle" | "square";
}

const avatarSize: Record<PresetSize, string> = { sm: "size-8", md: "size-10", lg: "size-14" };

const AvatarPreset = React.forwardRef<HTMLSpanElement, SkeletonAvatarProps>(
  ({ size = "md", shape = "circle", className, ...props }, ref) => (
    <Root
      ref={ref}
      {...props}
      shape={shape === "circle" ? "circle" : "rounded"}
      data-slot="skeleton-avatar"
      className={mergeClassName(
        cn("block shrink-0", avatarSize[size], shape === "square" && "rounded-lg"),
        className,
      )}
    />
  ),
);
AvatarPreset.displayName = "Skeleton.Avatar";

/* ---- Button and Input: control heights, so they follow density ---- */

const controlHeight: Record<PresetSize, string> = {
  sm: "h-[var(--sp-control-height-sm)]",
  md: "h-[var(--sp-control-height)]",
  lg: "h-[var(--sp-control-height-lg)]",
};
const buttonWidth: Record<PresetSize, string> = { sm: "w-20", md: "w-24", lg: "w-32" };
const controlRadius = "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]";

export interface SkeletonButtonProps extends PresetBase {
  /** Button's sizes. Default `md`. */
  size?: PresetSize;
  /** Full width, like a block button. */
  block?: boolean;
}

const ButtonPreset = React.forwardRef<HTMLSpanElement, SkeletonButtonProps>(
  ({ size = "md", block = false, className, ...props }, ref) => (
    <Root
      ref={ref}
      {...props}
      data-slot="skeleton-button"
      className={mergeClassName(
        cn(
          "block shrink-0",
          controlHeight[size],
          controlRadius,
          block ? "w-full" : buttonWidth[size],
        ),
        className,
      )}
    />
  ),
);
ButtonPreset.displayName = "Skeleton.Button";

export interface SkeletonInputProps extends PresetBase {
  /** Input's sizes. Default `md`. */
  size?: PresetSize;
}

const InputPreset = React.forwardRef<HTMLSpanElement, SkeletonInputProps>(
  ({ size = "md", className, ...props }, ref) => (
    <Root
      ref={ref}
      {...props}
      data-slot="skeleton-input"
      className={mergeClassName(cn("block w-full", controlHeight[size], controlRadius), className)}
    />
  ),
);
InputPreset.displayName = "Skeleton.Input";

/* ---- Image: an aspect-ratio box, optionally with a decorative icon ---- */

export interface SkeletonImageProps extends PresetBase {
  /** CSS aspect ratio. Default `"16 / 9"`. */
  aspectRatio?: string;
  /** Show a faint image icon in the middle. Default `false`. */
  icon?: boolean;
}

const ImagePreset = React.forwardRef<HTMLSpanElement, SkeletonImageProps>(
  ({ aspectRatio = "16 / 9", icon = false, className, style, ...props }, ref) => (
    <Shape
      ref={ref}
      {...props}
      data-slot="skeleton-image"
      style={{ aspectRatio, ...style }}
      className={mergeClassName("flex h-auto w-full items-center justify-center", className)}
      decoration={
        icon ? (
          <ImageIcon aria-hidden="true" className="text-fg-muted size-8 opacity-50" />
        ) : undefined
      }
    />
  ),
);
ImagePreset.displayName = "Skeleton.Image";

/* ============================================================
 * Group: the loading region
 * ============================================================ */

export interface SkeletonGroupProps extends React.ComponentPropsWithRef<"div"> {
  /** Default `true`. Passed to every Skeleton inside that doesn't set its own. */
  loading?: boolean;
  /** Announced once when loading starts (after `delay`). Be specific: "Loading orders". Default "Loading". */
  label?: string;
  /** Announced when loading ends, if loading was announced. Optional: "Orders loaded". */
  loadedLabel?: string;
  /** Animation for every Skeleton inside. */
  animation?: SkeletonAnimation;
  /** Delay for every Skeleton inside and for the announcement. If loading ends first, nothing is said. */
  delay?: LoadingDelay;
  render?: useRender.RenderProp;
}

const Group = React.forwardRef<HTMLDivElement, SkeletonGroupProps>(
  (
    {
      loading = true,
      label = "Loading",
      loadedLabel,
      animation,
      delay,
      render,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const ms = delayMs(delay);
    const announced = React.useRef(false);

    // One announcement per loading cycle, after the delay; none if loading ends first
    React.useEffect(() => {
      if (!loading) return;
      const timer = setTimeout(() => {
        announce(label);
        announced.current = true;
      }, ms);
      return () => clearTimeout(timer);
    }, [loading, label, ms]);

    React.useEffect(() => {
      if (loading || !announced.current) return;
      announced.current = false;
      if (loadedLabel) announce(loadedLabel);
    }, [loading, loadedLabel]);

    const context = React.useMemo(
      () => ({ loading, animation, delay }),
      [loading, animation, delay],
    );

    const element = useRender({
      defaultTagName: "div",
      render,
      ref,
      props: {
        ...props,
        "data-slot": "skeleton-group",
        "data-loading": loading ? "" : undefined,
        "aria-busy": loading || undefined,
        className: mergeClassName("flex flex-col gap-[var(--sp-control-gap)]", className),
        children,
      },
    });
    return <GroupContext.Provider value={context}>{element}</GroupContext.Provider>;
  },
);
Group.displayName = "Skeleton.Group";

// Parts for the server-safe namespace in ./Skeleton (GEO-972). One named export
// each: a Server Component can't read properties off a client module.
export {
  Root as SkeletonRoot,
  Text as SkeletonText,
  AvatarPreset as SkeletonAvatar,
  ButtonPreset as SkeletonButton,
  InputPreset as SkeletonInput,
  ImagePreset as SkeletonImage,
  Group as SkeletonGroup,
};

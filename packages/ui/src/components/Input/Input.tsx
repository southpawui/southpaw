import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { Select as BaseSelect } from "@base-ui/react/select";
import {
  EnvelopeSimpleIcon,
  MagnifyingGlassIcon,
  LockSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { Button } from "../Button/Button";

// Heavy deps — only pulled in when Input.Phone or Input.Card are used
import {
  countryCodes,
  detectCountryCode,
  getPhoneFormat,
  formatNational,
} from "../../lib/input/phone-utils";
import type { CountryCode } from "../../lib/input/phone-utils";
import {
  detectCardBrand,
  formatCardNumber,
  formatCardExpiry,
  formatCvv,
  cardBrandIcons,
} from "../../lib/input/card-utils";
import type { CardBrand } from "../../lib/input/card-utils";

/* ============================================================
 * Simple format functions (no heavy deps)
 * ============================================================ */

function formatUrl(value: string): string {
  return value.replace(/^https?:\/\//i, "");
}

/* ============================================================
 * Purpose config — simple types only
 * ============================================================ */
interface PurposeConfig {
  maxWidth: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  defaultPrepend?: string;
  defaultPrependIcon?: React.ComponentType;
  format?: (value: string) => string;
}

const purposeConfig: Record<string, PurposeConfig> = {
  name: { maxWidth: "sm:max-w-64", autoComplete: "name", placeholder: "Full name" },
  "given-name": { maxWidth: "sm:max-w-48", autoComplete: "given-name", placeholder: "First name" },
  "family-name": { maxWidth: "sm:max-w-48", autoComplete: "family-name", placeholder: "Last name" },
  username: { maxWidth: "sm:max-w-64", autoComplete: "username", placeholder: "Username" },
  email: {
    maxWidth: "sm:max-w-80",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
    defaultPrependIcon: EnvelopeSimpleIcon,
  },
  address: {
    maxWidth: "sm:max-w-full",
    autoComplete: "street-address",
    placeholder: "Street address",
  },
  city: { maxWidth: "sm:max-w-48", autoComplete: "address-level2", placeholder: "City" },
  postcode: { maxWidth: "sm:max-w-32", autoComplete: "postal-code", placeholder: "Postcode" },
  country: { maxWidth: "sm:max-w-48", autoComplete: "country-name", placeholder: "Country" },
  url: {
    maxWidth: "sm:max-w-96",
    type: "text",
    autoComplete: "url",
    placeholder: "example.com",
    defaultPrepend: "https://",
    format: formatUrl,
  },
  search: {
    maxWidth: "sm:max-w-80",
    type: "search",
    placeholder: "Search...",
    defaultPrependIcon: MagnifyingGlassIcon,
  },
  currency: { maxWidth: "sm:max-w-40", type: "text", inputMode: "decimal", placeholder: "0.00" },
  number: { maxWidth: "sm:max-w-32", type: "number", inputMode: "numeric" },
  date: { maxWidth: "sm:max-w-40", type: "date" },
};

export type InputPurpose = keyof typeof purposeConfig;

/* ============================================================
 * Addon padding helper
 * ============================================================ */
const addonClasses =
  "text-fg-muted flex shrink-0 items-center text-sm select-none [&>svg]:h-[var(--sp-control-icon)] [&>svg]:w-[var(--sp-control-icon)]";

function addonPadding(content: React.ReactNode, side: "left" | "right"): string {
  if (typeof content === "string") return side === "left" ? "pl-3" : "pr-3";
  if (React.isValidElement(content) && content.type === Button) {
    return side === "left" ? "pl-0.5" : "pr-0.5";
  }
  return side === "left" ? "pl-2.5" : "pr-2.5";
}

/* ============================================================
 * Core Input
 * ============================================================ */
export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  purpose?: InputPurpose;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  /** Show valid/success state — green border + checkmark */
  valid?: boolean;
  /** @internal tight padding on prepend (used by sub-components) */
  _tightPrepend?: boolean;
}

const BaseInputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      purpose,
      prepend,
      append,
      valid,
      type,
      autoComplete,
      inputMode,
      placeholder,
      onChange,
      _tightPrepend,
      ...props
    },
    ref,
  ) => {
    const config = purpose ? purposeConfig[purpose] : undefined;

    const handleFormattedInput = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (config?.format) e.target.value = config.format(e.target.value);
        onChange?.(e);
      },
      [config, onChange],
    );

    let resolvedPrepend: React.ReactNode = prepend;
    if (prepend === undefined && config?.defaultPrepend) resolvedPrepend = config.defaultPrepend;
    else if (prepend === undefined && config?.defaultPrependIcon) {
      const Icon = config.defaultPrependIcon;
      resolvedPrepend = <Icon />;
    }

    // Auto-append checkmark when valid and no explicit append
    let resolvedAppend: React.ReactNode = append;
    if (valid && append === undefined) {
      resolvedAppend = <CheckIcon className="text-success h-4 w-4" />;
    }

    return (
      <div
        data-slot="input-group"
        className={cn(
          "flex items-center",
          "bg-surface-base w-full rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
          "border-border-control border-2",
          "h-[var(--sp-control-height)]",
          "transition-[border-color,box-shadow] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          "hover:border-fg-muted",
          "has-[:focus-visible]:sp-focus-ring",
          "has-[[data-invalid]]:border-danger",
          valid && "border-success",
          "has-[:disabled]:bg-surface-sunken has-[:disabled]:opacity-[var(--sp-state-disabled-opacity)]",
          "has-[input:read-only]:bg-surface-sunken has-[input:read-only]:border-border-default",
          config?.maxWidth,
          className,
        )}
      >
        {resolvedPrepend && (
          <span
            data-slot="input-prepend"
            className={cn(
              addonClasses,
              _tightPrepend ? "pl-0.5" : addonPadding(resolvedPrepend, "left"),
            )}
          >
            {resolvedPrepend}
          </span>
        )}
        <BaseInput
          ref={ref}
          data-slot="input"
          type={type ?? config?.type}
          autoComplete={autoComplete ?? config?.autoComplete}
          inputMode={inputMode ?? config?.inputMode}
          placeholder={placeholder ?? config?.placeholder}
          onChange={config?.format ? handleFormattedInput : onChange}
          className={cn(
            "text-fg-default placeholder:text-fg-muted h-full w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed",
            resolvedPrepend ? "pl-1" : "pl-3",
            resolvedAppend ? "pr-1" : "pr-3",
          )}
          {...props}
        />
        {resolvedAppend && (
          <span
            data-slot="input-append"
            className={cn(addonClasses, addonPadding(resolvedAppend, "right"))}
          >
            {resolvedAppend}
          </span>
        )}
      </div>
    );
  },
);
BaseInputComponent.displayName = "Input";

/* ============================================================
 * Input.Phone — phone code selector
 * ============================================================ */
function PhoneCodeSelect({
  value,
  onChange,
  countries,
  disabled,
}: {
  value: string;
  onChange: (code: string) => void;
  countries: CountryCode[];
  disabled?: boolean;
}) {
  if (countries.length === 1) {
    return (
      <span
        data-slot="input-phone-code"
        className="text-fg-default inline-flex h-[calc(var(--sp-control-height)-8px)] shrink-0 items-center px-2.5 text-sm"
      >
        ({countries[0].code})
      </span>
    );
  }
  return (
    <BaseSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      <BaseSelect.Trigger
        data-slot="input-phone-code"
        aria-label="Country code"
        disabled={disabled}
        className={cn(
          "inline-flex h-[calc(var(--sp-control-height)-8px)] shrink-0 cursor-pointer items-center rounded-[calc(var(--radius-DEFAULT)-4px)] px-2.5",
          "text-fg-default text-sm",
          "transition-colors duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]",
          "hover:bg-[var(--sp-state-hover)]",
          "focus-visible:sp-focus-ring",
          disabled && "pointer-events-none cursor-not-allowed",
        )}
      >
        ({value})
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50">
          <BaseSelect.Popup
            className={cn(
              "bg-surface-overlay max-h-60 w-64 overflow-y-auto rounded-[var(--radius-DEFAULT)] p-1 shadow-lg",
              "border-border-default border",
            )}
          >
            <BaseSelect.List>
              {countries.map((c) => (
                <BaseSelect.Item
                  key={`${c.country}-${c.code}`}
                  value={c.code}
                  className={cn(
                    "text-fg-default relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 pl-7 text-sm outline-none",
                    "data-[highlighted]:bg-[var(--sp-state-hover)]",
                  )}
                >
                  <BaseSelect.ItemIndicator className="text-accent absolute left-2 flex h-4 w-4 items-center justify-center">
                    <CheckIcon className="h-3 w-3" />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText>
                    {c.flag} {c.name} ({c.code})
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

interface PhoneInputProps extends Omit<InputProps, "purpose" | "prepend"> {
  defaultCountryCode?: string;
  allowedCountries?: string[];
  excludedCountries?: string[];
  onPhoneChange?: (fullValue: string, parts: { code: string; number: string }) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      defaultCountryCode = "+44",
      allowedCountries,
      excludedCountries,
      onPhoneChange,
      onChange,
      placeholder,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [phoneCode, setPhoneCode] = React.useState(defaultCountryCode);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const prevDigitsRef = React.useRef("");

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const filteredCountries = React.useMemo(() => {
      let list = countryCodes;
      if (allowedCountries?.length) list = list.filter((c) => allowedCountries.includes(c.country));
      if (excludedCountries?.length)
        list = list.filter((c) => !excludedCountries.includes(c.country));
      return list;
    }, [allowedCountries, excludedCountries]);

    const currentCountry = React.useMemo(
      () => countryCodes.find((c) => c.code === phoneCode),
      [phoneCode],
    );
    const phoneFormat = React.useMemo(
      () =>
        currentCountry
          ? getPhoneFormat(currentCountry.country)
          : { placeholder: "0000 000000", maxDigits: 15 },
      [currentCountry],
    );

    const handleCodeChange = React.useCallback(
      (code: string) => {
        setPhoneCode(code);
        if (inputRef.current) {
          const digits = inputRef.current.value.replace(/[^\d]/g, "");
          inputRef.current.value = formatNational(digits, code);
          onPhoneChange?.(`${code}${digits}`, { code, number: digits });
        }
      },
      [onPhoneChange],
    );

    const handleInput = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const prevCursor = input.selectionStart ?? input.value.length;

        let raw = input.value;
        const detected = detectCountryCode(raw);
        if (detected) {
          setPhoneCode(detected.code);
          raw = raw.replace(/[^\d+]/g, "").slice(detected.code.replace(/-/g, "").length);
        }
        const digits = raw.replace(/[^\d]/g, "");
        const codeDigits = phoneCode.replace(/[^\d]/g, "");
        let cleanDigits = digits.startsWith(codeDigits) ? digits.slice(codeDigits.length) : digits;
        cleanDigits = cleanDigits.slice(0, phoneFormat.maxDigits);

        // Count digits before cursor in the old value
        const digitsBefore = input.value.slice(0, prevCursor).replace(/[^\d]/g, "").length;

        if (cleanDigits === prevDigitsRef.current && !detected) {
          input.value = formatNational(cleanDigits, phoneCode);
          return;
        }
        prevDigitsRef.current = cleanDigits;
        const activeCode = detected?.code ?? phoneCode;

        const formatted = formatNational(cleanDigits, activeCode);
        input.value = formatted;

        // Restore cursor to the same digit offset in the new formatted value
        let digitCount = 0;
        let newCursor = formatted.length;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            digitCount++;
            if (digitCount === digitsBefore) {
              newCursor = i + 1;
              break;
            }
          }
        }
        input.setSelectionRange(newCursor, newCursor);

        onChange?.(e);
        onPhoneChange?.(`${activeCode}${cleanDigits}`, { code: activeCode, number: cleanDigits });
      },
      [phoneCode, phoneFormat.maxDigits, onChange, onPhoneChange],
    );

    return (
      <BaseInputComponent
        ref={mergedRef}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder={placeholder ?? phoneFormat.placeholder}
        onChange={handleInput}
        disabled={disabled}
        prepend={
          <PhoneCodeSelect
            value={phoneCode}
            onChange={handleCodeChange}
            countries={filteredCountries}
            disabled={disabled}
          />
        }
        className="sm:max-w-64"
        _tightPrepend
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "Input.Phone";

/* ============================================================
 * Input.Card — card number / expiry / cvv
 * ============================================================ */
interface CardInputProps extends Omit<InputProps, "purpose" | "append"> {
  field?: "number" | "expiry" | "cvv";
  allowedBrands?: CardBrand[];
  /** Fires when the detected card brand changes. `allowed` is false when the brand is not in `allowedBrands`. */
  onBrandChange?: (brand: CardBrand, allowed: boolean) => void;
}

const CardInput = React.forwardRef<HTMLInputElement, CardInputProps>(
  ({ field = "number", allowedBrands, onBrandChange, onChange, ...props }, ref) => {
    const [cardBrand, setCardBrand] = React.useState<CardBrand>("unknown");

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (field === "number") {
          e.target.value = formatCardNumber(e.target.value);
          const brand = detectCardBrand(e.target.value.replace(/\D/g, ""));
          setCardBrand(brand);
          const allowed =
            !allowedBrands?.length || brand === "unknown" || allowedBrands.includes(brand);
          onBrandChange?.(brand, allowed);
        } else if (field === "expiry") {
          e.target.value = formatCardExpiry(e.target.value);
        } else if (field === "cvv") {
          e.target.value = formatCvv(e.target.value);
        }
        onChange?.(e);
      },
      [field, allowedBrands, onBrandChange, onChange],
    );

    const CardIcon = cardBrandIcons[cardBrand];
    const configs = {
      number: {
        autoComplete: "cc-number",
        inputMode: "numeric" as const,
        placeholder: "4242 4242 4242 4242",
        className: "sm:max-w-56",
        append: <CardIcon width={32} height={20} />,
      },
      expiry: {
        autoComplete: "cc-exp",
        inputMode: "numeric" as const,
        placeholder: "MM / YY",
        className: "sm:max-w-28",
        append: undefined,
      },
      cvv: {
        autoComplete: "cc-csc",
        inputMode: "numeric" as const,
        placeholder: "123",
        className: "sm:max-w-20",
        append: undefined,
      },
    };
    const config = configs[field];

    return (
      <BaseInputComponent
        ref={ref}
        type="text"
        autoComplete={config.autoComplete}
        inputMode={config.inputMode}
        placeholder={config.placeholder}
        onChange={handleChange}
        append={config.append}
        className={config.className}
        {...props}
      />
    );
  },
);
CardInput.displayName = "Input.Card";

/* ============================================================
 * Input.Password — show/hide toggle
 * ============================================================ */
interface PasswordInputProps extends Omit<InputProps, "purpose" | "type" | "append"> {
  autoComplete?: "new-password" | "current-password";
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ autoComplete = "new-password", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <BaseInputComponent
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        prepend={<LockSimpleIcon />}
        append={
          <Button
            size="icon"
            variant="ghost"
            icon={visible ? <EyeSlashIcon /> : <EyeIcon />}
            srOnly={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="h-[calc(var(--sp-control-height)-8px)] w-[calc(var(--sp-control-height)-8px)] rounded-[calc(var(--radius-DEFAULT)-4px)]"
          />
        }
        className="sm:max-w-72"
        {...props}
      />
    );
  },
);
PasswordInput.displayName = "Input.Password";

/* ============================================================
 * Compound export
 * ============================================================ */
export const Input = Object.assign(BaseInputComponent, {
  Phone: PhoneInput,
  Card: CardInput,
  Password: PasswordInput,
});

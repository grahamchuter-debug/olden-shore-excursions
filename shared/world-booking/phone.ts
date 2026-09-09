/**
 * Lightweight international phone helpers for Olden (and shared booking flows).
 * No third-party dependency — curated dial codes + E.164 normalisation.
 */

export type PhoneDialOption = {
  iso: string;
  dial: string;
  label: string;
};

/** Common cruise-guest countries. Default for Olden site context is Norway. */
export const PHONE_DIAL_OPTIONS: readonly PhoneDialOption[] = [
  { iso: "NO", dial: "+47", label: "Norway (+47)" },
  { iso: "GB", dial: "+44", label: "United Kingdom (+44)" },
  { iso: "IE", dial: "+353", label: "Ireland (+353)" },
  { iso: "US", dial: "+1", label: "United States (+1)" },
  { iso: "CA", dial: "+1", label: "Canada (+1)" },
  { iso: "DE", dial: "+49", label: "Germany (+49)" },
  { iso: "NL", dial: "+31", label: "Netherlands (+31)" },
  { iso: "FR", dial: "+33", label: "France (+33)" },
  { iso: "ES", dial: "+34", label: "Spain (+34)" },
  { iso: "IT", dial: "+39", label: "Italy (+39)" },
  { iso: "SE", dial: "+46", label: "Sweden (+46)" },
  { iso: "DK", dial: "+45", label: "Denmark (+45)" },
  { iso: "AU", dial: "+61", label: "Australia (+61)" },
  { iso: "NZ", dial: "+64", label: "New Zealand (+64)" },
  { iso: "IN", dial: "+91", label: "India (+91)" },
  { iso: "SG", dial: "+65", label: "Singapore (+65)" },
  { iso: "AE", dial: "+971", label: "United Arab Emirates (+971)" },
] as const;

export const DEFAULT_PHONE_DIAL_CODE = "+47";

const E164 = /^\+[1-9]\d{7,14}$/;

export function isE164Phone(value: string): boolean {
  return E164.test(value.trim());
}

/** Digits only from a national/local fragment; strips a single leading trunk 0. */
export function nationalPhoneDigits(national: string): string {
  let digits = national.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/**
 * Build E.164 from dial code + national number.
 * If `national` is already a full international number (+…), return that when valid.
 */
export function composeE164Phone(dialCode: string, national: string): string | null {
  const trimmedNational = national.trim();
  if (trimmedNational.startsWith("+")) {
    const compact = `+${trimmedNational.slice(1).replace(/\D/g, "")}`;
    return isE164Phone(compact) ? compact : null;
  }
  const dial = dialCode.trim();
  if (!/^\+[1-9]\d{0,3}$/.test(dial)) return null;
  const digits = nationalPhoneDigits(trimmedNational);
  if (digits.length < 6 || digits.length > 14) return null;
  const composed = `${dial}${digits}`;
  return isE164Phone(composed) ? composed : null;
}

export function validateInternationalPhone(value: string): string | null {
  if (!value.trim()) {
    return "Please enter a Mobile / WhatsApp number so we can reach you about this request.";
  }
  if (!isE164Phone(value)) {
    return "Please include your country code (for example +44…) with a valid Mobile / WhatsApp number.";
  }
  return null;
}

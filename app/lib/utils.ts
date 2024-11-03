import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FieldType, InputFieldType, OptionsField, SimpleField } from "./types";

export const isBrowser = typeof window !== "undefined";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getInitialFieldState = ({
  type,
  options,
  name,
  required,
}: {
  type: FieldType;
  options?: string[];
  name?: string;
  required?: boolean;
}): InputFieldType => {
  const baseField = {
    name: name || "",
    type,
    required: required || false,
    enabled: true,
  };

  return type === "number" || type === "text"
    ? ({ ...baseField } as SimpleField)
    : ({ ...baseField, options: options || [] } as OptionsField);
};

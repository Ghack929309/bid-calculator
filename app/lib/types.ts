export type FieldType = "number" | "text" | "select" | "checkbox";
export type FormField = SimpleField | OptionsField;

interface BaseField {
  name: string;
  type: FieldType;
  required: boolean;
  enabled: boolean;
}

export interface SimpleField extends BaseField {
  type: "number" | "text";
  value: string;
}

export interface OptionsField extends BaseField {
  type: "select" | "checkbox";
  options: string[];
}

export type Field = {
  name: string;
  value: string;
  isRequired: boolean;
  type: FieldType;
  relatedField: string;
  relationType: string;
};

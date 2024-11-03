export type FieldType = "number" | "text" | "select" | "checkbox";
export type InputFieldType = SimpleField | OptionsField;

interface BaseField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  enabled: boolean;
}

export interface SimpleField extends BaseField {
  type: "number" | "text";
}

export interface OptionsField extends BaseField {
  type: "select" | "checkbox";
  options: string[];
}

export type LogicFieldType = {
  name: string;
  value: string;
  isRequired: boolean;
  type: FieldType;
  relatedField: string;
  relationType: string;
};

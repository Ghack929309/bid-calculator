export type FieldType = "number" | "text" | "select" | "checkbox";
export type InputFieldType = SimpleField | OptionsField;

export enum CalculationType {
  SIMPLE = "simple",
  CONDITIONAL = "conditional",
}

interface BaseField {
  id: string;
  sectionId: string;
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
  options: {
    value: string;
    id: string;
    fieldId: string;
  }[];
}

export type LogicFieldType = {
  id: string;
  sectionId: string;
  name: string;
};

export type OperatorType =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "percentage";
export type CalculationFieldType = "number" | "field" | "logic";

export type CalculationValue = {
  type: CalculationFieldType;
  fieldId: string | null;
  value: string;
};
export type CalculationOperation = {
  id: string;
  operator: OperatorType;
  value1: CalculationValue;
  value2?: CalculationValue;
};

export type SimpleCalculationType = {
  id: string;
  logicId: string;
  type: CalculationType.SIMPLE;
  operations: CalculationOperation[];
};

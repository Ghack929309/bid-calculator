export type FieldType = "number" | "text" | "select" | "checkbox";

export enum CalculationType {
  SIMPLE = "simple",
  CONDITIONAL = "conditional",
}

export type InputFieldType = {
  id: string;
  sectionId: string;
  name: string;
  required: boolean;
  enabled: boolean;
} & (
  | {
      type: "number" | "text";
    }
  | {
      type: "select" | "checkbox";
      options: {
        value: string;
        id: string;
        fieldId: string;
      }[];
    }
);

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

export type FieldType = "number" | "text" | "select" | "checkbox";
export type InputFieldType = SimpleField | OptionsField;

interface BaseField {
  id: string;
  section: string;
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
  type: "simple";
  operations: CalculationOperation[];
};

export type ConditionalCalculationType = {
  id: string;
  logicId: string;
  type: "conditional";
  existingLogic: {
    id: string;
    name: string;
  };
  conditions: ConditionType[];
  thenCalculations: SimpleCalculationType;
  elseCalculations: SimpleCalculationType;
};

export type ConditionType = {
  id: string;
  field: string;
  type: "condition";
  comparison: string;
  value: string;
  value2: string;
  logicalOperator: "and" | "or";
};

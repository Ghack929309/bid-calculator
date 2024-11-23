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

export const FieldTypes = {
  INPUT: "input",
  LOGIC: "logic",
} as const;

export type ConditionType = {
  id: string;
  fieldType: typeof FieldTypes.INPUT | typeof FieldTypes.LOGIC;
  field: string;
  operator: string;
  compareValueType: (typeof CompareValueTypes)[keyof typeof CompareValueTypes];
  compareValue: string;
  compareFieldId: string;
  valueType: string;
  resultType: string;
  resultValue: string;
  resultField: string;
  mathOperation: string;
  operationValue: string;
  thenValue: string;
  thenOperation: string;
  thenCalculations: SimpleCalculationType;
  elseValue: string;
  elseOperation: string;
  elseCalculations: SimpleCalculationType;
};

export const ConditionOperators = {
  EQUALS: "equals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  GREATER_EQUAL: "greaterEqual",
  LESS_EQUAL: "lessEqual",
};

export const CompareValueTypes = {
  FIXED: "fixed",
  INPUT: "input",
  LOGIC: "logic",
} as const;

export const MathOperations = {
  NONE: "none",
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
  PERCENTAGE: "percentage",
};

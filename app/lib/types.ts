export type FieldType = "number" | "text" | "select" | "checkbox";

export enum CalculationType {
  SIMPLE = "simple",
  CONDITIONAL = "conditional",
}

export type VariableType = "priceRange" | "miles";

export type PriceRangeVariable = {
  type: "priceRange";
  baseFieldId: string;
  entries: {
    min: string;
    max: string;
    value: string;
  }[];
};

export type MilesVariable = {
  type: "miles";
  baseFieldId: string;
  entries: {
    state: string;
    miles: string;
    ratePerMiles: string;
  }[];
};

export type MultiChoiceType = {
  type: "select" | "checkbox";
  options: {
    value: string;
    id: string;
    fieldId: string;
  }[];
};
export type InputFieldType = {
  id: string;
  sectionId: string;
  name: string;
  required: boolean;
  enabled: boolean;
  isPrivate: boolean;
} & (
  | {
      type: "number" | "text";
    }
  | MultiChoiceType
  | PriceRangeVariable
  | MilesVariable
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
  | "percentage"
  | "none";

export const MathOperations: { [K in Uppercase<OperatorType>]: Lowercase<K> } =
  {
    ADD: "add",
    SUBTRACT: "subtract",
    MULTIPLY: "multiply",
    DIVIDE: "divide",
    PERCENTAGE: "percentage",
    NONE: "none",
  } as const;

export type CalculationFieldType = "number" | "field" | "logic";

export type CalculationValue = {
  type: CalculationFieldType;
  fieldId: string | null;
  logicId: string | null;
  value: string;
};
export type CalculationOperation = {
  id: string;
  operator: OperatorType;
  nextOperator: OperatorType;
  value1: CalculationValue;
  value2?: CalculationValue;
};

export type SimpleCalculationType = {
  id: string;
  logicId: string;
  type: CalculationType.SIMPLE;
  operations: CalculationOperation[];
};

export type ConditionalOperation = {
  then: CalculationOperation[];
  else: CalculationOperation[];
};

export type ConditionalCalculationType = {
  id: string;
  logicId: string;
  type: CalculationType.CONDITIONAL;
  comparator: ConditionOperators;
  comparedValues: {
    value1: CalculationValue;
    value2: CalculationValue;
  };
  operations: ConditionalOperation;
};

export const FieldTypes = {
  INPUT: "input",
  LOGIC: "logic",
} as const;

export enum ConditionOperators {
  EQUALS = "equals",
  GREATER_THAN = "greaterThan",
  LESS_THAN = "lessThan",
  GREATER_EQUAL = "greaterEqual",
  LESS_EQUAL = "lessEqual",
}

export const CompareValueTypes = {
  FIXED: "number",
  INPUT: "field",
  LOGIC: "logic",
} as const;

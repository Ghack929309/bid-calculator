export const operations = [
  { value: "add", label: "Add (+)" },
  { value: "subtract", label: "Subtract (-)" },
  { value: "multiply", label: "Multiply (×)" },
  { value: "divide", label: "Divide (÷)" },
  { value: "percentage", label: "Percentage (%)" },
];

export const comparisons = [
  { value: "equals", label: "Equals (=)" },
  { value: "notEquals", label: "Not Equals (≠)" },
  { value: "greaterThan", label: "Greater Than (>)" },
  { value: "lessThan", label: "Less Than (<)" },
  { value: "between", label: "Between" },
];

export const logicalOperators = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

export const defaultSimpleOperations = {
  id: "",
  operator: "add",
  nextOperator: "none",
  section: "",
  value1: {
    type: "field",
    fieldId: "",
    value: "",
  },
  value2: {
    type: "field",
    fieldId: "",
    value: "",
  },
};

import { v4 as uuidv4 } from "uuid";
import { defaultSimpleOperations } from "~/lib/constant";
import {
  CalculationOperation,
  CalculationType,
  CalculationValue,
  InputFieldType,
  LogicFieldType,
  OperatorType,
  SimpleCalculationType,
} from "~/lib/types";

type ValidationError = {
  message: string;
  field: string;
};
type ResolvedOperation = {
  operator: OperatorType;
  value1: number;
  value2: number;
};

type ResolvedCalculation = {
  operations: ResolvedOperation[];
};

type PreparedCalculationResult = {
  isValid: boolean;
  errors?: ValidationError[];
  data?: ResolvedCalculation;
};

class CalculationService {
  private static instance: CalculationService;

  private constructor() {}

  static getInstance(): CalculationService {
    if (!CalculationService.instance) {
      CalculationService.instance = new CalculationService();
    }
    return CalculationService.instance;
  }

  createSimpleCalculation({
    logicId,
  }: {
    logicId: string;
  }): SimpleCalculationType {
    const newCalculation = {
      id: uuidv4(),
      logicId,
      type: CalculationType.SIMPLE,
      operations: [{ ...defaultSimpleOperations, id: uuidv4() }],
    };
    // db.createCalculation(newCalculation as SimpleCalculationType);
    return newCalculation as SimpleCalculationType;
  }

  // createConditionalCalculation({
  //   logicId,
  // }: {
  //   logicId: string;
  // }): ConditionalCalculationType {
  //   return {
  //     id: uuidv4(),
  //     logicId,
  //     type: "conditional",
  //     existingLogic: {
  //       id: "",
  //       name: "",
  //     },
  //     conditions: [],
  //     thenCalculations: this.createSimpleCalculation({ logicId }),
  //     elseCalculations: this.createSimpleCalculation({ logicId }),
  //   };
  // }

  // createDefaultCondition(): ConditionType {
  //   return {
  //     id: uuidv4(),
  //     field: "",
  //     type: "condition",
  //     comparison: "",
  //     value: "",
  //     value2: "",
  //     logicalOperator: "and",
  //   };
  // }

  addCalculation({
    calculations,
    logicId,
  }: {
    calculations: SimpleCalculationType[];
    logicId: string;
  }) {
    console.log("calculations", calculations);
    const existingCalculation = calculations?.find(
      (c) => c.logicId === logicId
    );

    if (
      !existingCalculation ||
      existingCalculation.type !== CalculationType.SIMPLE
    ) {
      const id = uuidv4();
      const defaultData = this.createSimpleCalculation({ logicId });

      // db.createCalculation({ ...defaultData, id });
      return [...calculations, { ...defaultData, id }];
    }

    // Add new operation to existing calculation
    return calculations.map((calc) => {
      if (calc.logicId === logicId && calc.type === CalculationType.SIMPLE) {
        return {
          ...calc,
          operations: [
            ...calc.operations,
            {
              ...defaultSimpleOperations,
              id: uuidv4(),
            } as CalculationOperation,
          ],
        };
      }
      return calc;
    });
  }

  // addCondition({
  //   calculations,
  //   calculationId,
  // }: {
  //   calculations: (SimpleCalculationType | ConditionalCalculationType)[];
  //   calculationId: string;
  // }) {
  //   return calculations.map((calc) => {
  //     if (calc.id === calculationId && "conditions" in calc) {
  //       return {
  //         ...calc,
  //         conditions: [
  //           ...calc.conditions,
  //           { ...this.createDefaultCondition(), id: uuidv4() },
  //         ],
  //       };
  //     }
  //     return calc;
  //   });
  // }

  updateCalculationOperations({
    calculations,
    calculationId,
    operation,
  }: {
    calculations: SimpleCalculationType[];
    calculationId: string;
    operation: CalculationOperation;
  }) {
    return calculations.map((calc) => {
      if (calc.id === calculationId) {
        return {
          ...calc,
          operations: calc.operations.map((op) =>
            op.id === operation.id ? { ...operation } : op
          ),
        };
      }
      return calc;
    });
  }

  updateCalculation({
    calculations,
    id,
    updates,
  }: {
    calculations: SimpleCalculationType[];
    id: string;
    updates: Partial<SimpleCalculationType>;
  }) {
    return calculations.map((calc) =>
      calc.id === id ? { ...calc, ...updates } : calc
    );
  }

  removeCalculation({
    calculations,
    calculationId,
    operationId,
  }: {
    calculations: SimpleCalculationType[];
    calculationId: string;
    operationId: string;
  }) {
    return calculations.map((calc) => {
      if (calc.id === calculationId && "operations" in calc) {
        return {
          ...calc,
          operations: calc.operations.filter((op) => op.id !== operationId),
        };
      }
      return calc;
    });
  }

  // updateCondition({
  //   calculations,
  //   calculationId,
  //   conditionId,
  //   updates,
  // }: {
  //   calculations: (SimpleCalculationType | ConditionalCalculationType)[];
  //   calculationId: string;
  //   conditionId: string;
  //   updates: Partial<ConditionType>;
  // }) {
  //   return calculations.map((calc) => {
  //     if (calc.id === calculationId && "conditions" in calc) {
  //       return {
  //         ...calc,
  //         conditions: calc.conditions.map((cond) =>
  //           cond.id === conditionId ? { ...cond, ...updates } : cond
  //         ),
  //       };
  //     }
  //     return calc;
  //   });
  // }

  // removeCondition({
  //   calculations,
  //   calculationId,
  //   conditionId,
  // }: {
  //   calculations: (SimpleCalculationType | ConditionalCalculationType)[];
  //   calculationId: string;
  //   conditionId: string;
  // }) {
  //   return calculations.map((calc) => {
  //     if (calc.id === calculationId && "conditions" in calc) {
  //       return {
  //         ...calc,
  //         conditions: calc.conditions.filter((c) => c.id !== conditionId),
  //       };
  //     }
  //     return calc;
  //   });
  // }
  #computeOperation(operation: CalculationOperation): number {
    const value1 = parseFloat(operation.value1.value) || 0;
    const value2 = parseFloat(operation.value2?.value || "0") || 0;

    switch (operation.operator) {
      case "add":
        return value1 + value2;
      case "subtract":
        return value1 - value2;
      case "multiply":
        return value1 * value2;
      case "divide":
        return value2 !== 0 ? value1 / value2 : 0;
      case "percentage":
        return (value1 * value2) / 100;
      default:
        return 0;
    }
  }

  computeCalculation(calculation: SimpleCalculationType): number {
    if (!calculation?.operations?.length) return 0;

    return calculation.operations.reduce((total, operation) => {
      return total + this.#computeOperation(operation);
    }, 0);
  }

  validateAndPrepareCalculation(
    calculation: SimpleCalculationType,
    formFields: InputFieldType[],
    formData: Record<string, string>,
    logicFields: Record<string, LogicFieldType>
  ): PreparedCalculationResult {
    const errors: ValidationError[] = [];

    // Validate and prepare each operation
    const operations = calculation.operations.map((op, index) => {
      const value1Result = this.validateAndResolveValue(
        op.value1,
        formFields,
        formData,
        logicFields,
        `Operation ${index + 1} - Value 1`
      );
      const value2Result = this.validateAndResolveValue(
        op.value2 || {
          type: "number",
          fieldId: null,
          value: "0",
        },
        formFields,
        formData,
        logicFields,
        `Operation ${index + 1} - Value 2`
      );

      // Collect any errors
      if (value1Result.error) errors.push(value1Result.error);
      if (value2Result.error) errors.push(value2Result.error);

      return {
        operator: op.operator,
        value1: value1Result.value,
        value2: value2Result.value,
      };
    });

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      };
    }

    return {
      isValid: true,
      data: { operations },
    };
  }

  private validateAndResolveValue(
    value: CalculationValue,
    formFields: InputFieldType[],
    formData: Record<string, string>,
    logicFields: Record<string, LogicFieldType>,
    fieldIdentifier: string
  ): { value: number; error?: ValidationError } {
    switch (value.type) {
      case "number": {
        const numValue = parseFloat(value.value);
        if (isNaN(numValue)) {
          return {
            value: 0,
            error: {
              field: fieldIdentifier,
              message: "Invalid number value",
            },
          };
        }
        return { value: numValue };
      }

      case "field": {
        const field = formFields.find((f) => f.id === value.fieldId);
        if (!field) {
          return {
            value: 0,
            error: {
              field: fieldIdentifier,
              message: "Field not found",
            },
          };
        }
        if (field.type !== "number") {
          return {
            value: 0,
            error: {
              field: fieldIdentifier,
              message: "Field must be of type number",
            },
          };
        }
        const fieldValue = parseFloat(formData[value.fieldId || ""] || "0");
        if (isNaN(fieldValue)) {
          return {
            value: 0,
            error: {
              field: fieldIdentifier,
              message: "Invalid field value",
            },
          };
        }
        return { value: fieldValue };
      }

      default:
        return {
          value: 0,
          error: {
            field: fieldIdentifier,
            message: "Invalid value type",
          },
        };
    }
  }
}

export const calculationService = CalculationService.getInstance();

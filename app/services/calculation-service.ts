import { v4 as uuidv4 } from "uuid";
import { defaultSimpleOperations } from "~/lib/constant";
import {
  CalculationOperation,
  CalculationType,
  CalculationValue,
  InputFieldType,
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
  private computedValues: Map<string, number> = new Map();
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

  #resolveValue(
    value: any,
    formFields?: InputFieldType[],
    formData?: Record<string, string>
  ): number {
    if (!value) return 0;

    // Handle direct number or string values
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value) || 0;

    if (typeof value === "object") {
      if (value.type === "number") {
        return parseFloat(value.value) || 0;
      }

      if (value.type === "field" && formFields && formData) {
        // Check if we already computed this field
        const cacheKey = `field_${value.fieldId}`;
        if (this.computedValues.has(cacheKey)) {
          return this.computedValues.get(cacheKey)!;
        }

        const field = formFields.find((f) => f.id === value.fieldId);
        if (!field) return 0;

        // If this field has its own calculation
        if ("calculation" in field && field.calculation) {
          const result = this.computeCalculation(
            field.calculation,
            formFields,
            formData
          );
          this.computedValues.set(cacheKey, result);
          return result;
        }

        // If it's a simple field value
        const fieldValue = parseFloat(formData[value.fieldId] || "0");
        this.computedValues.set(cacheKey, fieldValue);
        return fieldValue;
      }
    }

    return 0;
  }

  #computeOperation(
    operation: any,
    formFields?: InputFieldType[],
    formData?: Record<string, string>
  ): number {
    const value1 = this.#resolveValue(operation.value1, formFields, formData);
    const value2 =
      this.#resolveValue(operation.value2, formFields, formData) || 0;

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

  computeCalculation(
    calculation: any,
    formFields?: InputFieldType[],
    formData?: Record<string, string>
  ): number {
    // Clear the memoization cache for new calculations
    this.computedValues.clear();

    if (!calculation?.operations) return 0;

    const operations =
      typeof calculation.operations === "string"
        ? JSON.parse(calculation.operations)
        : calculation.operations;

    if (!Array.isArray(operations) || operations.length === 0) return 0;

    return operations.reduce((total, operation) => {
      return total + this.#computeOperation(operation, formFields, formData);
    }, 0);
  }

  validateAndPrepareCalculation(
    calculation: SimpleCalculationType,
    formFields: InputFieldType[],
    formData: Record<string, string>
  ): PreparedCalculationResult {
    const errors: ValidationError[] = [];

    // Parse operations if they're stored as a JSON string
    const operations =
      typeof calculation.operations === "string"
        ? JSON.parse(calculation.operations)
        : calculation.operations;

    // Validate and prepare each operation
    const validatedOperations = operations.map((op: any, index: number) => {
      const value1Result = this.validateAndResolveValue(
        op.value1,
        formFields,
        formData,
        `Operation ${index + 1} - Value 1`
      );
      const value2Result = this.validateAndResolveValue(
        op.value2 || { type: "number", fieldId: null, value: "0" },
        formFields,
        formData,
        `Operation ${index + 1} - Value 2`
      );

      if (value1Result.error) errors.push(value1Result.error);
      if (value2Result.error) errors.push(value2Result.error);

      return {
        operator: op.operator,
        value1: value1Result.value,
        value2: value2Result.value,
      };
    });

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      data: { operations: validatedOperations },
    };
  }

  private validateAndResolveValue(
    value: CalculationValue,
    formFields: InputFieldType[],
    formData: Record<string, string>,
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

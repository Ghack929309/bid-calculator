import { v4 as uuidv4 } from "uuid";
import {
  ConditionalCalculationType,
  ConditionType,
  SimpleCalculationType,
} from "~/lib/types";

class CalculationService {
  private static instance: CalculationService;

  private constructor() {}

  static getInstance(): CalculationService {
    if (!CalculationService.instance) {
      CalculationService.instance = new CalculationService();
    }
    return CalculationService.instance;
  }

  createSimpleCalculation(): SimpleCalculationType {
    return {
      id: uuidv4(),
      name: "",
      type: "simple",
      operation: "",
      value: "",
      baseField: "",
      existingLogic: {
        id: "",
        name: "",
      },
    };
  }

  createConditionalCalculation(): ConditionalCalculationType {
    return {
      id: uuidv4(),
      name: "",
      type: "conditional",
      existingLogic: {
        id: "",
        name: "",
      },
      conditions: [],
      thenCalculations: this.createSimpleCalculation(),
      elseCalculations: this.createSimpleCalculation(),
    };
  }

  createDefaultCondition(): ConditionType {
    return {
      id: uuidv4(),
      field: "",
      type: "condition",
      comparison: "",
      value: "",
      value2: "",
      logicalOperator: "and",
    };
  }

  addCalculation({
    calculations,
    type = "simple",
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    type?: "simple" | "conditional";
  }) {
    const defaultCalculation =
      type === "simple"
        ? this.createSimpleCalculation()
        : this.createConditionalCalculation();
    return [...calculations, { ...defaultCalculation, id: uuidv4(), type }];
  }

  addCondition({
    calculations,
    calculationId,
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    calculationId: string;
  }) {
    return calculations.map((calc) => {
      if (calc.id === calculationId && "conditions" in calc) {
        return {
          ...calc,
          conditions: [
            ...calc.conditions,
            { ...this.createDefaultCondition(), id: uuidv4() },
          ],
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
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    id: string;
    updates: Partial<SimpleCalculationType | ConditionalCalculationType>;
  }) {
    return calculations.map((calc) =>
      calc.id === id ? { ...calc, ...updates } : calc
    );
  }

  updateCondition({
    calculations,
    calculationId,
    conditionId,
    updates,
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    calculationId: string;
    conditionId: string;
    updates: Partial<ConditionType>;
  }) {
    return calculations.map((calc) => {
      if (calc.id === calculationId && "conditions" in calc) {
        return {
          ...calc,
          conditions: calc.conditions.map((cond) =>
            cond.id === conditionId ? { ...cond, ...updates } : cond
          ),
        };
      }
      return calc;
    });
  }

  removeCalculation({
    calculations,
    id,
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    id: string;
  }) {
    return calculations.filter((c) => c.id !== id);
  }

  removeCondition({
    calculations,
    calculationId,
    conditionId,
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    calculationId: string;
    conditionId: string;
  }) {
    return calculations.map((calc) => {
      if (calc.id === calculationId && "conditions" in calc) {
        return {
          ...calc,
          conditions: calc.conditions.filter((c) => c.id !== conditionId),
        };
      }
      return calc;
    });
  }
}

export const calculationService = CalculationService.getInstance();

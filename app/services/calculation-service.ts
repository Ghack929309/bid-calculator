import { v4 as uuidv4 } from "uuid";
import { defaultOperations } from "~/lib/constant";
import {
  CalculationOperation,
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

  createSimpleCalculation({
    logicId,
  }: {
    logicId: string;
  }): SimpleCalculationType {
    return {
      id: uuidv4(),
      logicId,
      type: "simple",
      operations: [
        { ...defaultOperations, id: uuidv4() } as CalculationOperation,
      ],
    };
  }

  createConditionalCalculation({
    logicId,
  }: {
    logicId: string;
  }): ConditionalCalculationType {
    return {
      id: uuidv4(),
      logicId,
      type: "conditional",
      existingLogic: {
        id: "",
        name: "",
      },
      conditions: [],
      thenCalculations: this.createSimpleCalculation({ logicId }),
      elseCalculations: this.createSimpleCalculation({ logicId }),
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
    logicId,
  }: {
    calculations: (SimpleCalculationType | ConditionalCalculationType)[];
    type?: "simple" | "conditional";
    logicId: string;
  }) {
    const defaultData =
      type === "simple"
        ? this.createSimpleCalculation({ logicId })
        : this.createConditionalCalculation({ logicId });
    const newCalculations = (calculations as SimpleCalculationType[]).map(
      (calc) => {
        if (calc.logicId === logicId) {
          calc.operations.push(defaultOperations as CalculationOperation);
        }
        return calc;
      }
    );
    return newCalculations.length > 0
      ? newCalculations
      : [...calculations, { ...defaultData, id: uuidv4(), type }];
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

  updateCalculationOperations({
    calculations,
    calculationLogicId,
    operation,
  }: {
    calculations: SimpleCalculationType[];
    calculationLogicId: string;
    operation: CalculationOperation;
  }) {
    return calculations.map((calc) => {
      if (calc.logicId === calculationLogicId) {
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

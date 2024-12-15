import { createContext, useContext, useState, ReactNode } from "react";
import { useFetcher } from "@remix-run/react";
import { calculationService } from "~/services/calculation-service";
import { Action } from "~/routes/admin.calculator";
import { createInitialCondition } from "~/lib/utils";
import {
  CalculationOperation,
  ConditionalCalculationType,
  SimpleCalculationType,
} from "~/lib/types";

interface CalculatorContextType {
  condition: ConditionalCalculationType | null;
  selectedSimpleCalculation: SimpleCalculationType | undefined;
  addCondition: () => void;
  updateCondition: (updates: Partial<ConditionalCalculationType>) => void;
  removeCondition: () => void;
  addNewSimpleCalculation: () => void;
  addNewSimpleOperation: () => void;
  removeSimpleOperation: (operationId: string) => void;
  updateSimpleOperation: (operation: CalculationOperation) => void;
  saveCalculations: () => void;
  updateConditionalOperation: (
    operation: CalculationOperation,
    type: "then" | "else"
  ) => void;
  removeConditionalOperation: (
    operationId: string,
    type: "then" | "else"
  ) => void;
  setSelectedSimpleCalculation: (calculation: SimpleCalculationType) => void;
  setCondition: (condition: ConditionalCalculationType | null) => void;
  setLogicId: (logicId: string | null) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [logicId, setLogicId] = useState<string | null>(null);
  const [selectedSimpleCalculation, setSelectedSimpleCalculation] = useState<
    SimpleCalculationType | undefined
  >(undefined);
  const calcFetcher = useFetcher();

  const [condition, setCondition] = useState<ConditionalCalculationType | null>(
    null
  );

  const addCondition = () => {
    const initialCondition = createInitialCondition();
    setCondition({ ...initialCondition, logicId: logicId as string });
  };

  const updateCondition = (updates: Partial<ConditionalCalculationType>) => {
    setCondition(condition ? { ...condition, ...updates } : null);
  };

  const removeCondition = () => {
    setCondition(null);
  };

  const addNewSimpleCalculation = () => {
    const newCalculation = calculationService.addCalculation({
      logicId: logicId as string,
    });

    setSelectedSimpleCalculation(newCalculation);
  };

  const addNewSimpleOperation = () => {
    if (!selectedSimpleCalculation) return;
    const newOperation = calculationService.addSimpleOperation();
    setSelectedSimpleCalculation({
      ...selectedSimpleCalculation,
      operations: [...selectedSimpleCalculation.operations, newOperation],
    });
  };

  const removeSimpleOperation = (operationId: string) => {
    if (!selectedSimpleCalculation) return;
    const updatedCalculation = calculationService.removeSimpleOperation({
      simpleCalculation: selectedSimpleCalculation,
      operationId,
    });
    setSelectedSimpleCalculation(updatedCalculation);
  };

  const updateSimpleOperation = (operation: CalculationOperation) => {
    if (!selectedSimpleCalculation) return;
    const update = calculationService.updateCalculationOperations({
      simpleCalculation: selectedSimpleCalculation,
      operation,
    });

    setSelectedSimpleCalculation(update);
  };

  const updateConditionalOperation = (
    operation: CalculationOperation,
    type: "then" | "else"
  ) => {
    if (!condition) return;
    const updatedCondition = {
      ...condition,
      operations: {
        ...condition.operations,
        [type]: condition.operations[type].map((op) =>
          op.id === operation.id ? operation : op
        ),
      },
    };
    setCondition(updatedCondition);
  };
  const removeConditionalOperation = (
    operationId: string,
    type: "then" | "else"
  ) => {
    if (!condition) return;
    const updatedCondition = {
      ...condition,
      operations: {
        ...condition.operations,
        [type]: condition.operations[type].filter(
          (op) => op.id !== operationId
        ),
      },
    };
    setCondition(updatedCondition);
  };

  const saveCalculations = () => {
    if (!selectedSimpleCalculation && !condition) return;

    calcFetcher.submit(
      {
        action: Action.createAndUpdateCalculation,
        data: selectedSimpleCalculation || condition,
      },
      { method: "post", encType: "application/json" }
    );
  };

  const value = {
    condition,
    selectedSimpleCalculation,
    addCondition,
    updateCondition,
    removeCondition,
    addNewSimpleCalculation,
    removeSimpleOperation,
    updateSimpleOperation,
    saveCalculations,
    setLogicId,
    updateConditionalOperation,
    removeConditionalOperation,
    setCondition,
    setSelectedSimpleCalculation,
    addNewSimpleOperation,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}

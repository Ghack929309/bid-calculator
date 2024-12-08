import { createContext, useContext, useState, ReactNode } from "react";
import { useFetcher } from "@remix-run/react";
import { calculationService } from "~/services/calculation-service";
import { Action } from "~/routes/admin";
import { createInitialCondition } from "~/lib/utils";
import {
  CalculationOperation,
  ConditionalCalculationType,
  SimpleCalculationType,
} from "~/lib/types";

interface CalculatorContextType {
  simpleCalculations: SimpleCalculationType[];
  condition: ConditionalCalculationType | null;
  selectedSimpleCalculation: SimpleCalculationType | undefined;
  addCondition: () => void;
  updateCondition: (updates: Partial<ConditionalCalculationType>) => void;
  removeCondition: () => void;
  addOperation: () => void;
  removeCalculation: (calculationId: string, operationId: string) => void;
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
  setSimpleCalculations: (calculations: SimpleCalculationType[]) => void;
  setConditionalCalculations: (
    calculations: ConditionalCalculationType[]
  ) => void;
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
  const [simpleCalculations, setSimpleCalculations] = useState<
    SimpleCalculationType[] | []
  >([]);
  const [conditionalCalculations, setConditionalCalculations] = useState<
    ConditionalCalculationType[] | []
  >([]);
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

  const addOperation = () => {
    const newCalculation = calculationService.addCalculation({
      calculations: simpleCalculations as SimpleCalculationType[],
      logicId: logicId as string,
    });
    setSimpleCalculations(newCalculation);
  };

  const removeCalculation = (calculationId: string, operationId: string) => {
    setSimpleCalculations((prev) =>
      calculationService.removeCalculation({
        calculations: prev,
        calculationId,
        operationId,
      })
    );
  };

  const updateSimpleOperation = (operation: CalculationOperation) => {
    if (!selectedSimpleCalculation) return;
    const update = calculationService.updateCalculationOperations({
      calculations: simpleCalculations as SimpleCalculationType[],
      calculationId: selectedSimpleCalculation?.id,
      operation,
    });
    setSimpleCalculations(update);
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
    simpleCalculations,
    condition,
    selectedSimpleCalculation,
    addCondition,
    updateCondition,
    removeCondition,
    addOperation,
    removeCalculation,
    updateSimpleOperation,
    saveCalculations,
    setLogicId,
    updateConditionalOperation,
    removeConditionalOperation,
    setCondition,
    setSimpleCalculations,
    setSelectedSimpleCalculation,
    setConditionalCalculations,
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

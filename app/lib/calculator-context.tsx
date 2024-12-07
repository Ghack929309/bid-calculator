import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { useFetcher } from "@remix-run/react";
import { calculationService } from "~/services/calculation-service";
import { Action } from "~/routes/admin";
import { createInitialCondition } from "~/lib/utils";
import {
  CalculationOperation,
  CalculationType,
  ConditionalCalculationType,
  SimpleCalculationType,
} from "~/lib/types";

interface CalculatorContextType {
  calculations: SimpleCalculationType[];
  condition: ConditionalCalculationType | null;
  selectedSimpleCalculation: SimpleCalculationType | undefined;
  addCondition: () => void;
  updateCondition: (updates: Partial<ConditionalCalculationType>) => void;
  removeCondition: () => void;
  addOperation: () => void;
  removeCalculation: (calculationId: string, operationId: string) => void;
  updateOperation: (operation: CalculationOperation) => void;
  saveCalculations: () => void;
  getInitialCalculations: (logicFieldId: string) => SimpleCalculationType[];
  updateConditionalOperation: (
    operation: CalculationOperation,
    type: "then" | "else"
  ) => void;
  removeConditionalOperation: (
    operationId: string,
    type: "then" | "else"
  ) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export function CalculatorProvider({
  children,
  logicId,
}: {
  children: ReactNode;
  logicId: string;
}) {
  const [initialCalculations, setInitialCalculations] = useState<
    SimpleCalculationType[] | ConditionalCalculationType[]
  >([]);
  const calcFetcher = useFetcher();
  const [calculations, setCalculations] = useState<SimpleCalculationType[]>(
    initialCalculations.filter(
      (cal) => cal.type === CalculationType.SIMPLE
    ) as SimpleCalculationType[]
  );
  const [condition, setCondition] = useState<ConditionalCalculationType | null>(
    initialCalculations.find(
      (cal) => cal.type === CalculationType.CONDITIONAL
    ) || null
  );

  const selectedSimpleCalculation = useMemo(() => {
    return calculations?.find(
      (cal) => cal.logicId === logicId && cal.type === CalculationType.SIMPLE
    );
  }, [calculations, logicId]);

  const getInitialCalculations = useCallback(
    (logicFieldId: string) => {
      const result = calculations.filter(
        (cal) => cal.logicId === logicFieldId
      ) as SimpleCalculationType[];
      setInitialCalculations(result);
      return result;
    },
    [calculations]
  );

  const addCondition = () => {
    const initialCondition = createInitialCondition();
    setCondition({ ...initialCondition, logicId });
  };

  const updateCondition = (updates: Partial<ConditionalCalculationType>) => {
    setCondition(condition ? { ...condition, ...updates } : null);
  };

  const removeCondition = () => {
    setCondition(null);
  };

  const addOperation = () => {
    const newCalculation = calculationService.addCalculation({
      calculations: calculations as SimpleCalculationType[],
      logicId,
    });
    setCalculations(newCalculation);
  };

  const removeCalculation = (calculationId: string, operationId: string) => {
    setCalculations((prev) =>
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
      calculations: calculations as SimpleCalculationType[],
      calculationId: selectedSimpleCalculation?.id,
      operation,
    });
    setCalculations(update);
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
    calculations,
    condition,
    selectedSimpleCalculation,
    addCondition,
    updateCondition,
    removeCondition,
    addOperation,
    removeCalculation,
    updateOperation: updateSimpleOperation,
    saveCalculations,
    getInitialCalculations,
    updateConditionalOperation,
    removeConditionalOperation,
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

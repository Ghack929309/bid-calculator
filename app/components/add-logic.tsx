import { useMemo, useState } from "react";
import { GitBranchPlus, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  CalculationOperation,
  ConditionType,
  InputFieldType,
  LogicFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { calculationService } from "~/services/calculation-service";
import { SimpleCalculation } from "./simple-calculation";
import { useFetcher } from "@remix-run/react";
import { Action } from "~/routes/admin";
import { ConditionalCalculation } from "./condition-calculation";
import { createInitialCondition } from "~/lib/utils";
import { Render } from "./render";

export function AddLogic({
  fields,
  logicId,
  logicalField,
  initialCalculations,
}: {
  fields: InputFieldType[];
  logicId: string;
  logicalField: LogicFieldType[];
  initialCalculations: SimpleCalculationType[];
}) {
  const calcFetcher = useFetcher();
  const [openModal, setOpenModal] = useState(false);
  const [calculations, setCalculations] =
    useState<SimpleCalculationType[]>(initialCalculations);

  const [condition, setCondition] = useState<ConditionType | null>(null);

  const addCondition = () => {
    setCondition(createInitialCondition());
  };

  const updateCondition = (updates: Partial<ConditionType>) => {
    setCondition(condition ? { ...condition, ...updates } : null);
  };

  const removeCondition = () => {
    setCondition(null);
  };

  const selectedCalculation = useMemo(() => {
    return calculations?.find((cal) => cal.logicId === logicId);
  }, [calculations, logicId]);

  const addOperation = () => {
    const newCalculation = calculationService.addCalculation({
      calculations: calculations as SimpleCalculationType[],
      logicId,
    });
    console.log("newCalculation", newCalculation);
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

  const updateOperation = (operation: CalculationOperation) => {
    console.log("operation", operation);
    if (!selectedCalculation) return;
    const update = calculationService.updateCalculationOperations({
      calculations: calculations as SimpleCalculationType[],
      calculationId: selectedCalculation?.id,
      operation,
    });
    console.log("update", update);
    setCalculations(update);
  };

  const saveCalculations = () => {
    if (!selectedCalculation) return;
    calcFetcher.submit(
      { action: Action.createAndUpdateCalculation, data: selectedCalculation },
      { method: "post", encType: "application/json" }
    );
    setOpenModal(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={(open) => setOpenModal(open)}>
      <DialogTrigger asChild>
        <GitBranchPlus className="w-4 h-4 cursor-pointer text-orange-500 hover:text-orange-700" />
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Calculator Builder</CardTitle>
            <CardDescription>
              Create complex calculations with conditions and mathematical
              operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <SimpleCalculation
                calculation={selectedCalculation}
                fields={fields}
                logicFields={logicalField}
                addMoreOperation={addOperation}
                updateOperation={updateOperation}
                onDelete={removeCalculation}
              />
              <Render when={condition !== null}>
                <ConditionalCalculation
                  condition={condition as ConditionType}
                  fields={fields}
                  logicFields={logicalField}
                  onUpdate={updateCondition}
                  onRemove={removeCondition}
                />
              </Render>
            </div>

            <div className="flex space-x-2">
              <Button
                disabled={calculations.length > 0}
                variant="outline"
                onClick={addOperation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Simple Calculation
              </Button>
              <Button
                disabled={condition !== null}
                className="mr-auto"
                variant="default"
                onClick={addCondition}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Conditional Calculation
              </Button>
            </div>
            <Button onClick={saveCalculations} variant="default">
              Save
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

import { useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  CalculationType,
  ConditionalCalculationType,
  InputFieldType,
  LogicFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { Dialog, DialogContent } from "./ui/dialog";
import { Calculator } from "./calculator";
import { ConditionalCalculation } from "./condition-calculation";
import { Render } from "./render";
import { useCalculator } from "~/lib/calculator-context";

export function AddLogic({
  open,
  close,
  fields,
  logicId,
  logicalField,
  allCalculations,
}: {
  open: boolean;
  close: () => void;
  fields: InputFieldType[];
  logicId: string;
  logicalField: LogicFieldType[];
  allCalculations: (SimpleCalculationType | ConditionalCalculationType)[];
}) {
  const {
    condition,
    addCondition,
    addNewSimpleCalculation,
    addNewSimpleOperation,
    removeCondition,
    updateCondition,
    updateSimpleOperation,
    removeSimpleOperation,
    selectedSimpleCalculation,
    saveCalculations,
    setCondition,
    setSelectedSimpleCalculation,
    setLogicId,
  } = useCalculator();
  const isButtonDisabled = !!condition || !!selectedSimpleCalculation;

  const init = useCallback(() => {
    setLogicId(logicId);

    setCondition(
      allCalculations?.find(
        (cal) =>
          cal.logicId === logicId && cal.type === CalculationType.CONDITIONAL
      ) as ConditionalCalculationType
    );
    setSelectedSimpleCalculation(
      allCalculations?.find(
        (cal) => cal.logicId === logicId && cal.type === CalculationType.SIMPLE
      ) as SimpleCalculationType
    );
  }, [
    allCalculations,
    logicId,
    setLogicId,
    setCondition,
    setSelectedSimpleCalculation,
  ]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Dialog open={open} onOpenChange={() => close()}>
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
              <Calculator
                addMoreOperation={addNewSimpleOperation}
                onDelete={removeSimpleOperation}
                updateOperation={updateSimpleOperation}
                operations={selectedSimpleCalculation?.operations}
                fields={fields}
                logicFields={logicalField}
              />
              <Render when={condition?.logicId === logicId}>
                <ConditionalCalculation
                  fields={fields}
                  logicFields={logicalField}
                  onUpdate={updateCondition}
                  onRemove={removeCondition}
                />
              </Render>
            </div>

            <div className="flex space-x-2">
              <Button
                disabled={isButtonDisabled}
                variant="outline"
                onClick={addNewSimpleCalculation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Simple Calculation
              </Button>
              <Button
                disabled={isButtonDisabled}
                className="mr-auto"
                variant="default"
                onClick={addCondition}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Conditional Calculation
              </Button>
            </div>
            <Button
              onClick={() => {
                saveCalculations();
                close();
              }}
              variant="default"
            >
              Save
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

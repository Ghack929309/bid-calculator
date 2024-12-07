import { useEffect, useState } from "react";
import { GitBranchPlus, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InputFieldType, LogicFieldType } from "~/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Calculator } from "./calculator";
import { ConditionalCalculation } from "./condition-calculation";
import { Render } from "./render";
import { useCalculator } from "~/lib/calculator-context";

export function AddLogic({
  fields,
  logicId,
  logicalField,
}: {
  fields: InputFieldType[];
  logicId: string;
  logicalField: LogicFieldType[];
}) {
  const {
    getInitialCalculations,
    calculations,
    condition,
    addCondition,
    addOperation,
    removeCondition,
    updateCondition,
    updateOperation,
    removeCalculation,
    selectedSimpleCalculation,
    saveCalculations,
  } = useCalculator();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getInitialCalculations(logicId);
  }, [logicId, getInitialCalculations]);

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
              <Calculator
                calculationId={selectedSimpleCalculation?.id as string}
                operations={selectedSimpleCalculation?.operations}
                fields={fields}
                logicFields={logicalField}
              />
              <Render when={condition !== null}>
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

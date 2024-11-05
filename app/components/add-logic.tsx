import { useState } from "react";
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
  CalculationOperation,
  ConditionalCalculationType,
  InputFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { calculationService } from "~/services/calculation-service";
import { SimpleCalculation } from "./simple-calculation";
import { ConditionalCalculation } from "./condition-calculation";
import { defaultOperations } from "~/lib/constant";
import { isBrowser } from "~/lib/utils";

export function AddLogic({
  fields,
  logicId,
}: {
  fields: InputFieldType[];
  logicId: string;
}) {
  const [calculations, setCalculations] = useState<
    (SimpleCalculationType | ConditionalCalculationType)[]
  >(isBrowser ? JSON.parse(localStorage.getItem("calculations") || "[]") : []);
  console.log("logic id", logicId);
  const addCalculation = (type = "simple") => {
    setCalculations((prev) =>
      calculationService.addCalculation({ calculations: prev, type, logicId })
    );
  };

  const addCondition = (calculationId: string) => {
    setCalculations((prev) =>
      calculationService.addCondition({ calculations: prev, calculationId })
    );
  };

  const updateCalculation = (id: string, updates: any) => {
    const updatedCalculation = calculationService.updateCalculation({
      calculations,
      id,
      updates,
    });
    console.log("updatedCalculation", updatedCalculation);

    setCalculations(updatedCalculation);
  };

  const removeCalculation = (id: string) => {
    setCalculations((prev) =>
      calculationService.removeCalculation({ calculations: prev, id })
    );
  };

  const updateOperation = (
    logicId: string,
    operation: CalculationOperation
  ) => {
    setCalculations((prev) =>
      calculationService.updateCalculationOperations({
        calculations: prev as SimpleCalculationType[],
        calculationLogicId: logicId,
        operation,
      })
    );
  };

  const saveCalculations = () => {
    if (isBrowser) {
      localStorage.setItem("calculations", JSON.stringify(calculations));
    }
  };

  const updateCondition = (
    calculationId: string,
    conditionId: string,
    updates: any
  ) => {
    setCalculations((prev) =>
      calculationService.updateCondition({
        calculations: prev,
        calculationId,
        conditionId,
        updates,
      })
    );
  };

  console.log("calculations", calculations);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Logic</Button>
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
              {calculations.map((calc) =>
                calc.type === "simple" ? (
                  <SimpleCalculation
                    key={calc.id}
                    defaultData={defaultOperations as CalculationOperation}
                    calculation={calc}
                    fields={fields}
                    onUpdate={updateCalculation}
                    updateOperation={updateOperation}
                    onDelete={removeCalculation}
                  />
                ) : (
                  <ConditionalCalculation
                    key={calc.id}
                    calculation={calc}
                    fields={fields}
                    onUpdate={updateCalculation}
                    onAddCondition={addCondition}
                  />
                )
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  addCalculation("simple");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Simple Calculation
              </Button>
              <Button
                className="mr-auto"
                variant="outline"
                onClick={() => addCalculation("conditional")}
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

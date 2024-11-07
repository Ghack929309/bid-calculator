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
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { calculationService } from "~/services/calculation-service";
import { SimpleCalculation } from "./simple-calculation";
import { ConditionalCalculation } from "./condition-calculation";
import { defaultSimpleOperations } from "~/lib/constant";
import { isBrowser } from "~/lib/utils";

export function AddLogic({
  fields,
  logicId,
}: {
  fields: InputFieldType[];
  logicId: string;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [calculations, setCalculations] = useState<
    (SimpleCalculationType | ConditionalCalculationType)[]
  >(isBrowser ? JSON.parse(localStorage.getItem("calculations") || "[]") : []);
  const selectedCalculationLogic = calculations.find(
    (calc) => calc.logicId === logicId
  );
  const addCalculation = (type = "simple") => {
    const newCalculation = calculationService.addCalculation({
      calculations: calculations as SimpleCalculationType[],
      type: "simple",
      logicId,
    });
    console.log("newCalculation", newCalculation);
    setCalculations(newCalculation);
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

    setCalculations(updatedCalculation as SimpleCalculationType[]);
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

  const updateOperation = (
    logicId: string,
    operation: CalculationOperation
  ) => {
    const update = calculationService.updateCalculationOperations({
      calculations: calculations as SimpleCalculationType[],
      calculationLogicId: logicId,
      operation,
    });
    console.log("update", update);
    setCalculations(update);
  };

  const saveCalculations = () => {
    if (isBrowser) {
      localStorage.setItem("calculations", JSON.stringify(calculations));
    }
    setOpenModal(false);
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
    <Dialog open={openModal} onOpenChange={(open) => setOpenModal(open)}>
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
              <SimpleCalculation
                defaultData={defaultSimpleOperations as CalculationOperation}
                calculation={selectedCalculationLogic as SimpleCalculationType}
                fields={fields}
                updateOperation={updateOperation}
                onDelete={removeCalculation}
              />
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

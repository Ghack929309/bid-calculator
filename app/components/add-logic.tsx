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
  ConditionalCalculationType,
  InputFieldType,
  SimpleCalculationType,
} from "~/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { calculationService } from "~/services/calculation-service";
import { SimpleCalculation } from "./simple-calculation";
import { ConditionalCalculation } from "./condition-calculation";

export function AddLogic({
  fields,
  logicName,
}: {
  fields: InputFieldType[];
  logicName: string;
}) {
  const [calculations, setCalculations] = useState<
    (SimpleCalculationType | ConditionalCalculationType)[]
  >([]);

  const addCalculation = (type = "simple") => {
    setCalculations((prev) =>
      calculationService.addCalculation({ calculations: prev, type })
    );
  };

  const addCondition = (calculationId: string) => {
    setCalculations((prev) =>
      calculationService.addCondition({ calculations: prev, calculationId })
    );
  };

  const updateCalculation = (id: string, updates: any) => {
    setCalculations((prev) =>
      calculationService.updateCalculation({ calculations: prev, id, updates })
    );
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
                    calculation={calc}
                    fields={fields}
                    onUpdate={updateCalculation}
                    onDelete={(id) =>
                      setCalculations((prev) => prev.filter((c) => c.id !== id))
                    }
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
                onClick={() => addCalculation("simple")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Simple Calculation
              </Button>
              <Button
                variant="outline"
                onClick={() => addCalculation("conditional")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Conditional Calculation
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

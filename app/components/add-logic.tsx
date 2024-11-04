import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusCircle, X, ChevronDown, Plus, Calculator } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InputFieldType } from "~/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { calculationService } from "~/services/calculation-service";

// Operation types
const operations = [
  { value: "add", label: "Add (+)" },
  { value: "subtract", label: "Subtract (-)" },
  { value: "multiply", label: "Multiply (×)" },
  { value: "divide", label: "Divide (÷)" },
  { value: "percentage", label: "Percentage (%)" },
];

// Comparison operators
const comparisons = [
  { value: "equals", label: "Equals (=)" },
  { value: "notEquals", label: "Not Equals (≠)" },
  { value: "greaterThan", label: "Greater Than (>)" },
  { value: "lessThan", label: "Less Than (<)" },
  { value: "between", label: "Between" },
];

// Logical operators
const logicalOperators = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

type SimpleCalculationType = {
  id: string;
  name: string;
  type: "simple";
  operation: string;
  value: string;
  baseField: string;
  existingLogic: {
    id: string;
    name: string;
  };
};

type ConditionalCalculationType = {
  id: string;
  field: string;
  type: "conditional";
  comparison: string;
  value: string;
  value2: string;
  logicalOperator: "and" | "or";
  existingLogic: {
    id: string;
    name: string;
  };
};

export function AddLogic({ fields }: { fields: InputFieldType[] }) {
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
  const RenderSimpleCalculation = ({
    calculation,
  }: {
    calculation: SimpleCalculationType;
  }) => {
    return (
      <div className="flex items-center space-x-2 mb-4">
        <Input
          className="w-[200px]"
          placeholder="Field name"
          value={calculation.name}
          onChange={(e) =>
            updateCalculation(calculation.id, { name: e.target.value })
          }
        />

        <span>=</span>

        <Select
          value={calculation.baseField}
          onValueChange={(value) =>
            updateCalculation(calculation.id, { baseField: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select base field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={calculation.operation}
          onValueChange={(value) =>
            updateCalculation(calculation.id, { operation: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Operation" />
          </SelectTrigger>
          <SelectContent>
            {operations.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Select
            value={calculation.existingLogic.name || ""}
            onValueChange={(value) =>
              updateCalculation(calculation.existingLogic.id, {
                existingLogic: value,
              })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="existing logic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem defaultChecked key="none" value="none">
                None
              </SelectItem>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>OR</span>
          <Input
            type="number"
            disabled={calculation.existingLogic.name !== "none"}
            className="w-[150px]"
            placeholder="Value"
            value={calculation.value}
            onChange={(e) =>
              updateCalculation(calculation.id, { value: e.target.value })
            }
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCalculations((prev) =>
              prev.filter((c) => c.id !== calculation.id)
            )
          }
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderCondition = (calculation, condition) => (
    <div key={condition.id} className="flex items-center space-x-2 mb-2">
      {condition.id !== calculation.conditions[0].id && (
        <Select
          value={condition.logicalOperator}
          onValueChange={(value) =>
            updateCondition(calculation.id, condition.id, {
              logicalOperator: value,
            })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {logicalOperators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={condition.field}
        onValueChange={(value) =>
          updateCondition(calculation.id, condition.id, { field: value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.comparison}
        onValueChange={(value) =>
          updateCondition(calculation.id, condition.id, { comparison: value })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Comparison" />
        </SelectTrigger>
        <SelectContent>
          {comparisons.map((comp) => (
            <SelectItem key={comp.value} value={comp.value}>
              {comp.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        className="w-[150px]"
        placeholder="Value"
        value={condition.value}
        onChange={(e) =>
          updateCondition(calculation.id, condition.id, {
            value: e.target.value,
          })
        }
      />

      {condition.comparison === "between" && (
        <>
          <span>and</span>
          <Input
            type="number"
            className="w-[150px]"
            placeholder="Second value"
            value={condition.value2}
            onChange={(e) =>
              updateCondition(calculation.id, condition.id, {
                value2: e.target.value,
              })
            }
          />
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          updateCalculation(calculation.id, {
            conditions: calculation.conditions.filter(
              (c) => c.id !== condition.id
            ),
          })
        }
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderConditionalCalculation = (
    calculation: ConditionalCalculationType
  ) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        {/* <Select
          value={calculation.}
          onValueChange={(value) =>
            updateCalculation(calculation.id, { baseField: value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select base field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        <Input
          className="w-[200px]"
          placeholder="Field name"
          // value={calculation.name}
          onChange={(e) =>
            updateCalculation(calculation.id, { name: e.target.value })
          }
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Conditions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCondition(calculation.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
            {calculation.conditions.map((condition) =>
              renderCondition(calculation, condition)
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Then</h3>
            <RenderSimpleCalculation
              calculation={{
                ...calculation,
                id: `${calculation.id}_then`,
              }}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Else</h3>
            <RenderSimpleCalculation
              calculation={{
                ...calculation,
                id: `${calculation.id}_else`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                  <RenderSimpleCalculation key={calc.id} calculation={calc} />
                ) : (
                  renderConditionalCalculation(calc)
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

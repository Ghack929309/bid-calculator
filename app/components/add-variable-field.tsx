import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { InputFieldType } from "~/lib/types";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Render } from "./render";
import { MilesVariable } from "./miles-variable";
import { PriceRangeVariable } from "./price-range-variable";

// Define types for our price range
interface PriceRange {
  min: number;
  max: number;
  value: number;
}

interface CsvColumnMapping {
  min: string;
  max: string;
  value: string;
}

export const AddVariableField = ({
  trigger,
  availableFields,
}: {
  trigger: React.ReactNode;
  availableFields: InputFieldType[];
  onSave: (fieldConfig: {
    name: string;
    baseField: string;
    priceRanges: PriceRange[];
  }) => void;
}) => {
  const [variableType, setVariableType] = useState("miles");
  const [fieldName, setFieldName] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Variable Field</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="miles-variable"
              name="variable-type"
              value="miles"
              checked={variableType === "miles"}
              onChange={(e) => setVariableType(e.target.value)}
            />
            <Label htmlFor="miles-variable">Miles Variable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="price-range"
              name="variable-type"
              value="price-range"
              checked={variableType === "price-range"}
              onChange={(e) => setVariableType(e.target.value)}
            />
            <Label htmlFor="price-range">Price Range</Label>
          </div>
        </div>
        <Render when={variableType === "miles"}>
          <MilesVariable />
        </Render>
        <Render when={variableType === "price-range"}>
          <PriceRangeVariable
            availableFields={availableFields}
            onSave={() => {}}
          />
        </Render>
      </DialogContent>
    </Dialog>
  );
};

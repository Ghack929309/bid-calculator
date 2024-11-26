import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { InputFieldType } from "~/lib/types";
import { Label } from "./ui/label";
import { Render } from "./render";
import { MilesVariable } from "./miles-variable";
import { PriceRangeVariable } from "./price-range-variable";

export const AddVariableField = ({
  trigger,
  onSavePriceRange,
  onSaveMiles,
  availableFields,
}: {
  trigger: React.ReactNode;
  onSavePriceRange: (field: InputFieldType) => void;
  onSaveMiles: (field: InputFieldType) => void;
  availableFields?: InputFieldType[];
}) => {
  const [variableType, setVariableType] = useState("miles");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        {trigger}
      </DialogTrigger>
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
        <Render when={variableType === "miles" && isOpen}>
          <MilesVariable
            fields={availableFields?.filter((field) => field.type !== "miles")}
            onSave={(field) => {
              onSaveMiles(field);
              setIsOpen(false);
            }}
          />
        </Render>
        <Render when={variableType === "price-range" && isOpen}>
          <PriceRangeVariable
            fields={
              availableFields?.filter((field) => field.type !== "priceRange") ??
              []
            }
            onSave={(field) => {
              onSavePriceRange(field);
              setIsOpen(false);
            }}
          />
        </Render>
      </DialogContent>
    </Dialog>
  );
};

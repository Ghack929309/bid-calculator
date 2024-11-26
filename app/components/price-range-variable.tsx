import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { v4 } from "uuid";
import { Render } from "./render";
import { InputFieldType } from "~/lib/types";

interface PriceRange {
  min: number;
  max: number;
  value: number;
  id: string;
}

interface CsvColumnMapping {
  min: string;
  max: string;
  value: string;
}

export function PriceRangeVariable({
  onSave,
  fields,
  initialData,
  updateField,
}: {
  onSave?: (fieldConfig: InputFieldType) => void;
  fields: InputFieldType[];
  initialData?: InputFieldType;
  updateField?: (field: InputFieldType) => void;
}) {
  const [fieldName, setFieldName] = useState(initialData?.name || "");
  const [baseFieldId, setBaseFieldId] = useState(
    fields.find((field) => field.id === initialData?.baseFieldId)?.id || ""
  );
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>(() => {
    if (!initialData?.entries || initialData.type !== "priceRange") return [];

    try {
      const parsed = JSON.parse(initialData.entries);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing entries:", error);
      return [];
    }
  });

  const [newRange, setNewRange] = useState<Partial<PriceRange>>({
    min: undefined,
    max: undefined,
    value: undefined,
  });
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<CsvColumnMapping>({
    min: "",
    max: "",
    value: "",
  });
  const [csvData, setCsvData] = useState<string[][]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const lines = text.split("\n");
      const headers = lines[0].split(",").map((header) => header.trim());

      const data = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim();
            return obj;
          }, {} as Record<string, string>);
        })
        .filter((row) => Object.values(row).some((value) => value)); // Remove empty rows

      setCsvData(data);
      setCsvColumns(headers);
    };

    reader.readAsText(file);
  };

  const handleApplyMapping = () => {
    if (
      !columnMapping.min ||
      !columnMapping.max ||
      !columnMapping.value ||
      !csvData
    ) {
      alert("Please upload a CSV file and map the columns correctly.");
      return;
    }
    console.log("columnMapping", columnMapping);
    console.log(
      "csvData",
      csvData.filter(
        (row) =>
          row[columnMapping.min] &&
          row[columnMapping.max] &&
          row[columnMapping.value]
      )
    );
    // Parse the CSV data and create price ranges
    const newRanges: PriceRange[] = csvData
      .filter(
        (row) =>
          row[columnMapping.min] &&
          row[columnMapping.max] &&
          row[columnMapping.value]
      )
      .map((row) => ({
        min: parseFloat(row[columnMapping.min]),
        max: parseFloat(row[columnMapping.max]),
        value: parseFloat(row[columnMapping.value]),
        id: v4(),
      }))
      .filter(
        (range) => !isNaN(range.min) && !isNaN(range.max) && !isNaN(range.value)
      );

    // Add the new ranges to existing ones
    setPriceRanges((prevRanges) => [...prevRanges, ...newRanges]);
  };

  const handleAddRange = () => {
    if (!newRange.min || !newRange.max || !newRange.value) return;

    setPriceRanges([...priceRanges, newRange as PriceRange]);
    setNewRange({ min: undefined, max: undefined, value: undefined });
  };

  const handleRemoveRange = (index: number) => {
    setPriceRanges(priceRanges.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!fieldName || !baseFieldId || priceRanges.length === 0) {
      alert(
        "Please enter a field name, select a base field, and add at least one price range."
      );
      return;
    }
    if (initialData) {
      const updatedField: InputFieldType = {
        ...initialData,
        name: fieldName,
        baseFieldId,
        entries: priceRanges.map((range) => ({
          min: range.min.toString(),
          max: range.max.toString(),
          value: range.value.toString(),
        })),
      };
      return void updateField?.(updatedField);
    }
    const fieldConfig: InputFieldType = {
      id: v4(),
      sectionId: "",
      name: fieldName,
      type: "priceRange",
      required: false,
      enabled: true,
      baseFieldId,
      entries: priceRanges.map((range) => ({
        min: range.min.toString(),
        max: range.max.toString(),
        value: range.value.toString(),
      })),
    };

    onSave?.(fieldConfig);
  };

  return (
    <div className="grid gap-6 py-4">
      {/* Top Section - Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-2">
          <label htmlFor="fieldName" className="text-sm font-medium">
            Field Name
          </label>
          <Input
            id="fieldName"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="baseField" className="text-sm font-medium">
            Base Field
          </label>
          <Select
            defaultValue={
              fields.find((field) => field.id === baseFieldId)?.id || ""
            }
            onValueChange={(value) => setBaseFieldId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select base field" />
            </SelectTrigger>
            <SelectContent>
              {fields?.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Manual Input */}
        <div className="grid gap-4">
          <div className="border h-fit rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-4">
              Add Price Range Manually
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <label htmlFor="min" className="text-sm">
                    Minimum ($)
                  </label>
                  <Input
                    id="min"
                    type="number"
                    placeholder="0"
                    value={newRange.min || ""}
                    onChange={(e) =>
                      setNewRange({
                        ...newRange,
                        min: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="max" className="text-sm">
                    Maximum ($)
                  </label>
                  <Input
                    id="max"
                    type="number"
                    placeholder="100"
                    value={newRange.max || ""}
                    onChange={(e) =>
                      setNewRange({
                        ...newRange,
                        max: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="value" className="text-sm">
                    Value ($)
                  </label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="50"
                    value={newRange.value || ""}
                    onChange={(e) =>
                      setNewRange({
                        ...newRange,
                        value: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleAddRange}
                disabled={!newRange.min || !newRange.max || !newRange.value}
              >
                Add Range
              </Button>
            </div>
          </div>

          {/* CSV Upload Section */}
          <div className="border h-fit rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-4">Import from CSV</h3>
            <div className="grid gap-3">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <p className="text-sm text-gray-500">
                Upload a CSV file with columns for minimum price, maximum price,
                and value.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - CSV Mapping & Price Ranges */}
        <div className="grid gap-4">
          <Render when={csvColumns.length > 0 && !priceRanges.length}>
            <div className="border h-fit rounded-lg p-4 bg-white">
              <h3 className="text-lg font-medium mb-4">Map CSV Columns</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="min-column" className="text-sm font-medium">
                    Minimum Price Column
                  </label>
                  <Select
                    value={columnMapping.min}
                    onValueChange={(value) =>
                      setColumnMapping((prev) => ({ ...prev, min: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent id="min-column">
                      {csvColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="max-column" className="text-sm font-medium">
                    Maximum Price Column
                  </label>
                  <Select
                    value={columnMapping.max}
                    onValueChange={(value) =>
                      setColumnMapping((prev) => ({ ...prev, max: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent id="max-column">
                      {csvColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="value-column" className="text-sm font-medium">
                    Value Column
                  </label>
                  <Select
                    value={columnMapping.value}
                    onValueChange={(value) =>
                      setColumnMapping((prev) => ({
                        ...prev,
                        value: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent id="value-column">
                      {csvColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleApplyMapping}
                    disabled={
                      !columnMapping.min ||
                      !columnMapping.max ||
                      !columnMapping.value
                    }
                  >
                    Apply Mapping
                  </Button>
                  <div className="mt-2 text-sm text-gray-500">
                    Current mapping: {columnMapping.min} → Min,{" "}
                    {columnMapping.max} → Max, {columnMapping.value} → Value
                  </div>
                </div>
              </div>
            </div>
          </Render>

          {/* Price Ranges List - Updated styling */}
          {priceRanges.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Price Ranges</h3>
                <span className="text-sm text-slate-500">
                  {priceRanges.length}
                  {priceRanges.length === 1 ? "range" : "ranges"}
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(60vh-100px)] overflow-y-auto pr-2">
                {priceRanges.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No price ranges yet. Add ranges manually or import from CSV.
                  </div>
                ) : (
                  priceRanges.map((range, idx) => (
                    <div
                      key={range.id}
                      className="bg-white p-4 rounded-lg shadow-sm space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-wrap">
                          <span className="text-slate-500">Min:</span>
                          <span className="ml-2 font-medium break-all">
                            ${Number(range.min).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-wrap">
                          <span className="text-slate-500">Max:</span>
                          <span className="ml-2 font-medium break-all">
                            ${Number(range.max).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-wrap">
                          <span className="text-slate-500">Value:</span>
                          <span className="ml-2 font-medium break-all">
                            ${Number(range.value).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveRange(idx)}
                          className="h-8"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end ">
        <Button
          onClick={handleSave}
          disabled={!fieldName || !baseFieldId || priceRanges.length === 0}
          className="w-32"
        >
          {initialData ? "Update Field" : "Save Field"}
        </Button>
      </div>
    </div>
  );
}

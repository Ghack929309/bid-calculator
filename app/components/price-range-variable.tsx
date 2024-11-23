import React, { useState } from "react";
import { InputFieldType } from "~/lib/types";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

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

export function PriceRangeVariable({
  availableFields,
  onSave,
}: {
  availableFields: InputFieldType[];
  onSave: (fieldConfig: {
    name: string;
    baseField: string;
    min: undefined;
    max: undefined;
    value: undefined;
  }) => void;
}) {
  const [fieldName, setFieldName] = useState("");
  const [baseField, setBaseField] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
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

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text
      .split("\n")
      .map((row) => row.split(",").map((cell) => cell.trim()));

    // Get headers and remove any empty columns
    const headers = rows[0].filter(Boolean);
    setCsvColumns(headers);
    setCsvData(rows);

    // Reset mapping
    setColumnMapping({
      min: "",
      max: "",
      value: "",
    });
    // Reset price ranges
    setPriceRanges([]);
  };

  const handleApplyMapping = () => {
    if (!columnMapping.min || !columnMapping.max || !columnMapping.value) {
      return;
    }

    const minIndex = csvColumns.indexOf(columnMapping.min);
    const maxIndex = csvColumns.indexOf(columnMapping.max);
    const valueIndex = csvColumns.indexOf(columnMapping.value);

    // Skip header row and parse CSV data
    const ranges: PriceRange[] = csvData
      .slice(1)
      .map((row) => ({
        min: parseFloat(row[minIndex]),
        max: parseFloat(row[maxIndex]),
        value: parseFloat(row[valueIndex]),
      }))
      .filter(
        (range) => !isNaN(range.min) && !isNaN(range.max) && !isNaN(range.value)
      );

    setPriceRanges(ranges);
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
    if (!fieldName || !baseField || priceRanges.length === 0) return;

    onSave({
      name: fieldName,
      baseField,
      priceRanges,
    });
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
          <Select value={baseField} onValueChange={setBaseField}>
            <SelectTrigger>
              <SelectValue placeholder="Select base field" />
            </SelectTrigger>
            <SelectContent>
              {availableFields?.map((field) => (
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
          <div className="border rounded-lg p-4 bg-white">
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
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-4">Import from CSV</h3>
            <div className="grid gap-3">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
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
          {csvColumns.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
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
              </div>
            </div>
          )}

          {/* Price Ranges List */}
          {priceRanges.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-medium mb-4">Price Ranges</h3>
              <div className="max-h-[300px] overflow-y-auto">
                <ul className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>
                        ${range.min.toFixed(2)} - ${range.max.toFixed(2)}: $
                        {range.value.toFixed(2)}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveRange(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={!fieldName || !baseField || priceRanges.length === 0}
          className="w-32"
        >
          Save Field
        </Button>
      </div>
    </div>
  );
}

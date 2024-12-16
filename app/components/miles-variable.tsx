import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { v4 } from "uuid";
import { InputFieldType } from "~/lib/types";

export const MilesVariable = ({
  onSave,
  initialData,
  updateMilesVariableField,
  fields,
}: {
  onSave?: (field: InputFieldType) => void;
  initialData?: InputFieldType;
  updateMilesVariableField?: (field: InputFieldType) => void;
  fields?: InputFieldType[];
}) => {
  const [fieldName, setFieldName] = useState(initialData?.name || "");
  const [csvData, setCsvData] = useState<Record<string, string>[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState({
    state: "",
    miles: "",
    ratePerMiles: "",
  });
  const [manualInput, setManualInput] = useState({
    state: "",
    miles: "",
    ratePerMiles: "",
  });
  const [entries, setEntries] = useState<
    Array<{
      state: string;
      miles: string;
      ratePerMiles: string;
      id: string;
    }>
  >(() => {
    if (!initialData?.entries || initialData.type !== "miles") return [];

    try {
      const parsed = JSON.parse(initialData.entries);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing entries:", error);
      return [];
    }
  });
  const [baseFieldId, setBaseFieldId] = useState(
    initialData?.type === "miles" ? initialData.baseFieldId : ""
  );

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (!text) return;
      const lines = text.toString().split("\n");
      const headers = lines[0].split(",").map((header) => header.trim());

      const data = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim();
            return obj;
          }, {});
        })
        .filter((row) => Object.values(row).some((value) => value));

      setCsvData(data);
      setHeaders(headers);
    };

    reader.readAsText(file);
  };

  const handleApplyMapping = () => {
    if (!csvData) return;
    const mappedEntries = csvData.map((row) => ({
      state: row[mapping.state] || "",
      miles: row[mapping.miles] || "",
      ratePerMiles: row[mapping.ratePerMiles] || "",
      id: v4(),
    }));
    setEntries(mappedEntries);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((_, index) => String(index) !== id));
  };

  const addManualEntry = () => {
    if (!manualInput.state || !manualInput.miles || !manualInput.ratePerMiles)
      return;

    const newEntry = {
      ...manualInput,
      id: v4(),
    };

    setEntries([...entries, newEntry]);
    setManualInput({ state: "", miles: "", ratePerMiles: "" });
  };

  const handleSave = () => {
    if (!fieldName || entries.length === 0 || !baseFieldId) {
      alert(
        "Please enter a field name, select a base field, and add at least one entry"
      );
      return;
    }
    if (initialData) {
      updateMilesVariableField?.({
        ...initialData,
        type: "miles" as const,
        name: fieldName,
        baseFieldId,
        entries: entries.map((entry) => ({
          state: entry.state,
          miles: entry.miles,
          ratePerMiles: entry.ratePerMiles,
        })),
      });
      return;
    }
    const fieldConfig: InputFieldType = {
      id: v4(),
      sectionId: "",
      name: fieldName,
      type: "miles",
      required: false,
      enabled: true,
      baseFieldId,
      entries: entries.map((entry) => ({
        state: entry.state,
        miles: entry.miles,
        ratePerMiles: entry.ratePerMiles,
      })),
    };

    onSave?.(fieldConfig);
  };
  console.log("csvData", csvData);
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="max-w-md bg-slate-50 p-6 rounded-lg space-y-4">
              <Label htmlFor="fieldName" className="text-lg font-semibold">
                Field Name
              </Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="Enter field name"
                className="mt-2 bg-white text-muted-foreground"
              />
              <Label htmlFor="baseField" className="text-lg font-semibold">
                Base Field
              </Label>
              <Select
                defaultValue={
                  fields?.find((field) => field.id === baseFieldId)?.name
                }
                onValueChange={(value) => setBaseFieldId(value)}
              >
                <SelectTrigger className="bg-white">
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
            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Import from CSV</h3>

              {/* CSV Upload */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-600">
                  Upload CSV File
                </Label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="bg-white"
                />
              </div>

              {/* Column Mapping */}
              {headers.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm text-slate-600">
                    Map CSV Columns
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">State Column</Label>
                      <Select
                        onValueChange={(value) =>
                          setMapping((prev) => ({ ...prev, state: value }))
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Miles Column</Label>
                      <Select
                        onValueChange={(value) =>
                          setMapping((prev) => ({ ...prev, miles: value }))
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Rate Per Miles Column</Label>
                      <Select
                        onValueChange={(value) =>
                          setMapping((prev) => ({
                            ...prev,
                            ratePerMiles: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleApplyMapping}
                    className="w-full"
                    variant="secondary"
                  >
                    Apply Mapping
                  </Button>
                </div>
              )}
            </div>

            {/* Manual Entry Section */}
            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Manual Entry</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">State</Label>
                  <Input
                    placeholder="Enter state"
                    value={manualInput.state}
                    onChange={(e) =>
                      setManualInput((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs">Miles</Label>
                  <Input
                    type="number"
                    placeholder="Enter miles"
                    value={manualInput.miles}
                    onChange={(e) =>
                      setManualInput((prev) => ({
                        ...prev,
                        miles: e.target.value,
                      }))
                    }
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs">Rate Per Miles</Label>
                  <Input
                    type="number"
                    placeholder="Enter rate per miles"
                    value={manualInput.ratePerMiles}
                    onChange={(e) =>
                      setManualInput((prev) => ({
                        ...prev,
                        ratePerMiles: e.target.value,
                      }))
                    }
                    className="bg-white"
                  />
                </div>
              </div>
              <Button
                onClick={addManualEntry}
                disabled={
                  !manualInput.state ||
                  !manualInput.miles ||
                  !manualInput.ratePerMiles
                }
                className="w-full"
              >
                Add Entry
              </Button>
            </div>
          </div>

          {/* Right Column - Entries Display */}
          <div className="bg-slate-50 p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Entries</h3>
              <span className="text-sm text-slate-500">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-0px)] overflow-y-auto pr-2">
              {entries.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  No entries yet. Add entries manually or import from CSV.
                </div>
              ) : (
                entries?.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg shadow-sm space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-wrap">
                        <span className="text-slate-500">State:</span>
                        <span className="ml-2 font-medium break-all">
                          {entry.state}
                        </span>
                      </div>
                      <div className="flex flex-wrap">
                        <span className="text-slate-500">Miles:</span>
                        <span className="ml-2 font-medium break-all">
                          {entry.miles}
                        </span>
                      </div>
                      <div className="flex flex-wrap">
                        <span className="text-slate-500">Rate/Mile:</span>
                        <span className="ml-2 font-medium break-all">
                          {entry.ratePerMiles}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeEntry(String(idx))}
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
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={!fieldName || entries.length === 0}
            className="w-32"
          >
            {initialData ? "Update Field" : "Save Field"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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
import { Alert, AlertDescription } from "~/components/ui/alert";
import { v4 } from "uuid";

export const MilesVariable = () => {
  const [fieldName, setFieldName] = useState("");
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
  >([]);

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
    setEntries(entries.filter((entry) => entry.id !== id));
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Rate Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Field Name Input */}
        <div className="space-y-2">
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name"
          />
        </div>

        {/* CSV Upload */}
        <div className="space-y-2">
          <Label>Upload CSV</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="flex-1"
          />
        </div>

        {/* Column Mapping */}
        {headers.length > 0 && (
          <div className="space-y-4">
            <Label>Map CSV Columns</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>State Column</Label>
                <Select
                  onValueChange={(value) =>
                    setMapping((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger>
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
                <Label>Miles Column</Label>
                <Select
                  onValueChange={(value) =>
                    setMapping((prev) => ({ ...prev, miles: value }))
                  }
                >
                  <SelectTrigger>
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
                <Label>Rate Per Miles Column</Label>
                <Select
                  onValueChange={(value) =>
                    setMapping((prev) => ({ ...prev, ratePerMiles: value }))
                  }
                >
                  <SelectTrigger>
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
            <Button onClick={handleApplyMapping} className="mt-2">
              Apply Mapping
            </Button>
          </div>
        )}

        {/* Manual Entry */}
        <div className="space-y-4">
          <Label>Add Manual Entry</Label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Enter state"
              value={manualInput.state}
              onChange={(e) =>
                setManualInput((prev) => ({ ...prev, state: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Enter miles"
              value={manualInput.miles}
              onChange={(e) =>
                setManualInput((prev) => ({ ...prev, miles: e.target.value }))
              }
            />
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
            />
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

        {/* Entries Display */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <Label>Entries</Label>
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="space-x-4">
                    <span>State: {entry.state}</span>
                    <span>Miles: {entry.miles}</span>
                    <span>Rate/Mile: {entry.ratePerMiles}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

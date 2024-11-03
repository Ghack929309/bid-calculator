import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { LogicFieldType } from "~/lib/types";

export function AddLogic({
  handleAddLogic,
}: {
  handleAddLogic: (field: LogicFieldType) => void;
}) {
  const [fields, setFields] = useState([
    {
      id: "purchase_price",
      name: "Purchase Price",
      type: "number",
      value: "",
      relationships: [],
      description: "",
      required: true,
      enabled: true,
    },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [newField, setNewField] = useState({
    id: "",
    name: "",
    type: "number",
    value: "",
    relationships: [],
    description: "",
    required: false,
    enabled: true,
    fieldsToEnable: [], // New field for checkbox type
  });

  const generateJsonConfig = () => {
    const config = {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      fields: fields.map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        defaultValue: field.value,
        required: field.required,
        enabled: field.enabled,
        description: field.description,
        // For checkboxes
        fieldsToEnable:
          field.type === "checkbox" ? field.fieldsToEnable : undefined,
        // For number fields
        relationships:
          field.type === "number"
            ? field.relationships.map((rel) => ({
                type: rel.type,
                targetFieldId: rel.fieldId,
                operationValue: rel.value,
              }))
            : undefined,
      })),
    };

    return JSON.stringify(config, null, 2);
  };

  // Handle checkbox change
  const handleCheckboxChange = (fieldId, checked) => {
    const checkboxField = fields.find((f) => f.id === fieldId);
    if (!checkboxField || !checkboxField.fieldsToEnable) return;

    const updatedFields = fields.map((field) => {
      if (checkboxField.fieldsToEnable.includes(field.id)) {
        return { ...field, enabled: checked };
      }
      return field;
    });

    setFields(
      updatedFields.map((field) =>
        field.id === fieldId ? { ...field, value: checked } : field
      )
    );
  };

  const renderCheckboxFields = () => (
    <>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={newField.description}
          onChange={(e) =>
            setNewField({ ...newField, description: e.target.value })
          }
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter description for checkbox"
        />
      </div>
      <div>
        <label
          htmlFor="fieldsToEnable"
          className="block text-sm font-medium mb-1"
        >
          Fields to Enable
        </label>
        <select
          id="fieldsToEnable"
          multiple
          value={newField.fieldsToEnable || []}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setNewField({ ...newField, fieldsToEnable: selectedOptions });
          }}
          className="w-full p-2 border rounded h-32"
        >
          {fields
            .filter((f) => f.type === "number")
            .map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Hold Ctrl/Cmd to select multiple fields
        </p>
      </div>
    </>
  );

  const renderNumberFields = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label htmlFor="relationship" className="block text-sm font-medium">
          Relationships
        </label>
        <button
          id="relationship"
          onClick={() =>
            setNewField((prev) => ({
              ...prev,
              relationships: [
                ...prev.relationships,
                { fieldId: "", type: "percentage", value: "" },
              ],
            }))
          }
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          + Add Relationship
        </button>
      </div>

      {newField.relationships.map((rel, index) => (
        <div key={index} className="p-4 border rounded space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Relationship {index + 1}
            </span>
            <button
              onClick={() =>
                setNewField((prev) => ({
                  ...prev,
                  relationships: prev.relationships.filter(
                    (_, i) => i !== index
                  ),
                }))
              }
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <select
            value={rel.type}
            onChange={(e) => {
              const updatedRelationships = [...newField.relationships];
              updatedRelationships[index] = { ...rel, type: e.target.value };
              setNewField({ ...newField, relationships: updatedRelationships });
            }}
            className="w-full p-2 border rounded"
          >
            {relationshipTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={rel.fieldId}
            onChange={(e) => {
              const updatedRelationships = [...newField.relationships];
              updatedRelationships[index] = { ...rel, fieldId: e.target.value };
              setNewField({ ...newField, relationships: updatedRelationships });
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select field</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={rel.value}
            onChange={(e) => {
              const updatedRelationships = [...newField.relationships];
              updatedRelationships[index] = { ...rel, value: e.target.value };
              setNewField({ ...newField, relationships: updatedRelationships });
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter value for operation"
          />
        </div>
      ))}
    </div>
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Logic</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Add a new field to the calculator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Field Name
            </label>
            <input
              id="name"
              type="text"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter field name"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Field Type
            </label>
            <select
              id="type"
              value={newField.type}
              onChange={(e) =>
                setNewField({
                  ...newField,
                  type: e.target.value,
                  relationships: [],
                  fieldsToEnable: [],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          {newField.type === "checkbox"
            ? renderCheckboxFields()
            : renderNumberFields()}

          <div className="flex items-center space-x-2">
            <input
              id="required"
              type="checkbox"
              checked={newField.required}
              onChange={(e) =>
                setNewField({ ...newField, required: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="required" className="text-sm">
              Required field
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

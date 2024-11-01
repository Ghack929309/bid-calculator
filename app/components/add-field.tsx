import { Check, Pencil, X } from "lucide-react";
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

type FieldType = "number" | "text" | "select" | "checkbox";

interface BaseField {
  name: string;
  type: FieldType;
  required: boolean;
  enabled: boolean;
}

interface SimpleField extends BaseField {
  type: "number" | "text";
  value: string;
}

interface OptionsField extends BaseField {
  type: "select" | "checkbox";
  options: string[];
}

type Field = SimpleField | OptionsField;

const getInitialFieldState = ({ type }: { type: FieldType }): Field => {
  const baseField = {
    name: "",
    type,
    required: false,
    enabled: true,
  };

  return type === "number" || type === "text"
    ? ({ ...baseField, value: "" } as SimpleField)
    : ({ ...baseField, options: [] } as OptionsField);
};

function FieldForm({
  field,
  onFieldChange,
}: {
  field: Field;
  onFieldChange: (field: Field) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldNameInput
        value={field.name}
        onChange={(name) => onFieldChange({ ...field, name })}
      />
      <FieldTypeSelect
        value={field.type}
        onChange={(type) => onFieldChange(getInitialFieldState({ type }))}
      />
      {(field.type === "select" || field.type === "checkbox") && (
        <OptionsManager
          options={field.options}
          onChange={(options) => onFieldChange({ ...field, options })}
        />
      )}
      <RequiredCheckbox
        checked={field.required}
        onChange={(required) => onFieldChange({ ...field, required })}
      />
    </div>
  );
}

function FieldNameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium mb-1">
        Field Name
      </label>
      <input
        id="name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter field name"
      />
    </div>
  );
}

function FieldTypeSelect({
  value,
  onChange,
}: {
  value: FieldType;
  onChange: (type: FieldType) => void;
}) {
  return (
    <div>
      <label htmlFor="fieldType" className="block text-sm font-medium mb-1">
        Field Type
      </label>
      <select
        id="fieldType"
        value={value}
        onChange={(e) => onChange(e.target.value as FieldType)}
        className="w-full p-2 border rounded"
      >
        <option value="number">Number</option>
        <option value="text">Text</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>
      </select>
    </div>
  );
}

function OptionsManager({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const [newOption, setNewOption] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addOption = () => {
    if (newOption.trim()) {
      onChange([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
    setEditingIndex(null);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="max-h-[150px] overflow-y-auto">
        {options.map((option, index) => (
          <OptionItem
            key={index}
            option={option}
            isEditing={editingIndex === index}
            onEdit={() => setEditingIndex(index)}
            onUpdate={(value) => updateOption(index, value)}
            onRemove={() => removeOption(index)}
            onCancel={() => setEditingIndex(null)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter an option"
          className="flex-1 p-2 border rounded"
        />
        <Button onClick={addOption}>Add</Button>
      </div>
    </div>
  );
}

function OptionItem({
  option,
  isEditing,
  onEdit,
  onUpdate,
  onRemove,
  onCancel,
}: {
  option: string;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (value: string) => void;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const [editValue, setEditValue] = useState(option);

  return (
    <div className="flex items-center p-2 justify-between w-full border rounded gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            className="flex-1 p-1 border rounded"
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onUpdate(editValue)}
          />
          <div className="flex items-center gap-1">
            <Check
              onClick={() => onUpdate(editValue)}
              className="w-4 h-4 text-green-500 cursor-pointer"
            />
            <X
              onClick={onCancel}
              className="w-4 h-4 text-red-500 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <>
          <span className="flex-1">{option}</span>
          <div className="flex items-center gap-2">
            <Pencil
              onClick={onEdit}
              className="w-4 h-4 text-blue-500 cursor-pointer"
            />
            <X
              onClick={onRemove}
              className="w-4 h-4 text-red-500 cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  );
}

function RequiredCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id="required"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300"
      />
      <label htmlFor="required" className="text-sm">
        Required field
      </label>
    </div>
  );
}

export function AddField({
  handleAddField,
}: {
  handleAddField: (field: Field) => void;
}) {
  const [field, setField] = useState<Field>(
    getInitialFieldState({ type: "number" })
  );

  const handleSave = () => {
    if (field.name.trim()) {
      handleAddField(field);
      setField(getInitialFieldState({ type: field.type }));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Field</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Add a new field to the calculator.
          </DialogDescription>
        </DialogHeader>
        <FieldForm field={field} onFieldChange={setField} />
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

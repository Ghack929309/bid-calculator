import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FieldType, InputFieldType, MultiChoiceType } from "~/lib/types";
import { getInitialFieldState } from "~/lib/utils";
import { v4 as uuidv4 } from "uuid";

function FieldForm({
  field,
  onFieldChange,
}: {
  field: InputFieldType;
  onFieldChange: (field: InputFieldType) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldNameInput
        value={field.name}
        onChange={(name) => onFieldChange({ ...field, name })}
      />
      <FieldTypeSelect
        value={field.type as FieldType}
        onChange={(type) =>
          onFieldChange(getInitialFieldState({ ...field, type }))
        }
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
      <PrivateCheckbox
        checked={field.isPrivate}
        onChange={(isPrivate) => onFieldChange({ ...field, isPrivate })}
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
      <label
        htmlFor="name"
        className="block text-sm font-medium mb-1 dark:text-gray-200"
      >
        Field Name
      </label>
      <input
        id="name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
      <label
        htmlFor="fieldType"
        className="block text-sm font-medium mb-1 dark:text-gray-200"
      >
        Field Type
      </label>
      <select
        id="fieldType"
        value={value}
        onChange={(e) => onChange(e.target.value as FieldType)}
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white"
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
  options: MultiChoiceType["options"];
  onChange: (options: MultiChoiceType["options"]) => void;
}) {
  const [newOption, setNewOption] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addOption = () => {
    if (newOption.trim()) {
      onChange([
        ...options,
        { value: newOption.trim(), id: uuidv4(), fieldId: "" },
      ]);
      setNewOption("");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { value, id: "", fieldId: "" };
    onChange(newOptions);
    setEditingIndex(null);
  };

  const removeOption = (index: number) => {
    const newOptions = options?.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  return (
    <div className="space-y-2">
      <div className="max-h-[150px] overflow-y-auto">
        {options?.map((option, index) => (
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
          className="flex-1 p-2 border rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
  option: MultiChoiceType["options"][number];
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (value: string) => void;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const [editValue, setEditValue] = useState(option);

  return (
    <div className="flex items-center p-2 justify-between w-full border rounded gap-2 bg-white dark:bg-gray-900 dark:border-gray-600">
      <span
        contentEditable={isEditing}
        onBlur={(e) => {
          setEditValue({ ...editValue, value: e.target.innerText });
          onUpdate(e.target.innerText);
        }}
        className={`${
          isEditing
            ? "flex-1 border-2 rounded border-blue-500 p-1 dark:border-blue-400"
            : "border-none"
        } dark:text-white`}
      >
        {option.value}
      </span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Check
            onClick={() => onUpdate(editValue.value)}
            className="w-4 h-4 text-green-500 cursor-pointer"
          />
        ) : (
          <Pencil
            onClick={onEdit}
            className="w-4 h-4 text-blue-500 cursor-pointer"
          />
        )}

        <X
          onClick={() => {
            isEditing ? onCancel() : onRemove();
          }}
          className="w-4 h-4 text-red-500 cursor-pointer"
        />
      </div>
    </div>
  );
}

function PrivateCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id="private"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 dark:border-gray-500 dark:bg-gray-900 dark:checked:bg-blue-600 dark:checked:border-blue-600"
      />
      <label htmlFor="private" className="text-sm dark:text-gray-200">
        Private field
      </label>
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
        className="rounded border-gray-300 dark:border-gray-500 dark:bg-gray-900 dark:checked:bg-blue-600 dark:checked:border-blue-600"
      />
      <label htmlFor="required" className="text-sm dark:text-gray-200">
        Required field
      </label>
    </div>
  );
}

export function AddField({
  handleAddField,
  handleUpdateField,
  trigger,
  initialField,
  isEditing = false,
  sectionId,
}: {
  handleAddField?: (field: InputFieldType) => void;
  handleUpdateField?: (field: InputFieldType) => void;
  trigger?: React.ReactNode;
  initialField: InputFieldType;
  isEditing?: boolean;
  sectionId: string;
}) {
  const [field, setField] = useState<InputFieldType>(initialField);

  const handleSave = () => {
    if (field.name.trim()) {
      handleAddField?.({ ...field, id: uuidv4(), sectionId });
      setField(getInitialFieldState({ type: field.type as FieldType }));
    }
  };
  const handleUpdate = () => {
    handleUpdateField?.(field);
  };

  const onFieldUpdate = (updatedField: InputFieldType) => {
    setField({ ...initialField, ...updatedField });
  };

  const handleClick = isEditing ? handleUpdate : handleSave;
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button disabled={!sectionId} variant="default">
            Add Field
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Add a new field to the calculator.
          </DialogDescription>
        </DialogHeader>
        <FieldForm field={field} onFieldChange={onFieldUpdate} />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClick}>
              {isEditing ? "Update" : "Save changes"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

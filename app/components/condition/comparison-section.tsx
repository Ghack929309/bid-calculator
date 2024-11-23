import { ConditionType, InputFieldType, LogicFieldType } from "~/lib/types";
import { FieldSelector } from "./field-selector";
import { OperatorSelector } from "./operator-selector";
import { CompareValueSection } from "./compare-value-section";

type ComparisonSectionProps = {
  condition: ConditionType;
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionType>) => void;
};

export const ComparisonSection = ({
  condition,
  fields,
  logicFields,
  onUpdate,
}: ComparisonSectionProps) => (
  <div className="grid grid-cols-3 gap-4">
    <FieldSelector
      condition={condition}
      fields={fields}
      logicFields={logicFields}
      onUpdate={onUpdate}
    />
    <OperatorSelector condition={condition} onUpdate={onUpdate} />
    <CompareValueSection
      condition={condition}
      fields={fields}
      logicFields={logicFields}
      onUpdate={onUpdate}
    />
  </div>
);

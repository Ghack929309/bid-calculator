import {
  CalculationValue,
  ConditionalCalculationType,
  ConditionOperators,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";

import { OperatorSelector } from "./operator-selector";
import { CompareValueSection } from "./compare-value-section";
import { defaultConditionalComparator } from "~/lib/constant";
import { useCalculator } from "~/lib/calculator-context";

type ComparisonSectionProps = {
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
};

export const ComparisonSection = ({
  fields,
  logicFields,
  onUpdate,
}: ComparisonSectionProps) => {
  const { condition } = useCalculator();
  const handleUpdate = (updates: {
    value1: CalculationValue;
    value2: CalculationValue;
  }) => {
    onUpdate({ ...condition, comparedValues: updates });
  };

  const handleUpdateOperator = (operator: ConditionOperators) => {
    onUpdate({ ...condition, comparator: operator });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col">
        <CompareValueSection
          type="value1"
          condition={condition?.comparedValues || defaultConditionalComparator}
          fields={fields}
          logicFields={logicFields}
          onUpdate={handleUpdate}
          hideFixedValue
        />
      </div>
      <OperatorSelector
        comparator={condition?.comparator || ConditionOperators.EQUALS}
        onUpdate={handleUpdateOperator}
      />
      <CompareValueSection
        type="value2"
        condition={condition?.comparedValues || defaultConditionalComparator}
        fields={fields}
        logicFields={logicFields}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

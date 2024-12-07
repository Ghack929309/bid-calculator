import {
  InputFieldType,
  LogicFieldType,
  ConditionalCalculationType,
} from "~/lib/types";
import { Calculator } from "../calculator";
import { defaultSimpleOperations } from "~/lib/constant";
import { useCalculator } from "~/lib/calculator-context";
import { v4 } from "uuid";

type ResultSectionProps = {
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  type: "then" | "else";
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
};

export const ResultSection = ({
  fields,
  logicFields,
  type,
  onUpdate,
}: ResultSectionProps) => {
  const { condition, updateConditionalOperation, removeConditionalOperation } =
    useCalculator();

  if (!condition) {
    alert("No condition found");
    return null;
  }
  const addMoreOperation = () => {
    onUpdate({
      ...condition,
      operations: {
        ...condition.operations,
        [type]: [
          ...(condition.operations[type] || []),
          { ...defaultSimpleOperations, id: v4() },
        ],
      },
    });
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-center gap-4">
        <Calculator
          calculationId={condition.id}
          operations={
            type === "then"
              ? condition.operations.then
              : condition.operations.else
          }
          addMoreOperation={addMoreOperation}
          fields={fields}
          logicFields={logicFields}
          updateOperation={(operation) =>
            updateConditionalOperation(operation, type)
          }
          onDelete={(calculationId, operationId) => {
            removeConditionalOperation(operationId, type);
          }}
        />
      </div>
    </div>
  );
};

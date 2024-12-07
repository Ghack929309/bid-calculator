import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  ConditionalCalculationType,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";
import { SingleCondition } from "./condition/single-condition";
import { useCalculator } from "~/lib/calculator-context";

type ConditionalCalculationProps = {
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
  onRemove: () => void;
};

export const ConditionalCalculation = ({
  fields,
  logicFields,

  onUpdate,
  onRemove,
}: ConditionalCalculationProps) => {
  const { condition } = useCalculator();
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Conditional Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SingleCondition
          condition={condition}
          fields={fields}
          logicFields={logicFields}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      </CardContent>
    </Card>
  );
};

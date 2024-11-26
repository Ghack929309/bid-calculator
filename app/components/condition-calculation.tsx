import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  ConditionalCalculationType,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";
import { SingleCondition } from "./condition/single-condition";

type ConditionalCalculationProps = {
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  condition: ConditionalCalculationType;
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
  onRemove: () => void;
};

export const ConditionalCalculation = ({
  fields,
  logicFields,
  condition,
  onUpdate,
  onRemove,
}: ConditionalCalculationProps) => {
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

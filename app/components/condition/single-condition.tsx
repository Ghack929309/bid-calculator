import {
  ConditionalCalculationType,
  InputFieldType,
  LogicFieldType,
} from "~/lib/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { ComparisonSection } from "./comparison-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResultSection } from "./result-section";

type SingleConditionProps = {
  fields: InputFieldType[];
  logicFields: LogicFieldType[];
  onUpdate: (updates: Partial<ConditionalCalculationType>) => void;
  onRemove: () => void;
};

export const SingleCondition = ({
  fields,
  logicFields,
  onUpdate,
  onRemove,
}: SingleConditionProps) => {
  return (
    <Card className="p-4">
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">If</h3>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <ComparisonSection
            fields={fields}
            logicFields={logicFields}
            onUpdate={onUpdate}
          />
        </div>

        <div className="mt-6">
          <Tabs defaultValue="then" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="then">Then</TabsTrigger>
              <TabsTrigger value="else">Else</TabsTrigger>
            </TabsList>

            <TabsContent value="then">
              <ResultSection
                type="then"
                fields={fields}
                logicFields={logicFields}
                onUpdate={onUpdate}
              />
            </TabsContent>

            <TabsContent value="else">
              <ResultSection
                type="else"
                fields={fields}
                logicFields={logicFields}
                onUpdate={onUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

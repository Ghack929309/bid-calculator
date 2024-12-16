import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { InputFieldType } from "~/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { AddField } from "./add-field";
import { Dialog, DialogContent } from "./ui/dialog";
import { MilesVariable } from "./miles-variable";
import { useState } from "react";
import { PriceRangeVariable } from "./price-range-variable";
import { RenderField } from "./render-field";

interface DynamicFormProps {
  fields: InputFieldType[];
  sectionId: string;
  isEditing?: boolean;
  handleUpdateField?: (field: InputFieldType) => void;
  handleDeleteField?: (field: InputFieldType) => void;
  handleUpdateMilesVariableField?: (field: InputFieldType) => void;
  handleDeleteMilesVariableField?: (id: string) => void;
  updatePriceRangeVariableField?: (field: InputFieldType) => void;
  handleDeletePriceRangeVariableField?: (id: string) => void;
}

export function DynamicForm({
  sectionId,
  fields,
  isEditing = false,
  handleDeleteField,
  handleUpdateField,
  handleUpdateMilesVariableField,
  handleDeleteMilesVariableField,
  updatePriceRangeVariableField,
  handleDeletePriceRangeVariableField,
}: DynamicFormProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<InputFieldType | null>(
    null
  );
  const privateFields = fields.filter((field) => field.isPrivate);
  const publicFields = fields.filter(
    (field) =>
      !field.isPrivate && field.type !== "miles" && field.type !== "priceRange"
  );
  const variables = fields.filter(
    (field) => field.type === "miles" || field.type === "priceRange"
  );

  function DisplayField({ field }: { field: InputFieldType }) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-between gap-2 flex-1",
          isEditing && "flex-1 flex items-end"
        )}
        key={field.id}
      >
        <div className="flex-1">
          <RenderField field={field} />
        </div>
        {isEditing &&
        ["text", "number", "select", "checkbox"].includes(field.type) ? (
          <div className="flex items-center gap-2 mb-2">
            <AddField
              trigger={
                <Pencil className="w-4 h-4 cursor-pointer text-blue-500" />
              }
              isEditing={isEditing}
              handleUpdateField={(updatedField) =>
                handleUpdateField?.(updatedField)
              }
              initialField={field}
              sectionId={sectionId}
            />

            <Trash2
              onClick={() => handleDeleteField?.(field)}
              className="w-4 h-4 cursor-pointer text-red-500"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <Pencil
              onClick={() => {
                setSelectedField(field);
                setIsEditModalOpen(true);
              }}
              className="w-4 h-4 cursor-pointer text-blue-500"
            />
            {isEditModalOpen && selectedField && (
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  {selectedField.type === "miles" && isEditModalOpen ? (
                    <MilesVariable
                      fields={fields}
                      updateMilesVariableField={(field) => {
                        handleUpdateMilesVariableField?.(field);
                        setIsEditModalOpen(false);
                      }}
                      initialData={selectedField}
                    />
                  ) : selectedField.type === "priceRange" && isEditModalOpen ? (
                    <PriceRangeVariable
                      fields={
                        fields?.filter(
                          (field) => field.type !== "priceRange"
                        ) ?? []
                      }
                      updateField={(field) => {
                        updatePriceRangeVariableField?.(field);
                        setIsEditModalOpen(false);
                      }}
                      initialData={selectedField}
                    />
                  ) : null}
                </DialogContent>
              </Dialog>
            )}

            <Trash2
              onClick={() => {
                if (field.type === "miles") {
                  handleDeleteMilesVariableField?.(field.id);
                } else {
                  handleDeletePriceRangeVariableField?.(field.id);
                }
              }}
              className="w-4 h-4 cursor-pointer text-red-500"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4 border border-green-500 p-4 rounded-md">
          <p className="text-lg font-bold">Public Fields</p>
          {publicFields.map((field, index) => {
            return <DisplayField key={index} field={field} />;
          })}
          {!publicFields.length && (
            <p className=" text-sm italic text-center text-slate-400">
              No public fields
            </p>
          )}
        </section>

        <section className="space-y-4 border border-orange-500 p-4 rounded-md">
          <p className="text-lg font-bold">Private Fields</p>
          {privateFields?.map((field, index) => {
            return <DisplayField key={index} field={field} />;
          })}
          {!privateFields.length && (
            <p className=" text-sm text-center text-slate-400 italic ">
              No private fields
            </p>
          )}
        </section>
        <section className="space-y-4 border border-purple-500 p-4 rounded-md">
          <p className="text-lg font-bold">Variables</p>
          {variables.map((field, index) => {
            return <DisplayField key={index} field={field} />;
          })}
          {!variables.length && (
            <p className="text-sm text-center italic text-slate-400">
              No variables
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

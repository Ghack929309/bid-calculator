import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { InputFieldType } from "~/lib/types";
import { Pencil, Trash2, Variable } from "lucide-react";
import { cn } from "~/lib/utils";
import { AddField } from "./add-field";
import { Dialog, DialogContent } from "./ui/dialog";
import { MilesVariable } from "./miles-variable";
import { useState } from "react";
import { PriceRangeVariable } from "./price-range-variable";

interface DynamicFormProps {
  fields: InputFieldType[];
  sectionId: string;
  onSubmit: (data: any) => void;
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
  onSubmit,
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

  const formSchema = z.object(
    fields.reduce((acc, field) => {
      let validator = z.string();

      if (field.type === "number") {
        validator = z.string().refine((val) => !isNaN(Number(val)), {
          message: "Must be a valid number",
        });
      }

      if (field.required) {
        validator =
          field.type === "number"
            ? validator.refine(
                (val) => val.length > 0,
                "This field is required"
              )
            : validator.min(1, "This field is required");
      }

      return { ...acc, [field.name]: validator };
    }, {})
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.value || "",
      }),
      {}
    ),
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {fields.map((field) => (
              <div
                className={cn(
                  "flex w-full items-center justify-between gap-2 flex-1",
                  isEditing && "flex-1 flex items-end"
                )}
                key={field.id}
              >
                <div className="flex-1">
                  <RenderField field={field} form={form} />
                </div>
                {isEditing &&
                ["text", "number", "select", "checkbox"].includes(
                  field.type
                ) ? (
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
                      <Dialog
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                      >
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
                          ) : selectedField.type === "priceRange" &&
                            isEditModalOpen ? (
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
            ))}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
const RenderField = ({ field, form }: { field: InputFieldType; form: any }) => {
  switch (field.type) {
    case "miles":
    case "priceRange":
      return (
        <div className="py-2">
          <FormLabel className="capitalize flex items-center gap-2">
            <Variable className="w-4 h-4" />
            <span>{field.name}</span>
          </FormLabel>
        </div>
      );

    case "text":
    case "number":
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <FormControl>
                <Input
                  type={field.type}
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                  {...formField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "select":
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select ${field.name.toLowerCase()}`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options?.map(
                    (option: { value: string; id: string }) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "checkbox":
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <div className="flex flex-col gap-4">
              <FormLabel className="capitalize">{field.name}</FormLabel>
              <div className="flex items-center flex-wrap gap-2">
                {field.options?.map((option: { value: string; id: string }) => (
                  <FormItem key={option.id} className="flex items-end gap-2">
                    <FormControl>
                      <Checkbox checked={formField.value === option.value} />
                    </FormControl>
                    <FormLabel className="capitalize">{option.value}</FormLabel>
                    <FormMessage />
                  </FormItem>
                ))}
              </div>
            </div>
          )}
        />
      );
    default:
      return null;
  }
};

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
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { AddField } from "./add-field";
import { useState } from "react";

interface DynamicFormProps {
  fields: InputFieldType[];
  onSubmit: (data: any) => void;
  isEditing?: boolean;
  handleUpdateField?: (field: InputFieldType) => void;
  handleDeleteField?: (field: InputFieldType) => void;
}

export function DynamicForm({
  fields,
  onSubmit,
  isEditing = false,
  handleDeleteField,
  handleUpdateField,
}: DynamicFormProps) {
  const [open, setOpen] = useState(false);
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      let validator = z.string();

      if (field.type === "number") {
        validator = z.string().refine((val) => !isNaN(Number(val)), {
          message: "Must be a valid number",
        });
      }

      // if (field.required) {
      //   validator = validator?.min(1, "This field is required");
      // }

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
  console.log("fields from dynamic form", fields);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                {isEditing && (
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
                    />

                    <Trash2
                      onClick={() => handleDeleteField?.(field)}
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
                  {(field as any).options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
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
                {field.options?.map((option: string) => (
                  <FormItem key={option} className="flex items-end gap-2">
                    <FormControl>
                      <Checkbox checked={formField.value === option} />
                    </FormControl>
                    <FormLabel className="capitalize">{option}</FormLabel>
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

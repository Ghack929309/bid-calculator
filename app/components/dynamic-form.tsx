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

interface DynamicFormProps {
  fields: InputFieldType[];
  onSubmit: (data: any) => void;
}

export function DynamicForm({ fields, onSubmit }: DynamicFormProps) {
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

  const renderField = (field: InputFieldType) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map(renderField)}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

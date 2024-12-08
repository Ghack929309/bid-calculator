import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/services/database-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { z } from "zod";
// import { useToast } from "~/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export async function loader() {
  const sections = await db.getFieldsAndSections();
  return { sections };
}

export default function Index() {
  const { sections } = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const { toast } = useToast();

  const createValidationSchema = () => {
    const schemaFields: Record<string, any> = {};

    sections?.forEach((section) => {
      section.fields
        .filter((f) => !f.isHidden && f.enabled)
        .forEach((field) => {
          let fieldSchema = z.any();

          switch (field.type) {
            case "number":
              fieldSchema = z.number().nullable();
              break;
            case "checkbox":
              fieldSchema = z.boolean();
              break;
            case "select":
            case "text":
              fieldSchema = z.string();
              break;
          }

          if (field.required) {
            fieldSchema = fieldSchema.refine((val) => {
              if (typeof val === "string") return val.trim().length > 0;
              if (typeof val === "number") return true;
              if (typeof val === "boolean") return true;
              return false;
            }, `${field.name} is required`);
          }

          schemaFields[field.id] = fieldSchema;
        });
    });

    return z.object(schemaFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = createValidationSchema();

    try {
      // Convert string numbers to actual numbers for validation
      const processedFormData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          const field = sections
            ?.flatMap((s) => s.fields)
            .find((f) => f.id === key);
          if (field?.type === "number" && value !== "") {
            acc[key] = Number(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

      const validatedData = schema.parse(processedFormData);

      // Handle your form submission here
      console.log("Form data validated:", validatedData);

      // toast({
      //   title: "Success",
      //   description: "Form submitted successfully",
      // });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);

        // toast({
        //   variant: "destructive",
        //   title: "Validation Error",
        //   description: "Please check the required fields",
        // });
      }
    }
  };

  const renderField = (field: any) => {
    if (!field.enabled) return null;

    const handleChange = (value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field.id]: value,
      }));
      // Clear error when field is modified
      if (errors[field.id]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field.id];
          return newErrors;
        });
      }
    };

    const commonLabelClasses = `${
      field.required
        ? "after:content-['*'] after:ml-0.5 after:text-red-500"
        : ""
    }`;
    const errorClasses = errors[field.id]
      ? "border-red-500 focus-visible:ring-red-500"
      : "";

    switch (field.type) {
      case "select":
        const options = field.options ? JSON.parse(field.options) : [];
        return (
          <div key={field.id} className="space-y-2">
            <Label className={commonLabelClasses}>{field.name}</Label>
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) => handleChange(value)}
              required={field.required}
            >
              <SelectTrigger className={errorClasses}>
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt: any) => (
                  <SelectItem key={opt.id || opt} value={opt.value || opt}>
                    {opt.value || opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label className={commonLabelClasses}>{field.name}</Label>
            <Input
              type="number"
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
              required={field.required}
              className={errorClasses}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleChange(checked)}
              required={field.required}
            />
            <Label htmlFor={field.id} className={commonLabelClasses}>
              {field.name}
            </Label>
          </div>
        );

      case "text":
      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label className={commonLabelClasses}>{field.name}</Label>
            <Input
              type="text"
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
              required={field.required}
              className={errorClasses}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Vehicle Import Calculator</h1>
        <p className="text-gray-600">
          Calculate your total landed cost including customs, shipping, and fees
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={sections?.[0]?.id} className="w-full">
              <TabsList className="w-full justify-start">
                {sections?.map((section) => (
                  <TabsTrigger key={section.id} value={section.id}>
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sections?.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <div className="space-y-6">
                    {section.fields
                      .filter((f) => !f.isHidden)
                      .map((field) => renderField(field))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

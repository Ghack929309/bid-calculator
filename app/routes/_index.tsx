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

// Add these validation schemas at the top level
const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
});

export async function loader() {
  const sections = await db.getFieldsAndSections();
  return { sections };
}

export default function Index() {
  const { sections } = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>(
    {}
  );

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
    setContactErrors({});

    try {
      // Validate contact information first
      const validatedContact = contactSchema.parse(contactInfo);

      // Then validate the rest of the form
      const schema = createValidationSchema();
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

      // Combine the validated data
      const finalData = {
        ...validatedContact,
        ...validatedData,
      };

      console.log("Form data validated:", finalData);

      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            // Separate contact errors from form errors
            if (err.path[0] === "email" || err.path[0] === "phone") {
              setContactErrors((prev) => ({
                ...prev,
                [err.path[0]]: err.message,
              }));
            } else {
              newErrors[err.path[0]] = err.message;
            }
          }
        });
        setErrors(newErrors);

        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check all required fields",
        });
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactInfo.email}
                  onChange={(e) => {
                    setContactInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    if (contactErrors.email) {
                      setContactErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                      });
                    }
                  }}
                  className={
                    contactErrors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {contactErrors.email && (
                  <p className="text-sm text-red-500">{contactErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={contactInfo.phone}
                  onChange={(e) => {
                    setContactInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                    if (contactErrors.phone) {
                      setContactErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.phone;
                        return newErrors;
                      });
                    }
                  }}
                  className={
                    contactErrors.phone
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {contactErrors.phone && (
                  <p className="text-sm text-red-500">{contactErrors.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Import Details</CardTitle>
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

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Calculate Total
          </Button>
        </div>
      </form>
    </div>
  );
}

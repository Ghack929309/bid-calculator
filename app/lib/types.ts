export type Field = {
  name: string;
  value: string;
  isRequired: boolean;
  type: "number" | "text" | "checkbox" | "select" | "textarea" | "radio";
  relatedField: string;
  relationType: string;
};

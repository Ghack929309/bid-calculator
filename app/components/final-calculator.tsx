import { Field, UserRequest } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { RenderField } from "./render-field";
import { InputFieldType } from "~/lib/types";

interface Props {
  open: boolean;
  close: () => void;
  userFields: UserRequest | null;
  allFields: Field[];
}

export function FinalCalculator({ open, close, userFields, allFields }: Props) {
  if (!userFields) return null;
  console.log("userFields", userFields);
  const sectionFields = allFields.filter(
    (field) => field.sectionId === userFields.sectionId && field.isPrivate
  );
  console.log("sectionFields", sectionFields);
  const userFieldData = JSON.parse(userFields.fields);
  console.log("userFieldData", userFieldData);
  const formField = Object.keys(userFieldData).map((key) => {
    return allFields.find((field) => field.id === key);
  });
  console.log("formField", formField);
  return (
    <Drawer open={open} onOpenChange={close}>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle>Final Calculator</DrawerTitle>
            <DrawerDescription>
              Fill out the final calculator to get your final results.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 grid grid-cols-3 gap-4">
            <section className="col-span-1">
              <p className="text-lg font-bold border-b pb-2">User Inputs</p>
              {formField?.map((field, index) => (
                <RenderField
                  isDisabled={true}
                  value={userFieldData[field?.id as string]}
                  key={index}
                  field={field as InputFieldType}
                />
              ))}
            </section>
            <section className="col-span-1">
              <p className="text-lg font-bold border-b pb-2">Your Inputs</p>
              {sectionFields?.map((field, index) => (
                <RenderField key={index} field={field as InputFieldType} />
              ))}
            </section>
            <section className="col-span-1">
              <p className="text-lg font-bold border-b pb-2">Your Logics</p>
              ...
              {/* {sectionFields?.map((field, index) => (
                <RenderField key={index} field={field as InputFieldType} />
              ))} */}
            </section>
          </div>
          <DrawerFooter>
            <Button
              disabled
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

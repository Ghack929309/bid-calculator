import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function CreateField({
  handleAddField,
  handleUpdateField,
  name,
  id,
  trigger,
}: {
  id?: string;
  name?: string;
  trigger?: React.ReactNode;
  handleAddField: (name: string) => void;
  handleUpdateField: (id: string, name: string) => void;
}) {
  const isUpdating = !!name && !!id;
  const [field, setField] = useState(name || "");
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Create new field</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new field</DialogTitle>
          <DialogDescription>
            Create a new logic field to use in your calculator
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={field}
            onChange={(e) => setField(e.target.value)}
            defaultValue="VAT price"
            className="col-span-3"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() =>
                isUpdating
                  ? handleUpdateField(id, field)
                  : handleAddField(field)
              }
            >
              {isUpdating ? "Update" : "Create"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

export function Result({
  calculations,
  onClose,
}: {
  calculations: { name: string; result: number }[];
  onClose?: () => void;
}) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose?.()}>
      <DialogTrigger asChild>
        <Button variant="outline">View Results</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calculation Results</DialogTitle>
          <DialogDescription>
            Here are the results of your calculations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {calculations.map((calc, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{calc.name}</span>
              <span className="text-right">{calc.result}</span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => window.print()}>Print Results</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

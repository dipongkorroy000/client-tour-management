import SingleImageUploader from "@/components/singleImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddDivisionModal() {
  const [image, setImage] = useState<File | null>(null);
  const [addDivision] = useAddDivisionMutation();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    const toastId = toast.loading("Uploading...");

    try {
      formData.append("data", JSON.stringify(data));
      formData.append("file", image as File);

      // console.log(formData.get("data"), formData.get("file"));

      const res = await addDivision(formData).unwrap();

      if (res.success) {
        toast.success("Add Division", { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Division</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Division</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="add-division" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Division name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Division Name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Division Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Division Description" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          {/* Image Uploader */}
          <SingleImageUploader onChange={setImage}></SingleImageUploader>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-division" disabled={!image}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

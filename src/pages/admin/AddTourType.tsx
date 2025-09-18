import { useGetTourTypesQuery, useRemoveTourTypeMutation } from "@/redux/features/tour/tour.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddTourTypeModal } from "@/components/modules/admin/tourType/AddTourTypeModal";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AddTourType = () => {
  const { data } = useGetTourTypesQuery(undefined);
  const [removeTourType] = useRemoveTourTypeMutation();

  const handleRemoveTourType = async (tourTypeId: string) => {
    const toastId = toast.loading("Removing...");
    try {
      const res = await removeTourType(tourTypeId).unwrap();
      if (res.success) toast.success("Removed", { id: toastId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-16">
        <h1 className="text-xl font-semibold">Tour Types</h1>
        <AddTourTypeModal></AddTourTypeModal>
      </div>
      <div className="border border-muted rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item: { _id: string; name: string }) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium w-full">{item?.name}</TableCell>

                <TableCell>
                  <DeleteConfirmation onConfirm={() => handleRemoveTourType(item._id)}>
                    <Button size="sm">
                      <Trash2></Trash2>
                    </Button>
                  </DeleteConfirmation>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AddTourType;

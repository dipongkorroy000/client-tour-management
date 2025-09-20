import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { useSearchParams } from "react-router";

const TourFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDivision = searchParams.get("division") || undefined;
  const selectedTourType = searchParams.get("tourType") || undefined;

  const { data: divisions, isLoading: divisionsLoading } = useGetDivisionsQuery(undefined);
  const { data: tourTypes, isLoading: tourTypesLoading } = useGetTourTypesQuery({ fields: "_id, name " });

  const divisionOptions = divisions?.map((item: { _id: string; name: string }) => ({ label: item.name, value: item._id }));
  const tourTypeOptions = tourTypes?.data.map((item: { _id: string; name: string }) => ({ label: item.name, value: item._id }));

  const handelDivisionUpdate = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("division", value);
    setSearchParams(params);
  };

  const handleTourTypeUpdate = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tourType", value);
    setSearchParams(params);
  };

  const handelClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("division");
    params.delete("tourType");
    setSearchParams(params);
  };

  return (
    <div className="col-span-3 w-full h-[500px] border border-muted rounded-md p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1>Filters</h1>
        <Button onClick={handelClearFilter}>Clear Filter</Button>
      </div>
      <div>
        <Label className="mb-2">Division to visit</Label>
        <Select onValueChange={handelDivisionUpdate} disabled={divisionsLoading} value={selectedDivision ? selectedDivision : ""}>
          <SelectTrigger className="w-full">
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Divisions</SelectLabel>
              {divisionOptions?.map((item: { label: string; value: string }) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2">Division to visit</Label>
        <Select onValueChange={handleTourTypeUpdate} disabled={tourTypesLoading} value={selectedTourType ? selectedTourType : ""}>
          <SelectTrigger className="w-full">
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tour Type</SelectLabel>
              {tourTypeOptions?.map((item: { label: string; value: string }) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TourFilters;

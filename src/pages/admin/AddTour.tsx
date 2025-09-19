import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function AddTour() {
  const { data: tourTypeData, isLoading: tourTypeLoading } = useGetTourTypesQuery(undefined);
  const { data: divisionData, isLoading: divisionLoading } = useGetDivisionsQuery(undefined);
  const [addTour] = useAddTourMutation();

  const divisionOptions = divisionData?.map((item: { _id: string; name: string }) => ({ value: item._id, label: item.name }));
  const tourTypeOptions = tourTypeData?.data?.map((item: { _id: string; name: string }) => ({ value: item._id, label: item.name }));

  const [images, setImages] = useState<(File | FileMetadata)[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Cox's Bazar Beach Adventure",
      description:
        "Experience the world's longest natural sea beach with golden sandy shores, crystal clear waters, and breathtaking sunsets. Enjoy beach activities, local seafood, and explore nearby attractions including Himchari National Park and Inani Beach.",
      location: "Cox's Bazar",
      costFrom: "15000",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      departureLocation: "Dhaka",
      arrivalLocation: "Cox's Bazar",
      included: [{ value: "All meals (breakfast, lunch, dinner)" }, { value: "Transportation (AC bus)" }, { value: "Professional tour guide" }],
      excluded: [{ value: "Personal expenses" }, { value: "Extra activities not mentioned" }, { value: "Travel insurance" }],
      amenities: [{ value: "Air-conditioned rooms" }, { value: "Free WiFi" }, { value: "Swimming pool access" }, { value: "Beach access" }],
      tourPlan: [
        { value: "Day 1: Arrival and beach exploration" },
        { value: "Day 2: Himchari National Park visit" },
        { value: "Day 3: Inani Beach and departure" },
      ],
      maxGuest: "25",
      minAge: "5",
      division: "",
      tourType: "",
    },
  });

  const { fields: includedFields, append: appendIncluded, remove: removeIncluded } = useFieldArray({ control: form.control, name: "included" });

  const { fields: excludedFields, append: appendExcluded, remove: removeExcluded } = useFieldArray({ control: form.control, name: "excluded" });

  const { fields: amenitiesFields, append: appendAmenities, remove: removeAmenities } = useFieldArray({ control: form.control, name: "amenities" });

  const { fields: tourPlanFields, append: appendTourPlan, remove: removeTourPlan } = useFieldArray({ control: form.control, name: "tourPlan" });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Creating tour....");

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      minAge: Number(data.minAge),
      maxGuest: Number(data.maxGuest),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included: data.included[0].value === "" ? [] : data.included.map((item: { value: string }) => item.value),
      excluded: data.included[0].value === "" ? [] : data.excluded.map((item: { value: string }) => item.value),
      amenities: data.amenities[0].value === "" ? [] : data.amenities.map((item: { value: string }) => item.value),
      tourPlan: data.tourPlan[0].value === "" ? [] : data.tourPlan.map((item: { value: string }) => item.value),
    };

    console.log(tourData);

    const formData = new FormData();

    images.forEach((image) => formData.append("files", image as File));
    // console.log(formData.getAll("files"));

    formData.append("data", JSON.stringify(tourData));

    try {
      const res = await addTour(formData).unwrap();
      if (res.success) {
        toast.success("Add Tour", { id: toastId });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add a new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="add-tour-form" className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              {/** Tour Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/** Location & CostFrom*/}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/** Departure Location & Arrival Location  */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/** Division & Tour Type*/}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Division</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={divisionLoading}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map((item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={tourTypeLoading}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map((item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/** Max Guest & Min Age */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Guest</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/** Start Date & End Date */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/** Description */}
              <div className="flex gap-5 items-stretch">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-[205px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-5">
                  <MultipleImageUploader onChange={setImages}></MultipleImageUploader>
                </div>
              </div>

              <div className="border-t border-muted w-full "></div>

              {/** Included */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Included</p>
                  <Button type="button" variant="outline" size="icon" onClick={() => appendIncluded({ value: "" })}>
                    <Plus />
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {includedFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`included.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button onClick={() => removeIncluded(index)} variant="destructive" className="!bg-red-700" size="icon" type="button">
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/** Excluded */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Excluded</p>
                  <Button type="button" variant="outline" size="icon" onClick={() => appendExcluded({ value: "" })}>
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {excludedFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`excluded.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button onClick={() => removeExcluded(index)} variant="destructive" className="!bg-red-700" size="icon" type="button">
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/** Amenities */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Amenities</p>
                  <Button type="button" variant="outline" size="icon" onClick={() => appendAmenities({ value: "" })}>
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {amenitiesFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`amenities.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button onClick={() => removeAmenities(index)} variant="destructive" className="!bg-red-700" size="icon" type="button">
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/** Tour Plan */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Tour Plan</p>
                  <Button type="button" variant="outline" size="icon" onClick={() => appendTourPlan({ value: "" })}>
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {tourPlanFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`tourPlan.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button onClick={() => removeTourPlan(index)} variant="destructive" className="!bg-red-700" size="icon" type="button">
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="add-tour-form">
            Create Tour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

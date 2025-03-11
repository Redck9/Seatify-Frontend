import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"; // Assuming Shadcn has these components
import { RestaurantFormData } from "./create-restaurant-page";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ScheduleFormProps {
  getValues: () => RestaurantFormData;
}

export function ScheduleForm({ getValues }: ScheduleFormProps) {
  const { control, setValue, watch } = useFormContext<RestaurantFormData>();
  const schedule = watch("schedule") || []; // Ensure schedule always has a default array
  console.log("RestaurantForm Data: ", getValues());

  // Function to add a new day to the schedule
  const addDay = () => {
    setValue("schedule", [...schedule, { day: "", openTime: "", closeTime: "" }]);
  };

  // Function to remove a day from the schedule
  const removeDay = (index: number) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setValue("schedule", updatedSchedule);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Restaurant Weekly Schedule</h3>

      {schedule.map((_, index) => (
        <div key={index} className="p-4 space-y-2 border rounded-lg">
          {/* Day Field - Select Dropdown */}
          <FormField
            control={control}
            name={`schedule.${index}.day`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day, i) => (
                        <SelectItem key={i} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opening Time Field */}
          <FormField
            control={control}
            name={`schedule.${index}.openTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Closing Time Field */}
          <FormField
            control={control}
            name={`schedule.${index}.closeTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remove Day Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => removeDay(index)}
            className="w-full mt-2"
          >
            Remove {weekDays[index]}
          </Button>
        </div>
      ))}

      {/* Add New Day Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addDay}
        className="w-full mt-4"
      >
        Add New Day
      </Button>
    </div>
  );
}

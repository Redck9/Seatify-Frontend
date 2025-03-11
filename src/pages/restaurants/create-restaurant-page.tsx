import /*React,*/ { useState } from "react";
import { RestaurantForm } from "./restaurant-form";
//import FloorPlan from "./FloorPlan";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Progress } from "@/app/components/ui/progress";
import { useForm, FormProvider } from "react-hook-form";
import { MenuItemForm } from "./menuItem-form";
import { ScheduleForm } from "./schedule-form";
import { Button } from "@/app/components/ui/button";
import axios from "axios";
import { toast } from "@/app/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/authService";

const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  type: z.string().min(2, "Type is required"),
  location: z.string().min(2, "Location is required"),
  tablesCapacity: z.number().min(1, "At least 1 table"),
  description: z.string().optional(),
  userUid: z.string().optional(),
  menuItem: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number().min(1, "At least 1€"),
      category: z.string().optional(),
      ingredients: z.array(z.string()).optional(),
      vegan: z.boolean().optional(),
      glutenFree: z.boolean().optional(),
      calories: z.number().optional(),
      availability: z.boolean().optional(),
      preparationTime: z.number().min(1, "At least 1 minute").optional(),
      availableDays: z.array(z.string()).optional(),
    })
  ),
  schedule: z.array(
    z.object({
      day: z.string(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })
  ),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function CreateRestaurant(){
    //const[restaurant, setRestaurant] = useState<{uid: string; tablesCapacity: number } | null>(null);
    const [step, setStep] = useState(0);
    const methods = useForm<RestaurantFormData>({
      resolver: zodResolver(restaurantSchema),
      defaultValues: {
        name: "",
        type: "",
        location: "",
        tablesCapacity: 1,
        description: "",
        menuItem: [],
        schedule: [],
      },
    });

    const { getValues } = methods;
    
    const { formState: { errors } } = methods;
    const navigate = useNavigate();

    console.log("Current step: ", step);
    console.log("Validation Errors: ", errors);

    const steps = [
      { title: "Restaurant Info", component: <RestaurantForm getValues={getValues}/> },
      { title: "Menu Items", component: <MenuItemForm getValues={getValues}/> },
      { title: "Schedule", component: <ScheduleForm getValues={getValues}/> },
    ];

    const handleNext = async () => {
      // Define fields for each step
      const stepFields: Record<number, (keyof RestaurantFormData)[]> = {
        0: ["name", "type", "location", "tablesCapacity", "description"],
        1: ["menuItem"], // Validate entire menuItem array
        2: ["schedule"], // Validate entire schedule array
      };

      // Validate only the current step fields
      const isValid = await methods.trigger(stepFields[step], { shouldFocus: true });
      if (isValid && step < steps.length - 1) {
        setStep(step + 1);
      }
    };
  
    const handlePrev = () => {
      if (step > 0) setStep(step - 1);
    };
  
    const onSubmit = async (data: z.infer<typeof restaurantSchema>) => {
      console.log("Form data:", data);
      const accessToken = await getAccessToken();
      console.log("Access Token:", accessToken);

      if (!accessToken) 
      {
          navigate("/");
          return;
      }

      try {
        const userUid = localStorage.getItem("userUid");
        if (!userUid) {
          toast({
            title: "User Not Found",
            description: "Please log in before creating a restaurant.",
            duration: 5000,
          });
          return;
        }
    
        data.userUid = userUid;
        console.log("Submitting restaurant data: ", data);
    
        const response = await axios.post(
          "http://192.168.1.44:8282/restaurant/bff/api/restaurant", 
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    
        if (response.status >= 200 && response.status < 300) {
          toast({
            title: "Restaurant Created! 🍽️🎉",
            description: `Successfully added "${data.name}"`,
            duration: 5000,
          });
    
          methods.reset(); // Reset form after successful submission
          navigate("/homepage");
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (err) {
        console.error("Error creating restaurant: ", err);
        toast({
          title: "Error Creating Restaurant",
          description: "Something went wrong. Please try again.",
          duration: 5000,
        });
      }
    };

    return (
        /*{ <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {!restaurant ? (
            <RestaurantForm onSave={(data) => setRestaurant({ uid: data.uid, tablesCapacity: data.tablesCapacity })} />
          ) : (
            <FloorPlan restaurantUid={restaurant.uid} maxTables={restaurant.tablesCapacity} />
          )}
        </div> }*/

        <FormProvider {...methods}>
          <div className="w-full max-w-2xl p-6 mx-auto space-y-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Create a Restaurant</h2>
            
            {/* Progress Bar */}
            <Progress value={(step / (steps.length - 1)) * 100} className="mb-4 [&>div]:bg-blue-600" />
            
            {/* Step Component */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {steps[step].component}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-4">
                {step > 0 && (
                  <Button type="button" onClick={handlePrev} variant="outline">
                    Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" onClick={methods.handleSubmit(onSubmit)}>Submit</Button>
                )}
              </div>
            </form>
          </div>
        </FormProvider>
      );
}
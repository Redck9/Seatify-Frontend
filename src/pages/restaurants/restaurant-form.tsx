/* import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/app/hooks/use-toast"; */
import { /*Form,*/ FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Textarea } from "@/app/components/ui/textarea"
import { Input } from "@/app/components/ui/input";
/* import { Button } from "@/app/components/ui/button";
import { MenuItemForm } from "./menuItem-form";
import { ScheduleForm } from "./schedule-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"; */
import { useFormContext } from "react-hook-form";
import {RestaurantFormData } from "./create-restaurant-page"



/*interface Restaurant
{
    uid: string;
    name: string;
    type: string;
    location: string;
    tablesCapacity: number;
    description: string;
    userUid: string;
    schedule: Schedule[];
    menuItem: MenuItem[];
}


interface Schedule
{
    day: string;
    openingTime: string;
    closingTime: string;
}

interface MenuItem
{
    name: string;
    description: string;
    price: number;
    category: string;
    ingredients: string[];
    vegan: boolean;
    glutenFree: boolean;
    calories: number;
    availability: boolean;
    preparationTime: number;
    availableDays: string[];
}*/

/*export const restaurantSchema = z.object({
    name: z.string().min(2, "Restaurant name must be at least 2 characters"),
    location: z.string().min(2, "Location is required"),
    tablesCapacity: z.number().min(1, "At least 1 table").max(100, "Max 100 tables"),
    menuItem: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            price: z.number(),
            category: z.string()
        })
    ),
});

interface Props {
    onSave: (restaurant: Restaurant) => void;
}*/

interface RestaurantFormProps {
    getValues: () => RestaurantFormData; // Correct type for getValues
  }

export function RestaurantForm(/*{onSave}: Props*/{getValues}: RestaurantFormProps)
{
    /*const form = useForm<Restaurant>({
        resolver: zodResolver(restaurantSchema),
        defaultValues:{
            name: "",
            type: "",
            location: "",
            tablesCapacity: 0,
            description: "",
            userUid: "",
        }
    });

    async function onSubmit(data: Restaurant)
    {
        try
        {
            console.log("Submitting restaurant data: ", data);

            const response  = await axios.post("http://192.168.1.44:8282/restaurant/bff/api/restaurant", data);

            if(response.status >= 200 && response.status < 300)
            {
                toast({
                    title: "Restaurant Created! 🍽️🎉",
                    description: `Successfully added "${data.name}"`,
                    duration: 5000,
                });

                onSave(data);
                form.reset();
            }
            else
            {
                throw new Error(`Request failed with status ${response.status}`)
            }
        } 
        catch(err)
        {
            console.error("Error creating restaurant: ", err);
            toast({
                title: "Error Creating Restaurant",
                description: "Something went wrong. Please try again.",
                duration: 5000
            });
        }
    }*/

    const { control} = useFormContext();

    console.log("RestaurantForm Data: ", getValues());

    return (
        /*<div className="flex flex-col items-center max-w-4xl px-4 py-8 mx-auto">
            <h2 className="mb-6 text-2xl font-bold text-center">Create a Restaurant</h2>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">

                <div className="grid grid-cols-1 gap-6 p-6 rounded-lg shadow-md sm:grid-cols-2">
                    <h3 className="text-lg font-semibold text-gray-300 sm:col-span-2">Restaurant Information</h3>
                    {/* Restaurant Name *//*}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Restaurant Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Restaurant Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* type *//*}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter type" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Location *//*}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter location" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Tables Capacity *//*}
                    <FormField
                        control={form.control}
                        name="tablesCapacity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Tables</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* description *//*}
                    <div className="p-6 space-y-6 rounded-lg shadow-md">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about your restaurant"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    {/* Tabs Section: Schedule and Menu Forms *//*}
                    <Tabs defaultValue="schedule" className="w-full">
                        <TabsList className="flex space-x-4 border-b">
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            <TabsTrigger value="menu">Menu</TabsTrigger>
                        </TabsList>

                        <TabsContent value="schedule" className="py-6">
                            <ScheduleForm />
                        </TabsContent>
                        
                        <TabsContent value="menu" className="py-6">
                            <MenuItemForm />
                        </TabsContent>
                    </Tabs>

                    <Button type="submit" className="w-full py-3 mt-6 text-white bg-blue-600 rounded-lg">Create Restaurant</Button>
                </div>
            </form>
        </Form>
        </div>*/
        <div className="grid grid-cols-2 gap-4">
            {/* Restaurant Name */}
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter restaurant name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Type */}
            <FormField
                control={control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter type" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Location */}
            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Tables Capacity */}
            <FormField
                control={control}
                name="tablesCapacity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tables Capacity</FormLabel>
                        <FormControl>
                            <Input type="number" value={field.value || ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Description */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe your restaurant" rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );

};


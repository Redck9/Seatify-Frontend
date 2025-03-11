import { useFieldArray, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useState} from "react"
import {RestaurantFormData } from "./create-restaurant-page"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface MenuItemFormProps{
    getValues: () => RestaurantFormData;
}


export function MenuItemForm({getValues}: MenuItemFormProps)
{
    const {control} = useFormContext();
    const {fields, append, remove} = useFieldArray({control, name: "menuItem"});
    console.log("RestaurantForm Data: ", getValues());

    return (
        <div className="space-y-4">
        <h3 className="text-lg font-semibold">Menu Items</h3>

        {fields.map((item, index) => (
            <div key={item.id} className="p-4 space-y-2 border rounded-lg">
                <FormField
                    control={control}
                    name={`menuItem.${index}.name`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter item name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Item description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.price`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Price" value={field.value || ''}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.category`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Category</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter item category" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.calories`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Calories</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Calories" value={field.value || ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.availableDays`}
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Available Days</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                                {daysOfWeek.map((day) => (
                                <label key={day} className="flex items-center space-x-2">
                                    <Checkbox
                                    checked={Array.isArray(field.value) && field.value.includes(day)}
                                    onCheckedChange={(checked: boolean) => {
                                        field.onChange(
                                        checked ? [...field.value, day] : field.value.filter((d: string) => d !== day)
                                        );
                                    }}
                                    />
                                    <span>{day}</span>
                                </label>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.preparationTime`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preparation Time</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Preparation time in minutes" value={field.value || ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.vegan`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Vegan </FormLabel>
                            <FormControl>
                                <Switch
                                    checked = {field.value ?? false}
                                    onCheckedChange={(checked: boolean) => field.onChange(checked ? true : null)}
                                    aria-readonly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.glutenFree`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Gluten Free </FormLabel>
                            <FormControl>
                                <Switch
                                    checked = {field.value ?? false}
                                    onCheckedChange={(checked: boolean) => field.onChange(checked ? true : null)}
                                    aria-readonly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.availability`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Availability </FormLabel>
                            <FormControl>
                                <Switch
                                    checked = {field.value ?? false}
                                    onCheckedChange={(checked: boolean) => field.onChange(checked ? true : null)}
                                    aria-readonly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`menuItem.${index}.ingredients`}
                    render={({ field }) => {
                        // Local state to manage the current input value
                        const [ingredientInput, setIngredientInput] = useState('');

                        return (
                            <FormItem>
                                <FormLabel>Ingredients</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                placeholder="Enter ingredient"
                                                value={ingredientInput} // Using local state for input value
                                                onChange={(e) => setIngredientInput(e.target.value)} // Update the local state on change
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    // Only add ingredient if there is a value
                                                    if (ingredientInput.trim() === "") return;

                                                    const newIngredients = [...(field.value || []), ingredientInput];
                                                    field.onChange(newIngredients); // Update form state
                                                    setIngredientInput(''); // Clear input after adding
                                                }}
                                                className="bg-green-500"
                                            >
                                                Add Ingredient
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value && field.value.length > 0 ? (
                                                field.value.map((ingredient: string, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center px-2 py-1 space-x-2 bg-blue-600 rounded-full"
                                                    >
                                                        <span>{ingredient}</span>
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                const newIngredients = field.value.filter((_: string, i: number) => i !== idx);
                                                                field.onChange(newIngredients);
                                                            }}
                                                            className="px-3 py-1 text-white bg-blue-600 rounded-full hover:bg-red-500"
                                                        >
                                                            &times;
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No ingredients added yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <Button type="button" onClick={() => remove(index)} className="bg-red-500">
                    Remove Item
                </Button>
            </div>
        ))}

        <Button type="button" onClick={() => append({ name: "", description: "", price: 0 })}>
            Add Menu Item
        </Button>
    </div>
    );
}

import { useEffect, useState } from "react";
import axios from "axios";
import * as fabric from "fabric";
import { TableIcon } from "lucide-react";

interface Restaurant
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
}

interface Table
{
    tableId?: string;
    restaurantUid: string;
    xPosition: number;
    yPosition: number;
    chairsCapacity: number;
    tableUid?: number;
    angle: number;
    width: number;
    height: number;
}

interface Chair
{
    tableUid: string;
    xPosition: number;
    yPosition: number;
    angle: number;
}

interface Props{
    restaurantUid: string;
    tablesCapacity: number;
}

export default function MyRestaurantPage({restaurantUid, tablesCapacity}: Props)
{
    const [tables, setTables] = useState<Table[]>([]);
    const [chairs, setChairs] = useState<Chair[]>([]);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [chairAssignments, setChairAssignments] = useState<{ [chairUid: string]: number | null }>({});


    const updateCanvasSize = () => {
        if (canvas) {
          const width = window.innerWidth - 500; // Add padding
          const height = window.innerHeight - 550; // Adjust for header/footer space
    
          // Update canvas size
          canvas.setDimensions({ width, height });
    
          // Optionally, adjust position of elements based on new canvas size
          canvas.renderAll();
        }
    };

    useEffect(() => {
        console.log("Restaurant floor plan is running!");
        const newCanvas = new fabric.Canvas("restaurantCanvas", {
          width: window.innerWidth - 500,
          height: window.innerHeight - 180,
        });

        console.log("Canvas Initialized:", newCanvas)
    
        // Apply border style to canvas element
        const canvasElement = document.getElementById("restaurantCanvas");
        if (canvasElement) {
          canvasElement.style.border = "2px solid #3b82f6"; // blue border
          canvasElement.style.borderRadius = "10px"
        }

        setCanvas(newCanvas);

        const doorWidth = 50;
        const doorHeight = 10;

        const door = new fabric.Rect({
        left: (newCanvas.width - doorWidth) / 2, // Center the door horizontally
        top: newCanvas.height - doorHeight, // Place door at the bottom edge
        width: doorWidth,
        height: doorHeight,
        fill: "brown", // Door color
        selectable: false, // Door is not selectable by the user
        angle: 0, // No rotation needed
        });

         // Add a label above the door to indicate it's a door
        const doorLabel = new fabric.IText("Door", {
            left: (newCanvas.width - doorWidth) / 2 + doorWidth / 2 - 22, // Center horizontally
            top: newCanvas.height - doorHeight - 25, // Position it above the door
            fontSize: 20,
            fill: "white",
            fontWeight: "bold",
            textAlign: "center",
        });

        // Add the door to the canvas
        newCanvas.add(door, doorLabel);
        newCanvas.renderAll();

        newCanvas.on("object:modified", (e) => {
            if (canvas) 
            {
                const activeObject = e.target as fabric.Rect & { customType?: string; tableUid?: number; chairId: number };
                if (activeObject) 
                {
                    const actualWidth = activeObject.getScaledWidth();
                    const actualHeight = activeObject.getScaledHeight();
                    console.log("Active object scales:", actualWidth, actualHeight);
                    console.log("Active object properties:", activeObject.width, activeObject.height);
                    // Optionally, you can update your table's position in the state here
                    const updatedTable = {
                        xPosition: activeObject.left!,
                        yPosition: activeObject.top!,
                        angle: activeObject.angle!, // The rotation angle
                        width: actualWidth, // The width of the object
                        height: actualHeight, // The height of the object
                    };

                    console.log("Object modified at position:", updatedTable);
                    setTables((prev) =>
                    prev.map((table) =>
                        table.tableUid === activeObject.get("tableUid")
                        ? {
                            ...table,
                            xPosition: activeObject.left!,
                            yPosition: activeObject.top!,
                            angle: updatedTable.angle, // Updated rotation
                            width: actualWidth, // Updated width
                            height: actualHeight, // Updated height
                            }
                        : table
                    )
                    );

                    if(activeObject.get("customType") === "chair")
                    {
                        if (activeObject.chairId === undefined) {
                            console.error("Error: chairId is undefined for this chair.");
                            return;  // Do not proceed if chairId is undefined
                        }
                        const assignedTable = chairAssignments[activeObject.get("chairId")!];
                        console.log(tables)
                        console.log("Chair modified")
                        if (assignedTable) {
                            // The chair already has a table assigned
                            const changeTable = window.confirm(
                                `This chair is assigned to Table ${assignedTable}. Do you want to change the table?`
                            );
                            
                            if (changeTable) {
                                // Allow the user to reassign the chair
                                assignTableToChair(activeObject);
                            }
                        } else {
                            // If the chair is not assigned, prompt the user to assign a table
                            assignTableToChair(activeObject);
                        }
                    }
                    else if(activeObject.get("customType") === "table")
                    {
                        console.log("Table UID on modified table:", activeObject.get("tableUid"));
                    }
                }
            }
        });
    
        window.addEventListener("resize", updateCanvasSize);

        return () => {
          newCanvas.dispose(); // Cleanup canvas when component is unmounted
          window.removeEventListener("resize", updateCanvasSize);
        };
    }, []);

    const assignTableToChair = (chair: fabric.Rect & {customType?: string; chairId: number; tableUid?: number }) => {
        const availableTables = tables.map(table => ({
            label: `Table ${table.tableUid}`,
            value: table.tableUid,
        }));
    
        // Prompt the user to select a table for the chair
        const selectedTableIndex = prompt(
            `Select the table number for this chair:\n` +
            availableTables.map((t) => `${t.value}. ${t.label}`).join("\n")
        );
    
        const selectedTableNumber = selectedTableIndex !== null ? parseInt(selectedTableIndex, 10) : undefined;
    
        if (selectedTableNumber && !isNaN(selectedTableNumber)) {
            // Store the assignment of the table to the chair
            setChairAssignments((prevAssignments) => ({
                ...prevAssignments,
                [chair.chairId]: selectedTableNumber,  // Use chairId for assignment
            }));
    
            // Update the chair's position or other properties based on the assigned table (optional)
            chair.tableUid = selectedTableNumber;  // Set the assigned table to the chair
            console.log(`Chair ${chair.chairId} assigned to Table: ${selectedTableNumber}`);
            canvas?.renderAll();
        } else {
            console.log("Invalid selection or no input provided.");
        }
    };
    
    

    const addTableIcon = () => {
        if(tables.length == tablesCapacity)
        {
            alert("Max Tables Reached");
        }

        const tableNumber = tables.length + 1;

        const newTable: Table = {
            restaurantUid: restaurantUid,
            xPosition: 100,
            yPosition: 100,
            chairsCapacity: 4,
            angle: 0, // Initial angle
            width: 50, // Initial width
            height: 25, // Initial height
        }
        
        setTables((prev) => [...prev, {...newTable, tableUid: tableNumber}]);
        
        if(canvas)
        {
            const tableRect = new fabric.Rect({
                left: newTable.xPosition,
                top: newTable.yPosition,
                fill: "white", // Color of the table
                width: newTable.width, // Width of the table
                height: newTable.height, // Height of the table
                selectable: true, // Allow the user to select and move the table
                hasControls: true, // Allow controls for resizing
            });


            const tableNumberText = new fabric.IText(`${tableNumber}`, {
                left: newTable.xPosition + newTable.width / 2, // Center the text
                top: newTable.yPosition + newTable.height / 2, // Center the text
                fontSize: 16,
                fill: "black",
                fontWeight: "bold",
                originX: "center",
                originY: "center",
                selectable: false, // Text should not be moved separately
            });

            const tableGroup = new fabric.Group([tableRect, tableNumberText], {
                left: newTable.xPosition,
                top: newTable.yPosition,
                selectable: true,
            }) as fabric.Group & { customType: string, tableUid: number };

            tableGroup.customType = "table"; 
            tableGroup.tableUid = tableNumber;

           // Add the table to the canvas
            canvas.add(tableGroup);
            console.log(tableGroup.get("customType"))
            console.log(tableGroup.get("tableUid"))
            canvas.renderAll();

        }
    
    }

    const addChairIcon = () => {
        if(chairs.length == tablesCapacity)
        {
            alert("Max Tables Reached");
        }

        const newChair: Chair = {
            tableUid: restaurantUid,
            xPosition: 10,
            yPosition: 10,
            angle: 0,
        }
        
        setChairs((prev) => [...prev, newChair]);
        
        if(canvas)
        {
            const chairId = chairs.length
            const chairRect = new fabric.Rect({
                left: newChair.xPosition,
                top: newChair.yPosition,
                fill: "green", // Color of the table
                width: 20, // Width of the table
                height: 20, // Height of the table
                selectable: true, // Allow the user to select and move the table
                hasControls: true, // Enable controls
                lockScalingX: true,  // Disable horizontal scaling
                lockScalingY: true,  // Disable vertical scaling
                hasRotatingPoint: true,
            }) as fabric.Rect & { customType: string, tableUid: number, chairId: number };

            chairRect.setControlsVisibility({
                mt: false, // Middle top
                mb: false, // Middle bottom
                ml: false, // Middle left
                mr: false, // Middle right
                tr: false, // Top right
                tl: false, // Top left
                br: false, // Bottom right
                bl: false, // Bottom left
                mtr: true,  // Rotation control
            });

            chairRect.customType = "chair"; 
            chairRect.chairId = chairId
            

           // Add the table to the canvas
            canvas.add(chairRect);
            console.log(chairRect.get("customType"))
            canvas.renderAll();
            
        }
    
    }

    /*const onSubmit = async () => {
    }*/

    return (
        <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xl font-bold">Restaurant Floor Plan</h2>
            <p className="text-sm text-gray-400"> Move the objects on the canvas to place them</p>

            <canvas id="restaurantCanvas"/>

            {/* Button to add a table icon */}
            <div className="mt-4">
                <button onClick={addTableIcon} className="px-4 py-2 text-white bg-blue-500 rounded">
                Add Table Icon
                </button>
                <button onClick={addChairIcon} className="px-4 py-2 ml-4 text-white bg-blue-500 rounded">
                Add Chair Icon
                </button>
            </div>


            <p className="mt-4">Tables placed: {tables.length} / {tablesCapacity}</p>
        </div>
    )
    

}
import { Separator } from "@/app/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/app/components/ui/tabs"
import { getAccessToken } from "@/authService";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/app/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Pencil } from "lucide-react";

interface User
{
    username: string;
    role: string;
    email: string;
    name: string;
    password: string;
}

export default function EditProfilePage()
{
    const [theme, setTheme] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [newValue, setNewValue] = useState<string>("");
    const [otpSent, setOtpSent] = useState(false);
    const [editField, setEditField] = useState<keyof User | null>(null);
    const [otpCode, setOtpCode] = useState<string>("");
    const [otpError, setOtpError] = useState<string | null>(null); // Track OTP errors
    const [otpSending, setOtpSending] = useState<boolean>(false); // Track if OTP is being sent
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const fetchUser = async() =>
    {
        setLoading(true)
        setError(null)

        const accessToken = await getAccessToken();
        if(!accessToken)
        {
            setError("Session expired. Please log in again.")
            navigate("/")
            return
        }

        try
        {
            const userUid = localStorage.getItem("userUid");
            const theme = localStorage.getItem("theme");
            if(!userUid)
            {
                setError("Session expired. Please log in again.")
                setLoading(false);
                return;
            }

            const response = await axios.get<User>(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            setUser(response.data)
            setTheme(theme)
                
        }
        catch(err)
        {
            setError("Failed to fetch user. Please try again.")
            console.log("Error fetching user:", err)
        }
        finally
        {
            setLoading(false)
        }
    
    }

    useEffect(() =>
    {
        fetchUser()
    }, [])

    const requestOtp = async() =>
    {
        setError(null);
        setOtpError(null); // Clear any previous OTP error
        setOtpSending(true); // Show loading state for OTP request
        const accessToken = await getAccessToken();
        if (!accessToken)
        {
            setError("Session expired. Please log in again.");
            navigate("/");
            return;
        }

        try 
        {
            console.log(user?.email)
            const userUid = localStorage.getItem("userUid");
            await axios.post(`http://192.168.1.44:8282/restaurant/bff/api/send/otp/${userUid}`, {},{
                headers: 
                {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setOtpSent(true);
        }
        catch (err)
        {
            console.error("Error requesting OTP:", err);
            setError("Failed to send OTP. Try again.");
        }
        finally 
        {
            setOtpSending(false); // Reset OTP sending state
        }

    }

    const verifyOtpAndSave = async() =>
    {
        setOtpError(null); // Reset OTP error
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        try 
        {
            const userUid = localStorage.getItem("userUid");
            const verifyResponse = await axios.post(`http://192.168.1.44:8282/restaurant/bff/api/verify/${userUid}/otp/${otpCode}`, {}, {
                headers: 
                {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log(verifyResponse)
            if(verifyResponse.status === 200)
            {
                const updatedUser = { ...user, [editField as string]: newValue } as User;
                console.log(updatedUser)
                await axios.put(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}`, updatedUser, 
                    {
                        headers:
                        {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                if (editField === "username") 
                {
                    localStorage.setItem("username", newValue);
                }

                setUser(updatedUser);
                setOtpSent(false);
                setOtpCode("");
                setIsDialogOpen(false);
            }
            else
            {
                setOtpError("OTP is incorrect. Please try again.");
            }
            
        }
        catch (err)
        {
            console.error("Error verifying OTP:", err);
            setError("Failed to verify OTP. Try again.");
        }
    }

    const requestOtpAndChangePassword = async () => 
    {

        setError(null);
        setOtpError(null); // Clear any previous OTP error
        setOtpSending(true); // Show loading state for OTP request
        setPasswordError(null);
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\]{6,}$/;
    
        if (!newPassword || !confirmPassword) 
        {
            setPasswordError("Both password fields are required.");
            setOtpSending(false);
            return;
        }
        
        if (newPassword !== confirmPassword) 
        {
            setPasswordError("Passwords do not match.");
            setOtpSending(false);
            return;
        }

        if (!passwordRegex.test(newPassword)) 
        {
            setPasswordError("Password must be at least 6 characters, include an uppercase letter, a number, and a special character.");
            setOtpSending(false);
            console.log("Password validation failed:", newPassword);
            return;
        }




        const accessToken = await getAccessToken();
        if (!accessToken)
        {
            setError("Session expired. Please log in again.");
            navigate("/");
            setOtpSending(false);
            return;
        }

        try 
        {
            console.log(user?.email)
            const userUid = localStorage.getItem("userUid");
            await axios.post(`http://192.168.1.44:8282/restaurant/bff/api/send/otp/${userUid}`, {},{
                headers: 
                {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setOtpSent(true);
        }
        catch (err)
        {
            console.error("Error requesting OTP:", err);
            setError("Failed to send OTP. Try again.");
        }
        finally 
        {
            setOtpSending(false); // Reset OTP sending state
        }
    }


    const verifyOtpAndChangePassword = async () => {
        setOtpError(null);
        
        const accessToken = await getAccessToken();
        if (!accessToken) return;
    
        try {
            const userUid = localStorage.getItem("userUid");
            const verifyResponse = await axios.post(`http://192.168.1.44:8282/restaurant/bff/api/verify/${userUid}/otp/${otpCode}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
    
            if (verifyResponse.status === 200) {
                const updatedUser = { ...user, [editField as string]: newPassword } as User;
                await axios.put(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}`, 
                    updatedUser, 
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
    
                setOtpSent(false);
                setOtpCode("");
                setNewPassword("");
                setConfirmPassword("");
                setIsDialogOpen(false);
            } else {
                setOtpError("OTP is incorrect. Please try again.");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("Failed to update password. Try again.");
        }
    };
    
    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setNewPassword("");
            setConfirmPassword("");
            setOtpCode("");
            setOtpSent(false);
            setPasswordError(null)
            setOtpError(null)
            setIsDialogOpen(false);
            setNewValue("");
        }
        setIsDialogOpen(open);
    }



    return(
        <div className="w-full min-h-screen px-4 pt-20 mx-auto max-w-screen-3xl">
            <h2 className="w-full mb-2 text-3xl font-bold text-blue-600">
                Edit Profile
            </h2>
            <p className="mb-4 text-gray-400"> Manage your account settings here.</p>
        
            <Separator className="my-4" />

            <Tabs defaultValue="Profile" className="flex items-start w-full">
                <TabsList className="grid items-start justify-start w-1/12 grid-cols-1 gap-2 px-2 bg-transparent">
                    <TabsTrigger value="Profile" className="w-full text-left justify-start data-[state=active]:bg-gray-800 px-4 py-2 rounded-md transition" >Profile</TabsTrigger>
                    <TabsTrigger value="Appearance" className="w-full text-left justify-start data-[state=active]:bg-gray-800 px-4 py-2 rounded-md transition" >Appearance</TabsTrigger>
                    <TabsTrigger value="Notifications" className="w-fulltext-left justify-start data-[state=active]:bg-gray-800 px-4 py-2 rounded-md transition" >Notifications</TabsTrigger>
                </TabsList>

                <div className="self-start w-3/4 h-full">
                    <TabsContent value="Profile" className="flex w-full">
                        <div className="flex-1 p-4 border rounded-sm">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Profile</h3>
                                <p className="text-sm text-gray-500">This is what your profile looks like 🔥</p>
                            </div>
                            <Separator className="my-4" ></Separator>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: Username */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Username:</span>  
                                        <span className="text-blue-600">{user?.username}</span>  
                                    </div>

                                    {/* Right Side: Edit Button */}
                                    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditField("username")}>
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Username</DialogTitle>
                                                <DialogDescription>
                                                    Change your username here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="username" className="text-right">Username</Label>
                                                    <Input value = {newValue} id="username" placeholder={user?.username} className="col-span-3" onChange={(e) => setNewValue(e.target.value)}/>
                                                </div>
                                            </div>
                                            <DialogFooter className="flex flex-col items-center gap-3">
                                            {!otpSent ? (
                                                <Button 
                                                    onClick={requestOtp} 
                                                    disabled={otpSending} 
                                                    className="w-full"
                                                >
                                                    {otpSending ? "Sending..." : "Send OTP"}
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col w-full gap-3">
                                                    <div className="flex flex-col w-full gap-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Enter OTP
                                                        </Label>
                                                        <Input 
                                                            value={otpCode} 
                                                            onChange={(e) => setOtpCode(e.target.value)} 
                                                            className="w-full"
                                                        />
                                                        {otpError && (
                                                            <p className="text-sm text-red-500">{otpError}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col w-full gap-2 sm:flex-row">
                                                        <Button onClick={verifyOtpAndSave} className="w-full sm:w-auto">
                                                            Verify & Save
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={requestOtp} 
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Resend OTP
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    This is your public display name. It can be your real name or a pseudonym.
                                </CardContent>
                            </Card>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: name */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Name:</span>  
                                        <span className="text-blue-600">{user?.name}</span>  
                                    </div>

                                    {/* Right Side: Edit Button */}
                                    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditField("name")}>
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Name</DialogTitle>
                                                <DialogDescription>
                                                    Change your name here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="name" className="text-right">Name</Label>
                                                    <Input value = {newValue} id="name" placeholder={user?.name} className="col-span-3" onChange={(e) => setNewValue(e.target.value)}/>
                                                </div>
                                            </div>
                                            <DialogFooter className="flex flex-col items-center gap-3">
                                            {!otpSent ? (
                                                <Button 
                                                    onClick={requestOtp} 
                                                    disabled={otpSending} 
                                                    className="w-full"
                                                >
                                                    {otpSending ? "Sending..." : "Send OTP"}
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col w-full gap-3">
                                                    <div className="flex flex-col w-full gap-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Enter OTP
                                                        </Label>
                                                        <Input 
                                                            value={otpCode} 
                                                            onChange={(e) => setOtpCode(e.target.value)} 
                                                            className="w-full"
                                                        />
                                                        {otpError && (
                                                            <p className="text-sm text-red-500">{otpError}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col w-full gap-2 sm:flex-row">
                                                        <Button onClick={verifyOtpAndSave} className="w-full sm:w-auto">
                                                            Verify & Save
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={requestOtp} 
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Resend OTP
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    This is your name. If not indicated, it is the same as the username.
                                </CardContent>
                            </Card>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: email */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Email:</span>  
                                        <span className="text-blue-600">{user?.email}</span>  
                                    </div>

                                    {/* Right Side: Edit Button */}
                                    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditField("email")}>
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Email</DialogTitle>
                                                <DialogDescription>
                                                    Change your email here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="email" className="text-right">Email</Label>
                                                    <Input value = {newValue} id="email" placeholder={user?.email} className="col-span-3" onChange={(e) => setNewValue(e.target.value)}/>
                                                </div>
                                            </div>
                                            <DialogFooter className="flex flex-col items-center gap-3">
                                            {!otpSent ? (
                                                <Button 
                                                    onClick={requestOtp} 
                                                    disabled={otpSending} 
                                                    className="w-full"
                                                >
                                                    {otpSending ? "Sending..." : "Send OTP"}
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col w-full gap-3">
                                                    <div className="flex flex-col w-full gap-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Enter OTP
                                                        </Label>
                                                        <Input 
                                                            value={otpCode} 
                                                            onChange={(e) => setOtpCode(e.target.value)} 
                                                            className="w-full"
                                                        />
                                                        {otpError && (
                                                            <p className="text-sm text-red-500">{otpError}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col w-full gap-2 sm:flex-row">
                                                        <Button onClick={verifyOtpAndSave} className="w-full sm:w-auto">
                                                            Verify & Save
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={requestOtp} 
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Resend OTP
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    This is your email. you can change it here.
                                </CardContent>
                            </Card>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: email */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Password</span>   
                                    </div>

                                    {/* Right Side: Edit Button */}
                                    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditField("password")}>
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Password</DialogTitle>
                                                <DialogDescription>
                                                    Change your password here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="new-password" className="text-right">Password</Label>
                                                    <Input type = "password" value = {newPassword} id="new-password" className="col-span-3" onChange={(e) => setNewPassword(e.target.value)}/>
                                                </div>
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="confirm-password" className="text-right">Confirm Password</Label>
                                                    <Input type = "password" value = {confirmPassword} id="confirm-password" className="col-span-3" onChange={(e) => setConfirmPassword(e.target.value)}/>
                                                </div>
                                                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                                            </div>
                                            <DialogFooter className="flex flex-col items-center gap-3">
                                            {!otpSent ? (
                                                <Button 
                                                    onClick={requestOtpAndChangePassword} 
                                                    disabled={otpSending} 
                                                    className="w-full"
                                                >
                                                    {otpSending ? "Sending..." : "Send OTP"}
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col w-full gap-3">
                                                    <div className="flex flex-col w-full gap-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Enter OTP
                                                        </Label>
                                                        <Input 
                                                            value={otpCode} 
                                                            onChange={(e) => setOtpCode(e.target.value)} 
                                                            className="w-full"
                                                        />
                                                        {otpError && (
                                                            <p className="text-sm text-red-500">{otpError}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col w-full gap-2 sm:flex-row">
                                                        <Button onClick={verifyOtpAndChangePassword} className="w-full sm:w-auto">
                                                            Verify & Save
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={requestOtp} 
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Resend OTP
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    You can change your password here.
                                </CardContent>
                            </Card>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: email */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Role:</span>  
                                        <span className="text-blue-600">{user?.role.replace("ROLE_", "").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</span>  
                                    </div>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    This is your role.
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="Appearance" className="flex w-full">
                        <div className="flex-1 p-4 border rounded-sm">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Appearance</h3>
                                <p className="text-sm text-gray-500">Customize the appearance of the app. Automatically switch between day and night themes. 🎨</p>
                            </div>
                            <Separator className="my-4" ></Separator>
                            <Card className="flex flex-col mb-2">
                                <CardHeader className="flex flex-row items-center justify-between w-full pb-1">
                                    {/* Left Side: Username */}
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <span>Theme </span>  
                                        <span className="text-blue-600">{theme}</span>  
                                    </div>

                                    {/* Right Side: Edit Button */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Username</DialogTitle>
                                                <DialogDescription>
                                                    Change your username here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center grid-cols-4 gap-4">
                                                    <Label htmlFor="username" className="text-right">Username</Label>
                                                    <Input id="username" placeholder={user?.username} className="col-span-3" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                {/* Description Below */}
                                <CardContent className="text-gray-500">
                                    Select the theme for the dashboard.
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="Notifications" className="flex w-full">
                        <div className="flex-1 p-4 border rounded-sm">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">Notifications</h3>
                                <p className="text-sm text-gray-500">Configure how you receive notifications.🔔</p>
                            </div>
                            <Separator className="my-4" ></Separator>
                            <p className="text-gray-500">Notifications coming soon...</p>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
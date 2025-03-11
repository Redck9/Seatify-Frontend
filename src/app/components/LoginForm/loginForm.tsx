"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from "axios"

import { toast } from "@/app/hooks/use-toast"
import { Button } from "@/app/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { useState ,useEffect } from "react"

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\]{6,}$/;


// Define schemas for login and register
const loginSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(passwordRegex, {
      message: "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

const registerSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(passwordRegex, {
      message: "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

// Create a union type for form data
type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type FormData = LoginData | RegisterData;

export function InputForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true) // State to toggle login/register

  // Choose the schema based on login/register state
  const formSchema = isLogin ? loginSchema : registerSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      ...(isLogin ? {}: {email: ""}),
    },
  })

  useEffect(() => {
    console.log("isLogin state has changed: ", isLogin);
  }, [isLogin]);

  async function onSubmit(data: FormData) {
    console.log("isLogin value before submission: ", isLogin);
    console.log("Form submitted with data:", data); 
    
    try{
      if(isLogin)
      {
        //LOGIN LOGIC

        console.log("Attempting login....")
        console.log(data.username)
        console.log(data.password)
        
        const payload = {
          identifier: data.username, // or data.email, depending on your login logic
          password: data.password,
        };

        console.log(payload)

        const response = await axios.post("http://192.168.1.44:8282/restaurant/bff/api/login", payload)

        if (!response.data?.accessToken) {
          throw new Error("Invalid credentials");
        }

        console.log(response.status)

        toast({
          title: `Login Successful. Welcome ${data.username}! 🎉`,
          description: `You have successfully logged in, ${data.username}`,
          duration: 5000,
        })
        
        console.log(response.data)
        console.log("ACCESS TOKEN: " + response.data.accessToken)
        console.log("REFRESH TOKEN: " + response.data.refreshToken)
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem("refreshToken", response.data.refreshToken)
        localStorage.setItem("username", data.username)
        localStorage.setItem("userUid", response.data.userUid)
        

        onLoginSuccess()
      }
      else
      {
        // REGISTRATION LOGIC
        
        const registerData = data as RegisterData;

        if (!registerData.email) {
          throw new Error("Email is required for registration.");
        }

        const registerPayload = 
        {
          "username": registerData.username,
          "email": registerData.email,
          "password": registerData.password,
        }

        console.log("Sending registration request...", registerPayload);
        const registerResponse = await axios.post("http://192.168.1.44:8282/restaurant/bff/api/register", registerPayload)
        console.log("Register response:", registerResponse);

        console.log(registerResponse.status)

        if(registerResponse.status >= 200 && registerResponse.status < 300)
        {
          toast({
            title: `Registration Successful! 🎉`,
            description: `Your account has been created, ${registerData.username}. Please log in.`,
            duration: 5000,
          })

          setTimeout(() => {
            setIsLogin(true);
            form.reset({
              username: registerData.username, // Keep username
              password: "", // Clear password
            },
            { keepDirtyValues: false } // Ensure validation resets
          );
          form.clearErrors();
          }, 500); // Small delay to ensure UI updates properly
          
        }
        else 
        {
          throw new Error(`Registration failed: ${registerResponse.status}`);
        }

        
        
      }
      
    } 
    catch(err)
    {
      console.error("Error during submission:", err);
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        duration: 5000,
      })
    }
    
    

    
  }

  return (

    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">
        {isLogin ? "Login" : "Register"}
      </h2>

      <Form {...form}>
        <form onSubmit={(e) => { console.log("Submit triggered!"); form.handleSubmit(onSubmit)(e)}} className="w-2/3 space-y-6">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email (Only for Register) */}
          {!isLogin && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@mail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Your password must be at least 6 characters long, contain 1 uppercase letter, 1 number, and 1 special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </Form>

      {/* Switch between Login and Register */}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? "Don't have an account? Register here!" : "Already have an account? Login here!"}
      </button>
    </div>

  )
}

"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const formSchema = z
  .object({
    emailAddress: z.string().email(),
    phoneNumber: z.string().min(10).max(10),
    mattressType: z.enum(["king", "queen", "full"]),
  })
  // .refine(
  //   (data) => {
  //     return data.password === data.passwordConfirm;
  //   },
  //   {
  //     message: "Passwords do not match",
  //     path: ["passwordConfirm"],
  //   }
  // )
  .refine(
    (data) => {
      if (data.mattressType === "mattressType") {
        return !!data.mattressType;
      }
      return true;
    },
    {
      message: "Mattress Type is required",
      path: ["mattressType"],
    }
  );

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      mattressType: "",
      phoneNumber: "",
    },
  });

  const mattressType = form.watch("mattressType");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isSent)
      setTimeout(() => {
        setIsSent(false);
      }, 5000);
  }, [isSent]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    fetch("https://rw8j7h.buildship.run/Mattress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.ok) {
          setIsSent(true);
          form.reset(); // Reset the form fields
        } else {
          // Handle error
          console.error("Error submitting form:", res.status);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="mattressType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>mattress size</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mattress Size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="king">King</SelectItem>
                      <SelectItem value="queen">Queen</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {mattressType === "mattressType" && (
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      type="phoneNumber"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/*
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password confirm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password confirm"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          /> */}
          {isSent ? (
            <Button
              disabled
              className="opacity-50 bg-[#3e0923] hover:bg-[#47152d] transition-colors px-5 py-2 text-white font-bold w-fit ml-auto rounded text-xs"
            >
              PLEASE WAIT
            </Button>
          ) : (
            <Button className="bg-[#3e0923] hover:bg-[#47152d] transition-colors px-5 py-2 text-white font-bold w-fit ml-auto rounded text-xs">
              SEND
            </Button>
          )}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}

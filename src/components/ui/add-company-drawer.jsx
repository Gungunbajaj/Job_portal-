import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";

import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, {
    message: "Company name is required",
  }),

  location: z.string().min(1, {
    message: "Company location is required",
  }),

  logo: z.any().optional(),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const {
    loading,
    error,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    console.log("Submitting company:", data);

    await fnAddCompany({
      name: data.name,
      location: data.location,
      logo: data.logo?.[0] || null,
    });

    // Refresh companies dropdown
    if (fetchCompanies) {
      await fetchCompanies();
    }

    // Clear form
    reset();

    // Close drawer
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="secondary"
        >
          Add Company
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Company</DrawerTitle>

          <DrawerDescription>
            Enter the company details below.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          {/* NAME */}
          <div>
            <Input
              placeholder="Company Name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <Input
              placeholder="Company Location"
              {...register("location")}
            />

            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* LOGO */}
          <div>
            <Input
              type="file"
              accept="image/*"
              {...register("logo")}
              className="file:text-gray-500"
            />

            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.logo.message}
              </p>
            )}
          </div>

          {/* ERROR */}
          {error?.message && (
            <p className="text-red-500 text-sm">
              {error.message}
            </p>
          )}

          {/* LOADER */}
          {loading && (
            <BarLoader
              width="100%"
              height={4}
            />
          )}

          <DrawerFooter className="px-0">
            <Button
              type="submit"
              variant="blue"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Company"}
            </Button>

            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
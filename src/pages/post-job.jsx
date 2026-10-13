import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apijobs";
import AddCompanyDrawer from "@/components/ui/add-company-drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/react";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";

import { State } from "country-state-city";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

import { z } from "zod";


// ================= SCHEMA =================

const schema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),

  description: z.string().min(1, {
    message: "Description is required",
  }),

  location: z.string().min(1, {
    message: "Select a location",
  }),

  company_id: z.string().min(1, {
    message: "Select or Add a new Company",
  }),

  requirements: z.string().min(1, {
    message: "Requirements are required",
  }),
});


// ================= COMPONENT =================

const PostJob = () => {
  const { user, isLoaded } = useUser();

  const navigate = useNavigate();


  // ================= FORM =================

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_id: "",
      requirements: "",
    },

    resolver: zodResolver(schema),
  });


  // ================= CREATE JOB =================

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);


  // ================= GET COMPANIES =================

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);


  // ================= SUBMIT JOB =================

  const onSubmit = async (data) => {
    console.log("Job data:", data);

    await fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };


  // ================= AFTER JOB CREATED =================

  useEffect(() => {
    if (dataCreateJob) {
      navigate("/jobs");
    }
  }, [dataCreateJob, navigate]);


  // ================= FETCH COMPANIES =================

  useEffect(() => {
    if (isLoaded && user) {
      fnCompanies();
    }
  }, [isLoaded, user]);


  // ================= LOADING =================

  if (!isLoaded || loadingCompanies) {
    return (
      <div className="flex justify-center py-10">
        <BarLoader width={200} height={4} />
      </div>
    );
  }


  // ================= RECRUITER CHECK =================

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }


  // ================= UI =================

  return (
    <div>

      {/* HEADING */}

      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>


      {/* FORM */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >

        {/* ================= JOB TITLE ================= */}

        <Input
          placeholder="Job Title"
          {...register("title")}
        />

        {errors.title && (
          <p className="text-red-500">
            {errors.title.message}
          </p>
        )}


        {/* ================= DESCRIPTION ================= */}

        <Textarea
          placeholder="Job Description"
          {...register("description")}
        />

        {errors.description && (
          <p className="text-red-500">
            {errors.description.message}
          </p>
        )}


        {/* ================= LOCATION + COMPANY ================= */}

        <div className="flex gap-4 items-center">


          {/* ================= LOCATION ================= */}

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>

                    {State.getStatesOfCountry("IN").map(
                      ({ name }) => (
                        <SelectItem
                          key={name}
                          value={name}
                        >
                          {name}
                        </SelectItem>
                      )
                    )}

                  </SelectGroup>
                </SelectContent>

              </Select>
            )}
          />


          {/* ================= COMPANY ================= */}

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <SelectTrigger>
                  <SelectValue placeholder="Company" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>

                    {companies?.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={String(company.id)}
                      >
                        {company.name}
                      </SelectItem>
                    ))}

                  </SelectGroup>
                </SelectContent>

              </Select>
            )}
          />


          {/* ================= ADD COMPANY ================= */}

          <AddCompanyDrawer
            fetchCompanies={fnCompanies}
          />

        </div>


        {/* ================= LOCATION ERROR ================= */}

        {errors.location && (
          <p className="text-red-500">
            {errors.location.message}
          </p>
        )}


        {/* ================= COMPANY ERROR ================= */}

        {errors.company_id && (
          <p className="text-red-500">
            {errors.company_id.message}
          </p>
        )}


        {/* ================= REQUIREMENTS ================= */}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.requirements && (
          <p className="text-red-500">
            {errors.requirements.message}
          </p>
        )}


        {/* ================= JOB ERROR ================= */}

        {errorCreateJob?.message && (
          <p className="text-red-500">
            {errorCreateJob.message}
          </p>
        )}


        {/* ================= LOADING ================= */}

        {loadingCreateJob && (
          <BarLoader
            width="100%"
            height={4}
          />
        )}


        {/* ================= SUBMIT ================= */}

        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="mt-2"
          disabled={loadingCreateJob}
        >
          {loadingCreateJob
            ? "Submitting..."
            : "Submit"}
        </Button>

      </form>

    </div>
  );
};

export default PostJob;
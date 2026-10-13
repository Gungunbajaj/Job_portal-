import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  RadioGroup,
  RadioGroupItem,
} from "./radio-group";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";


const schema = z.object({
  experience: z
    .number()
    .min(0, {
      message: "Experience must be at least 0",
    })
    .int(),

  skills: z
    .string()
    .min(1, {
      message: "Skills are required",
    }),

  education: z.enum(
    ["Intermediate", "Graduate", "Post Graduate"],
    {
      message: "Education is required",
    }
  ),

  resume: z.any().refine(
    (file) =>
      file instanceof File &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type),
    {
      message: "Please upload a valid PDF or DOC file",
    }
  ),
});


const ApplyJobDrawer = ({
  user,
  job,
  applied = false,
  fetchJob,
}) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });


  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);


  const onSubmit = async (data) => {

    try {

      await fnApply({
        ...data,

        job_id: job.id,

        user_id: user.id,

        name: user.fullName,

        status: "applied",

        resume: data.resume[0],
      });

      fetchJob();

      reset();

    } catch (error) {
      console.error("Application error:", error);
    }
  };


  return (
    <Drawer open={applied ? false : undefined}>

      <DrawerTrigger asChild>

        <Button
          size="lg"
          variant={
            job?.isOpen && !applied
              ? "blue"
              : "destructive"
          }
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen
            ? applied
              ? "Applied"
              : "Apply"
            : "Hiring Closed"}
        </Button>

      </DrawerTrigger>


      <DrawerContent>

        <DrawerHeader>

          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>

          <DrawerDescription>
            Please fill the form below
          </DrawerDescription>

        </DrawerHeader>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >

          {/* EXPERIENCE */}

          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />

          {errors.experience && (
            <p className="text-red-500 text-sm">
              {errors.experience.message}
            </p>
          )}


          {/* SKILLS */}

          <Input
            type="text"
            placeholder="Skills (comma separated)"
            className="flex-1"
            {...register("skills")}
          />

          {errors.skills && (
            <p className="text-red-500 text-sm">
              {errors.skills.message}
            </p>
          )}


          {/* EDUCATION */}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
              >

                <div className="flex items-center space-x-2">

                  <RadioGroupItem
                    value="Intermediate"
                    id="intermediate"
                  />

                  <Label htmlFor="intermediate">
                    Intermediate
                  </Label>

                </div>


                <div className="flex items-center space-x-2">

                  <RadioGroupItem
                    value="Graduate"
                    id="graduate"
                  />

                  <Label htmlFor="graduate">
                    Graduate
                  </Label>

                </div>


                <div className="flex items-center space-x-2">

                  <RadioGroupItem
                    value="Post Graduate"
                    id="post-graduate"
                  />

                  <Label htmlFor="post-graduate">
                    Post Graduate
                  </Label>

                </div>

              </RadioGroup>
            )}
          />

          {errors.education && (
            <p className="text-red-500 text-sm">
              {errors.education.message}
            </p>
          )}


          {/* RESUME */}

          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />

          {errors.resume && (
            <p className="text-red-500 text-sm">
              {errors.resume.message}
            </p>
          )}


          {/* API ERROR */}

          {errorApply?.message && (
            <p className="text-red-500 text-sm">
              {errorApply.message}
            </p>
          )}


          {/* LOADER */}

          {loadingApply && (
            <BarLoader
              width={100}
              height={4}
            />
          )}


          <DrawerFooter>

            <Button
              type="submit"
              variant="blue"
              size="lg"
              disabled={loadingApply}
            >
              {loadingApply ? "Applying..." : "Apply"}
            </Button>

            <DrawerClose asChild>

              <Button variant="outline">
                Cancel
              </Button>

            </DrawerClose>

          </DrawerFooter>

        </form>

      </DrawerContent>

    </Drawer>
  );
};


export default ApplyJobDrawer;
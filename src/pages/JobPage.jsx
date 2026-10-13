import React, { useEffect } from "react";
import { useUser } from "@clerk/react";
import { useParams } from "react-router-dom";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apijobs";


import {
  Briefcase,
  MapPinIcon,
  DoorOpen,
  DoorClosed,
} from "lucide-react";

import { BarLoader } from "react-spinners";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MDEditor from "@uiw/react-md-editor";
import ApplyJobDrawer from "@/components/ui/apply-job";

const JobPage = () => {
  const { isLoaded, user } = useUser();

  const { id } = useParams();

  // Get single job
  const {
    loading: LoadingJob,
    data: Job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  // Update hiring status
  const {
    loading: LoadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  // Change hiring status
  const handleStatusChange = (value) => {
    const isOpen = value === "open";

    fnHiringStatus(isOpen).then(() => {
      fnJob();
    });
  };

  // Fetch job
  useEffect(() => {
    if (isLoaded && id) {
      fnJob();
    }
  }, [isLoaded, id]);

  // Loading
  if (!isLoaded || LoadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <BarLoader width={200} height={4} />
      </div>
    );
  }
  console.log("FULL JOB:", Job);

  return (
    <div className="flex flex-col gap-8 mt-5 px-6 pb-10">

      {/* Header */}
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {Job?.title}
        </h1>

        <img
  src={Job?.company?.logo_url}
  className="h-12"
  alt={Job?.title}
/>
      </div>

      {/* Job Info */}
      <div className="flex flex-col sm:flex-row justify-between gap-5">

        {/* Location */}
        <div className="flex gap-2 items-center">
  <MapPinIcon />
  <span>{Job?.company?.location || "Location not specified"}</span>
</div>

        {/* Applicants */}
        <div className="flex gap-2 items-center">
  <Briefcase />
  <span>
    {Job?.applications?.length || 0} Applicants
  </span>
</div>

        {/* Status */}
        <div className="flex gap-2 items-center">
          {Job?.isOpen ? (
            <>
              <DoorOpen />
              <span>Open</span>
            </>
          ) : (
            <>
              <DoorClosed />
              <span>Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Hiring Status */}
      {LoadingHiringStatus && (
        <div className="flex items-center justify-center">
          <BarLoader width={100} height={4} />
        </div>
      )}
      {Job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${Job?.isOpen
                ? "bg-green-500"
                : "bg-red-500"
              } text-white`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " +
                (Job?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="open">
              Open
            </SelectItem>

            <SelectItem value="closed">
              Closed
            </SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* About Job */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          About the Job
        </h2>

        <p className="sm:text-lg">
          {Job?.description}
        </p>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          What we are looking for
        </h2>

        <MDEditor.Markdown
          source={Job?.requirements || ""}
          className="bg-transparent sm:text-lg"
        />
      </div>

      {/* Applications */}
      {Job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={Job}
          user={user}
          fetchJob={fnJob}
          applied={Job?.applications?.some(
            (app) => app.user_id === user?.id
          )}
        />
      )}
           {LoadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {Job?.applications?.length > 0 && Job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {Job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>

      )}
    </div>
);
};

export default JobPage;
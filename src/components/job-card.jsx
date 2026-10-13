import React, { useEffect, useState } from "react";

import { useUser } from "@clerk/react";

import { Link } from "react-router-dom";

import {
  Heart,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";

import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";

import {
  saveJob,
  deleteJobs,
} from "@/api/apijobs";


const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobsaved = () => {},
}) => {

  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();


  // SAVE JOB
  const {
    fn: fnSavedJobs,
    data: SavedJobs,
    loading: loadingSavedJobs,
  } = useFetch(saveJob, {
    alreadySaved: saved,
  });


  // SAVE / UNSAVE
  const handleSaveJob = async () => {

    if (!user) return;

    await fnSavedJobs({
      user_id: user.id,
      job_id: job.id,
    });

    onJobsaved();
  };


  // DELETE JOB
  const {
    loading: loadingDeleteJob,
    fn: fnDeleteJob,
  } = useFetch(deleteJobs, {
    job_id: job.id,
  });


  const handleDeleteJob = async () => {

    await fnDeleteJob();

    onJobsaved();
  };


  // UPDATE SAVED STATE
  useEffect(() => {

    if (SavedJobs !== undefined) {

      setSaved(
        SavedJobs?.length > 0
      );

    }

  }, [SavedJobs]);


  return (

    <Card className="flex flex-col">

      {/* DELETE LOADER */}
      {loadingDeleteJob && (
        <BarLoader
          className="mt-4"
          width="100%"
          height={4}
        />
      )}


      {/* HEADER */}
      <CardHeader>

        <CardTitle className="flex justify-between font-bold">

          {job.title}


          {/* DELETE */}
          {isMyJob && (

            <Trash2Icon
              size={18}
              className="text-red-400 cursor-pointer"
              onClick={handleDeleteJob}
            />

          )}

        </CardTitle>

      </CardHeader>


      {/* CONTENT */}
      <CardContent className="flex flex-col gap-4 flex-1">

        <div className="flex justify-between items-center">

          {/* COMPANY LOGO */}
          {job.company && job.company.logo_url && (

            <img
              src={job.company.logo_url}
              alt={job.company.name || "Company logo"}
              className="h-8 w-auto object-contain"
            />

          )}


          {/* LOCATION */}
          <div className="flex gap-2 items-center">

            <MapPinIcon size={15} />

            {job.location || "Location not specified"}

          </div>

        </div>


        <hr />


        {/* DESCRIPTION */}
        <p>

          {job.description?.substring(
            0,
            job.description.indexOf(".") === -1
              ? job.description.length
              : job.description.indexOf(".")
          )}

        </p>

      </CardContent>


      {/* FOOTER */}
      <CardFooter className="flex gap-2">

        {/* DETAILS */}
        <Link
          to={`/job/${job.id}`}
          className="flex-1"
        >

          <Button
            variant="secondary"
            className="w-full"
          >
            More Details
          </Button>

        </Link>


        {/* SAVE */}
        {!isMyJob && (

          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJobs}
          >

            {saved ? (

              <Heart
                size={18}
                stroke="red"
                fill="red"
              />

            ) : (

              <Heart size={18} />

            )}

          </Button>

        )}

      </CardFooter>

    </Card>

  );
};

export default JobCard;
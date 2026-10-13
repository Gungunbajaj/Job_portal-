import React, { useEffect } from "react";
import { useUser } from "@clerk/react";
import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";
import { getMyJobs } from "@/api/apijobs";
import JobCard from "@/components/job-card";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    fn: fnMyJobs,
    data: jobs,
    loading: loadingJobs,
    error,
  } = useFetch(getMyJobs);

  useEffect(() => {
    if (isLoaded && user) {
      fnMyJobs({
        recruiter_id: user.id,
      });
    }
  }, [isLoaded, user]);

  if (!isLoaded || loadingJobs) {
    return (
      <div className="flex justify-center mt-10">
        <BarLoader width={200} height={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to fetch your jobs.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        My Jobs
      </h1>

      {jobs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isMyJob={true}
              onJobsaved={() =>
                fnMyJobs({
                  recruiter_id: user.id,
                })
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          You haven't posted any jobs yet.
        </p>
      )}
    </div>
  );
};

export default CreatedJobs;
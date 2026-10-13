import React, { useState, useEffect } from "react";
import { useSession } from "@clerk/react";
import { BarLoader } from "react-spinners";
import { State } from "country-state-city";
import { getCompanies } from "@/api/apiCompanies";
import useFetch from "@/hooks/use-fetch";
import { getJobs } from "@/api/apijobs";
import JobCard from "@/components/job-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { session, isLoaded } = useSession();

  // Fetch Jobs
  const {
    fn: fnjobs,
    data: Jobs,
    loading: loadingJobs,
    error,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  // Fetch Companies
  const {
    fn: fnCompanies,
    data: Companies,
    loading: loadingCompanies,
    error: companyError,
  } = useFetch(getCompanies);
  // Fetch jobs
  useEffect(() => {
    if (isLoaded && session) {
      fnjobs();
    }
  }, [isLoaded, session, location, company_id, searchQuery]);

  // Fetch companies
  useEffect(() => {
    if (isLoaded && session) {
      fnCompanies();
    }
  }, [isLoaded, session]);

  console.log("Jobs data:", Jobs);
  console.log("Jobs error:", error);
  console.log("Companies:", Companies);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const query = formData.get("search-query");

    setSearchQuery(query || "");
  };

  // Clear filters
  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };

  // Loading Clerk session
  if (!isLoaded || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <BarLoader width={200} height={4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">

      {/* Heading */}
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="h-14 flex w-full gap-2 items-center mb-3"
        >
          <input
            name="search-query"
            type="text"
            placeholder="Search jobs..."
            defaultValue={searchQuery}
            className="w-full md:flex-1 p-3 rounded-lg border bg-background"
          />

          <Button
            type="submit"
            className="h-full sm:w-28"
            variant="blue"
          >
            Search
          </Button>
        </form>

        {/* Other Filters */}
        <div className="flex flex-col sm:flex-row gap-2">

          {/* Location */}
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Company */}
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {Companies?.map((company) => (
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
         
          {/* Clear Filters */}
          <Button
            className="sm:w-1/2"
            variant="destructive"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Loading Jobs */}
      {loadingJobs && (
        <div className="flex justify-center my-8">
          <BarLoader width={200} height={4} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-center my-5">
          Failed to fetch jobs.
        </div>
      )}

      {/* Jobs */}
      {!loadingJobs && !error && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {Jobs?.length > 0 ? (
            Jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              No Jobs Found!
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default JobListing;
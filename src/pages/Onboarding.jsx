import React, { useEffect } from "react";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "../components/ui/button";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  console.log(user);
  const navigate = useNavigate();
  

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: {
          role: role,
        },
      });

      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user.unsafeMetadata.role === "recruiter"
          ? "/post-job"
          : "/jobs"
      );
    }
  }, [user, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center pt-24 bg-black">
        <BarLoader
          width={200}
          height={4}
          loading={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-4 bg-black">

      {/* Heading */}
      <h2
        className="
          gradient-title
          font-extrabold
          text-6xl
          sm:text-7xl
          md:text-8xl
          text-center
        "
      >
        I am a....
      </h2>

      {/* Role Buttons */}
      <div
        className="
          mt-16
          flex
          flex-col
          sm:flex-row
          gap-6
          w-full
          max-w-2xl
        "
      >

        {/* Candidate Button */}
        <Button
          variant="blue"
          onClick={() => handleRoleSelection("candidate")}
          className="
            group
            flex-1
            h-40
            rounded-2xl
            text-2xl
            font-bold

            bg-blue-600
            hover:bg-blue-500

            border
            border-blue-400/30

            shadow-lg
            shadow-blue-500/20

            hover:shadow-xl
            hover:shadow-blue-500/40

            hover:-translate-y-1

            transition-all
            duration-300
          "
        >
          <span className="group-hover:scale-105 transition-transform duration-300">
            Candidate
          </span>
        </Button>

        {/* Recruiter Button */}
        <Button
          variant="destructive"
          onClick={() => handleRoleSelection("recruiter")}
          className="
            group
            flex-1
            h-40
            rounded-2xl
            text-2xl
            font-bold

            bg-red-600
            hover:bg-red-500

            border
            border-red-400/30

            shadow-lg
            shadow-red-500/20

            hover:shadow-xl
            hover:shadow-red-500/40

            hover:-translate-y-1

            transition-all
            duration-300
          "
        >
          <span className="group-hover:scale-105 transition-transform duration-300">
            Recruiter
          </span>
        </Button>

      </div>
    </div>
  );
};

export default Onboarding;
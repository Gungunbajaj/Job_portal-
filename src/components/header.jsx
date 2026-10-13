import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Show,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/react";
import {
  BriefcaseBusiness,
  Heart,
  PenBox,
} from "lucide-react";

const Header = () => {
  const { user } = useUser();

  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();

  // Open login modal when URL contains ?sign-in=true
  useEffect(() => {
    if (search.get("sign-in") === "true") {
      setShowSignIn(true);
    }
  }, [search]);

  // Close modal when clicking the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  // Open login modal and update URL
  const handleLogin = () => {
    setSearch({ "sign-in": "true" });
  };

  return (
    <>
      <nav className="flex items-center justify-between py-4">

        {/* Logo */}
        <Link to="/">
          <img
            src="/image.png"
            alt="Logo"
            className="h-20"
          />
        </Link>

        <div className="flex items-center gap-8">

          {/* Logged Out */}
          <Show when="signed-out">
            <Button
              variant="outline"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Show>

          {/* Logged In */}
          <Show when="signed-in">
            <div className="flex items-center gap-8">

              {/* Recruiter Only */}
              {user?.unsafeMetadata?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button
                    variant="destructive"
                    className="rounded-full"
                  >
                    <PenBox
                      size={20}
                      className="mr-2"
                    />
                    Post a Job
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>

                  {/* My Jobs */}
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={
                      <BriefcaseBusiness size={15} />
                    }
                    href="/my-jobs"
                  />

                  {/* Saved Jobs */}
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={
                      <Heart size={15} />
                    }
                    href="/saved-jobs"
                  />

                  {/* Manage Account */}
                  <UserButton.Action
                    label="manageAccount"
                  />

                </UserButton.MenuItems>
              </UserButton>

            </div>
          </Show>

        </div>
      </nav>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
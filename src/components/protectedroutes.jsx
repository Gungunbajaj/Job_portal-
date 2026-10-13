import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";

const ProtectedRoutes = ({ children }) => {
  const { isSignedIn,user ,isLoaded } = useUser();
  const { pathname } = useLocation();

  if (isLoaded && !isSignedIn && isSignedIn!==undefined ) {
    return <Navigate to='/?sign-in=true'/>;
  }
//CHECK ONBOARDING STATUS
if(user!==undefined && !user.unsafeMetadata?.role && pathname !='/onboarding')
  return <Navigate to='/onboarding'/>
  return children;
};

export default ProtectedRoutes;
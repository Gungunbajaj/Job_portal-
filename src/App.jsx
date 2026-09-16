import React from 'react' 
import { createBrowserRouter } from 'react-router-dom' 
import { RouterProvider } from 'react-router-dom' 
import LandingPage from './pages/landingpage' 
import AppLayout from './layout/app-layout' 
import Onboarding from './pages/Onboarding' 
import { ThemeProvider } from './components/themeprovider' 
import JobListing from './pages/job_listing' 
import JobPage from './pages/JobPage' 
import PostJob from './pages/post-job' 
import SavedJob from './pages/saved-job' 
import MyJobs from './pages/my-jobs' 
import ProtectedRoutes from './components/ProtectedRoutes'
import './App.css' 
 
 
 
  const router = createBrowserRouter([ 
    { 
      element: <AppLayout/> , 
      children:[ 
        { 
    path: "/", 
    element: <LandingPage/>, 
  }, 
  { 
    path:"/onboarding", 
    element:(
      <ProtectedRoutes>
        <Onboarding/>
      </ProtectedRoutes>
    ),  
  }, 
  { 
    path: "/jobs", 
    element: (<ProtectedRoutes>
      <JobListing />
    </ProtectedRoutes>), 
  }, 
  { 
    path: "/job/:id", 
    element: (<ProtectedRoutes>
      <JobPage />
    </ProtectedRoutes>), 
  }, 
  { 
    path: "/post-job", 
    element: (
      <ProtectedRoutes>
        <PostJob />
      </ProtectedRoutes>
    ), 
  }, 
  { 
    path: "saved-job", 
    element: (
      <ProtectedRoutes>
        <SavedJob />
      </ProtectedRoutes>
    ), 
  }, 
  { 
    path : "/my-jobs", 
    element: (
      <ProtectedRoutes>
        <MyJobs />
      </ProtectedRoutes>
    ), 
  } 
 
      ], 
    }, 
   
]); 
function App() {  
  return ( 
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> 
    <RouterProvider router={router} /> 
    </ThemeProvider> 
  ); 
} 
 
export default App
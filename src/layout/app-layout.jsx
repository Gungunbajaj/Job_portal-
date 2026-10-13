import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'

const AppLayout = () => {
  return (
    <div>
       <div className="grid-background"></div>
       <main className="min-h-screen w-full">
        <div className="mx-auto w-full max-w-7xl px-6">
           <Header/>
        <Outlet/>
        </div>
       </main>
       <div className="p-10 text-center bg-gray-800 mt-10">
        Made with love!!
        </div>
    </div>
  )
}

export default AppLayout

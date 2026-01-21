import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { route } from './pages/router/route'

export default function App() {
  return (
    <div>
      <RouterProvider router={route}/>
    </div>
  )
}

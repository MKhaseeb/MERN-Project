// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route, Link} from "react-router-dom";
import Homecomponent from './Components/Homecomponent'
import RegisterUser from './Components/RegisterUser'
import CompanyRegister from './Components/CompanyRegister';
import LoginComponent from './Components/LoginComponent';
import CompanyLogin from './Components/CompanyLogin';

function App() {

  return (
    <Routes>
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/" element={<Homecomponent />} />
      <Route path="/register_company" element={<CompanyRegister />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/login_company" element={<CompanyLogin />} />
    </Routes>
  )
}

export default App

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import viteL from '/palestine.svg'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Homecomponent from './Components/Homecomponent'
import RegisterUser from './Components/RegisterUser'
import CompanyRegister from './Components/CompanyRegister';
import LoginComponent from './Components/LoginComponent';
import CompanyLogin from './Components/CompanyLogin';
import { useState } from 'react';
import { CompanyHome } from './Components/CompanyHome';
import  UserHomePage  from './Components/UserHomePage';
import AllJobLists from './Components/AllJobLists';
import ChartsComp from './Components/ChartsComp';
import CreateJobPage from './Components/CreateJobPage';
import ApplyComponent from './Components/ApplyComponent';
import { ApplicationBoard } from './Components/ApplicationBoard';

function App() {
  // const userId = localStorage.getItem("userId"); 
  const [companyId, setCompanyId] = useState(null);
const storedUserId = localStorage.getItem("userId");
const [userId, setUserId] = useState(storedUserId);


  return (
    <Routes>
      <Route path="/" element={<Homecomponent />} />
      <Route path="/register" element={<RegisterUser setUserId={setUserId} />} />
      <Route path="/login" element={<LoginComponent setUserId={setUserId} />} />
      <Route path="/register_company" element={<CompanyRegister setCompanyId={setCompanyId} />} />
      <Route path="/login_company" element={<CompanyLogin />} />
      <Route path="/company_home" element={<CompanyHome companyId={companyId} />} />
      <Route path="/create-job" element={<CreateJobPage />} />
      <Route path="/user_home" element={<UserHomePage userId={userId}/>} />
      <Route path="/allJobs" element={<AllJobLists/>} />
      <Route path="/Charts" element={<ChartsComp/>} />
      <Route path="/apply/:id" element={<ApplyComponent/>} />
      <Route path="/board" element={<ApplicationBoard userId={userId} />} />
    </Routes>
  )
}

export default App

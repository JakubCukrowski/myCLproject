import React from "react";
import {Route, Routes} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Info from "./components/info/Info";
import Gallery from "./components/gallery/Gallery";
import Offer from "./components/offer/Offer";
import Contact from "./components/contact/Contact";
import Prices from "./components/prices/Prices";
import Login from "./components/login/Login";
import UncontrolledExample from "./components/carousel/Carousel";
import About from "./components/aboutUs/About";
import Hero from "./components/hero/Hero";
import Dashboard from "./components/dashboard/Dashboard";
import Register from "./components/register/Register";

import { AuthContextProvider } from "./components/context/AuthContext";
import ProtectedRouteToDashboard from "./components/protectedRoute/ProtectedRouteToDashboard";
import AccountSettings from "./components/dashboard/dashboardComponents/accountSettings/AccountSettings";
import UserVisits from "./components/dashboard/dashboardComponents/visits/UserVisits";
import ProtectedRouteToLogin from "./components/protectedRoute/ProtectedRouteToLogin";
import MyCalendar from "./components/dashboard/dashboardComponents/calendar/Calendar";
import { ThreeColumns } from "./components/threeColumns/ThreeColumns";

const App = () => {
    const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`
    console.log(currentTime);

    return (
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<><Hero/><ThreeColumns/><About/><UncontrolledExample/></>} />
                    <Route path="info" element={<Info />} />
                    <Route path="gallery" element={<Gallery/>} />
                    <Route path="offer" element={<Offer/>} />
                    <Route path="contact" element={<Contact/>} />
                    <Route path="prices" element={<Prices/>} />
                    <Route path="login" element={
                        <ProtectedRouteToLogin>
                            <Login/>
                        </ProtectedRouteToLogin>} />
                    <Route path="register" element={
                        <ProtectedRouteToLogin>
                            <Register/>
                        </ProtectedRouteToLogin>} />
                </Route>
                <Route path="/dashboard" element={
                    <ProtectedRouteToDashboard>
                        <Dashboard />
                    </ProtectedRouteToDashboard>}>
                    <Route path="savevisit" element={<MyCalendar/>}/>
                    <Route path="settings" element={<AccountSettings/>}/>
                    <Route path="uservisits" element={<UserVisits/>}/>
                </Route>
            </Routes>
        </AuthContextProvider>
    )

}

export default App
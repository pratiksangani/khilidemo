import "./App.scss";
import React, { createContext, useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import LoginScreen from "./screens/user/LoginScreen";
import SignUpScreen from "./screens/user/SignUpScreen";
import AdminLogin from "./screens/admin/AdminLogin";
import AdminDashboard from "./screens/admin/AdminDashboard";
import HomeScreen from "./screens/user/HomeScreen";
import ContextProvider, { MyContext } from "./utility/ContextProvider";

const Container = () => {
  const { pathname } = window.location;

  const { isUser, isAdmin } = useContext(MyContext);
  if (pathname.includes("admin")) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        {isAdmin && (
          <React.Fragment>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </React.Fragment>
        )}
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signUp" element={<SignUpScreen />} />
        {isUser && (
          <React.Fragment>
            <Route path="/home" element={<HomeScreen />} />
          </React.Fragment>
        )}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
};

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Container />
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;

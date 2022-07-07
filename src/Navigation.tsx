import React from "react";
import { BrowserRouter, Route, Routes, Link, NavLink, useLocation, Router } from "react-router-dom";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";

export const Navigation = () => {
  const location = useLocation();
  //   console.log(location);
  return (
    <>
      <div>
        {/* main nav */}
        <div style={{ padding: "0 15px", backgroundColor: "#000", height: 50 }}>
          <div className="nav_container">
            <NavLink to="/" className={({ isActive }) => (isActive ? "red" : "white")}>
              <h5 style={{ cursor: "pointer" }}>ETH</h5>
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "red" : "white")} to="/page1">
              <h5 style={{ cursor: "pointer" }}>PAGE1</h5>
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "red" : "white")} to="/page2">
              <h5 style={{ cursor: "pointer" }}>PAGE2</h5>
            </NavLink>
          </div>
        </div>

        <div style={{ padding: "0 15px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

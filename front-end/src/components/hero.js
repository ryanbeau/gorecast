import React from "react";
import logo from "../images/gorecast.svg";

const Hero = () => (
  <div className="text-center hero">
    <img className="mb-3 app-logo" src={logo} alt="Gorecast logo" width="120" />
    <h1 className="mb-4">Gorecast, budget tracker extraordinaire</h1>
    <p className="lead">
      Gorecast is a secure and easy to use web-based financial budgeting
      application.
    </p>
  </div>
);

export default Hero;

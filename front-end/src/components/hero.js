import React from "react";
import logo from "../images/gorecast.svg";
import herobg from "../images/money-coins-desk.jpg";

const Hero = () => (
  <div className="text-center hero" style={{
    backgroundImage: `url(${herobg})`,
    height: '50vh',
    width: '100%',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    opacity: '0.9'
  }}>
    <div style={{
      paddingTop: '10vh',
      color: 'whitesmoke',
      textShadow: '2px 1px black'
      }}>
      <img className="mb-3 app-logo" src={logo} alt="Gorecast logo" width="120" />
      <h1 className="mb-4">Gorecast, budget tracker extraordinaire</h1>
      <p className="lead">
        Gorecast is a secure and easy to use web-based financial budgeting
        application.
      </p>
    </div>
  </div>
);

export default Hero;

import React, { Fragment } from "react";

import { Hero, HomeContent, Taunt } from "../components";

const Home = () => (
  <div style={{ backgroundColor:"#080808" }}>
    <Fragment>
      <br />
      <Hero />
      <br />
      <HomeContent />
      <br />
      <Taunt />
      <br />
    </Fragment>
  </div>
);

export default Home;

import { mount } from "enzyme";
import React from "react";
import Navbar from "../components/nav-bar.js";

describe("components/navbar", () => {
  xit("Renders with required props", async () => {
    const wrapper = mount(<Navbar />);
    expect(wrapper).toBeTruthy();
  });
});

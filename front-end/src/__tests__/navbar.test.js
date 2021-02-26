import { shallow } from "enzyme";
import React from "react";
import Navbar from "../components/nav-bar.js";

describe("components/navbar", () => {
  it("Renders with required props", async () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper).toBeTruthy();
  });
});

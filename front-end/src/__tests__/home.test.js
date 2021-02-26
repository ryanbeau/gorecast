import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import Home from "../views/home.js";

it("renders correctly", () => {
  const wrapper = shallow(<Home />);

  expect(toJson(wrapper)).toMatchSnapshot();
});

import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import LoginButton from "../components/login-button.js";

it("renders correctly", () => {
  const wrapper = shallow(<LoginButton />);

  expect(toJson(wrapper)).toMatchSnapshot();
});

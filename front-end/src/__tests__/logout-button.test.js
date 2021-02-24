import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import LogoutButton from "../components/logout-button.js";


it("renders correctly", () => {
  const wrapper = shallow(<LogoutButton />);

  expect(toJson(wrapper)).toMatchSnapshot();
});

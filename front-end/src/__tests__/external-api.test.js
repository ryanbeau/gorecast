import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import ExternalApi from "../views/external-api.js";

it("renders correctly", () => {
  const wrapper = shallow(<ExternalApi />);

  expect(toJson(wrapper)).toMatchSnapshot();
});

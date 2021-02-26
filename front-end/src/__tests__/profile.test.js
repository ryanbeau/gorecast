import { useAuth0 } from "@auth0/auth0-react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import Profile from "../views/profile.js";

// Mock user
const user = {
  email: "kevin.kaspari@gmail.com",
  user_id: "auth0|602eac644a7c6300688c8f7a",
  name: "kevin.kaspari@gmail.com",
  picture: "https://s.gravatar.com/avatar/03c69e55c6a2ffbb2fd4638d6d03aecb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fke.png",
};

jest.mock("@auth0/auth0-react");

describe("views/profile - logged in", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
    })
  });

  it("renders correctly", () => {
    const wrapper = shallow(<Profile />);
  
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})


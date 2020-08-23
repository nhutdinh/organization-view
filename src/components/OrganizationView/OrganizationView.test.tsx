import { fireEvent, render, wait } from "@testing-library/react";
import * as axios from "axios";
import React from "react";
import OrganizationView from "./OrganizationView";
jest.mock("axios");

describe("should render correctly", () => {
  test("Input and Search button should be there", () => {
    const { getByTestId } = render(<OrganizationView />);
    expect(getByTestId("organization-view__search-input")).toBeInTheDocument();
    expect(getByTestId("organization-view__search-btn")).toBeInTheDocument();
    expect(
      getByTestId("organization-view__instruction-text")
    ).toHaveTextContent("Input Employee's name and Click Search to start...");
  });
  test("should show result when doing search", async () => {
    axios.default.get.mockImplementation((url: string) => {
      if (url === "http://api.additivasia.io/api/v1/assignment/employees/a") {
        return Promise.resolve({
          data: ["CEO", { "direct-subordinates": ["a1", "a2"] }],
        });
      } else if (
        url === "http://api.additivasia.io/api/v1/assignment/employees/a1"
      ) {
        return Promise.resolve({
          data: ["boss1", { "direct-subordinates": ["a1_1", "a1_2"] }],
        });
      } else if (
        url === "http://api.additivasia.io/api/v1/assignment/employees/a2"
      ) {
        return Promise.resolve({
          data: ["boss1", { "direct-subordinates": ["a1_1", "a2_1"] }],
        });
      } else {
        return Promise.resolve({
          data: ["employee"],
        });
      }
    });
    const mockGet = axios.default.get;
    const { getByTestId, queryAllByText } = render(<OrganizationView />);
    fireEvent.change(getByTestId("organization-view__search-input"), {
      target: { value: "a" },
    });
    fireEvent.click(getByTestId("organization-view__search-btn"));
    expect(mockGet).toHaveBeenCalledWith(
      "http://api.additivasia.io/api/v1/assignment/employees/a"
    );
    await wait();
    expect(mockGet).toHaveBeenCalledWith(
      "http://api.additivasia.io/api/v1/assignment/employees/a1"
    );
    expect(mockGet).toHaveBeenCalledWith(
      "http://api.additivasia.io/api/v1/assignment/employees/a2"
    );

    await wait();
    expect(mockGet).toHaveBeenCalledWith(
      "http://api.additivasia.io/api/v1/assignment/employees/a1_1"
    );
    expect(mockGet).toHaveBeenCalledWith(
      "http://api.additivasia.io/api/v1/assignment/employees/a1_2"
    );

    expect(queryAllByText("a")).toHaveLength(0);
    expect(queryAllByText("a1")).toHaveLength(1);
    expect(queryAllByText("a2")).toHaveLength(1);
    expect(queryAllByText("a1_1")).toHaveLength(1);
    expect(queryAllByText("a1_2")).toHaveLength(1);
    expect(queryAllByText("a2_1")).toHaveLength(1);
  });
});

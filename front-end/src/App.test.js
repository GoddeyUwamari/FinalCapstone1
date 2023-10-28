import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom/extend-expect";

test("renders title", () => {
  render(
    <React.Suspense
      fallback={
        <div className="page-loader">
          <p>Loading...</p>
        </div>
      }
    >
      <App />
    </React.Suspense>
  );
  const restaurant = screen.getByText(/capstone/i);
  expect(restaurant).toBeInTheDocument();
});

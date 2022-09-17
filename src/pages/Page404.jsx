import React from "react";

import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Image404 from "../assets/404.svg";
import ButtonTheme from "../components/buttons/ButtonTheme";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Not Found</title>
        </Helmet>
      </HelmetProvider>

      <div className="container text-center px-4 my-5">
        <img
          src={Image404}
          className="img-fluid"
          alt="404"
          style={{ width: "35%", minWidth: "120px", maxWidth: "250px" }}
        />

        <h3 className="text-theme mt-4 fw-bold">404</h3>
        <h4 className="text-theme fw-bold">
          Oh no, this place is unknown. Let me take you back.
        </h4>

        <ButtonTheme
          property="mt-3 px-4 text-white fw-bold"
          onClick={() => navigate("/")}
        >
          Take Me Back
        </ButtonTheme>
      </div>
    </>
  );
};

export default Page404;

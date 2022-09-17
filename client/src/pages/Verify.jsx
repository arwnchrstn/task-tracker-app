import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";

import verified from "../assets/verified.svg";
import invalid from "../assets/invalid.svg";
import ButtonTheme from "../components/buttons/ButtonTheme";

const Verify = () => {
  const { token } = useParams("token");
  const [verification, setVerification] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //verify token from the database
  const verifyToken = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/api/verify/" + token
      );

      if (response.status === 200) {
        setVerification({
          message: response.data,
          status: response.status
        });
      }
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        setVerification({
          message: error.response.data,
          status: error.response.status
        });
      } else {
        console.error(`${error.response.status} / ${error.response.data}`);
        setVerification({
          message: error.response.data,
          status: error.response.status
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken(token);
  }, [token]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Verify Email</title>
        </Helmet>
      </HelmetProvider>

      <div className="container text-center px-4">
        {isLoading ? (
          <h2 className="text-theme fw-bold">
            Verifying your email <Spinner className="ms-1" animation="border" />
          </h2>
        ) : (
          <>
            {(verification.status === 400 || verification.status === 500) && (
              <>
                <img
                  src={invalid}
                  className="img-fluid"
                  alt="verified"
                  style={{ width: "50%", maxWidth: "250px", minWidth: "150px" }}
                />
                <h4 className="fw-bold text-theme mt-5">
                  {verification.message}
                </h4>

                <ButtonTheme
                  property="mt-3 text-white fw-bold px-4"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </ButtonTheme>
              </>
            )}

            {verification.status === 200 && (
              <>
                <img
                  src={verified}
                  className="img-fluid"
                  alt="verified"
                  style={{ width: "50%", maxWidth: "250px", minWidth: "150px" }}
                />
                <h4 className="fw-bold text-theme mt-5">
                  {verification.message}
                </h4>

                <ButtonTheme
                  property="mt-3 text-white fw-bold px-4"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </ButtonTheme>
              </>
            )}

            {verification.status !== 400 &&
              verification.status !== 500 &&
              verification.status !== 200 && (
                <>
                  <img
                    src={invalid}
                    className="img-fluid"
                    alt="verified"
                    style={{
                      width: "50%",
                      maxWidth: "250px",
                      minWidth: "150px"
                    }}
                  />
                  <h4 className="fw-bold text-theme mt-5">
                    {verification.message}
                  </h4>

                  <ButtonTheme
                    property="mt-3 text-white fw-bold px-4"
                    onClick={() => navigate("/")}
                  >
                    Back to Login
                  </ButtonTheme>
                </>
              )}
          </>
        )}
      </div>
    </>
  );
};

export default Verify;

import React, { useState, useEffect, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import ButtonTheme from "../components/buttons/ButtonTheme";
import invalid from "../assets/invalid.svg";
import verified from "../assets/verified.svg";

const DisregardReset = () => {
  const { resetToken } = useParams();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteReset = useRef();
  const navigate = useNavigate();

  //delete password reset
  handleDeleteReset.current = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_SERVER +
          `${process.env.REACT_APP_USER_ENDPOINT}/forgot-password/remove/${resetToken}`
      );

      if (response.status === 200) {
        setIsDeleted(true);
      }
    } catch (error) {
      setIsDeleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDeleteReset.current();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Discard Password Reset</title>
        </Helmet>
      </HelmetProvider>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            {isLoading ? (
              <h2 className="text-theme fw-bold text-center">
                Loading... <Spinner className="ms-1" animation="border" />
              </h2>
            ) : (
              <>
                {isDeleted === true && (
                  <>
                    <img
                      src={verified}
                      alt="success change"
                      className="img-fluid mx-auto d-block"
                      style={{
                        width: "55%",
                        minWidth: "120px",
                        maxWidth: "250px"
                      }}
                    />
                    <h4 className="text-center text-theme fw-bold mt-4">
                      Password reset discarded. Change your password if you
                      think your account is compromised
                    </h4>

                    <ButtonTheme
                      property="mt-4 text-white fw-bold px-4 d-block mx-auto"
                      onClick={() => navigate("/")}
                    >
                      Back to Login
                    </ButtonTheme>
                  </>
                )}

                {isDeleted === false && (
                  <>
                    <img
                      src={invalid}
                      alt="success change"
                      className="img-fluid mx-auto d-block"
                      style={{
                        width: "55%",
                        minWidth: "120px",
                        maxWidth: "250px"
                      }}
                    />
                    <h4 className="text-center text-theme fw-bold mt-4">
                      No reset token found. Your password reset might have been
                      discarded already
                    </h4>

                    <ButtonTheme
                      property="mt-4 text-white fw-bold px-4 d-block mx-auto"
                      onClick={() => navigate("/")}
                    >
                      Back to Login
                    </ButtonTheme>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisregardReset;

import React from "react";

const ButtonAccent = (props) => {
  return (
    <button
      className={`btn btn-accent rounded text-white ${props.property}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default ButtonAccent;

import React from "react";

import { Outlet } from "react-router-dom";

const PlainLayout = () => {
  return (
    <div className="main-layout justify-content-center">
      <Outlet />
    </div>
  );
};

export default PlainLayout;

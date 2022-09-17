import React from "react";

//Layout
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/Signup"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword"));

//Plain Layout
const Verify = React.lazy(() => import("../pages/Verify"));
const Page404 = React.lazy(() => import("../pages/Page404"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));
const DisregardReset = React.lazy(() => import("../pages/DisregardReset"));

//Portal Layout
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Category = React.lazy(() => import("../pages/Category"));

export const layout = [
  { path: "", index: true, exact: true, component: Login },
  { path: "signup", exact: true, component: Signup },
  { path: "forgot-password", exact: true, component: ForgotPassword }
];

export const plainLayout = [
  { path: "*", exact: true, component: Page404 },
  { path: "verify/:token", exact: true, component: Verify },
  { path: "reset-password/:resetToken", exact: true, component: ResetPassword },
  {
    path: "request/reset-password/:resetToken/remove",
    exact: true,
    component: DisregardReset
  }
];

export const portalRoutes = [
  { path: "dashboard", exact: true, component: Dashboard },
  { path: "profile", exact: true, component: Profile },
  { path: "category/:id", exact: true, component: Category }
];

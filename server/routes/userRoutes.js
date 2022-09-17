const router = require("express").Router();
const userController = require("../controllers/userControllers");
const auth = require("../middlewares/auth");

//user login router
router.post("/login", userController.userLogin);

//user signup router
router.post("/signup", userController.userSignup);

//check user if logged in
router.get("/check_user", userController.checkUser);

//user logout router
router.get("/logout", auth, userController.userLogout);

//forgot password router
router.post("/forgot-password", userController.forgotPassword);

//validate reset password token
router.get(
  "/forgot-password/validate/:resetToken",
  userController.validateResetPasswordToken
);

//update new password in password reset
router.put(
  "/forgot-password/update/:resetToken",
  userController.forgotPasswordUpdate
);

//delete reset password token
router.delete(
  "/forgot-password/remove/:resetToken",
  userController.disregardResetToken
);

//edit username router
router.put("/edit-username", auth, userController.editUsername);

//change email router
router.put("/change-email", auth, userController.changeEmail);

//change password router
router.put("/change-password", auth, userController.changePassword);

//delete account router
router.post("/delete", auth, userController.deleteAccount);

module.exports = router;

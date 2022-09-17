const router = require("express").Router();
const verificationController = require("../controllers/verificationController");
const auth = require("../middlewares/auth");

//verify token router
router.post("/:token", verificationController.verifyEmail);

//resend new verification router
router.post(
  "/resend/verification",
  auth,
  verificationController.resendVerification
);

module.exports = router;

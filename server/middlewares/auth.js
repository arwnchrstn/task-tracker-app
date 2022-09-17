const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//auth middleware
//status codes: (401, 403)
module.exports = async (req, res, next) => {
  //check for cookie is exisiting
  const { access_token } = req.cookies;
  const existingUser = await User.findById(
    jwt.decode(access_token, process.env.ACCESS_SECRET)?.userId
  );

  try {
    //clear access token if cookie is not present
    if (!access_token || !existingUser)
      return res
        .cookie("access_token", "", {
          httpOnly: true,
          maxAge: 0,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : ""
        })
        .status(401)
        .send("Unauthorized");

    //verify access token
    const verified = jwt.verify(access_token, process.env.ACCESS_SECRET);
    req.user = verified.userId;
    next();
  } catch (error) {
    //1st catch block
    //check refresh token if valid when access token is expired

    //send status 401 when token is invalid signature
    if (error.message === "invalid signature")
      return res
        .cookie("access_token", "", {
          httpOnly: true,
          maxAge: 0,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : ""
        })
        .status(401)
        .send("Unauthorized");

    try {
      //check if there is existing user
      if (!existingUser)
        return res
          .cookie("access_token", "", {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : ""
          })
          .status(401)
          .send("Unauthorized");

      //verify refresh token
      const verified = jwt.verify(
        existingUser.refreshToken,
        process.env.REFRESH_SECRET
      );
      //sign new access token is refresh token is valid
      const newAccessToken = jwt.sign(
        { userId: verified.userId },
        process.env.ACCESS_SECRET,
        { expiresIn: "10m" }
      );
      //send new access token to https cookie
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 * 1000, //30 days
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      });
      req.user = verified.userId;
      next();
    } catch (error) {
      res.cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      });

      //remove refresh token from the database
      existingUser.refreshToken = "";
      await existingUser.save();

      res.status(403).send("Session expired. Please re-login to your account");
    }
  }
};

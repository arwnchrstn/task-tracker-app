const User = require("../models/userModel");

module.exports = async (event, user) => {
  //add to recent activities
  const existingUser = await User.findById(user);
  existingUser.recent_activities.unshift({
    event
  });

  return await existingUser.save();
};

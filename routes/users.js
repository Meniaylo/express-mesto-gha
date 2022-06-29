const userRouter = require('express').Router();

const {
  userController,
  usersController,
  createUser,
  updateUserProfile,
  updateUserAvatar
} = require("../controllers/users");

userRouter.get("/", usersController);
userRouter.get("/:userId", userController);
userRouter.post("/", createUser);
userRouter.patch("/me", updateUserProfile);
userRouter.patch("/me/avatar", updateUserAvatar);

module.exports = userRouter;
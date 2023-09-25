const {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} = require("../../schemas");
const { validateBody } = require("../../decorators");

const userRegisterValidate = validateBody(userRegisterSchema);

const userLoginValidate = validateBody(userLoginSchema);

const userUpdateSubscriptionValidate = validateBody(userUpdateSchema);

module.exports = {
  userRegisterValidate,
  userLoginValidate,
  userUpdateSubscriptionValidate,
};

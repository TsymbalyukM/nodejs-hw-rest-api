const express = require("express");
const { isValidId } = require("../../middlewares/index");
const contactsController = require("../../controllers/contacts-controller");
const router = express.Router();
const { validateBody } = require("../../decorators");
const schemas = require("../../schemas/contacts-schemas");

const contactAddValidate = validateBody(schemas.contactAddSchema);
const contactUpdateValidate = validateBody(schemas.contactUpdateSchema);
const contactUpdateFavoriteValidate = validateBody(
  schemas.contactUpdateFavoriteSchema
);

router.get("/", contactsController.getAllContacts);

router.get("/:id", isValidId, contactsController.getContactById);

router.post("/", contactAddValidate, contactsController.addContact);

router.delete("/:id", isValidId, contactsController.removeContact);

router.put(
  "/:id",
  isValidId,
  contactUpdateValidate,
  contactsController.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavoriteValidate,
  contactsController.updateContactStatus
);

module.exports = router;

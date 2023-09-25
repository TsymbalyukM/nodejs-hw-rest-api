const Contact = require("../models/Contact");
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };
  if (favorite) {
    query.favorite = favorite;
  }
  const result = await Contact.find(query, "", { skip, limit }).populate(
    "owner",
    "email subscription"
  );
  res.json(result);
};
const getContactById = async (req, res) => {
  const { id } = req.params;
  const { _id: contactOwner } = req.user;
  const result = await Contact.findOne({ owner: contactOwner, _id: contactId });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};
const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: contactOwner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { owner: contactOwner, _id: id },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};
const removeContact = async (req, res) => {
  const { id } = req.params;
  const { _id: contactOwner } = req.user;
  const result = await Contact.findOneAndDelete({
    owner: contactOwner,
    _id: id,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not  found`);
  }
  res.json({
    message: "Contact deleted",
  });
};
const updateContactStatus = async (req, res, next) => {
  const { id } = req.params;
  const { _id: contactOwner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { owner: contactOwner, _id: id },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};
module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  removeContact: ctrlWrapper(removeContact),
  updateContactStatus: ctrlWrapper(updateContactStatus),
};

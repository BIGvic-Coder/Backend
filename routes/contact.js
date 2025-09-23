const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const newContact = await contact.save();
    res.status(201).json({ id: newContact._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

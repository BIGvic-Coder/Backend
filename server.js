import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

dotenv.config();
const app = express();

// ✅ Stronger CORS config (fix Swagger "Failed to fetch")
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Swagger setup
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Connect to MongoDB (modern way)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB at", process.env.MONGO_URI))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* -------------------------------------------------------------------------- */
/* PROFESSIONAL MODEL + ROUTE (your portfolio data) */
/* -------------------------------------------------------------------------- */
const professionalSchema = new mongoose.Schema({
  professionalName: String,
  base64Image: String, // optional base64
  imageUrl: String, // optional hosted image URL
  nameLink: {
    firstName: String,
    url: String,
  },
  primaryDescription: String,
  workDescription1: String,
  workDescription2: String,
  linkTitleText: String,
  linkedInLink: {
    text: String,
    link: String,
  },
  githubLink: {
    text: String,
    link: String,
  },
});

const Professional = mongoose.model(
  "Professional",
  professionalSchema,
  "professionals"
);

const fallbackData = {
  professionalName: "Victor Boluwatife",
  base64Image: "",
  imageUrl: "https://via.placeholder.com/150",
  nameLink: {
    firstName: "Victor",
    url: "https://www.linkedin.com/in/victor-talabi-93387a263/",
  },
  primaryDescription:
    "Software developer passionate about building impactful web apps.",
  workDescription1: "I specialize in JavaScript, React, Node.js.",
  workDescription2: "Also skilled in backend systems & MongoDB.",
  linkTitleText: "Portfolio",
  linkedInLink: {
    text: "LinkedIn",
    link: "https://www.linkedin.com/in/victor-talabi-93387a263/",
  },
  githubLink: {
    text: "GitHub",
    link: "https://github.com/BIGvic-Coder",
  },
};

// ✅ GET professional info
app.get("/professional", async (req, res) => {
  try {
    const prof = await Professional.findOne();
    if (prof) {
      res.json(prof);
    } else {
      res.json(fallbackData);
    }
  } catch (err) {
    console.error("❌ Error fetching professional:", err);
    res.status(500).json(fallbackData);
  }
});

/* -------------------------------------------------------------------------- */
/* CONTACTS MODEL + CRUD ROUTES (assignment requirement) */
/* -------------------------------------------------------------------------- */
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  favoriteColor: { type: String, required: true },
  birthday: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema, "contacts");

// GET all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET contact by ID
app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new contact
app.post("/contacts", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact)
      return res.status(404).json({ message: "Contact not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------- */
// ✅ Start server
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

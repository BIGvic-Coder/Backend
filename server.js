import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Swagger setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Contacts API",
    version: "1.0.0",
    description: "A simple Express Contacts API",
  },
  servers: [
    {
      url: "https://contacts-api-2tnt.onrender.com", // ✅ Render server
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./server.js"], // now we’ll use JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the contact
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         favoriteColor:
 *           type: string
 *         birthday:
 *           type: string
 *       example:
 *         firstName: Victor
 *         lastName: Boluwatife
 *         email: victor@example.com
 *         favoriteColor: Blue
 *         birthday: 2000-01-01
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of all contacts
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single contact
 *       404:
 *         description: Contact not found
 *   put:
 *     summary: Update a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated
 *   delete:
 *     summary: Delete a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact deleted
 */

// ✅ Root route
app.get("/", (req, res) => {
  res.send(
    "✅ Contacts API is running. Visit /api-docs for Swagger documentation."
  );
});

// Example contacts route (in-memory for now)
let contacts = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Doe",
    email: "alice@example.com",
    favoriteColor: "Red",
    birthday: "1999-05-10",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    favoriteColor: "Green",
    birthday: "1990-08-15",
  },
];

app.get("/contacts", (req, res) => {
  res.json(contacts);
});

app.post("/contacts", (req, res) => {
  const newContact = { id: contacts.length + 1, ...req.body };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.get("/contacts/:id", (req, res) => {
  const contact = contacts.find((c) => c.id == req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
});

app.put("/contacts/:id", (req, res) => {
  const index = contacts.findIndex((c) => c.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Contact not found" });
  contacts[index] = { ...contacts[index], ...req.body };
  res.json(contacts[index]);
});

app.delete("/contacts/:id", (req, res) => {
  const index = contacts.findIndex((c) => c.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Contact not found" });
  contacts.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

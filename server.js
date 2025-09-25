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
      url: "https://contacts-api-2tnt.onrender.com", // ✅ Your Render link
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./server.js"], // If you document endpoints with JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Root route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send(
    "✅ Contacts API is running. Visit /api-docs for Swagger documentation."
  );
});

// Example contacts route
let contacts = [
  { id: 1, name: "Alice Doe", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
];

app.get("/contacts", (req, res) => {
  res.json(contacts);
});

app.post("/contacts", (req, res) => {
  const newContact = { id: contacts.length + 1, ...req.body };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

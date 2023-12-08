// Call all the Imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

// Initialize Env Variables
dotenv.config();

// Initialize the App
const app = express();

// Initialize PostgreSQL Database
const sql = require("./db/postgre-sql");

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(async (req, res, next) => {
  try {
    if (req.body.user_id !== null) {
      next();
    } else {
      const { email_id } = req.body || req.query;
      user_id =
        await sql`SELECT user_id from users WHERE email_id = ${email_id}`;
      if (user_id[0] === undefined) {
        next();
      }
      req.body.user_id = user_id[0].user_id;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
    next();
  }
});

// Initializing Port
const port = process.env.PORT || 9000;

app.listen(port, async () => {
  console.log(`Listening to Port: ${port}!`);
});

app.get("/user/v1/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params || req.body;
    const user = await sql`SELECT * FROM users WHERE email_id = ${email_id}`;
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.post("/user/v1/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params || req.body;
    const user =
      await sql`INSERT INTO users (user_name) VALUES(${userName}) RETURNING *`;
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.put("/user/v1/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params || req.body;
    const { user_id } = req.body;
    const { updateList } = req.body;
    const updateQuery = "SET";

    for (let index = 0; index < updateList.length; index++) {
      const element = array[index];
      updateQuery = `${updateQuery} ${element.name} = ${element.update}`;
      if (index + 1 !== updateList.length) {
        updateQuery = `${updateQuery}, `;
      }
    }
    const user = await sql`UPDATE user_details ${updateList} 
      FROM users WHERE user_details.user_id = 
      (SELECT user_id FROM users WHERE email_id = ${email_id}) 
      RETURNING *`;
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get("/search/v1", async (req, res) => {
  try {
    const { query } = req.body || req.query;
    const searchList = await sql`SELECT * FROM schemas`;
    const resList = [];
    const resListIndex = 0;

    for (let index = 0; index < searchList.length; index++) {
      const element = array[index];
      if (element.content.toLowerCase().include(query.toLowerCase())) {
        resList[resListIndex] = element;
        resList[resListIndex].index = element.content
          .toLowerCase()
          .indexOf(query.toLowerCase());
        resListIndex = resListIndex + 1;
      }
    }

    if (resListIndex === 0) {
      res.status(303).send("Not Found!");
    } else {
      res.status(202).send(resList);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get("/schema/v1/:schema_id", async (req, res) => {
  try {
    const { schema_id } = req.params;
    const schema = sql`SELECT * FROM schemas WHERE schema_id = ${schema_id}`;
    if (typeof schema[0] !== "object") {
      res.status(303).send("No schema of such type");
    } else {
      res.status(202).send(schema);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get("/schema/v1/:schema_id/checkout", async (req, res) => {
  try {
    const { schema_id } = req.params;
    const schema = sql`SELECT * FROM schemas_checkout WHERE schema_id = ${schema_id}`;
    if (typeof schema[0] !== "object") {
      res.status(303).send("No schema checkout found!");
    } else {
      res.status(202).send(schema);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get("/histroy/v1/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params;
    const histroies = sql`SELECT * FROM histroies WHERE user_id = 
      (SELECT user_id FROM users WHERE email_id = ${email_id})`;
    if (typeof histroies[0] !== "object") {
      res.status(303).send("No schema checkout found!");
    } else {
      res.status(202).send(histroies);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.post("/feedback/v1/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params;
    const { user_id } = req.query || req.body;
    const { feedback_msg } = req.body;
    const feedback = sql`INSERT INTO feedback (feedback_msg, user_id) VALUES(${feedback_msg}, 
      ${
        user_id !== undefined
          ? user_id
          : `(SELECT user_id FROM users WHERE email_id = ${email_id})`
      }) 
      RETURNING *`;
    if (typeof feedback[0] !== "object") {
      res.status(303).send("No schema checkout found!");
    } else {
      res.status(202).send(feedback);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get("/chatbot", async (req, res) => {
  try {
    const { query } = req.query || req.body.query;
    // const chatBotAPI = "some.example.com";
    // const res = await fetch(chatBotAPI, { method: "GET", body: { query: query } });
    // res.status(203).send(res);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

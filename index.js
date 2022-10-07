const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./model/todo");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
dotenv.config()

const port = process.env.PORT || 5000;
const db = process.env.DB_LOCAL;
const dbonline = process.env.DB_ONLINE;

//Connect to your mongodb server
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

//Create a todo record and store it in the database
app.post("/add", async (req, res) => {
  const { title, description, author } = req.body;

  const todos = await Todo.create({
    title,
    description,
    author,
  });

  if (todos) {
    res.status(201).json({
      status: true,
      message: "Todo was created successfully",
      data: todos,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Sorry Something went wrong",
    });
  }
});

//Get all records from the database
app.get("/getAllTodos", async (req, res) => {
  const data = await Todo.find();

  if (data) {
    res.status(200).json({
      status: true,
      message: "Success",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Sorry Something went wrong",
    });
  }
});

//Edit todo info
app.put("/put/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;

  const todo = await Todo.updateOne({
    title: title,
    description: description,
    author: author,
  }).where({ _id: id });

  if (todo){
    res.status(200).json({ 
        status: true,
        message: "Updated", 
        data: todo
    })
  }else {
    res.status(400).json({
        status: false,
        message: "Sorry Something went wrong",
    })
  }
});



app.patch("/patch/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;

  const todo = await Todo.updateOne({
    title: title,
    description: description,
    author: author,
  }).where({ _id: id });

  if (todo){
    res.status(200).json({ 
        status: true,
        message: "Updated", 
        data: todo
    })
  }else {
    res.status(400).json({
        status: false,
        message: "Sorry Something went wrong",
    })
  }
});

// app.patch("/todos/:id", async (req, res) => {
//     const { id } = req.params;
//     const patch = req.body;

//     const todo = await Todo.updateMany(patch).where({
//       _id: id,

//     });

//     if (todo) {
//       res.status(200).json({
//         status: true,
//         message: "Todo edited successfully",
//         data: todo,
//       });
//     } else {
//        res.status(400).json({
//         status: false,
//         message: "Todo failed to update",
//       });
//     }
//   });

//Put request
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, author } = req.body;

  const todo = await Todo.updateOne({
    title: title,
    description: description,
    author: author,
  }).where({
    _id: id,
  });

  if (todo) {
    res.status(200).json({
      status: true,
      message: "Todos edited successfully by put",
      data: todo,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Todos failed to update",
    });
  }
});

//Delete todo from the database by its id
app.delete("/remove/:id", async (req, res) => {
  const data = await Todo.findByIdAndDelete(req.params.id);

  if (data) {
    res.status(200).json({
      status: true,
      message: "Todo has been deleted successfully",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Sorry Unable to delete Todo",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

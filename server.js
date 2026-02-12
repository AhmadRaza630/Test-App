const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

// Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // ensures MongoDB enforces unique emails
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// 🔹 POST - Add or Update User (Upsert)
app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required"
      });
    }

    // Upsert: find by email, update if exists, create if not
    const user = await User.findOneAndUpdate(
      { email },           // query
      { name, email },     // update
      { new: true, upsert: true } // options: return updated doc, create if not exists
    );

    // Determine if it was an update or new user
    const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();

    res.status(200).json({
      success: true,
      message: isNewUser ? "User Added Successfully" : "User Updated Successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔹 GET - Get All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

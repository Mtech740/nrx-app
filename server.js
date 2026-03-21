const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];
let rewardCodes = {};

// 🎁 Generate reward
function generateReward() {
  const rand = Math.random();
  if (rand < 0.1) return "$10";
  if (rand < 0.3) return "$5";
  if (rand < 0.6) return "$3";
  return "$1";
}

// 🔑 Generate code
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return "NRX-" + code;
}

// 🛒 CREATE ORDER
app.post("/create-order", (req, res) => {
  const { name, phone, size, delivery } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing info" });
  }

  const reward = generateReward();
  const code = generateCode();

  rewardCodes[code] = {
    reward,
    used: false
  };

  const order = {
    id: Date.now(),
    name,
    phone,
    size,
    delivery,
    code
  };

  orders.push(order);

  res.json({
    success: true,
    code,
    reward
  });
});

// 🎯 REDEEM CODE
app.post("/redeem", (req, res) => {
  const { code } = req.body;

  if (!rewardCodes[code]) {
    return res.json({ success: false, message: "Invalid code" });
  }

  if (rewardCodes[code].used) {
    return res.json({ success: false, message: "Already used" });
  }

  rewardCodes[code].used = true;

  res.json({
    success: true,
    reward: rewardCodes[code].reward
  });
});

// 🌍 START SERVER
app.listen(3000, () => {
  console.log("Server running...");
});

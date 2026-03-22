const express = require("express");
const app = express();

app.use(express.json({ limit: "10mb" }));

let orders = [];
let rewards = {};

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let code = "NRX-";
  for(let i=0;i<8;i++){
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function randomReward(){
  const rand = Math.random();
  if(rand < 0.1) return "$10 cashback";
  if(rand < 0.3) return "$5 discount";
  return "$1 reward";
}

// CREATE ORDER
app.post("/api/order", (req, res) => {
  const { name, phone, color, size } = req.body;

  if(!name || !phone || !color || !size){
    return res.json({ success:false });
  }

  const code = generateCode();
  const reward = randomReward();

  rewards[code] = { reward, used:false };

  orders.push({
    id: Date.now(),
    name,
    phone,
    color,
    size,
    code
  });

  res.json({
    success:true,
    code,
    reward
  });
});

// REDEEM
app.post("/api/redeem", (req, res) => {
  const { code } = req.body;

  if(!rewards[code]){
    return res.json({ success:false, message:"Invalid code" });
  }

  if(rewards[code].used){
    return res.json({ success:false, message:"Already used" });
  }

  rewards[code].used = true;

  res.json({
    success:true,
    reward: rewards[code].reward
  });
});

// TEST ROUTE
app.get("/", (req,res)=>{
  res.send("NRX Backend Running 🚀");
});

app.listen(3000, () => console.log("Server running..."));

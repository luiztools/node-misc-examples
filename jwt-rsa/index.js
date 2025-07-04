//index.js
require("dotenv-safe").config();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.json({ message: "Tudo ok por aqui!" });
})

app.get("/clientes", verifyJWT, (req, res) => {
  console.log("Retornou todos clientes!");
  res.json([{ id: 1, nome: "luiz" }]);
})

function verifyJWT(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided." });

  token = req.headers["authorization"].replace("Bearer ", "");
  if (blacklist[token]) return res.status(403).json({ message: "Invalid token." });

  try {
    const publicKey = fs.readFileSync("./public.key", "utf8");
    const decoded = jwt.verify(token, publicKey, { algorithm: ["RS256"] });
    if (!decoded) return res.status(403).json({ message: "Invalid token." });

    res.locals.token = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
}

app.post("/login", (req, res, next) => {
  //esse teste abaixo deve ser feito no seu banco de dados
  if (req.body.user === "luiz" && req.body.password === "123") {
    //auth ok
    const userId = 1; //esse id viria do banco de dados

    const privateKey = fs.readFileSync("./private.key", "utf8");
    const token = jwt.sign({ userId }, privateKey, {
      expiresIn: parseInt(process.env.JWT_EXPIRES),
      algorithm: "RS256"
    });

    return res.json({ token: token });
  }

  res.status(401).json({ message: "Invalid credentials!" });
})

const blacklist = {};

app.post("/logout", verifyJWT, (req, res) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  blacklist[token] = true;
  setTimeout(() => delete blacklist[token], parseInt(process.env.JWT_EXPIRES) * 1000);
  res.json({ token: null });
})

app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));

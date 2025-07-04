//index.js
require("dotenv-safe").config();
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ message: "Invalid token." });

    res.locals.token = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
}

const refreshTokens = {};

function generateRefreshToken(userId) {

  //gera novo token
  const token = uuidv4();
  refreshTokens[token] = userId;

  //limpa token paralelo, se houver
  Object.keys(refreshTokens).forEach(t => {
    if (t !== token && refreshTokens[t] === userId)
      refreshTokens[t] = undefined;
  })

  //configura expiração automática
  setTimeout(() => delete refreshTokens[token], parseInt(process.env.REFRESH_EXPIRES))
  return token;
}

app.post("/login", (req, res) => {
  //esse teste abaixo deve ser feito no seu banco de dados
  if (req.body.user === "luiz" && req.body.password === "123") {
    const userId = 1; //esse id viria do banco de dados

    //access token
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES)
    });

    //refresh token
    const refreshToken = generateRefreshToken(userId);

    return res.json({ accessToken, refreshToken });
  }

  res.status(401).json({ message: "Invalid credentials!" });
})

app.post("/refresh", (req, res) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided." });

  token = req.headers["authorization"].replace("Bearer ", "");
  const userId = refreshTokens[token];
  if (!userId) return res.status(403).json({ message: "Invalid token." });

  //novo access token
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES)
  });

  //novo refresh token
  const refreshToken = generateRefreshToken(userId);

  return res.json({ accessToken, refreshToken });
})

const blacklist = {};

app.post("/logout", verifyJWT, (req, res) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  blacklist[token] = true;
  setTimeout(() => delete blacklist[token], parseInt(process.env.JWT_EXPIRES) * 1000);

  //limpando refresh token
  Object.keys(refreshTokens).forEach(t => {
    if (refreshTokens[t] === res.locals.token.userId)
      refreshTokens[t] = undefined;
  })

  res.json({ accessToken: null, refreshToken: null });
})

app.listen(3000, () => console.log("Servidor escutando na porta 3000..."));

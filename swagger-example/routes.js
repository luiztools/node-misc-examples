import jwt from "jsonwebtoken";

import express from "express";
const router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the server
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", (req, res, next) => {
  res.json({ message: "Tudo ok por aqui!" });
})

/**
 * @openapi
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
*                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", (req, res, next) => {
  //esse teste abaixo deve ser feito no seu banco de dados
  if (req.body.user === "luiz" && req.body.password === "123") {
    //auth ok
    const userId = 1; //esse id viria do banco de dados
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES)
    });
    return res.json({ token: token });
  }

  res.status(401).json({ message: "Invalid credentials!" });
})

/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Get all clients
 *     description: Returns a list of clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/clientes", verifyJWT, (req, res) => {
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

const blacklist = {};

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Logs out a user and invalidates the JWT token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", verifyJWT, (req, res) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  blacklist[token] = true;
  setTimeout(() => delete blacklist[token], parseInt(process.env.JWT_EXPIRES) * 1000);
  res.json({ token: null });
})

export default router;
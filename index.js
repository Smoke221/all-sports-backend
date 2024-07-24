const express = require("express");
const connection = require("./configs/db");
const { authRouter } = require("./routes/authRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to my App</h1>
        <p>I'm glad you're here!.</p>
        <a href="https://allsportsmoke.el.r.appspot.com/api-docs">Swagger Documentation.</a>
        `);
});

app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

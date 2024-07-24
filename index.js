const express = require("express");
const connection = require("./configs/db");
const { authRouter } = require("./routes/authRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./swagger");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
  res.send("testing");
});

app.use("/auth", authRouter);
app.use("/categories", categoryRouter)
app.use("/products", productRouter)

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});

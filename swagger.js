const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Allsport.in Backend Assignment",
      version: "1.0.0",
      description:
        "RESTful API for a simple e-commerce application using Node.js and MySQL. The API handles operations related to products, categories, and user authentication.",
    },
    servers: [
      {
        url: "https://allsportsmoke.el.r.appspot.com/",
      },
    ],
  },
  apis: ["./routes/**/*.js", "./controllers/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

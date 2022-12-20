//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.

const userRoutes = require("./routesAPI");
const instructorRoutes = require("./instructor");
const courseRoutes = require("./courses");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/student", userRoutes);
  app.use("/instructor", instructorRoutes);
  app.use("/courses", courseRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;

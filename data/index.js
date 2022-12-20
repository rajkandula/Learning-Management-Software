//Here you will require data files and export them as shown in lecture code and worked in previous labs.
const userData = require("./users");
const instructorData = require("./instructor");
const feedbackData = require("./feedback");
const coursesData = require("./courses");

module.exports = {
  users: userData,
  instructor: instructorData,
  feedback: feedbackData,
  courses: coursesData,
};

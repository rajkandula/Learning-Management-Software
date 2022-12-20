//require express, express router and bcrypt as shown in lecture code

const express = require("express");
const router = express.Router();
const intructors = require("../data/instructor");
const feedbacks = require("../data/feedback");
const coursess = require("../data/courses");

router.route("/createCourse1").get(async (req, res) => {
  //code here for GET
  const id_data = req.session.idData;
  try {
    let courseList = await coursess.getAllCourses();
    res.json(courseList);
  } catch (e) {
    res.sendStatus(500);
  }
});

// route to my create course
router
  .route("/createCourse")
  .get(async (req, res) => {
    //code here for GET
    let name = req.session.fname + req.session.lname;
    if (req.session.user) {
      res.render("instructor/createCourse", {
        userType: req.session.userType,
        title: "Create Course Page",
        name,
      });
    } else {
      res.render("instructor/instructorLogin", { title: "instructor Login" });
    }
  })
  .post(async (req, res) => {
    const id_data = req.session.idData;
    //fname+lname
    const course_name = req.body.courseNameInput;
    //select country
    const description_name = req.body.descriptionInput;
    //message
    const courseid_name = req.body.courseIdInput;
    const resourse_name = req.body.courseInput;

    try {
      //Create a User by sending u and p.
      var registration_response = await coursess.createCourse(
        id_data,
        course_name,
        courseid_name,
        description_name,
        resourse_name
      );

      //course-data
      // req.session.courseTitle = registration_response.data.courseTitle;
      // req.session.courseId = registration_response.data.courseId;
      // req.session.courseDescription =
      //   registration_response.data.courseDescription;
      // req.session.courseResourse = registration_response.data.courseResourse;

      // console.log("registration_response", registration_response);

      //     if ("inserted_user" in registration_response) {
      //       res.redirect("/");
      //     } else {
      //       res.status(500);
      //       res.render("instructor/instructor_private", {
      //         title: "register",
      //         error_msg: "Internal Server Error",
      //       });
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      // });
      if ("inserted_user" in registration_response) {
        res.redirect("/instructor/");
      } else if ("user_exists" in registration_response) {
        res.status(400);
        res.render("instructor/createCourse", {
          userType: req.session.userType,
          title: "instructor course",
          error_msg: " Course Already Exist",
        });
      } else if ("validation_error" in registration_response) {
        res.status(400);
        res.render("instructor/createCourse", {
          userType: req.session.userType,
          title: "instructor course",
          error_msg: registration_response.validation_error,
        });
      } else {
        res.status(500);
        res.render("instructor/createCourse", {
          userType: req.session.userType,
          title: "instructor course",
          error_msg: "Internal Server Error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
module.exports = router;

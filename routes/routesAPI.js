//require express, express router and bcrypt as shown in lecture code
const e = require("express");
const express = require("express");
const router = express.Router();
const userss = require("../data/users");
const feedbacks = require("../data/feedback");
const coursess = require("../data/courses");
var { O } = require("mongodb");
const quizzs = require("../data/quizQuestions");

router.route("/").get(async (req, res) => {
  //code here for GET
  if (req.session.user != null && req.session.type == "instructor") {
    res.redirect("/instructor/");
  } else if (req.session.user != null && req.session.type == "student") {
    res.redirect("/protected");
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

//profile route
router.route("/profile").get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    var userData = await userss.getUserByUsername(req.session.user);
    date_time = Date();

    res.render("student/user_profile", {
      title: "profile page",
      date_time: date_time,
      fname: userData.firstnameData,
      lname: userData.lastnameData,
      user: userData.usernameData,
      email: userData.emailData,
      dob: userData.dobData,
      gender: userData.genderData,
      saddress: userData.streetaddressData,
      city: userData.cityData,
      zipcode: userData.zipcodeData,
      country: userData.country,
      phonenumber: userData.phonenumberData,
    });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

router.route("/home").get(async (req, res) => {
  //code here for GET
  var userData = await userss.getUserByUsername(req.session.user);
  if (req.session.user) {
    res.render("student/home", {
      title: "Home Page",
      fname: userData.firstnameData,
    });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

// route to my course
router.route("/mycourse_list").get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    var userData = await userss.getUserByUsername(req.session.user);
    let courseList = await coursess.getAllCourses();
    console.log("courseList-1", courseList);

    courseList = courseList.map((course) => {
      return {
        ...course,
        already_enrolled: userData?.enrolledCourse?.includes(
          course?._id?.toString().replace(/ObjectId\("(.*)"\)/, "$1")
        ),
      };
    });
    //code here for GET

    console.log("courseList-2", courseList);

    res.render("student/mycourse_list", {
      fname: userData.firstnameData,
      title: "My Course List Page",
      courses: courseList,
    });
  } else {
    // res.render("userLogin", { title: "User Login" });
    res.redirect("/");
  }
});

// route to contact Form
router.route("/contact_form").get(async (req, res) => {
  //code here for GET
  // let courseList = await coursess.getAllCourses();
  if (req.session.user) {
    res.render("student/ajax_contact_form", {
      title: "Contact Form",
    });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});
// route to contact Form
router.route("/searchbars").get(async (req, res) => {
  //code here for GET
  // let courseList = await coursess.getAllCourses();
  if (req.session.user) {
    res.render("student/ajax_contact_form", {
      title: "Contact Form",
    });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

// route to my about page
router.route("/aboutpage").get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    res.render("student/aboutpage", { title: "About Page" });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

// route to my connect // social media
router.route("/social_media").get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    res.render("student/social_media", { title: "Social Media Page" });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});
// route to my feedbackform
router
  .route("/feedbackform")
  .get(async (req, res) => {
    //code here for GET
    var userData = await userss.getUserByUsername(req.session.user);
    let name = userData?.firstnameData + userData?.lastnameData;
    if (req.session.user) {
      res.render("student/feedbackform", {
        // name: name,
        title: "feedback  Page",
      });
    } else {
      res.render("student/userLogin", { title: "User Login" });
    }
  })
  .post(async (req, res) => {
    const id_data = req.session.idData;
    //fname+lname
    const full_name = req.body.fullnameInput;
    //select country
    const country_name = req.body.countryInput;
    //message
    const message_name = req.body.messageInput;

    try {
      //Create a User by sending.
      var registration_response = await feedbacks.sendFeedback(
        id_data,
        full_name,
        country_name,
        message_name
      );

      console.log("registration_response", registration_response);

      if (registration_response.inserted_feedback == true) {
        // res.render("meassageWithRedirect", {
        //   title: "Message",
        //   message: "Feedback Sent Successfully",
        //   redirectMessage:"Click here to go back to Home Page",
        //   redirectUrl: "/",
        // });
        res.json({ message: "Feedback Sent Successfully", success: true });
      } else {
        res.json({
          error_msg:
            registration_response.validation_error ||
            "Error in sending feedback",
        });

        /**res.render("student/feedbackform", {
          title: "register",
          error_msg: registration_response.validation_error || "Error in sending feedback",
        });**/
      }
    } catch (e) {
      console.log(e);
    }
  });
// route to my askqq
// router.route("/ask_question").get(async (req, res) => {
//   //code here for GET
//   if (req.session.user) {
//     res.render("student/ask_question", { title: "Ask Question Page" });
//   } else {
//     res.render("student/userLogin", { title: "User Login" });
//   }
// });

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      res.redirect("/protected");
    } else {
      res.render("student/userRegister", { title: "register" });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //get data and save to database

    //fname+lname
    const fname_data = req.body.firstnameInput;
    const lname_data = req.body.lastnameInput;

    //username
    const user_data = req.body.usernameInput;

    //email
    const email_data = req.body.emailInput;

    //dob
    const dob_data = req.body.birthdayInput;

    //gender
    const gender_data = req.body.genderInput;

    //address
    const street_address_data = req.body.street_addressInput;
    const city_data = req.body.cityInput;
    const postal_code_data = req.body.postal_codeInput;
    const country_data = req.body.countryInput;

    //phone
    const phone_data = req.body.phoneInput;

    //password
    const password_data = req.body.passwordInput;
    // res.render("userRegister", { user: data });

    //printing user data
    console.log("fname_data", fname_data);
    console.log("lname_data", lname_data);
    console.log("user_data", user_data);
    console.log("email_data", email_data);
    console.log("dob_data", dob_data);
    console.log("gender_data", gender_data);
    console.log("street_address_data", street_address_data);
    console.log("city_data", city_data);
    console.log("postal_code_data", postal_code_data);
    console.log("country_data", country_data);
    console.log("phone_data", phone_data);
    console.log("password_data", password_data);

    try {
      //Create a User by sending u and p.
      var registration_response = await userss.createUser(
        fname_data,
        lname_data,
        user_data,
        email_data,
        dob_data,
        gender_data,
        street_address_data,
        city_data,
        postal_code_data,
        country_data,
        phone_data,
        password_data
      );

      console.log("registration_response", registration_response);

      if ("inserted_user" in registration_response) {
        res.redirect("/");
      } else if ("user_exists" in registration_response) {
        res.status(400);
        res.render("student/userRegister", {
          title: "register",
          error_msg: " User Already Exist",
        });
      } else if ("validation_error" in registration_response) {
        res.status(400);
        res.render("student/userRegister", {
          title: "register",
          error_msg: registration_response.validation_error,
        });
      } else {
        res.status(500);
        res.render("student/userRegister", {
          title: "register",
          error_msg: "Internal Server Error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

router.route("/login").post(async (req, res) => {
  //code here for POST
  //get login info, verify and then create session and redirect to private page
  //code here for POST
  //get data and save to database

  // res.render("userRegister", { user: data });

  //fname+lname
  const fname_data = req.body.firstnameInput;
  const lname_data = req.body.lastnameInput;

  //username
  const user_data = req.body.usernameInput;

  //email
  const email_data = req.body.emailInput;

  //dob
  const dob_data = req.body.birthdayInput;

  //gender
  const gender_data = req.body.genderInput;

  //address
  const street_address_data = req.body.street_addressInput;
  const city_data = req.body.cityInput;
  const postal_code_data = req.body.postal_codeInput;
  const country_data = req.body.countryInput;

  //phone
  const phone_data = req.body.phoneInput;

  //password
  const password_data = req.body.passwordInput;

  try {
    //Create a User by sending u and p.
    var registration_response = await userss.checkUser(
      user_data,
      password_data
    );
    console.log("registration_response", registration_response);

    if ("authenticatedUser" in registration_response) {
      //create a session
      console.log(
        "my user logged in=",
        registration_response.data._id.toString()
      );
      req.session.idData = registration_response.data._id;
      req.session.user = registration_response.data.usernameData;
      req.session.type = "student";
      //req.session.user = user_data;
      console.log("courseList-registration_response", registration_response);
      res.redirect("/");
    } else if ("validation_error" in registration_response) {
      res.status(400);
      res.render("student/userLogin", {
        title: "User Login",
        error_msg: registration_response.validation_error,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router
  .route("/protected")
  .get(async (req, res) => {
    //code here for GET
    if (!req.session.user) {
      res.redirect("/");
    }

    // if (req.session.userType) {
    //   res.redirect("/");
    // }

    date_time = Date();
    let userData = await userss.getAllUsers();

    var userDataFresh = await userss.getUserByUsername(req.session.user);
    var coursesIdList = userDataFresh?.enrolledCourse;
    if (userDataFresh == null) {
      res.redirect("/");
    } else {
      var coursesIdList = userDataFresh.enrolledCourse;
    }

    var courses = [];
    if (coursesIdList != null) {
      console.log("enrolled course ID list", coursesIdList);
      courses = await coursess.getCoursesByIdList(coursesIdList);
    }

    console.log("enrolled courses", courses);
    if (req.session.user) {
      res.render("student/student_private", {
        title: `${req.session.user}'s Enrolled Courses.`,
        userInfo: userData,
        fname: req.session?.user,
        enrolled: courses,

        // courses: courseList,
      });
    }
    //check if user is logged in
    //if yes -
    // if no
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    }

    const search_term = req.body.search_course;
    let error_msg = " ";

    if (search_term == "" || search_term.trim() == "") {
      error_msg = "Please enter a search term";
    }

    if (search_term.length > 25) {
      error_msg = "Search term should be less than 25 characters";
    }

    console.log("search_term", search_term);

    let userData = await userss.getAllUsers();
    var userDataFresh = await userss.getUserByUsername(req.session.user);
    var coursesIdList = userDataFresh?.enrolledCourse;
    var courses = [];
    if (coursesIdList != null) {
      console.log("enrolled course ID list", coursesIdList);
      courses = await coursess.getCoursesByIdList(coursesIdList);
    }

    console.log("enrolled courses", courses, req.session.user);

    courses = courses.filter((course) => {
      return course?.courseTitle
        ?.toLowerCase()
        .includes(search_term?.toLowerCase());
    });

    if (req.session.user) {
      res.render("student/student_private", {
        title: `Search results for ${search_term}`,
        userInfo: req.session.user,
        fname: req.session.user,
        enrolled: courses,
        error_msg: error_msg,

        // courses: courseList,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  //Destroy session
  req.session.destroy();
  res.render("logout", { title: "Logout" });
});

//edit user
router.route("/editUser").get(async (req, res) => {
  //code here for GET
  if (!req.session.user) {
    res.redirect("/");
  }

  var userData = await userss.getUserByUsername(req.session.user);
  date_time = Date();
  if (req.session.user) {
    res.render("student/editUser", {
      title: "Edit user page",
      date_time: date_time,
      fname: userData.firstnameData,
      lname: userData.lastnameData,
      user: userData.usernameData,
      email: userData.emailData,
      dob: userData.dobData,
      gender: userData.genderData,
      saddress: userData.streetaddressData,
      city: userData.cityData,
      zipcode: userData.zipcodeData,
      country: userData.country,
      phonenumber: userData.phonenumberData,
    });
  } else {
    res.render("student/userLogin", { title: "User Login" });
  }
});

//update user
router.post("/updateUser", async (req, res) => {
  //code here for POST
  //get data and save to database

  const id_data = req.session.idData;
  console.log("id passed is", id_data);
  //fname+lname
  const fname_data = req.body.firstnameInput;
  const lname_data = req.body.lastnameInput;

  //username
  const user_data = req.body.userInput;

  //email
  const email_data = req.body.emailInput;

  //dob
  const dob_data = req.body.dobInput;

  //gender
  const gender_data = req.body.genderInput;

  //address
  const street_address_data = req.body.addressInput;
  const city_data = req.body.cityInput;
  const postal_code_data = req.body.zipcodeInput;
  const country_data = req.body.countryInput;

  //phone
  const phone_data = req.body.phonenumberInput;

  //password
  const password_data = req.body.passwordInput;
  // res.render("userRegister", { user: data });

  //printing user data

  try {
    //Create a User by sending u and p.
    var registration_response = await userss.updateRecord(
      id_data,
      fname_data,
      lname_data,
      dob_data,
      gender_data,
      street_address_data,
      city_data,
      postal_code_data,
      country_data
    );
    console.log("registration_response", registration_response);

    if ("updatedInfo" in registration_response) {
      //create a session

      res.redirect("/profile");
    } else if ("validation_error" in registration_response) {
      res.status(400);
      res.render("student/editUser", {
        title: "edit user",
        error_msg: registration_response.validation_error,
      });
    } else {
      res.render("student/userLogin", { title: "User Login" });
    }
  } catch (e) {
    console.log(e);
  }
});

// route to enroll course
//update user
router.post("/enroll_course", async (req, res) => {
  //code here for POST
  //get data and save to database

  // req.session.endrolled = registration_response.data.enrolledCourse;

  const id_data = req.session.idData;
  const enrollId = req.body.enrollInputId;

  var userDataFresh = await userss.getUserByUsername(req.session.user);
  var coursesIdList = userDataFresh?.enrolledCourse;

  if (coursesIdList?.includes(enrollId)) {
    res.redirect(`/readCourse/${enrollId}`);
  } else {
    //
    var registration_response = await userss.updateEnrolledId(
      id_data,
      enrollId
    );

    res.redirect("/protected");
  }
});

// //read  all courses
// router.route("/readCourse").get(async (req, res) => {
//   //code here for GET

//   date_time = Date();
//   let userData = await userss.getAllUsers();
//   var userDataFresh = await userss.getUserByUsername(req.session.user);
//   var coursesIdList = userDataFresh.enrolledCourse;
//   var courses = [];
//   if (coursesIdList != null) {
//     console.log("enrolled course ID list", coursesIdList);
//     courses = await coursess.getCoursesByIdList(coursesIdList);
//   }
//   if (req.session.user) {
//     res.render("student/readCoursePage", {
//       title: "Read Course",
//       userInfo: userData,
//       enrolled: courses,

//       // courses: courseList,
//     });
//   } else {
//     res.render("forbiddenAccess", { title: "Error" });
//   }
// });

//read courses by id
router.route("/readCourse/:id").get(async (req, res) => {
  //code here for GET

  if (req.session.user) {
    id = req.params.id;

    console.log("id-id", id);
    date_time = Date();
    let userData = await userss.getAllUsers();
    var userDataFresh = await userss.getUserByUsername(req.session.user);
    var courses = [];
    // if (coursesIdList != null) {
    // console.log("enrolled course ID list", coursesIdList);
    courses = await coursess.getCourseById(id);
    // }
    console.log("course gotten", courses);

    res.render("student/readCoursePage", {
      title: "Read Course",
      userInfo: userData,
      enrolled: courses,

      // courses: courseList,
    });
  } else {
    res.render("forbiddenAccess", { title: "Error" });
  }
});

router.route("/unenroll_course").post(async (req, res) => {
  const userId = req.body.courseId;

  const courseId = req.body.userId;

  var userDataFresh = await userss.getUserByUsername(req.session.user);

  console.log("session details-----", req.session.user);

  var updatedUser = await userss.unenroll_course(req.session.user, courseId);

  if (updatedUser) {
    res.redirect("/");
  }
});

module.exports = router;

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const coursess = require("../data/courses");

function ValidateEmail(email_id) {
  const regex_pattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex_pattern.test(email_id);
}

//chech phone
function ValidatePhonenumber(phone) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(phone);
  //console.log(regex.test(phone))
}

//space check
function hasWhiteSpace(s) {
  return s.indexOf(" ") >= 0;
}
//alpha numeric
function onlyLettersAndNumbers(str) {
  return /^[A-Za-z0-9]*$/.test(str);
}
//checking Password must have at least one uppercase character, one number and  one special character.
function checkPassword(str) {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/.test(str);
}

const createUser = async (
  firstnameData,
  lastnameData,
  usernameData,
  emailData,
  dobData,
  genderData,
  streetaddressData,
  cityData,
  zipcodeData,
  country,
  phonenumberData,
  passwordData
) => {
  //validate data first
  usernameData = usernameData.toLowerCase();
  emailData = emailData.toLowerCase();
  if (firstnameData.length <= 0) {
    return {
      validation_error: "The length of the first must be greater than 0! ",
    };
  }
  if (lastnameData.length < 4) {
    return {
      validation_error: "You have entered an invalid phoone number! ",
    };
  }
  if (usernameData.length < 4) {
    return {
      validation_error: "The length of the Username must be greater than 4 ",
    };
  }
  if (hasWhiteSpace(usernameData)) {
    return {
      validation_error: "Username must not contain space character",
    };
  }
  if (onlyLettersAndNumbers(usernameData) == false) {
    return {
      validation_error: "Username must be Alphanumeric",
    };
  }
  if (checkPassword(passwordData) == false) {
    return {
      validation_error:
        "Password must have at least one uppercase character, one number and  one special character.",
    };
  }
  if (hasWhiteSpace(passwordData)) {
    return {
      validation_error: "Password must not contain space character",
    };
  }
  if (passwordData.length < 6) {
    return {
      validation_error: "The length of the Password must be greater than 6 ",
    };
  }
  if (ValidateEmail(emailData) == false) {
    return {
      validation_error: "You have entered an invalid email address! ",
    };
  }

  if (ValidatePhonenumber(phonenumberData) == false) {
    return {
      validation_error: "You have entered an invalid phoone number! ",
    };
  }

  //check phone number

  //verify user does not exist in db
  doesUserExist = await getUserByUsername(usernameData);

  doesPhoneExist = await getUserByPhone(phonenumberData);
  doesEmailExist = await getUserByEmail(emailData);

  if (doesPhoneExist != null) {
    return {
      validation_error:
        "Please provide another Phone number, the given phone number  address already exits! ",
    };
  }

  if (doesEmailExist != null) {
    return {
      validation_error:
        "Please provide another email address, the given email address already exits! ",
    };
  }

  if (doesUserExist == null) {
    //user does not exist, therefore save record
    let new_user;
    new_user = {
      firstnameData: firstnameData,
      lastnameData: lastnameData,
      usernameData: usernameData,
      emailData: emailData,
      dobData: dobData,
      genderData: genderData,
      streetaddressData: streetaddressData,
      cityData: cityData,
      zipcodeData: zipcodeData,
      country: country,
      phonenumberData: phonenumberData,
      passwordData: bcrypt.hashSync(passwordData, salt),
    };
    console.log("new_user", new_user);

    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(new_user);
    if (!insertInfo.insertedId) throw "Could not add user";

    const inserted_user = await getUserById(insertInfo.insertedId);
    console.log("inserted_user", inserted_user);
    return { inserted_user: true };
  } else {
    return { user_exists: true };
  }

  return { error: true };
};

const checkUser = async (username, password) => {
  //if user finds in db, return true
  username = username.toLowerCase();

  if (username.length < 4) {
    return {
      validation_error: "The length of the Username must be greater than 4 ",
    };
  }
  if (hasWhiteSpace(username)) {
    return {
      validation_error: "Username must not contain space character",
    };
  }
  if (hasWhiteSpace(password)) {
    return {
      validation_error: "Password must not contain space character",
    };
  }
  if (password.length < 6) {
    return {
      validation_error: "The length of the Password must be greater than 6 ",
    };
  }

  var userCheck = await getUserByUsername(username);
  if (userCheck == null) {
    return {
      validation_error: "Either the username or password is invalid",
    };
  } else {
    //verify password
    var pwdValid = bcrypt.compareSync(password, userCheck.passwordData); // true
    if (pwdValid == true) {
      //login success
      return { authenticatedUser: true, data: userCheck };
    } else {
      //invalid password
      return {
        validation_error: "Either the username or password is invalid",
      };
    }
  }
};

const checkEmail = async (email) => {
  var emailCheck = await getUserByEmail(email);
  if (emailCheck == null) {
    return {
      validation_error: "Email Id already exits, try with another email",
    };
  }
};
const checkPhone = async (phone) => {
  var phoneCheck = await getUserByPhone(phone);
  console.log("checkPhone", checkPhone);
  if (phoneCheck == null) {
    return {
      validation_error:
        "Phone Number already exits, try with another phone number",
    };
  }
};

//email adrees check from db
const getUserByEmail = async (email) => {
  const userCollection = await users();
  const userEmail = await userCollection.findOne({ emailData: email });
  console.log("getUserByEmail", userEmail);

  return userEmail;
};

//phonenumber  check from db
const getUserByPhone = async (phone) => {
  const userCollection = await users();
  const userPhone = await userCollection.findOne({ phonenumberData: phone });
  console.log("getUserByPhone", userPhone);

  return userPhone;
};

const getUserByUsername = async (username) => {
  console.log("searching for " + username);
  const userCollection = await users();
  const user = await userCollection.findOne({ usernameData: username });
  console.log("getUserByUsername", user);

  return user;
};

const getUserById = async (id) => {
  const userCollection = await users();
  const userr_id = await userCollection.findOne({ _id: ObjectId(id) });
  return userr_id;
};

const updateRecord = async (
  id,
  firstnameData,
  lastnameData,
  dobData,
  genderData,
  streetaddressData,
  cityData,
  zipcodeData,
  country
) => {
  if (firstnameData.length <= 0) {
    return {
      validation_error: "The length of the first must be greater than 0! ",
    };
  }
  if (lastnameData.length < 4) {
    return {
      validation_error: "The length of the lastname must be greater than 0!",
    };
  }
  // //verify user does not exist in db
  // doesUserExist = await getUserByUsername(usernameData);

  // if (doesUserExist == null) {
  //user does not exist, therefore save record
  let updateUser;
  updateUser = {
    firstnameData: firstnameData,
    lastnameData: lastnameData,
    dobData: dobData,
    genderData: genderData,
    streetaddressData: streetaddressData,
    cityData: cityData,
    zipcodeData: zipcodeData,
    country: country,
  };
  console.log("update_user", updateUser);

  // console.log("_id", _id);
  console.log("id", id);

  const userCollection = await users();

  // { _id: ObjectId(id) },
  // { _id: id },
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updateUser }
  );

  if (updatedInfo.modifiedCount === 0) {
    // throw "could not update user successfully";
    return {
      validation_error: "could not update user successfully",
    };
  }

  var userCheck = await getUserById(id);
  //login success
  return { updatedInfo: true, data: userCheck };

  // return { error: true };

  // updateEnrolledId
};

const updateEnrolledId = async (user_id, enroll_id) => {
  let enrolledCourse = [];

  // console.log("enrolledCourse", enrolledCourse);

  // console.log("_id", _id);
  console.log("user_id", user_id);

  // let courseList = await coursess.getCourseById(enroll_id);

  const userCollection = await users();

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(user_id) },
    { $push: { enrolledCourse: enroll_id } }
  );

  if (updatedInfo.modifiedCount === 0) {
    // throw "could not update user successfully";
    return {
      validation_error: "failed to enroll the course ",
    };
  }

  var userCheck = await getUserById(user_id);
  //login success
  return { updatedInfo: true, data: userCheck };

  // return { error: true };

  // updateEnrolledId
};

//get all user data
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "No users in system!";

  //var userCheck = await getUserByUsername();

  // return { courseCollection: true, data: courseList };
  return userList;
};

const unenroll_course = async (userId, courseId) => {
  // let enrolledCourse = [];

  // console.log("user_id", enrolled_courses_hee);

  const userCollection = await users();

  let { _id, enrolledCourse } = await getUserByUsername(userId);

  console.log("USERRRRRR---------", enrolledCourse);

  // if (enrolledCourse && enrolledCourse.length === 0) {
  //   return {
  //     validation_error: "Course not found in enrolled courses",
  //   };
  // }

  // if(enrolledCourse && !enrolledCourse?.includes(courseId)){
  //   return {
  //     validation_error: "Course not found in enrolled courses",
  //   };
  // }

  enrolledCourse = enrolledCourse?.filter((course) => course !== courseId);

  console.log("USERRRRRR---------2");

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(_id) },
    { $set: { enrolledCourse: enrolledCourse } }
  );

  if (updatedInfo.modifiedCount === 0) {
    return {
      validation_error: "failed to remove the course ",
    };
  }

  var userCheck = await getUserByUsername(userId);
  //login success
  return { updatedInfo: true, data: userCheck };
};

module.exports = {
  createUser,
  checkUser,
  updateRecord,
  updateEnrolledId,
  getAllUsers,
  getUserByUsername,
  unenroll_course,
};

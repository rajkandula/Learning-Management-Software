const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const { ObjectId } = require("mongodb");

const createCourse = async (
  instructorId,
  courseTitle,
  courseId,
  courseDescription,
  courseResourse
) => {
  if (courseTitle.length <= 3) {
    return {
      validation_error: "Please provide name and name of the length must be >3",
    };
  }
  if (courseId.length <= 0) {
    return {
      validation_error: "Please select your country ",
    };
  }
  if (courseDescription.length <= 6) {
    return {
      validation_error:
        "Please write a message and message length must be >6 character length",
    };
  }

  courseId = courseId.toLowerCase();
  doesCourseIdExist = await getUserByCourseId(courseId);
  if (doesCourseIdExist == null) {
    let courses_creation;
    courses_creation = {
      instructorId: instructorId,
      courseTitle: courseTitle,
      courseId: courseId,
      courseDescription: courseDescription,
      courseResourse: courseResourse,
    };

    console.log("courses_creation", courses_creation);

    const userCollection = await courses();
    const insertInfo = await userCollection.insertOne(courses_creation);
    if (!insertInfo.insertedId)
      return {
        validation_error: "Could not send courses",
      };

    const inserted_user = await getUserById(insertInfo.insertedId);
    console.log("inserted_user", inserted_user);

    return { inserted_user: true };
  } else {
    return { user_exists: true };
  }

  return { error: true };
};
const getUserById = async (id) => {
  const userCollection = await courses();
  const feedack_id = await userCollection.findOne({ _id: ObjectId(id) });
  return feedack_id;
};

const getUserByCourseId = async (courseid) => {
  console.log("searching for " + courseid);
  const userCollection = await courses();
  const course_id = await userCollection.findOne({ courseId: courseid });
  console.log("getUserByUsername", course_id);

  return course_id;
};

const getCourseByInstructorId = async (instructorId) => {
  console.log("searching for " + instructorId);
  const userCollection = await courses();
  const courses_list = await userCollection.find({
    instructorId: "639b803ae5848f8d9a43cd01",
  });
  console.log("getCourseByInstructorId", instructorId);

  return courses_list;
};

const checkCourse = async (courseid) => {
  //if user finds in db, return true
  const courses = await courses();
  const CourseList = await courses.find({}).toArray();
  //var courseCheck = await getUserByCourseId(courseid);
  return CourseList;
};
//get courses by id
const getCourseById = async (id) => {
  // id = validation.checkId(id);
  const userCollection = await courses();
  const userCourse = await userCollection.findOne({ _id: ObjectId(id) });
  if (!userCourse) throw "Error: course not found";
  return userCourse;
};

const getAllCourses = async () => {
  const courseCollection = await courses();
  const courseList = await courseCollection.find({}).toArray();
  if (!courseList) throw "No users in system!";
  return courseList;
};
//

//get courses by id
const getCoursesByIdList = async (idList) => {
  // id = validation.checkId(id);
  const userCollection = await courses();
  idObject = [];
  idList.forEach((element) => {
    idObject.push(ObjectId(element));
  });

  const userCourse = await userCollection
    .find({ _id: { $in: idObject } })
    .toArray();

  if (!userCourse) throw "Error: course not found";
  return userCourse;
};

//
const removeCourseList = async (id) => {
  const courseCollection = await courses();
  // const deletionInfo = await courseCollection.removeOne({ _id: id });
  const deletionInfo = await courseCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete course with id of ${id}`;
  }
  return true;

  // return { error: true };
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseByInstructorId,
  getCourseById,
  getCoursesByIdList,
  removeCourseList,
};

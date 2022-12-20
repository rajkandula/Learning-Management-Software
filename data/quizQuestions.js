const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const coursess = require("../data/courses");
const instructor = require("../data/instructor");
const feedback = require("../data/feedback");
const users = require("../data/users");
const quizQuestions = mongoCollections.quizQuestions;

// const quizQuestions = mongoCollections.quizQuestions;
const validation = require("../helpers");

const addQuestion = async (courseId, question, a, b, c, d, correctAnswer) => {
  //check phone number

  if (!courseId) {
    throw "Error: Course Id not provided";
  }

  courseId = courseId.trim();

  a = validation.checkOption(a);
  b = validation.checkOption(b);
  c = validation.checkOption(c);
  d = validation.checkOption(d);
  correctAnswer = validation.checkOption(correctAnswer);

  const quizQuestionsCollection = await quizQuestions();

  let questionObj = {
    question: question,
    a: a,
    b: b,
    c: c,
    d: d,
    correctAnswer: correctAnswer,
  };

  let currentCourse = await quizQuestionsCollection.findOne({
    courseId: courseId,
  });

  if (!currentCourse) {
    let questionArr = [questionObj];
    let newQuestion = {
      courseId: courseId,
      quizQuestions: questionArr,
    };

    const newInsert = await quizQuestionsCollection.insertOne(newQuestion);
  } else {
    let currentCourseQuiz = currentCourse["quizQuestions"];
    currentCourseQuiz.push(questionObj);

    let newupdateQuiz = {
      quizQuestions: currentCourseQuiz,
    };
    // const updateInfo = await quizQuestionsCollection.updateOne(

    const userCollection = await quizQuestions();
    const insertInfo = await userCollection.insertOne(newupdateQuiz);
    if (!insertInfo.insertedId) throw "Could not add user";

    const inserted_user = await getUserById(insertInfo.insertedId);
    console.log("inserted_user", inserted_user);
    return { inserted_user: true };

    // } else {
    //   return { user_exists: true };
    // }

    return { error: true };
    // );
    // if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    //   throw "Update failed";
  }
  return true;
};

async function getQuiz(courseId) {
  if (!courseId) {
    throw "Error: Course Id not provided";
  }
  const quizQuestionsCollection = await quizQuestions();
  const courseQuiz = await quizQuestionsCollection.findOne({
    courseId: courseId,
  });
  if (!courseQuiz) throw "Quiz for this course not found";
  return courseQuiz;
}

const getUserById = async (id) => {
  const userCollection = await quizQuestions();
  const userr_id = await userCollection.findOne({ _id: ObjectId(id) });
  return userr_id;
};

module.exports = {
  addQuestion: addQuestion,
  getQuiz: getQuiz,
};

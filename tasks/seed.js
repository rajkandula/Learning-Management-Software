const dbConnection = require("../config/mongoConnection");
const data = require("../data/");

const users = data.users;
const instructor = data.instructor;
const feedback = data.feedback;
const courses = data.courses;

async function main() {
  const db = await dbConnection();

  await db.dropDatabase();

  // const patrick = await users.addUser("Patrick", "Hill");

  //Create a User by sending u and p.
  console.log("Registering on student side:");
  const student_user = await users.createUser(
    "Patrick",
    "Hill",
    "Patrick123",
    "patrick123@gmail.com",
    "1997-12-24",
    "Male",
    "63 Franklin St, Apt 1",
    "Jersey",
    "07307",
    "US",
    "5512560939",
    "Patrick@123"
  );

  const userId = student_user._id;
  const username = "Patrick123";
  const password = "Patrick@123";

  console.log(
    "Hello, class!",
    "Today we are creating online course website! (user side)",
    userId,
    "sample username and password",
    username,
    password
  );

  console.log("Registering on Instructor side:");
  const instructor_user = await instructor.createUser(
    "Patrick",
    "Hill",
    "IPatrick1234",
    "patrick1234@gmail.com",
    "1997-12-24",
    "Male",
    "63 Franklin St, Apt 1",
    "Jersey",
    "07307",
    "US",
    "5512560937",
    "Patrick@1234"
  );
  const instructorId = instructor_user._id;
  const username1 = "IPatrick1234";
  const password1 = "Patrick@123";

  console.log(
    "Hello, class!",
    "Today we are creating online course website! (instructor side) instructorId:",
    instructorId,
    "sample username and password",
    username1,
    password1
  );

  const createCourse1 = await courses.createCourse(
    instructorId,
    "NODE JS",
    "NODEJS123",
    "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.",
    [
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
    ]
  );
  await courses.createCourse(
    instructorId,
    "NODE JS",
    "NODEJS123",
    "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.",
    [
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
    ]
  );

  await courses.createCourse(
    instructorId,
    "NODE JS",
    "NODEJS123",
    "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.",
    [
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
    ]
  );

  const createCourse4 = await courses.createCourse(
    instructorId,
    "NODE JS",
    "NODEJS123",
    "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.",
    [
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
    ]
  );

  const createCourse5 = await courses.createCourse(
    instructorId,
    "NODE JS",
    "NODEJS123",
    "As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.",
    [
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
      "https://nodejs.org/en/about/",
    ]
  );

  console.log("Done seeding database");
  await db.serverConfig.close();
}

main().catch((error) => {
  console.error(error);
  return dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});

const mongoCollections = require("../config/mongoCollections");
const feedback = mongoCollections.feedback;
const { ObjectId } = require("mongodb");

const sendFeedback = async (feedBackId="", fullname="", country="", message="") => {
  if (fullname?.length <= 3) {
    return {
      validation_error: "Please provide name and name of the length must be >3",
    };
  }
  if (country.length <= 0) {
    return {
      validation_error: "Please select your country ",
    };
  }
  if (message.length <= 6) {
    return {
      validation_error:
        "Please write a message and message length must be >6 character length",
    };
  }

  //
  let feedback_msg;
  feedback_msg = {
    feedBackId: feedBackId,
    fullname: fullname,
    country: country,
    message: message,
  };
  console.log("feedback_msg", feedback_msg);

  const userCollection = await feedback();
  const insertInfo = await userCollection.insertOne(feedback_msg);
  if (!insertInfo.insertedId)
    return {
      validation_error: "Could not send feedback",
    };

  const inserted_user = await getUserById(insertInfo.insertedId);
  console.log("inserted_user", inserted_user);
  // return {
  //   validation_error: "Thank you for your valuable feedback",
  // };
  return { inserted_feedback: true };

  //   return { user_exists: true };

  //   return { error: true };
  // return { user_exists: true };
};
const getUserById = async (id) => {
  const userCollection = await feedback();
  const feedack_id = await userCollection.findOne({ _id: ObjectId(id) });
  return feedack_id;
};
module.exports = { sendFeedback };

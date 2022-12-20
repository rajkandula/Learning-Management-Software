function checkOption(option) {
  if (!option) {
    throw "Error: No option provided";
  }
  if (typeof option !== "string") {
    throw "Error: The input to the option should be a string";
  }
  option = option.trim();
  if (option.length === 0) {
    throw "Error: Option field cannot be empty";
  }

  return option;
}

function checkQuestion(question) {
  if (!question) {
    throw "Error: No Question provided";
  }
  if (typeof question !== "string") {
    throw "Error: The input to the Question should be a string";
  }
  question = question.trim();
  if (question.length === 0) {
    throw "Error: Question field cannot be empty";
  }

  if (question.length < 5) {
    throw "Error: The question should have atleast 5 characters!";
  }

  return question;
}

module.exports = {
  checkOption: checkOption,
  checkQuestion: checkQuestion,
};

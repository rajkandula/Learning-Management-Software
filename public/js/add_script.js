var getCourseInputField = document.getElementById("courseInputFields");
var add_more_fields = document.getElementById("add_more_fields");

var remove_fields = document.getElementById("remove_fields");

add_more_fields.onclick = function () {
  var newField = document.createElement("input");
  newField.setAttribute("type", "text");
  newField.setAttribute("name", "courseInput");
  newField.setAttribute("id", "courseInput");
  newField.setAttribute("class", "courseInputFields");
  newField.setAttribute("size", 100);
  newField.setAttribute("placeholder", "Add Resourses link");

  // var newField2 = document.createElement("input");
  // newField2.setAttribute("type", "text");
  // newField2.setAttribute("name", "courseInput");
  // newField2.setAttribute("id", "courseInput");
  // newField2.setAttribute("class", "courseInputFields");
  // newField2.setAttribute("size", 100);
  // newField2.setAttribute("placeholder", "Add Resourses description");

  // var newField3 = document.createElement("input");
  // newField3.setAttribute("type", "text");
  // newField3.setAttribute("name", "courseInput");
  // newField3.setAttribute("id", "courseInputs");
  // newField3.setAttribute("class", "courseInputFields");
  // newField3.setAttribute("size", 100);
  // newField3.setAttribute("placeholder", "Add Resourses link");

  getCourseInputField.appendChild(newField);
  // getCourseInputField.appendChild(newField2);
  // getCourseInputField.appendChild(newField3);
};

remove_fields.onclick = function () {
  var input_tags = getCourseInputField.getElementsByTagName("input");
  if (input_tags.length > 3) {
    getCourseInputField.removeChild(input_tags[input_tags.length - 1]);
  }
};

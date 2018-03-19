'use strict'

function check() {
  const scheduleName = document.getElementById('scheduleName').value.trim();
  const candidateName = document.getElementById('candidates').value.trim();
  const submit_button = document.getElementById('submit-button');
  let validate_text = "";
  if (scheduleName && candidateName) {
    submit_button.disabled = "";
  }
  else {
    submit_button.disabled = "disabled";

    validate_text += "<ul>"
    if (!scheduleName) {
      validate_text += "<li>予定名を入力してください</li>"
    }
    if (!candidateName) {
      validate_text += "<li>候補日を１つ以上入力してください</li>"
    }
    validate_text += "</ul>"
  }
  document.getElementById('validate-text').innerHTML = validate_text;
}
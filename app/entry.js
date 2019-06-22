'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';

$('.availability-toggle-button').each((i, e) => {
  const button = $(e);
  button.click(() => {
    const scheduleId = button.data('schedule-id');
    const userId = button.data('user-id');
    const candidateId = button.data('candidate-id');
    const availability = parseInt(button.data('availability'));
    const nextAvailability = (availability + 1) % 3;
    $.post(`/schedules/${scheduleId}/users/${userId}/candidates/${candidateId}`,
      { availability: nextAvailability },
      (data) => {
        button.data('availability', data.availability);
        const availabilityLabels = ['欠', '？', '出'];
        button.text(availabilityLabels[data.availability]);

        const buttonStyles = ['btn-danger', 'btn-secondary', 'btn-success'];
        button.removeClass('btn-danger btn-secondary btn-success');
        button.addClass(buttonStyles[data.availability]);
      });
  });
});

const buttonSelfComment = $('#self-comment-button');
buttonSelfComment.click(() => {
  const scheduleId = buttonSelfComment.data('schedule-id');
  const userId = buttonSelfComment.data('user-id');
  const comment = prompt('コメントを255文字以内で入力してください。');
  if (comment) {
    $.post(`/schedules/${scheduleId}/users/${userId}/comments`,
      { comment: comment },
      (data) => {
        $('#self-comment').text(data.comment);
      });
  }
});

let btnFlag = false;
let dateFlag = false;
function candAddListener(candidate) {
  candidate.addEventListener('input', function() {
    if (candidate.value.match(/\d{4}-\d{2}-\d{2}/g)) {
      dateFlag = true;
    } else {
      dateFlag = false;
    }
    if (btnFlag && dateFlag) {
      makeSchedBtn.disabled = false;
    } else {
      makeSchedBtn.disabled = true;
    }
  }, false);
}

function initInputDate() {
  let candidates = document.getElementsByName('candidates');
  candAddListener(candidates[0]);
}

function createAddCandBtn(pathName) {
  let candidates = document.getElementsByName('candidates');
  const addCandBtn = document.getElementById('addCandBtn');
  addCandBtn.addEventListener('click', function() {
    let parent = addCandBtn.parentNode;
    candidates = document.getElementsByName('candidates');
    let pathName = location.pathname;
    let maxNum = 3; // 候補日程の最大数
    if (candidates.length < maxNum + 1) { 
      let input = document.createElement('input');
      input.setAttribute('name', 'candidates');
      input.setAttribute('type', 'date');
      input.classList.add('form-control');
      input.classList.add('mt-1');
      if (pathName === 'new') {
        candAddListener(input);
      }
      parent.insertBefore(input, addCandBtn);
      if (candidates.length === maxNum) { 
        addCandBtn.disabled = true; 
      }
    }
  }, false);
}

let pathName = location.pathname;
if (pathName.match(/new$/)) {
  createAddCandBtn('new');

  const schedNameTextBox = document.getElementById('scheduleName');
  const makeSchedBtn = document.getElementById('makeSchedBtn');
  schedNameTextBox.addEventListener('input', function() {
    if (schedNameTextBox.value.match(/[^\s]+/g)) {
      btnFlag = true;
    } else {
      btnFlag = false;
    }
    if (btnFlag && dateFlag) {
      makeSchedBtn.disabled = false;
    } else {
      makeSchedBtn.disabled = true;
    }
  }, false);

  initInputDate();

} else if (pathName.match(/edit$/)) {
  createAddCandBtn('edit');

  const schedNameTextBox = document.getElementById('scheduleName');
  const editSchedBtn = document.getElementById('editSchedBtn');
  schedNameTextBox.addEventListener('input', function() {
    if (schedNameTextBox.value.match(/[^\s]+/g)) {
      editSchedBtn.disabled = false;
    } else {
      editSchedBtn.disabled = true;
    }
  }, false);

  initInputDate();
}


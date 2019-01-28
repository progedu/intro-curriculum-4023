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
  const buttonDeleteComment = `<button class="btn-xs btn-danger" data-schedule-id="${scheduleId}" data-user-id="${userId}" id="delete-self-comment-button">削除</button>`;
  if (comment) {
    $.post(`/schedules/${scheduleId}/users/${userId}/comments`,
      { comment: comment },
      (data) => {
        $('#self-comment').text(data.comment);
        $('#self-comment-button').after(buttonDeleteComment);
        $("#delete-self-comment-button").click(() => {
          deleteComment(scheduleId, userId);
        });
      });
  }
});

const buttonDeleteComment = $('#delete-self-comment-button');
buttonDeleteComment.click(() => {
  const scheduleId = buttonDeleteComment.data('schedule-id');
  const userId = buttonSelfComment.data('user-id');
  deleteComment(scheduleId, userId);
});

function deleteComment(scheduleId, userId) {
  if (confirm('コメントを消去してもよろしいですか？')) {
    $.post(`/schedules/${scheduleId}/users/${userId}/comments?delete=1`,
    { comment: "" },
    (data) => {
      $('#self-comment').text(data.comment);
      $('#delete-self-comment-button').remove();
    });
  }
}
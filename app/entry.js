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
  const csrfToken = $('input[name="_csrf"]');
  if (comment) {
    $.post(`/schedules/${scheduleId}/users/${userId}/comments`,
      { comment: comment, _csrf: csrfToken.val() },
      ).done((data) => {
        deleteOldAlert();
        $('#self-comment').text(data.comment);
        csrfToken.val(data.csrfToken);
        alertMessage('コメントを更新しました');
      }).fail((err) => {
        alert('コメントの更新に失敗しました。\nページを更新してからもう一度お試し下さい。')
      });
  }
});

const copyURLButton = $('#copyURLButton');
copyURLButton.click(() => {
  deleteOldAlert();
  const shareURL = $('#shareURL');
  shareURL.select();
  document.execCommand('copy');
  getSelection().empty();
	shareURL.blur();
  alertMessage('コピーしました');
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function alertMessage(message) {
  var success = $(`<div class="text-center alert alert-success alert-dismissible fade show" role="alert">${message}</div>`).css({'position':'absolute', 'width': '100%','left':'0', 'z-index': '1'}).prependTo('nav').fadeOut(3000, () => success.remove());
}

function deleteOldAlert() {
  $('.alert').remove();
}
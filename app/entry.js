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

        // 出欠ボタンを押すごとに集計結果を更新する
        button.parent().parent().find('td').each((i, f) => {
          let availabilitesNum = $(f);
          let beforedata = data.availability - 1;
          if (beforedata === -1) {
            beforedata = 0;
          } else if (beforedata === 0) {
            beforedata = 2;
          }

          let afterdata = data.availability;
          if (data.availability === 0) {
            afterdata = 2;
          } else if (data.availability === 2) {
            afterdata = 0;
          }

          if (i === afterdata) {
            availabilitesNum.text(Number(availabilitesNum.text()) + 1);
          } else if (i === beforedata) {
            availabilitesNum.text(Number(availabilitesNum.text()) - 1);
          }
        }); 
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

'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/i18n/datepicker-ja';
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

        const buttonStyles = ['btn-danger', 'btn-default', 'btn-success'];
        button.removeClass('btn-danger btn-default btn-success');
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

$(function () {
  $('#datepicker').datepicker({
    dateFormat: 'mm/dd(D)',
    onSelect: (date) => {
      const candidate = $('#candidates').val();
      const datetime = date + ' 19:00〜';
      if (candidate === "") {
        $('#candidates').val(datetime);
      } else {
        jQuery('#candidates').val(candidate + '\n' + datetime);
      }
    }
  });
});
'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import bootstrapDatepicker from 'bootstrap-datepicker';

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

// 予定の削除時に確認
const deleteSchedule = $('#delete-schedule-form');
deleteSchedule.submit(() => {
  if (window.confirm('本当に削除しますか？')) {
    return true;
  } else {
    return false;
  }
});

// bootstrap-datepicker
$.fn.datepicker.dates['ja'] = {
  days: ["日曜日", "月曜日", "日曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  daysShort: ["日", "月", "日", "水", "木", "金", "土"],
  daysMin: ["日", "月", "日", "水", "木", "金", "土"],
  months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
};

const datesDisabledList = $('li.list-group-item').toArray().map((l) => l.innerText);

$('#candidates').datepicker({
  format: "yyyy/mm/dd",
  startDate: "new Date()",
  language: "ja",
  multidate: true,
  multidateSeparator: ", ",
  datesDisabled: datesDisabledList
});
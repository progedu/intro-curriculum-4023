'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
require('popper.js');
import bootstrap from 'bootstrap';
require('bootstrap-confirmation2');
$('[data-toggle=confirmation]').confirmation({
  rootSelector: '[data-toggle=confirmation]',
  // other options
});

//validation.js
window.addEventListener('load', function() {
  // カスタムブートストラップ検証スタイルを適用するすべてのフォームを取得
  var forms = document.getElementsByClassName('needs-validation');
  // ループして帰順を防ぐ
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);

$('.availability-toggle-button').each((i, e) => {
  const button = $(e);
  button.click(() => {
    const scheduleId = button.data('schedule-id');
    const userId = button.data('user-id');
    const userProvider = button.data('user-provider');
    const candidateId = button.data('candidate-id');
    const availability = parseInt(button.data('availability'));
    const nextAvailability = (availability + 1) % 3;
    $.post(`/schedules/${scheduleId}/users/${userId}/${userProvider}/candidates/${candidateId}`,
      { availability: nextAvailability },
      (data) => {
        button.data('availability', data.availability);
        const availabilityLabels = ['欠', '？', '出'];
        button.text(availabilityLabels[data.availability]);

// 出席率を表示し、80％以上なら背景色をブルーに変更
const attendanceArea = button.parent().parent().find('.attendanceRate');
attendanceArea.text(data.attendanceRate + '%');
attendanceArea.removeClass('bg-info');
if (data.attendanceRate >= 80) {
  attendanceArea.addClass('bg-info');
}

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
  const userProvider = buttonSelfComment.data('user-provider');
  const comment = prompt('コメントを255文字以内で入力してください。');
  if (comment) {
    $.post(`/schedules/${scheduleId}/users/${userId}/${userProvider}/comments`,
      { comment: comment },
      (data) => {
        $('#self-comment').text(data.comment);
      });
  }
});
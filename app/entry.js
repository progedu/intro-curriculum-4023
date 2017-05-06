'use strict';
const $ = require('jquery');
const global = Function('return this;')();
global.jQuery = $;
const bootstrap = require('bootstrap');

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

        const tdAvailabilityClasses = ['bg-danger', 'bg-default', 'bg-success'];
        button.parent().removeClass('bg-danger bg-default bg-success');
        button.parent().addClass(tdAvailabilityClasses[data.availability]);
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

// 予定名が空のデータが作成されないようにする（予定名が空だとクリックできない）
// jQuery の特殊な書き方を勉強しつつ作成
const scheduleRecordForm = $('.schedule-record');  // 予定の作成・編集するフォームの class 名
scheduleRecordForm.submit(() => {          // 送信イベントを操作する
  const inputNode = $('#scheduleName');  // 予定名の欄（ input タグ）
  // 予定名が空欄の場合、警告文を表示して送信を中止する
  if (inputNode.val() === '')  {
    if (!$('label[for="scheduleName"]').children('b').text())  // 既に警告文が表示されているかどうか
      // label 要素内に b 要素の警告文を追加
      $('label[for="scheduleName"]').append('<b style="color:red"> ※予定名は必須です</b>');
    inputNode.focus();  // フォーカスする
    return false;  // 送信中止
  }
  // 送信成功
  // ....
});

// Flatpickr でカレンダーを表示される部分
Flatpickr.localize(Flatpickr.l10ns.ja);  // カレンダーの月名が日本語になる
const candidateDays = $('.list-group-item');
// 一度登録した日付を編集時に再選択できないようにする
const candidateArr = [];  // 登録した日付を入れる配列
for (var i = 0; i < candidateDays.length; i++)
  candidateArr.push(candidateDays[i].innerText);
flatpickr('#candidates', {
  mode: 'multiple',
  minDate: 'today',
  defaultDate: candidateArr,
  dateFormat: 'Y年m月d日 (D)' });
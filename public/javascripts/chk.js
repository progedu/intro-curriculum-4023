'use strict';

function chk(scheduleName){
  if(scheduleName){
    return true;
  } else {
    alert("予定名を入力してください");
    return false;
  }
}
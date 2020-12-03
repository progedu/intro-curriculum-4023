'use strict';
const btn = document.getElementById("copyButton")

btn.addEventListener("click",function() {
  const ta = document.createElement("textarea");
  ta.value = btn.value;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.parentElement.removeChild(ta);
});
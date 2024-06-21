import '../scss/_modalwindow.scss';
import { deleteString } from '../main';

const table = document.querySelector('.table');
const modal = document.querySelector('.modal-background');
const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
let stringId;

table.addEventListener('click', function (e) {
  let targetElement = e.target;
  stringId = targetElement.id;
  targetElement.tagName === 'IMG' && (modal.style.display = 'flex');
});

noButton.addEventListener('click', function () {
  modal.style.display = 'none';
});
yesButton.addEventListener('click', function () {
  modal.style.display = 'none';
  deleteString(stringId);
});

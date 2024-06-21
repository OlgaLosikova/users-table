import { searchUsers } from '../main';

const searchInput = document.querySelector('.search');
const cleanButton = document.querySelector('.clean-button');

searchInput.addEventListener('input', function () {
  if (searchInput.value !== '' && searchInput.value.length > 2) {
    searchUsers(searchInput.value);
    document.querySelector('.clean-button').style.display = 'flex';
  } else if (searchInput.value === '') {
    searchClean();
  }
});

export function searchClean() {
  searchInput.value !== 0 && (searchInput.value = '');
  searchUsers('');
  document.querySelector('.clean-button').style.display = 'none';
}
cleanButton.addEventListener('click', searchClean);

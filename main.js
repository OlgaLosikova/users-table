'use strict';
const resultTable = document.querySelector('.table');
const modal = document.querySelector('.modal-background');
const footer = document.querySelector('.footer');
const baseUrl = 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users';
//Кнопки, номер страницы и индекс массива для работы пагинации
let itemIndex = 0;
let pageIndex = 1;
const pageNumber = document.querySelector('.page-number');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

//Шапку таблицы добавляем первым элементом таблицы всякий раз при рендеринге
const tableHeader = document.getElementById('tableHeader').innerHTML;

//Индекс удаляемого элемента
let stringId;

//Поле поиска, кнопка очистки фильтрации
const searchInput = document.querySelector('.search');
const cleanButton = document.querySelector('.clean-button');

const fetchUsers = async () => {
  try {
    const response = await fetch(baseUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    resultTable.innerHTML = `<span class="error">${err.message}</span>`;
  }
};

const main = async () => {
  const users = await fetchUsers();

  const renderingUsers = () => {
    const usersPage = users
      .filter((user) => {
        if (user.id !== stringId) {
          return true;
        }
        return false;
      })
      .filter((user) => {
        if (
          user.username.toLowerCase().includes(searchInput.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchInput.value.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .slice(itemIndex, itemIndex + 5);
    console.log('usersPage', usersPage);
    //usersPage.length >= 5 ? (footer.style.display = 'flex') : (footer.style.display = 'none');

    resultTable.innerHTML = tableHeader;
    usersPage.forEach((item) => {
      const tableRow = document.createElement('div');
      tableRow.classList.add('table_row');
      tableRow.innerHTML = `<div class="table_data table_data__blue">${item.username}</div>
        <div class="table_data">${item.email}</div>
        <div class="table_data">
          ${
            new Date(item.registration_date).getDate() < 10
              ? `0${new Date(item.registration_date).getDate()}`
              : new Date(item.registration_date).getDate()
          }
          .${
            new Date(item.registration_date).getMonth() + 1 < 10
              ? `0${new Date(item.registration_date).getMonth() + 1}`
              : new Date(item.registration_date).getMonth() + 1
          }
          .${new Date(item.registration_date).getFullYear()}
        </div>
        <div class="table_data">${item.rating}</div>
        <img
          id="${item.id}"
          class="table_delete-button"
          src="./assets/svg/cancel.svg"
          alt="delete"
        />`;
      resultTable.appendChild(tableRow);
    });
  };
  renderingUsers();

  //Пагинация
  nextButton.addEventListener('click', function () {
    itemIndex += 5;
    pageIndex++;
    pageNumber.innerText = pageIndex;
    prevButton.disabled = false;
    if (itemIndex === users.length - 5) {
      nextButton.disabled = true;
    }
    renderingUsers();
  });
  prevButton.addEventListener('click', function () {
    itemIndex -= 5;
    pageIndex--;
    pageNumber.innerText = pageIndex;
    nextButton.disabled = false;
    if (itemIndex === 0) {
      prevButton.disabled = true;
    }
    renderingUsers();
  });

  //Удаление строки из списка пользователей
  const deleteString = (e) => {
    let removeBtn = e.target;
    removeBtn.tagName === 'IMG' && (modal.style.display = 'flex');

    document.getElementById('noButton').addEventListener('click', function () {
      modal.style.display = 'none';
    });
    document.getElementById('yesButton').addEventListener('click', function () {
      modal.style.display = 'none';
      stringId = removeBtn.id;
      renderingUsers();
    });
  };
  resultTable.addEventListener('click', deleteString);

  //Поиск
  const searchClean = () => {
    searchInput.value !== 0 && (searchInput.value = '');
    renderingUsers();
    document.querySelector('.clean-button').style.display = 'none';
  };
  cleanButton.addEventListener('click', searchClean);
  const searchUsers = () => {
    if (searchInput.value !== '' && searchInput.value.length > 2) {
      renderingUsers();
      document.querySelector('.clean-button').style.display = 'flex';
    } else if (searchInput.value === '') {
      searchClean();
    }
  };
  searchInput.addEventListener('input', searchUsers);
};
main();

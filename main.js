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

//Поле поиска, кнопка очистки фильтрации, пустой массив поиска
const searchInput = document.querySelector('.search');
const cleanButton = document.querySelector('.clean-button');
let filterUsers = [];

//Кнопки Да и Нет в модальном окне
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

//Пустой массив сортировки, кнопки сортировки, переменная направления сортировки
let sortUsers = [];
const sortDateButton = document.querySelector('.filters__black');
const sortRatingButton = document.querySelector('.filters__gray');
let dateDirection = 0;
let ratingDirection = 0;

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
    console.log('searchInput.value', searchInput.value);

    //При первой отрисовке записываем всех пришедших из api пользователей в массив, если есть запрос в поиске и/или удаленная строка, перезаписываем массив
    filterUsers = (filterUsers.length === 0 ? users : filterUsers)
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
      });
    console.log('filterUsers', filterUsers);
    if (dateDirection === 'DESC') {
      sortUsers = filterUsers.sort((a, b) => (a.registration_date < b.registration_date ? 1 : -1));
    } else if (dateDirection === 'ASC') {
      sortUsers = filterUsers.sort((a, b) => (a.registration_date > b.registration_date ? 1 : -1));
    } else sortUsers = filterUsers.sort((a, b) => (a.id > b.id ? 1 : -1));

    console.log('sortUsers', sortUsers);
    filterUsers.length >= 5 ? (footer.style.display = 'flex') : (footer.style.display = 'none');
    console.log('itemIndex', itemIndex);
    //Исходя из полученного на предыдущем шаге массива,записываем в массив отображаем первую страницу записей
    const usersPage = filterUsers.slice(
      itemIndex,
      filterUsers[itemIndex + 5] ? itemIndex + 5 : filterUsers.length,
    );
    console.log('usersPage', usersPage);

    resultTable.innerHTML = tableHeader;
    usersPage.length === 0
      ? (resultTable.innerHTML = `<span class="table_empty">Нет ни одной записи</span>`)
      : usersPage.forEach((item) => {
          const tableRow = document.createElement('div');
          tableRow.classList.add('table_row');
          tableRow.innerHTML = `<div class="table_data table_data__blue">${item.username}</div>
        <div class="table_data">${item.email}</div>
        <div class="table_data">
          ${
            new Date(item.registration_date).getDate() < 10
              ? `0${new Date(item.registration_date).getDate()}`
              : new Date(item.registration_date).getDate()
          }.${
            new Date(item.registration_date).getMonth() + 1 < 10
              ? `0${new Date(item.registration_date).getMonth() + 1}`
              : new Date(item.registration_date).getMonth() + 1
          }.${new Date(item.registration_date).getFullYear()}
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
    if (itemIndex >= filterUsers.length - 5) {
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
    if (itemIndex >= filterUsers.length - 5) {
      nextButton.disabled = true;
    }
    renderingUsers();
  });

  //Удаление строки из списка пользователей
  const deleteString = (e) => {
    let removeBtn = e.target;
    removeBtn.tagName === 'IMG' && (modal.style.display = 'flex');

    noButton.addEventListener('click', function () {
      modal.style.display = 'none';
    });
    yesButton.addEventListener('click', function () {
      modal.style.display = 'none';
      stringId = removeBtn.id;
      renderingUsers();
    });
  };
  resultTable.addEventListener('click', deleteString);

  //Поиск
  const searchClean = () => {
    searchInput.value !== 0 && (searchInput.value = '');
    filterUsers = [];
    dateDirection = 0;
    ratingDirection = 0;
    console.log(filterUsers);
    goToFirstPage();
    renderingUsers();
    cleanButton.style.display = 'none';
  };
  //При запуске поиска и сбросе запроса результаты начинаем отображать с первой страницы
  const goToFirstPage = () => {
    itemIndex = 0;
    pageIndex = 1;
    pageNumber.innerText = pageIndex;
    prevButton.disabled = true;
    nextButton.disabled = false;
  };
  cleanButton.addEventListener('click', searchClean);
  const searchUsers = () => {
    if (searchInput.value !== '' && searchInput.value.length > 2) {
      goToFirstPage();
      renderingUsers();
      cleanButton.style.display = 'flex';
    } else if (searchInput.value === '') {
      searchClean();
    }
  };
  searchInput.addEventListener('input', searchUsers);

  //Сортировка
  const sortDate = () => {
    dateDirection === 0
      ? (dateDirection = 'DESC')
      : dateDirection === 'DESC'
      ? (dateDirection = 'ASC')
      : dateDirection === 'ASC' && (dateDirection = 0);
    console.log('dateDirection', dateDirection);
    renderingUsers();
  };
  sortDateButton.addEventListener('click', sortDate);
};
main();

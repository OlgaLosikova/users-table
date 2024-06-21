export function pageNext(element) {
  let index = 0;
  const setIndex = (index) => {
    counter = index;
    console.log(counter);
  };
  element.addEventListener('click', () => setIndex(counter + 5));
  setCounter(0);
}

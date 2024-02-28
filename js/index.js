// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

// функция для получения цвета фрукта
const getFruitColor = (color) => {
  switch (color.toLowerCase()) {
    case "фиолетовый":
      return "#8b00ff";
    case "зеленый":
      return "#84cd1b";
    case "розово-красный":
      return "#dc143c";
    case "желтый":
      return "#ffd800";
    case "светло-коричневый":
      return "#cd853f";
    default:
      return "#000"; // цвет по умолчанию
  }
};

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruitsArray) => {
  fruitsList.innerHTML = ""; // очищаем fruitsList от вложенных элементов

  fruitsArray.forEach((fruit, index) => {
    const fruitItem = document.createElement("li");
    fruitItem.classList.add("fruit__item", `fruit_${fruit.color.toLowerCase()}`);

    // Добавляем стили через JavaScript
    fruitItem.style.border = `2px solid ${getFruitColor(fruit.color)}`;

    const fruitInfo = document.createElement("div");
    fruitInfo.classList.add("fruit__info");

    fruitInfo.innerHTML = `
      <div>index: ${index}</div>
      <div>kind: ${fruit.kind}</div>
      <div>color: ${fruit.color}</div>
      <div>weight (кг): ${fruit.weight}</div>
    `;

    fruitItem.appendChild(fruitInfo);
    fruitsList.appendChild(fruitItem);
  });
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits.splice(randomIndex, 1)[0]);
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  // Получаем значения из полей ввода
  const minWeight = parseFloat(document.querySelector('.minweight__input').value);
  const maxWeight = parseFloat(document.querySelector('.maxweight__input').value);

  fruits = fruits.filter((fruit) => fruit.weight >= minWeight && fruit.weight <= maxWeight);
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display(fruits);
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ["фиолетовый", "зеленый", "розово-красный", "желтый", "светло-коричневый"];

  const getColorPriority = (color) => {
    const index = priority.indexOf(color.toLowerCase());
    return index !== -1 ? index : Infinity;
  };

  const aPriority = getColorPriority(a.color);
  const bPriority = getColorPriority(b.color);

  return aPriority - bPriority;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap элементов
        }
      }
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
      const comparisonResult = comparation(arr[i], pivot);
      if (comparisonResult < 0) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    const sortedLeft = this.quickSort(left, comparation);
    const sortedRight = this.quickSort(right, comparation);

    return [...sortedLeft, pivot, ...sortedRight];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // Вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';

  // Выполнить сортировку и произвести замер времени
  const sort = sortAPI[sortKind];
  const sortedFruits = [...fruits]; // Создаем копию массива для сортировки, чтобы не изменять оригинальный
  sortAPI.startSort(sort, sortedFruits, comparationColor);

  // Обновить отображение и вывести в sortTimeLabel значение sortTime
  display(sortedFruits);
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  const newKind = kindInput.value;
  const newColor = colorInput.value;
  const newWeight = parseFloat(weightInput.value);


  const newFruit = { kind: newKind, color: newColor, weight: newWeight };
  fruits.push(newFruit);


  display(fruits);


  kindInput.value = '';
  colorInput.value = '';
  weightInput.value = '';

  colorInput.style.backgroundColor = newColor;
});

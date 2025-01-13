import { DATE_MONTHS_SHORT, UI_CLASS, UI_ICON_NAMES } from "./const.js";

/* ///////////////
    MISCELLANEOUS HELPER UTILITY FUNCTION
/////////////// */


// Convert single digit number to 2 digit
export function toTwoDigit(num) {
  return num > 0 && num < 9 ? ("0" + num).slice(-2) : num;
}

// Generate random integer between given number
// FISHER YATES SHUFFLE
export function getRandomInRange(min, max) {
  // Create an array [start,......,end]
  const allNumbers = [];
  for (let i = min; i <= max; i++) {
    allNumbers.push(i);
  }
  // Fisher-Yates Array shuffle
  let i = allNumbers.length;
  while (i !== 0) {
    let randomIndex = Math.floor(Math.random() * i);
    i--;
    // Swap current element with random index
    [allNumbers[i], allNumbers[randomIndex]] = [
      allNumbers[randomIndex],
      allNumbers[i],
    ];
  }

  // Return Random Array element
  return allNumbers[Math.floor(Math.random() * allNumbers.length)];
}

// If given ELEMENT is an ARRAY, return the first element.
export function getFirstIfArray(elems) {
  if (Array.isArray(elems) || elems instanceof NodeList) return elems[0];
  else return elems;
}

// POP and RETURN ELEMENT based on Index from Array
export function popFromArray(array, value) {
  const index = array.indexOf(value);
  if (index > -1) array.splice(index, 1);
  return array;
}

/* ///////////////
    FUNCTIONS for DOM TRAVERSAL
/////////////// */

// FUNCTION to TRAVERSE and RETURN the PARENT with given class
export function getParentElement(element, targetParent) {
  element = getFirstIfArray(element);
  let parent = element.parentNode;

  while (parent && parent.tagName !== "BODY") {
    if (parent.tagName.toUpperCase() === targetParent.toUpperCase()) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return null; // No parent found with the target class
}

// FUNCTION to Set Title Attribute
export function setTitleAttr() {
  let textElementsArr = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, th, td"
  );

  textElementsArr.forEach((elem) => {
    elem.setAttribute("title", elem.innerText);
  });
}

// Set Icons to Respective Messages - Notes, Snackbars and Input Messages
export function setMsgIcons(elem, iconName) {
  if (elem.querySelector(".icon")) return;
  if (!elem) return;
  let icon = document.createElement("span");
  icon.className = "icon";
  icon.innerHTML = getBootstrapIcon(iconName);
  elem.prepend(icon);
}

// Get SVG SPRITE FILE ICONS PATH
export function getBootstrapIcon(iconName) {
  switch (iconName) {
    case UI_CLASS.error:
      return `<i class="bi bi-${UI_ICON_NAMES.error}"></i>`;
    case UI_CLASS.warn:
      return `<i class="bi bi-${UI_ICON_NAMES.warn}"></i>`;
    case UI_CLASS.success:
      return `<i class="bi bi-${UI_ICON_NAMES.success}"></i>`;
    case UI_CLASS.info:
      return `<i class="bi bi-${UI_ICON_NAMES.info}"></i>`;
    default:
      return `<i class="bi bi-${iconName}"></i>`;
  }
}



/* ///////////////
DATA STORAGE FUNCTIONS
/////////////// */

// FUNCTION to SAVE data to storage throughout the project
export function saveToStorage(key, data) {
  try {
    if (!key || typeof key !== "string") {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }

    // data = data.filter(item => item !== null);

    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);

  } catch (error) {
    return null;
  }
}

// FUNCTION to READ data to storage throughout the project
export function getFromStorage(key) {
  try {
    if (!key || typeof key !== "string") {
      throw new Error("Invalid key: Key must be a non-empty string.");
    }

    // Retrieve data
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      throw new Error("Key not found");
    }

    // Parse retrieved data
    const parsedData = JSON.parse(storedData);

    return parsedData;

  } catch (error) {
    return null;
  }
}

/* ///////////////
  DATE, TIME and CURRENCY FORMMATING
/////////////// */

export function parseDateToDDMMYYYY(dateInput) {

  // Attempt to parse the date input
  const parsedDate = new Date(dateInput);

  // Check if the date is valid
  if (isNaN(parsedDate)) {
    throw new Error("Invalid date format");
  }

  // Format the date as dd-mm-yyyy
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = parsedDate.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDateCommon(dateStr) {
  const DATE = new Date(dateStr);
  return `${toTwoDigit(DATE.getDate())} ${DATE_MONTHS_SHORT[DATE.getMonth()]}, ${DATE.getFullYear()}`;
}

// GET 2 DATES ADDITION
export function addDates(date1, date2) {
  const date1MS = new Date(date1).getTime();
  const date2MS = new Date(date2).getTime();
  const days = Math.floor((date2MS + date1MS) / (1000 * 60 * 60 * 24));
  return days;
}

// GET NUMBER OF DAYS BETWEEN 2 DATES
export function subtractDates(date1, date2) {
  const date1MS = new Date(date1).getTime();
  const date2MS = new Date(date2).getTime();
  let daysDiff = Math.floor((date2MS - date1MS) / (1000 * 60 * 60 * 24));
  return ++daysDiff;
}

export function formatINR(num, isCurrency = true) {
  // Convert to String and Split the Integer and Decimal Part
  num = num.toString();
  let [integerPart, decimalPart] = num.split('.');
  // Format the Integer part
  integerPart = integerPart.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  // Join the Integer + Decimal part if it exists
  num = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return isCurrency ? "₹ " + num : num;
}


/* ///////////////
  GET REGION OF THE ELEMENT
/////////////// */
export function setLocationByRegion(elem, popupElem) {
  // Viewport's height and width
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get X and Y position of the Center of the Element
  let { top, left, width, height } = elem.getBoundingClientRect();
  let popupHeight = popupElem.getBoundingClientRect().height;
  let popupWidth = popupElem.getBoundingClientRect().width;

  let centerX = left + width / 2;
  let centerY = top + height / 2;

  // Default - dropdown below and aligned left
  let posTop = top + height + 4;
  let posLeft = left;

  if (centerX < viewportWidth / 4 && centerY < viewportHeight / 4) {
    // north west
  } else if (centerX > 3 * viewportWidth / 4 && centerY < viewportHeight / 4) {
    // north east
    posLeft = left + width - popupWidth; // Align to the right
  } else if (centerX < viewportWidth / 4 && centerY > 3 * viewportHeight / 4) {
    // south west
    posTop = top - popupHeight - 4; // Show above the button
  } else if (centerX > 3 * viewportWidth / 4 && centerY > 3 * viewportHeight / 4) {
    // south east
    posTop = top - popupHeight - 4; // Show above the button
    posLeft = left + width - popupWidth; // Align to the right
  } else if (centerX < viewportWidth / 4) {
    // west
  } else if (centerX > 3 * viewportWidth / 4) {
    // east
    posLeft = left + width - popupWidth; // Align to the right
  } else if (centerY > 3 * viewportHeight / 4) {
    // south
    posTop = top - popupHeight - 4; // Show above the button
  }

  return [posTop, posLeft];
}

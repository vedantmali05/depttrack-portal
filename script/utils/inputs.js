import { UI_STATUS_FEEDBACK, UI_CLASS } from "./const.js";
import { setLocationByRegion, getFirstIfArray, getParentElement, setMsgIcons } from "./utils.js";

/* ///////////////
    INPUT's FUNCTIONALITY
/////////////// */

// FUNCTION to SET specified INPUT VALUE or REMOVE it not specified
export function setInputValue(inputTag, value = "") {
  inputTag.value = value;
}

// FUNCTION to SET TOGGLE INPUTS CHECKED
export function setToggleInputChecked(inputTagArr, value = "") {
  if (value || value != ``) return;

  inputTagArr.forEach((input) => (input.checked = input.value == value));
}

// FUNCTION to Allow NUMBER in the INPUTS
export function allowNumberInputOnly(inputTag, allowFloating = true, allowNegative = true) {

  inputTag.setAttribute("inputmode", "numeric");
  inputTag.setAttribute("autocomplete", "off");

  // Allowed characters (including backspace and delete for editing)
  const allowedKeys = [
    "+",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0", // Numeric characters
    "Backspace",
    "Delete",
    "Enter", // Editing keys
    "ArrowLeft",
    "ArrowRight",
    "Shift",
    "Control",
    "Tab",
    "Home",
    "End",
    "PageUp",
    "PageDown", // Standard modifier and movement keys
    "PrintScreen",
    "Insert",
    "NumLock",
    "CapsLock", // Additional user actions
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12", // Function keys (consider use case)
    "Escape",
  ];

  if (allowNegative) allowedKeys.push("-");
  if (allowFloating) allowedKeys.push(".");


  if (!inputTag.classList.contains("number-code-input")) {
    allowedKeys.push("ArrowDown");
    allowedKeys.push("ArrowUp");
  }

  inputTag.addEventListener("keydown", function (event) {

    if (event.ctrlKey) return;

    // Prevent default behavior for disallowed keys
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  });

  inputTag.addEventListener("input", (e) => {
    let value = inputTag.value.trim();
    // Replace all trailing + and - signs
    value = value.replace(/[^0-9-+.]/g, '');
    // Allow only one decimal point
    value = value.replace(/\./g, (match, index) => index === value.indexOf('.') ? match : '');
    // Allow only one leading +/- sign
    value = value.replace(/[-+]/g, (match, index) => index === 0 ? match : '');
    // Assign the updated value
    inputTag.value = value;
  })
}

export function handleEnterKey(input, button) {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default Enter key behavior
      button.click(); // Trigger the Next button
    }
  });
}



// FUNCTION to INCREMENT or DECREMENT Numeric Input value by given number
export function incrementWithDifference(input, incBy = 1, allowNegative = true) {
  let value = input.value.trim();
  if (isNaN(parseFloat(value)) && isFinite(value)) return
  if (!allowNegative && parseFloat(value) < 1) return;
  input.value = Number(value) + (incBy);
}

// FUNCTION to INCREMENT or DECREMENT Numeric Input value on +, -, Arrow Up and Arrow Down keypress
export function setIncDecOnKeypress(input, allowNegative = true) {
  input.setAttribute("title", "Use + and ↑ or and - and ↓ (plus, arrow up, minus and arrow down) keys to increase or decrease value.")

  input.addEventListener("keydown", (e) => {
    if (e.key == "+" || e.key == "ArrowUp") incrementWithDifference(input);
    if (e.key == "-" || e.key == "ArrowDown") incrementWithDifference(input, -1, allowNegative);
  })
}

// OTP Input
export function handleOTPInput(inputArr) {
  inputArr.forEach((input, i) => {
    // Disable all keyboard keys except - number, functional and navigation keys
    allowNumberInputOnly(input, false, false);
    // Maximum length - 1 digits

    // Select when focused
    input.addEventListener("focus", (e) => {
      input.setSelectionRange(0, 1);
    });

    // Move to next location on input
    input.addEventListener("input", (e) => {
      input.value = input.value.slice(0, 1);
      if (input.value != ``) {
        inputArr[i + 1]?.focus();
      }
    });

    // Fill all boxes on paste
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pastedOTP = e.clipboardData.getData("text");
      // Pasted OTP must be a 6 digit number
      if (parseInt(pastedOTP) !== NaN && pastedOTP.length == 6) {
        for (let j = 0; j < inputArr.length; j++) {
          inputArr[j].value = pastedOTP[j];
        }
      }
    });

    // Navigation back and forth on buttons pressed
    input.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Backspace":
          if (input.value == ``) inputArr[i - 1]?.focus();
          break;

        case "ArrowRight":
          inputArr[i + 1]?.focus();
          break;

        case "ArrowLeft":
          inputArr[i - 1]?.focus();
          break;

        case "End":
          inputArr[inputArr.length - 1]?.focus();
          break;

        case "Home":
          inputArr[0]?.focus();
          break;
      }
    });
  });
}

/* ///////////////
    INPUT's VALIDATION
/////////////// */

// FUNCTION to REFRESH INPUT TAG PROPERTIES
export function refreshInputs() {
  // FILLABLE INPUTS (all inputs except Radios and Checkboxes)
  let inputArr = document.querySelectorAll(
    "input:not([type=radio]):not([type=checkbox]), .text-input"
  );

  inputArr.forEach((input) => {
    // POPULATE 👁️ Password Visibility Button if current input is Password
    if (input.type == "password" && !input.parentNode.querySelector("password-visibility-btn")) {
      let passwordVisibilityBtn = document.createElement("button");
      passwordVisibilityBtn.type = "button";
      passwordVisibilityBtn.classList.add(
        "password-visibility-btn",
        "trail",
        "icon"
      );
      passwordVisibilityBtn.innerHTML = `
            <img src="/static/assets/eye.png" class="eye">
            <img src="/static/assets/eye-slash.png" class="eye-slash">
            `;

      // Get Parent Element of current Password Input and  append Eye button in it.
      input.parentNode.append(passwordVisibilityBtn);

      // Password Visibility Event
      passwordVisibilityBtn.addEventListener("click", function (e) {
        e.preventDefault();
        input.type = input.type == "password" ? "text" : "password";
        passwordVisibilityBtn.classList.toggle(
          "visible",
          input.type != "password"
        );
      });
    }
  });

  // TOGGLE INPUTS like Radio and Checkbox
  document.querySelectorAll("input[type=radio], input[type=checkbox]")
    .forEach((input) => input.classList.add("toggle-input"));


  // REFRESH ICONS ONCE
  let errorElemsList = document.querySelectorAll(
    "fieldset .msg.error, .note.error"
  );
  let warnElemsList = document.querySelectorAll(
    "fieldset .msg.warn, .note.warn"
  );
  let successElemsList = document.querySelectorAll(
    "fieldset .msg.success, .note.success"
  );
  let infoElemsList = document.querySelectorAll(
    "fieldset .msg.info, .note.info"
  );

  infoElemsList?.forEach((elem) => {
    setMsgIcons(elem, UI_CLASS.info);
  });
  successElemsList?.forEach((elem) => {
    setMsgIcons(elem, UI_CLASS.success);
  });
  warnElemsList?.forEach((elem) => {
    setMsgIcons(elem, UI_CLASS.warn);
  });
  errorElemsList?.forEach((elem) => {
    setMsgIcons(elem, UI_CLASS.error);
  });
}

// FUNCTION to SET specified INPUT MESSAGE
export function setInputMsg(inputTag, msg, status = UI_CLASS.error) {
  inputTag = getFirstIfArray(inputTag);
  removeInputMsg(inputTag, status);

  // Create message div
  const msgDiv = document.createElement("div");
  // Set class, by default, it's "error"
  msgDiv.classList.add("msg", status);
  msgDiv.innerHTML = `<span>${msg}</span>`;
  setMsgIcons(msgDiv, status);

  // Find parent for appending
  const fieldset = getParentElement(inputTag, UI_CLASS.fieldset);
  fieldset.append(msgDiv);
}

// FUNCTION to REMOVE specified INPUT MESSAGE
export function removeInputMsg(inputTag, status = UI_STATUS_FEEDBACK.error) {
  inputTag = getFirstIfArray(inputTag);

  const fieldset = getParentElement(inputTag, UI_CLASS.fieldset);
  // Get type of msg to be deleted, by default, "error"
  fieldset.querySelectorAll("." + status).forEach((div) => div.remove());
}

// FUNCTION for INPUT VALIDATION
export function validateInput(inputTag, errorMsg) {
  inputTag.value = inputTag.value.trim();  

  if (inputTag.required && !inputTag.value) {
    setInputMsg(inputTag, "This field is required");
    return false;
  }


  const pattern = inputTag.pattern?.trim();
  if (!pattern || new RegExp(pattern).test(inputTag.value)) {
    removeInputMsg(inputTag);
    return true;
  }

  setInputMsg(inputTag, errorMsg);
  return false;
}

// FUNCTION to validate TOGGLE INPUTS like radio and checkboxes
export function validateToggleInputs(
  toggleInputs,
  errorMsg = "This field is required"
) {
  removeInputMsg(toggleInputs);
  let isRequired = false,
    isChecked = false;
  toggleInputs.forEach((input) => {
    if (input.required) isRequired = true;
    if (input.checked) isChecked = true;
  });

  if (isRequired && !isChecked) {
    setInputMsg(toggleInputs, errorMsg);
    return false;
  }

  return true;
}

// FUNCTION TO VALIDATE OTP CODE INPUT
export function validateOTPInput(
  inputElemArr,
  digits,
  errorMsg = "This field is required"
) {
  removeInputMsg(inputElemArr);

  let enteredOTP = ``;

  inputElemArr.forEach((input) => {
    enteredOTP += input.value;
  });

  if (inputElemArr[0].required && !enteredOTP) {
    setInputMsg(inputElemArr, "This field is required");
    return false;
  }

  if (new RegExp(/^\d{6}$/).test(enteredOTP.trim())) {
    removeInputMsg(inputElemArr);
    return true;
  }

  setInputMsg(inputElemArr, errorMsg);
  return false;
}


// FUNCTION TO SHOW PASSWORD CONDITIONS

export function showPasswordConditions(passwordInput, conditionBox) {

  let isFirstTime = false;

  passwordInput.addEventListener("input", () => {
    if (!isFirstTime) {
      conditionBox.innerHTML = `
      <!-- Password Conditions -->
<div class="password-conditions subtitle step-sec">
  <p><b class="text-primary">Password Conditions</b></p>

  <!-- Length Condition -->
  <p class="step d-flex align-items-center" id="password_length">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>Password must be 7 to 16 characters long.</span>
  </p>

  <!-- No Spaces Condition -->
  <p class="step d-flex align-items-center" id="password_spaces">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>Password must <b>not</b> contain spaces.</span>
  </p>

  <p><b>It must contain:</b></p>

  <!-- Uppercase Condition -->
  <p class="step d-flex align-items-center" id="password_uppercase">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>At least one uppercase alphabet.</span>
  </p>

  <!-- Lowercase Condition -->
  <p class="step d-flex align-items-center" id="password_lowercase">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>At least one lowercase alphabet.</span>
  </p>

  <!-- Number Condition -->
  <p class="step d-flex align-items-center" id="password_number">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>At least a number.</span>
  </p>

  <!-- Symbol Condition -->
  <p class="step d-flex align-items-center" id="password_symbol">
    <span class="me-2 text-muted pending"><i class="bi bi-circle"></i></span>
    <span class="me-2 text-success completed d-none"><i class="bi bi-check-circle-fill"></i></span>
    <span>At least one symbol.</span>
  </p>
</div>

      `;

      if (conditionBox.querySelector(".password-conditions")) {
        let value = passwordInput.value;

        // Length must be between 7 to 16 chars
        conditionBox.querySelector("#password_length").classList.toggle("completed", /^(.{7,16})$/.test(value));

        // No whitespaces allowed (corrected)
        conditionBox.querySelector("#password_spaces").classList.toggle("completed", !(value.split("").includes(" ")));

        // At least one uppercase character must be present
        conditionBox.querySelector("#password_uppercase").classList.toggle("completed", /([A-Z])+/g.test(value));

        // At least one lowercase character must be present
        conditionBox.querySelector("#password_lowercase").classList.toggle("completed", /([a-z])+/g.test(value));

        // At least one number character must be present
        conditionBox.querySelector("#password_number").classList.toggle("completed", /([0-9])+/g.test(value));

        // At least one symbol character must be present
        conditionBox.querySelector("#password_symbol").classList.toggle("completed", /[^\w\s]/.test(value));
      }
    }
  });

}

/* ///////////////
  INPUT DATALIST / COMBOBOX
/////////////// */


// FUNCTION TO SEARCH IN THE DATALIST BASED ON THE INPUT
function searchInDatalist(input, datalist) {
  let value = input.value.toLowerCase();
  const regex = new RegExp(`(${value})`, 'gi');
  let matchFound = false;

  // Hide overline elements when on search and show if no input is given
  const overlineList = datalist.querySelectorAll(".overline");
  overlineList?.forEach(overline => overline.style.display = value ? 'none' : 'block');

  // Search value with every datalist item
  datalist.querySelectorAll("li").forEach(li => {
    // Match value
    let matches =
      li.textContent.trim().replace(/\s+/g, ' ').toLowerCase().includes(value)
      || li.getAttribute("data-keywords")?.trim().replace(/\s+/g, ' ').toLowerCase().includes(value)

    // Set visible and matchFound
    if (matches) matchFound = true;
    li.style.display = matches ? "block" : "none";
    li.innerHTML = li.textContent.replace(regex, '<b>$1</b>');
  });

  // If no items found.
  let notFoundElem = datalist.querySelector(".not-found");
  if (notFoundElem) notFoundElem.style.display = matchFound ? "none" : "block";
}

let associatedInput = null;

// FUNCTION TO UPDATE DROP DOWN POSITION
export function updateDropDownPosition(elem, dropDownElem, isInput) {
  const dropDownBody = dropDownElem.querySelector(".drop-down-menu-body");
  let [top, left] = setLocationByRegion(elem, dropDownBody);
  Object.assign(dropDownBody.style, {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${elem.clientWidth + 32}px`,
    width: `fit-content`,
    maxWidth: "700px",
  });
  if (top > 0) dropDownBody.style.maxHeight = `calc(100vh - ${top}px)`
  dropDownElem.classList.add("visible");

  // Return and don't do further input handling
  if (!isInput) return;

  associatedInput = elem;
  if (!dropDownElem.querySelector(".not-found")) {
    let notFoundElem = document.createElement("p");
    notFoundElem.classList.add("not-found");
    notFoundElem.innerHTML = "No such items found. Try changing the prompt.";
    notFoundElem.style.display = "none";
    dropDownElem.querySelector("ul").append(notFoundElem);
  }

  // Perform Searching
  searchInDatalist(elem, dropDownElem);
}

// FUNCTION TO REMOVE DROP DOWN MENU
export function removeDropDownMenu(dropDownBody, e = false) {
  if (e && e.target != dropDownBody) return;
  dropDownBody.classList.remove("visible");
}

// FUNCTION to SET DROP DOWN MENU to the Associated Input, if isInput
export function setDropDownMenu(elem, isInput = false, handleSelectedListItem = (selectedItem, associatedInput) => { }) {
  // Get Associated Drop Down Menu using ID
  let dropDownElem = document.getElementById(elem.getAttribute("data-drop-down"));

  // Show datalist on focus and click
  elem.addEventListener("focus", () => updateDropDownPosition(elem, dropDownElem, isInput));
  elem.addEventListener("click", () => updateDropDownPosition(elem, dropDownElem, isInput));

  // REMOVE POPUP ON PRESSING KEYS
  elem.addEventListener("keydown", (e) => {
    // Hide datalist on blur and certain key presses
    let closeKeys = ["Tab", "Escape", "PageDown", "PageUp"];
    if (closeKeys.includes(e.key)) removeDropDownMenu(dropDownElem);

    // Get the first visible list item and fill input with it on Enter
    if (isInput && e.key === "Enter") {
      if (!dropDownElem.classList.contains("visible")) return;
      let firstVisibleItem = Array.from(dropDownElem.querySelectorAll("li"))
        .find(li => li.style.display !== "none");
      if (firstVisibleItem) {
        elem.value = firstVisibleItem.textContent.trim().replace(/\s+/g, ' ');
        handleSelectedListItem(firstVisibleItem, associatedInput)
        removeDropDownMenu(dropDownElem);
      }
    }
  });

  // Hide datalist on click or scroll elsewhere

  dropDownElem.addEventListener("click", (e) => removeDropDownMenu(dropDownElem, e));
  dropDownElem.addEventListener("wheel", (e) => removeDropDownMenu(dropDownElem, e), { passive: true });

  // Return and don't do further input handling if the drop down is not an input
  if (!isInput) return;

  // Create Trailing Chevron
  if (!elem.parentNode.querySelector(".trail")) {
    let arrowDown = document.createElement("span");
    arrowDown.classList.add("trail");
    arrowDown.innerHTML =
      `<svg class="icon"><use href="/static/assets/icon-sprite.svg#chevron-down" /></svg>`;
    elem.parentNode.append(arrowDown);
    arrowDown.addEventListener("click", () => updateDropDownPosition(elem, dropDownElem, isInput));
  }

  // Disable autocomplete and browsers' default recent inputs' datalists
  elem.setAttribute("autocomplete", "off");

  // Hide Drop Down if any option is chosen from the list
  dropDownElem.querySelectorAll("button, a").forEach(btn =>
    btn.addEventListener("click", () => removeDropDownMenu(dropDownElem))
  );

  // Fill input on particular item click and close popup  
  dropDownElem.querySelectorAll("li").forEach(li =>
    li.addEventListener("click", () => {
      if (elem === associatedInput) {
        elem.value = li.textContent.trim().replace(/\s+/g, ' ');
        handleSelectedListItem(li, associatedInput)
        removeDropDownMenu(dropDownElem);
      }
    })
  );

  // Search filter the datalist based on input
  elem.addEventListener("input", () => {
    if (!dropDownElem.classList.contains("visible")) updateDropDownPosition(elem, dropDownElem, isInput);
    // Perform Searching
    searchInDatalist(elem, dropDownElem);
  });
}

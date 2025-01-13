// Import necessary functions from utils/inputs.js
import {
    validateInput,
    setInputMsg,
    removeInputMsg,
    allowNumberInputOnly,
    handleEnterKey,
    showPasswordConditions,

} from "./utils/inputs.js";

// Validation script for signup form
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const nextBtn = document.getElementById("next_btn");

    // Define form inputs
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Define custom error messages
    const errorMessages = {
        name: "Name must contain only letters and spaces, and be 3-50 characters long.",
        email: "Enter a valid email address (e.g., example@example.com).",
        phone: "Phone number must be exactly 10 digits.",
        password:
            "Password must be 6-16 characters long, include letters and numbers, and no spaces.",
        confirmPassword: "Passwords do not match.",
    };

    // Validate individual inputs
    function validateName() {
        return validateInput(nameInput, errorMessages.name);
    }

    function validateEmail() {
        return validateInput(emailInput, errorMessages.email);
    }

    function validatePhone() {
        return validateInput(phoneInput, errorMessages.phone);
    }

    function validatePassword() {
        return validateInput(passwordInput, errorMessages.password);
    }

    function validateConfirmPassword() {
        // Check if the input is empty
        if (confirmPasswordInput.value.trim() === "") {
            setInputMsg(confirmPasswordInput, "This field is required.");
            return false;
        }

        // Check if the passwords match
        if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
            setInputMsg(confirmPasswordInput, errorMessages.confirmPassword);
            return false;
        }

        // Remove error message if validation passes
        removeInputMsg(confirmPasswordInput);
        return true;
    }

    [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach((input) =>
        handleEnterKey(input, nextBtn)
    );

    allowNumberInputOnly(phoneInput, false, false)

    // Form submission handler
    nextBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        // Run all validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        showPasswordConditions(passwordInput, document.getElementById("password_conditions_box"));

        // If all validations pass, submit the form
        if (
            isNameValid &&
            isEmailValid &&
            isPhoneValid &&
            isPasswordValid &&
            isConfirmPasswordValid
        ) {
            window.location.href = "/signup-role-selection.html"
        }
    });
});
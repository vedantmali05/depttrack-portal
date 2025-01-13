// Import necessary functions from utils/inputs.js
import { UI_ICON_NAMES } from "./utils/const.js";
import {
    setInputMsg,
    removeInputMsg,
    handleEnterKey,
    validateInput
} from "./utils/inputs.js";

// Validation script for signup form
document.addEventListener("DOMContentLoaded", () => {
    // Dummy credentials for validation
    const dummyEmail = "user@example.com";
    const dummyPassword = "Pass@123";

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login_btn");

    [emailInput, passwordInput].forEach(input => {
        handleEnterKey(input, loginBtn);
    })

    // Form submission handler
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        // Run all validations
        const isEmailValid = validateInput(emailInput, "This field is required.");
        const isPasswordValid = validateInput(passwordInput, "This field is required.");

        // If all validations pass, check credentials
        if (isEmailValid && isPasswordValid) {
            if (emailInput.value.trim() === dummyEmail && passwordInput.value.trim() === dummyPassword) {
                window.location.href = "./index.html";
            } else {
                // Create a toast container if it doesn't exist
                let toastContainer = document.getElementById("toast-container");
                if (!toastContainer) {
                    toastContainer = document.createElement("div");
                    toastContainer.id = "toast-container";
                    toastContainer.style.position = "fixed";
                    toastContainer.style.bottom = "2rem";
                    toastContainer.style.right = "2rem";
                    toastContainer.style.zIndex = "9999";
                    document.body.appendChild(toastContainer);
                }

                // Create the toast element
                const toast = document.createElement("div");
                toast.className = "toast align-items-center bg-dark border-0 show p-3";
                toast.role = "alert";
                toast.ariaLive = "assertive";
                toast.ariaAtomic = "true";
                toast.innerHTML = `
                    <div class="d-flex fs-400">
                        <div class="toast-body text-danger">
                            <span><i class="bi bi-${UI_ICON_NAMES.error}"></i></span>
                            Invalid email or password.
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                `;

                // Append the toast to the container
                toastContainer.appendChild(toast);

                // Automatically remove the toast after a few seconds
                setTimeout(() => {
                    toast.remove();
                }, 1000000);
            }
        }
    });
});

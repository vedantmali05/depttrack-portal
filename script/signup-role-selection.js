
// Import necessary functions from utils/inputs.js
import {
    validateInput,
    setInputMsg,
    removeInputMsg,
    handleEnterKey
} from "./utils/inputs.js";

// Validation script for role selection form
document.addEventListener("DOMContentLoaded", () => {

    const roleSelect = document.getElementById('role');
    const roleSpecificFieldsContainer = document.getElementById('role-specific-fields');
    const submitBtn = document.getElementById('submit_btn');

    // Function to handle the role selection and update the form accordingly
    roleSelect.addEventListener('change', function () {
        const selectedRole = roleSelect.value;
        roleSpecificFieldsContainer.innerHTML = ''; // Clear any previous role-specific fields

        if (selectedRole) {
            // Enable the "Next" button once a role is selected
            submitBtn.disabled = false;

            // Call the function to add the role-specific fields
            addRoleSpecificFields(selectedRole);
        } else {
            // Disable the "Next" button if no role is selected
            submitBtn.disabled = true;
        }

        const roleSpecificInput = document.querySelector("#role-specific-fields input");
        handleEnterKey(roleSpecificInput, submitBtn);
    });

    // Function to add role-specific fields based on the selected role
    function addRoleSpecificFields(role) {
        const roleSpecificFieldsContainer = document.getElementById("role-specific-fields");
        let labelText = "";
        let placeholderText = "";

        // Determine the label and placeholder text based on the selected role
        switch (role) {
            case "HOD":
                labelText = "Approval ID / Authorization Code";
                placeholderText = "Enter Approval ID or Authorization Code";
                break;
            case "Teacher":
                labelText = "Employee ID";
                placeholderText = "Enter Employee ID";
                break;
            case "Staff":
                labelText = "Employee ID";
                placeholderText = "Enter Employee ID";
                break;
            case "Admin":
                labelText = "Admin Security Key";
                placeholderText = "Enter Admin Security Key";
                break;
            default:
                return; // Do nothing if role is not recognized
        }

        // Create the input field HTML
        const roleSpecificFields = `
        <fieldset class="mb-4">
            <label for="role_specific_id_input" class="form-label fs-300 text-muted">${labelText}</label>
            <input type="text" class="form-control fs-400" id="role_specific_id_input" name="role_specific_id_input" placeholder="${placeholderText}" required />
        </fieldset>
    `;

        // Insert the field into the container
        roleSpecificFieldsContainer.innerHTML = roleSpecificFields;
    }


    // Define form inputs
    const departmentInput = document.getElementById("department");
    const roleInput = document.getElementById("role");

    // Define custom error messages
    const errorMessages = {
        department: "Please select a department.",
        role: "Please select a role.",
        roleSpecific: {
            HOD: "Please enter the Approval ID / Authorization Code.",
            Teacher: "Please enter the Employee ID.",
            Staff: "Please enter the Employee ID.",
            Admin: "Please enter the Admin Security Key."
        }
    };

    // Validate Department
    function validateDepartment() {
        return validateInput(departmentInput, errorMessages.department);
    }

    // Validate Role
    function validateRole() {
        return validateInput(roleInput, errorMessages.role);
    }

    // Validate Role-Specific Fields
    function validateRoleSpecific() {
        if (!roleInput.value) return false; // No role selected

        
        
        const selectedRole = roleInput.value;
        let roleSpecificField = document.getElementById(`role_specific_id_input`);

        if (!roleSpecificField) {
            return false; // No role-specific field found
        }

        return validateInput(roleSpecificField, errorMessages.roleSpecific[selectedRole]);
    }

    // Handle "Next" button click
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        
        
        // Run all validations
        const isDepartmentValid = validateDepartment();
        const isRoleValid = validateRole();
        const isRoleSpecificValid = validateRoleSpecific();

        // If all validations pass, proceed to the next page
        if (isDepartmentValid && isRoleValid && isRoleSpecificValid) {
            window.location.href = "./index.html"; // Redirect to next page or final page
        }
    });

    // Enable "Next" button when role is selected
    roleInput.addEventListener("change", () => {
        submitBtn.disabled = !(roleInput.value && departmentInput.value);
    });

    // Enable "Next" button when department is selected
    departmentInput.addEventListener("change", () => {
        submitBtn.disabled = !(roleInput.value && departmentInput.value);
    });

    // Handling Enter key for form submission
    [departmentInput, roleInput].forEach((input) =>
        handleEnterKey(input, submitBtn)
    );
});
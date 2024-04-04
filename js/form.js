import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';

const firestore = getFirestore(app);
const timestamp = serverTimestamp();

document.addEventListener("DOMContentLoaded", function () {
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', saveChanges);
    }
});

async function saveChanges() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const phoneNumber = document.getElementById('inputPhoneNumber').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const place = document.getElementById('inputPlace').value.trim();

    const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Validate inputs
    if (validateInputs(firstName, phoneNumber, email, place)) {
        const dataToSave = {
            firstName: firstName,
            phoneNumber: phoneNumber,
            email: email,
            place: place,
            timestamp: timestamp
        };

        const userDocRef = collection(firestore, `users/${uid}/table`);

        try {
            const docRef = await addDoc(userDocRef, dataToSave);
            localStorage.setItem('num', phoneNumber);
            console.log('Data successfully added to Firestore');
            window.location.href = '../pages/scratchCard.html';
        } catch (error) {
            console.error('Error adding data to Firestore: ', error);
            // Show error message to user
            showError('Error adding data to Firestore. Please try again later.');
        }
    }
}

function validateInputs(firstName, phoneNumber, email, place) {
    if (!firstName || !phoneNumber || !email || !place) {
        showError('Please fill in all required fields.');
        return false;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        showError('Please enter a valid phone number.');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return false;
    }

    return true;
}

function showError(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}

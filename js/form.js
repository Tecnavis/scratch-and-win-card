import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';


const firestore = getFirestore(app);
const timestamp = serverTimestamp()

// Attach event listener to the button with ID saveChangesBtn
document.addEventListener("DOMContentLoaded", function () {
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function () {
            saveChanges();
        });
    }
});


async function saveChanges() {
    // Get the edited values
    const firstName = document.getElementById('inputFirstName').value;
    const phoneNumber = document.getElementById('inputPhoneNumber').value;
    const email = document.getElementById('inputEmail').value;
    const place = document.getElementById('inputPlace').value;

    // Get the UID of the authenticated user
    const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    if (firstName && phoneNumber && email && place) {
        // Create an object with the data to be saved
        const dataToSave = {
            firstName: firstName,
            phoneNumber: phoneNumber,
            email: email,
            place: place,
            timestamp: timestamp
        };


        // Reference to the user's profile document
        const userDocRef = collection(firestore, `users/${uid}/table`);

        try {
            const docRef = await addDoc(userDocRef, dataToSave);
            // const docID = docRef.id;
            // console.log(docID);
            localStorage.setItem('num', phoneNumber);
            console.log('Data successfully added to Firestore');
            window.location.href = '../pages/scratchCard.html';
        } catch (error) {
            console.error('Error adding data to Firestore: ', error);
        }
    } else {
        var element = document.getElementById('errorMessage');
        element.style.display = 'block';
        setInterval(() => {
            element.style.display = 'none';
        }, 5000)
    }
}



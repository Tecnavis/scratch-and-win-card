import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js';
import { app } from '../../config/db.js';

const firestore = getFirestore(app);
const storage = getStorage(app);
const timestamp = serverTimestamp()

// var num = Math.floor(Math.random() * 4) + 1;

// $("#card").wScratchPad({
//   size: 100, // The size of the brush/scratch.
//   bg: `Images/Gpay_Card ${num}.jpg`, // Background (image path or hex color).
//   fg: `Images/front.jpg`, // Foreground (image path or hex color).
//   cursor: "pointer", // Set cursor.
// });


// Function to retrieve data from Firebase and initialize scratch card
async function retrieveDataAndInitializeScratchCard() {
  const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';

  if (!uid) {
    console.error('User not authenticated');
    return;
  }

  const userDocRef = collection(firestore, `users/${uid}/prizeList`);

  try {
    const querySnapshot = await getDocs(query(userDocRef, orderBy('timestamp', 'asc')));
    const cardsData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      cardsData.push(data);
    });

    // Sort cardsData array based on count in descending order
    cardsData.sort((a, b) => b.count - a.count);

    // Check if there are available cards
    if (cardsData.length > 0) {
      const card = cardsData[0]; // Select the first card (highest count)

      // Check if counts are available
      if (card.count > 0) {
        initializeScratchCard(card);
      } else {
        // If counts are not available, handle it accordingly (e.g., show a message).
        console.log("No counts available for this card.");
      }
    } else {
      console.log("No scratch cards available for this user.");
    }
  } catch (error) {
    console.error('Error retrieving data from Firebase:', error);
  }
}


// Function to initialize scratch card with data
function initializeScratchCard(cardData) {
  // console.log(cardData.photoUrl);
  $("#card").wScratchPad({
    size: 100, // The size of the brush/scratch.
    bg: cardData.photoUrl, // Background image from Firebase data.
    fg: "Images/front.jpg", // Foreground image.
    cursor: "pointer", // Set cursor.
    scratchMove: function (e, percent) {
      // If scratch reaches a certain threshold (e.g., 50%), update count in database
      if (percent > 50) {
        updateCount(cardData);
      }
    }
  });
}

function updateCount(cardData) {
  const uid = 'NTqIUsvcrtSj3zO9zdY9X4vUELf2';
  const cardRef = collection(firestore, `users/${uid}/prizeList`);

  // Use where clause to target the specific document based on its ID
  const querys = query(cardRef, where('prizeID', '==', cardData.prizeID));
  // console.log(cardData.prizeID);

  getDocs(querys)
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        console.log(doc.id);
        await updateDoc(doc.ref, {
          count: cardData.count - 1 // Decrease count by 1
        }).then(() => {
          console.log("Count updated successfully.");
        }).catch((error) => {
          console.error("Error updating count: ", error);
        });
      });
    })
    .catch((error) => {
      console.error("Error updating count: ", error);
    });

}

// Call the function to retrieve data from Firebase and initialize scratch card
retrieveDataAndInitializeScratchCard();
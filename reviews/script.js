// For v9+ (modular style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

 // Import the functions you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
 import {
   getFirestore, collection, addDoc, getDocs, updateDoc, doc, increment
 } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

 // Your Firebase configuration (replace with yours)
 const firebaseConfig = {
    apiKey: "AIzaSyAhT_ZU5v_R8RBU3lzKtdNzfqZNtd2xODQ",
    authDomain: "bushcampsite-review.firebaseapp.com",
    projectId: "bushcampsite-review",
    storageBucket: "bushcampsite-review.firebasestorage.app",
    messagingSenderId: "784426299962",
    appId: "1:784426299962:web:9147e0bf7c68dd302c3b03",
    measurementId: "G-7P4NTJGXZW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM References
const form = document.getElementById("reviewForm");
const reviewsDiv = document.getElementById("reviews");
const anonymousCheckbox = document.getElementById("anonymous");
const nameInput = document.getElementById("name");

anonymousCheckbox.addEventListener("change", () => {
  nameInput.disabled = anonymousCheckbox.checked;
});

async function loadReviews() {
  reviewsDiv.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    if (querySnapshot.empty) {
      displaySampleReview();
      return;
    }
    querySnapshot.forEach((docSnap) => {
      const review = docSnap.data();
      review.id = docSnap.id;
      displayReview(review);
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
    displaySampleReview();
  }
}

function displaySampleReview() {
  const div = document.createElement("div");
  div.className = "review-card";
  div.innerHTML = `
        <strong>Anonymous</strong> (Gauteng) - 26/04/2025
        <div class="stars">★★★★☆</div>
        <p>"Amazing experience! Very satisfied with the service."</p>
        <div class="thumb-buttons">
            <button>👍 12</button>
            <button>👎 1</button>
        </div>
    `;
  reviewsDiv.appendChild(div);
}

function loadReviews() {
  fetch("http://localhost:3000/reviews")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server error");
      }
      return response.json();
    })
    .then((data) => {
      reviewsDiv.innerHTML = "";

      if (data.length === 0) {
        displaySampleReview();
      } else {
        data.forEach((review) => {
          displayReview(review);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      reviewsDiv.innerHTML = "";
      displaySampleReview(); // <-- Always show sample if error
    });
}

// function displaySampleReview() {
//   const div = document.createElement("div");
//   div.className = "review-card";
//   div.innerHTML = `
//         <strong>Anonymous</strong> (Gauteng) - 26/04/2025
//         <div class="stars">★★★★☆</div>
//         <p>"Amazing experience! Very satisfied with the service."</p>
//         <div class="thumb-buttons">
//             <button>👍 12</button>
//             <button>👎 1</button>
//         </div>
//     `;
//   reviewsDiv.appendChild(div);
// }

function displaySampleReview() {
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
      <strong>Anonymous</strong> (Gauteng) - 26/04/2025
      <div class="stars">★★★★☆</div>
      <p>"Amazing experience! Very satisfied with the service."</p>
      <div class="thumb-buttons">
          <button>👍 12</button>
          <button>👎 1</button>
      </div>
    `;
    reviewsDiv.appendChild(div);
  }

  function displayReview(review) {
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
      <strong>${review.name || 'Anonymous'}</strong> (${review.province}) - ${new Date(review.review_date).toLocaleDateString()}
      <div class="stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
      <p>${review.comment}</p>
      <div class="thumb-buttons">
        <button onclick="thumb('${review.id}', 'up')">👍 ${review.thumbs_up || 0}</button>
        <button onclick="thumb('${review.id}', 'down')">👎 ${review.thumbs_down || 0}</button>
      </div>
    `;
    reviewsDiv.appendChild(div);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const review = {
      name: anonymousCheckbox.checked ? 'Anonymous' : nameInput.value.trim(),
      province: document.getElementById('province').value.trim(),
      review_date: document.getElementById('date').value,
      stars: parseInt(document.getElementById('stars').value),
      comment: document.getElementById('comment').value.trim(),
      thumbs_up: 0,
      thumbs_down: 0
    };

    try {
      await addDoc(collection(db, "reviews"), review);
      form.reset();
      loadReviews();
      showToast('✅ Thank you for your review!');
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast('❌ Failed to submit!');
    }
  });

  // Make thumb function global
  window.thumb = async function(id, action) {
    const reviewRef = doc(db, "reviews", id);
    try {
      await updateDoc(reviewRef, {
        [action === 'up' ? 'thumbs_up' : 'thumbs_down']: increment(1)
      });
      loadReviews();
    } catch (error) {
      console.error("Error updating thumbs:", error);
    }
  };

  window.showToast = function(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  // Load on init
  loadReviews();

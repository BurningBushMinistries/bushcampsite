const form = document.getElementById('reviewForm');
const reviewsDiv = document.getElementById('reviews');
const anonymousCheckbox = document.getElementById('anonymous');
const nameInput = document.getElementById('name');

anonymousCheckbox.addEventListener('change', () => {
    nameInput.disabled = anonymousCheckbox.checked;
});

function loadReviews() {
    fetch('http://localhost:3000/reviews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error');
            }
            return response.json();
        })
        .then(data => {
            reviewsDiv.innerHTML = '';

            if (data.length === 0) {
                displaySampleReview();
            } else {
                data.forEach(review => {
                    displayReview(review);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            reviewsDiv.innerHTML = ''; 
            displaySampleReview();  // <-- Always show sample if error
        });
}

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

function loadReviews() {
    fetch('http://localhost:3000/reviews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error');
            }
            return response.json();
        })
        .then(data => {
            reviewsDiv.innerHTML = '';

            if (data.length === 0) {
                displaySampleReview();
            } else {
                data.forEach(review => {
                    displayReview(review);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            reviewsDiv.innerHTML = ''; 
            displaySampleReview();  // <-- Always show sample if error
        });
}

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
            <button onclick="thumb('${review.id}', 'up')">👍 ${review.thumbs_up}</button>
            <button onclick="thumb('${review.id}', 'down')">👎 ${review.thumbs_down}</button>
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
            <button onclick="thumb('${review.id}', 'up')">👍 ${review.thumbs_up}</button>
            <button onclick="thumb('${review.id}', 'down')">👎 ${review.thumbs_down}</button>
        </div>
    `;
    reviewsDiv.appendChild(div);
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const review = {
        name: anonymousCheckbox.checked ? 'Anonymous' : nameInput.value.trim(),
        province: document.getElementById('province').value.trim(),
        review_date: document.getElementById('date').value,
        stars: parseInt(document.getElementById('stars').value),
        comment: document.getElementById('comment').value.trim()
    };

    fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to save review');
        }
        return res.json();
    })
    .then(() => {
        form.reset();
        loadReviews();
        showToast('✅ Thank you for your review!');
    })
    .catch(error => {
        console.error('Error submitting review:', error);
        showToast('❌ Something went wrong!');
    });
});

function thumb(id, action) {
    fetch(`http://localhost:3000/reviews/${id}/thumbs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
    })
    .then(res => res.json())
    .then(() => loadReviews());
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000); // Hide after 3 seconds
}

// Initial load
loadReviews();


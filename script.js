// Data storage (yyyy-mm-dd format for dates)
const PET_TABLE = {
    "1A1": {
        "name": "Buddy",
        "type": "Dog",
        "breed": "Golden Retriever",
        "size": "Large",
        "birthDate": "2018-06-15"
    }
};

const OWNER_TABLE = {
    "1A": {
        "firstName": "Ana",
        "lastName": "Perez",
        "phone": "67548522",
        "email": "ana.perez@email.com",
        "apartment": "1A"
    }
};

const ENCRYPT_KEY = 'PalmaRealKey';

// Carousel functionality
let currentSlideIndex = 1;


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
    showSlide(currentSlideIndex);

    // Show spinner and hide carousel initially
    const spinner = document.getElementById('loading-spinner');
    const carousel = document.getElementById('carousel-section');

    try {
        // Wait 5 seconds before loading data
        await new Promise(resolve => setTimeout(resolve, 100));

        await populateData();

        // Show success notification
        showNotification('Mascota encontrada!', 'success');

        // Hide spinner and show carousel
        if (spinner) spinner.style.display = 'none';
        if (carousel) carousel.style.display = 'block';
    } catch (error) {
        // Hide spinner even on error
        if (spinner) spinner.style.display = 'none';
        if (carousel) carousel.style.display = 'none';

        showNotification('No se encontró la mascota', 'error');

        return;
    }

    // Auto-advance carousel every 5 seconds
    setInterval(() => {
        nextSlide();
    }, 5000);
});

// Carousel Functions
function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slideNumber > slides.length) {
        currentSlideIndex = 1;
    }
    if (slideNumber < 1) {
        currentSlideIndex = slides.length;
    }

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide
    slides[currentSlideIndex - 1].classList.add('active');
    dots[currentSlideIndex - 1].classList.add('active');
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
}

function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber;
    showSlide(currentSlideIndex);
}

// Data Management Functions
async function populateData() {
    // Get the raw parameter from URL to avoid double encoding issues
    const urlSearchParams = window.location.search;
    const rawIdMatch = urlSearchParams.match(/[?&]id=([^&]*)/);
    const rawId = rawIdMatch ? rawIdMatch[1] : encodeURIComponent(id);

    // Populate the data
    const decodedId = decodeURIComponent(rawId);
    const petId = decryptText(decodedId, ENCRYPT_KEY);

    updateCarouselImages(petId);
    populatePetData(PET_TABLE[petId]);

    const ownerId = extractOwnerId(petId);
    populateOwnerData(OWNER_TABLE[ownerId]);
}

// Update carousel images based on pet ID
function updateCarouselImages(petId) {
    const directoryPath = `images/${petId}`;

    // Update each carousel slide image
    const imageIds = ['pet-image-1', 'pet-image-2', 'pet-image-3'];
    const imageFiles = ['pet1.jpg', 'pet2.jpg', 'pet3.jpg'];

    imageIds.forEach((imageId, index) => {
        const imageElement = document.getElementById(imageId);
        if (imageElement) {
            const imagePath = `${directoryPath}/${imageFiles[index]}`;

            // Update the src attribute
            imageElement.src = imagePath;

            // Update the alt attribute for accessibility
            imageElement.alt = `Pet Photo ${index + 1}`;

            // Handle image load errors with fallback
            imageElement.onerror = function () {
                //console.warn(`Failed to load image: ${imagePath}, using fallback`);
                this.src = `images/pet${index + 1}.svg`; // Fallback to default SVG
            };

            // Log successful image update
            imageElement.onload = function () {
                //console.log(`Successfully loaded: ${imagePath}`);
            };
        }
    });
}

// Separate function to populate the display
function populatePetData(petData) {
    const petNameEl = document.getElementById('pet-name');
    const petTypeEl = document.getElementById('pet-type');
    const petBreedEl = document.getElementById('pet-breed');
    const petSizeEl = document.getElementById('pet-size');
    const petAgeEl = document.getElementById('pet-age');

    if (petNameEl) petNameEl.textContent = petData.name || 'Unknown';
    if (petTypeEl) petTypeEl.textContent = petData.type || 'Unknown';
    if (petBreedEl) petBreedEl.textContent = petData.breed || 'Mixed';
    if (petSizeEl) petSizeEl.textContent = petData.size || 'Unknown';
    if (petAgeEl) petAgeEl.textContent = getMonthsFormatted(petData.birthDate) || 'Unknown';
}

function populateOwnerData(ownerData) {
    const ownerFirstNameEl = document.getElementById('owner-first-name');
    const ownerLastNameEl = document.getElementById('owner-last-name');
    const ownerPhoneEl = document.getElementById('owner-phone');
    const ownerEmailEl = document.getElementById('owner-email');
    const ownerApartmentEl = document.getElementById('owner-apartment');

    if (ownerFirstNameEl) ownerFirstNameEl.textContent = ownerData.firstName || 'Unknown';
    if (ownerLastNameEl) ownerLastNameEl.textContent = ownerData.lastName || 'Unknown';
    if (ownerPhoneEl) ownerPhoneEl.textContent = ownerData.phone || 'No phone';
    if (ownerEmailEl) ownerEmailEl.textContent = ownerData.email || 'No email';
    if (ownerApartmentEl) ownerApartmentEl.textContent = ownerData.apartment || 'Unknown';
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    const backgroundColors = {
        success: '#12a537ff',
        info: '#3498db',
        error: '#e74c3c'
    };

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColors[type] || backgroundColors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add keyboard navigation for carousel
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        previousSlide();
    } else if (event.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.carousel').addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.querySelector('.carousel').addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
}

// Utility Functions for Encryption/Decryption
function encryptText(text, key) {
    if (!text || !key) return '';

    let encrypted = '';
    const keyLength = key.length;

    // XOR encryption with key cycling
    for (let i = 0; i < text.length; i++) {
        const textChar = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % keyLength);
        const encryptedChar = textChar ^ keyChar;
        encrypted += String.fromCharCode(encryptedChar);
    }

    // Convert to base64
    return btoa(encrypted);
}

function decryptText(encryptedBase64, key) {
    if (!encryptedBase64 || !key) return '';

    try {
        // Decode from base64
        const encryptedText = atob(encryptedBase64);
        let decrypted = '';
        const keyLength = key.length;

        // Reverse XOR decryption with key cycling
        for (let i = 0; i < encryptedText.length; i++) {
            const encryptedChar = encryptedText.charCodeAt(i);
            const keyChar = key.charCodeAt(i % keyLength);
            const originalChar = encryptedChar ^ keyChar;
            decrypted += String.fromCharCode(originalChar);
        }

        return decrypted;
    } catch (error) {
        //console.error('Error decrypting text:', error);
        return '';
    }
}

// Utility Function to calculate months between two dates
function getMonthsBetweenDates(startDate, endDate) {
    // If end date is before start date, return 0
    if (endDate < startDate) {
        return 0;
    }

    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();

    // If the end date's day is before the start date's day, subtract one month
    if (endDate.getDate() < startDate.getDate()) {
        months--;
    }

    return months <= 0 ? 0 : months;
}

function getMonthsFormatted(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const currentDate = new Date();
    const totalMonths = getMonthsBetweenDates(birthDate, currentDate);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    let result = '0 meses';
    if (years > 0) {
        result = `${years} año${years > 1 ? 's' : ''}`;

        if (months > 0) {
            result += ` ${months} mes${months > 1 ? 'es' : ''}`;
        }
    } else {
        if (months > 0) {
            result = `${months} mes${months > 1 ? 'es' : ''}`;
        }
    }

    return result.trim();
}

function isConsonant(char) {
    const lowerChar = char.toLowerCase();
    return (/[a-z]/.test(lowerChar));
}

function extractOwnerId(petId) {
    let ownerId = '';
    for (let char of petId) {
        ownerId += char;
        if (isConsonant(char)) {
            break;
        }
    }

    return ownerId;
}
/*
// We can use this site to generate QR codes for testing:
// https://www.the-qrcode-generator.com/

// Console log for debugging
console.log('Pet Profile App initialized successfully');

console.log(isConsonant('1')); // true
console.log(isConsonant('b')); // true

console.log(getMonthsFormatted('2024-12-01')); // Example usage

const examples = [
    { text: "1A1", key: ENCRYPT_KEY },
];

examples.forEach((example, index) => {
    console.log(`\n--- Example ${index + 1} ---`);
    console.log('Original text:', example.text);
    console.log('Key:', example.key);

    const encrypted = encryptText(example.text, example.key);
    const decrypted = decryptText(encrypted, example.key);

    console.log('Encrypted (Base64):', encrypted);
    const encoded = encodeURIComponent(encrypted);
    console.log('Encoded text:', encoded);
    const decoded = decodeURIComponent(encoded);
    console.log('Decoded text:', decoded);
    console.log('Decrypted text:', decrypted);
    console.log('Success:', example.text === decrypted ? '✅' : '❌');
});*/

function uploadImage() {
    const file = document.getElementById("imageInput").files[0];
    const caption = document.getElementById("captionInput").value;
    if (!file) return alert("Select an image");
    const reader = new FileReader();
    reader.onload = () => {
        const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
        gallery.push({ src: reader.result, caption });
        localStorage.setItem("gallery", JSON.stringify(gallery));
        renderGallery();
        document.getElementById("imageInput").value = "";
        document.getElementById("captionInput").value = "";
    };
    reader.readAsDataURL(file);
}

function addCustomText() {
    const section = document.getElementById("sectionSelector").value;
    const text = document.getElementById("customTextInput").value;
    if (!text) return alert("Text required");
    localStorage.setItem("text_" + section, text);
    alert("Text added to " + section + " section");
    document.getElementById("customTextInput").value = "";
}

function renderGallery() {
    const galleryDiv = document.getElementById("galleryAdmin");
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    galleryDiv.innerHTML = gallery
        .map(
            (item, i) => `
        <div class="mb-3">
          <img src="${item.src}" class="img-fluid uploaded-img mb-1"/>
          <p>${item.caption}</p>
          <button class="btn btn-sm btn-danger" onclick="deleteImage(${i})">Delete</button>
        </div>`
        )
        .join("");
}

function deleteImage(index) {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    gallery.splice(index, 1);
    localStorage.setItem("gallery", JSON.stringify(gallery));
    renderGallery();
}

document.addEventListener("DOMContentLoaded", renderGallery);

// File: jessica/upgrade/script.js
// DOM Ready

document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
    });

    feather.replace();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Back to Top Button Setup
    let backToTopBtn = document.getElementById("backToTop");

    if (!backToTopBtn) {
        backToTopBtn = document.createElement("a");
        backToTopBtn.id = "backToTop";
        backToTopBtn.href = "#top";
        backToTopBtn.className = "btn btn-purple position-fixed bottom-0 end-0 m-3";
        backToTopBtn.style.display = "none";
        backToTopBtn.innerText = "Top⬆";
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = "1";
            backToTopBtn.style.pointerEvents = "auto";
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.opacity = "0";
            backToTopBtn.style.pointerEvents = "none";
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Social media tracking
    document.querySelectorAll(".socials a").forEach((link) => {
        link.addEventListener("click", function () {
            const platform = this.getAttribute("href").replace("https://", "").split(".")[0];
            console.log(`Navigating to ${platform}`);
        });
    });

    // Lightbox gallery
    const galleryImages = document.querySelectorAll(".gallery-grid img");
    const lightboxOverlay = document.getElementById("lightboxOverlay");
    const lightboxImg = lightboxOverlay?.querySelector("img");

    galleryImages.forEach((img) => {
        img.addEventListener("click", () => {
            if (lightboxOverlay && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxOverlay.style.display = "flex";
                document.body.style.overflow = "hidden";
            }
        });
    });

    lightboxOverlay?.addEventListener("click", () => {
        lightboxOverlay.style.display = "none";
        document.body.style.overflow = "";
    });

    // Contact form validation
    const contactForm = document.getElementById("contactForm");
    contactForm?.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        contactForm.classList.add("was-validated");
    });

    // Stats and admin logic
    const countryCountEl = document.getElementById("country-count");
    const daysLeftEl = document.getElementById("days-left");
    const form = document.getElementById("statsForm");
    const countryInput = document.getElementById("countryInput");
    const eventDateInput = document.getElementById("eventDateInput");
    const adminPanel = document.getElementById("adminPanel");
    const adminPassword = "sotee16";

    // Admin Access Check
    function checkAdmin() {
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin === "true") {
            adminPanel.style.display = "block";
            document.getElementById("logoutBtn").style.display = "inline-block";
        } else {
            const input = prompt("🔐 Enter Admin Password:");
            if (input === adminPassword) {
                localStorage.setItem("isAdmin", "true");
                adminPanel.style.display = "block";
                document.getElementById("logoutBtn").style.display = "inline-block";
                alert("✅ Admin Access Granted");
            } else if (input !== null) {
                alert("❌ Incorrect Password");
            }
        }
    }
    // Show admin panel if logged in
    if (localStorage.getItem("isAdmin") === "true") {
        adminPanel.style.display = "block";
        document.getElementById("logoutBtn").style.display = "inline-block";
    } else {
        document.getElementById("logoutBtn").style.display = "none";
    }
    // Show admin panel on page load if logged in
    if (localStorage.getItem("isAdmin") === "true") {
        adminPanel.style.display = "block";
        document.getElementById("logoutBtn").style.display = "inline-block";
    } else {
        document.getElementById("logoutBtn").style.display = "none";
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("isAdmin") === "true") {
            document.getElementById("adminPanel").style.display = "block";
        }
    });

    checkAdmin();

    if (localStorage.getItem("isAdmin") === "true") {
        countryInput.disabled = false;
        eventDateInput.disabled = false;
    } else {
        countryInput.disabled = true;
        eventDateInput.disabled = true;
    }
    // Load saved stats
    const savedCountryCount = localStorage.getItem("countryCount");
    const savedEventDate = localStorage.getItem("eventDate");

    if (savedCountryCount) {
        countryCountEl.innerText = savedCountryCount;
        countryInput.value = savedCountryCount;
    }
    if (savedEventDate) {
        eventDateInput.value = savedEventDate;
        updateDaysLeft(savedEventDate);
    }

    // logout Admin

    function logoutAdmin() {
        localStorage.removeItem("isAdmin");
        document.getElementById("adminPanel").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";
        alert("You have been logged out.");
    }

    // Admin resetStats
    function resetStats() {
        if (confirm("Reset all stats? This action cannot be undone.")) {
            localStorage.removeItem("countryCount");
            localStorage.removeItem("eventDate");
            location.reload();
        }
    }
    // If no saved stats, set default values
    if (!savedCountryCount) {
        countryCountEl.innerText = "15"; // Default value
        countryInput.value = "15"; // Default value
    }
    if (!savedEventDate) {
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() + 1); // Default to one year from now
        eventDateInput.value = defaultDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        updateDaysLeft(eventDateInput.value);
    } else {
        updateDaysLeft(savedEventDate);
    }



    // Count-up animation
    function animateCount(target) {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            countryCountEl.innerText = count;
            if (count >= target) clearInterval(interval);
        }, 80);
    }

    // Days left calculation
    function updateDaysLeft(date) {
        const today = new Date();
        const eventDate = new Date(date);
        const diffTime = eventDate - today;
        const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
        daysLeftEl.innerText = daysLeft;
    }

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const countries = parseInt(countryInput.value);
        const eventDate = eventDateInput.value;

        if (!isNaN(countries)) {
            localStorage.setItem("countryCount", countries);
            animateCount(countries);
        }

        if (eventDate) {
            localStorage.setItem("eventDate", eventDate);
            updateDaysLeft(eventDate);
        }

        alert("📊 Stats updated successfully!");
    });

    // Optional: Initial animation
    if (countryCountEl && !savedCountryCount) animateCount(15);
});

window.addEventListener("scroll", () => {
    const backToTopBtn = document.getElementById("backToTop");
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = "1";
        backToTopBtn.style.pointerEvents = "auto";
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.opacity = "0";
        backToTopBtn.style.pointerEvents = "none";
        backToTopBtn.style.display = "none";
    }
});
feather.replace();

// Gallery functionality
const galleryGrid = document.getElementById('galleryGrid');
const uploadSection = document.getElementById('uploadSection');

function loadGallery() {
    galleryGrid.innerHTML = '';
    const images = JSON.parse(localStorage.getItem('galleryImages')) || [];

    images.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4';
        col.innerHTML = `
        <div class="card shadow-sm">
          <img src="${item.image}" class="card-img-top" alt="Uploaded Image" />
          <div class="card-body">
            <p class="card-text">${item.caption}</p>
          </div>
        </div>`;
        galleryGrid.appendChild(col);
    });
}

function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const file = fileInput.files[0];
    const caption = captionInput.value;

    if (!file) return alert('Please select an image.');

    const reader = new FileReader();
    reader.onload = function (e) {
        const newImage = {
            image: e.target.result,
            caption: caption
        };
        const existing = JSON.parse(localStorage.getItem('galleryImages')) || [];
        existing.push(newImage);
        localStorage.setItem('galleryImages', JSON.stringify(existing));
        fileInput.value = '';
        captionInput.value = '';
        loadGallery();
    };
    reader.readAsDataURL(file);
}

// Only show upload section if admin is logged in
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isAdmin') === 'true') {
        uploadSection.style.display = 'block';
    }
    loadGallery();
});

function loadCustomText() {
    ["home", "about", "contact"].forEach(id => {
        const text = localStorage.getItem("text_" + id);
        if (text) document.getElementById("custom" + id.charAt(0).toUpperCase() + id.slice(1)).innerText = text;
    });
}

function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    const galleryDiv = document.getElementById("gallerySection");
    galleryDiv.innerHTML = gallery.map(item => `
        <div class="col-12 col-md-6 col-lg-4">
          <img src="${item.src}" class="img-fluid"/>
          <p>${item.caption}</p>
        </div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    loadCustomText();
    loadGallery();
});

// File: jessica/upgrade/admin-dashboard.js
// Admin Dashboard Script
// Redirect if not admin
if (localStorage.getItem("isAdmin") !== "true") {
    window.location.href = "admin-login.html";
}

const countryCountEl = document.getElementById("countryInput");
const eventDateEl = document.getElementById("eventDateInput");

// Load saved stats
countryCountEl.value = localStorage.getItem("countryCount") || "";
eventDateEl.value = localStorage.getItem("eventDate") || "";

document
    .getElementById("statsForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.setItem("countryCount", countryCountEl.value);
        localStorage.setItem("eventDate", eventDateEl.value);
        alert("Stats updated successfully!");
    });

document
    .getElementById("uploadForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const fileInput = document.getElementById("imageInput");
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "img-fluid rounded shadow mt-3";
                img.style.maxWidth = "300px";
                const preview = document.getElementById("previewContainer");
                preview.innerHTML = "";
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

function logout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "soteeFashion.html";
}

function login(e) {
    e.preventDefault();
    const pass = document.getElementById("adminPass").value;
    const correct = "sotee16"; // Your admin password

    if (pass === correct) {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html"; // Redirect to dashboard
    } else {
        document.getElementById("errorMsg").innerText = "Invalid password.";
    }
}

// Redirect if not admin
if (localStorage.getItem("isAdmin") !== "true") {
    window.location.href = "admin-login.html";
}

// Admin Dashboard Script
// Load saved stats
countryCountEl.value = localStorage.getItem("countryCount") || "";
eventDateEl.value = localStorage.getItem("eventDate") || "";

document
    .getElementById("statsForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.setItem("countryCount", countryCountEl.value);
        localStorage.setItem("eventDate", eventDateEl.value);
        alert("Stats updated successfully!");
    });

document
    .getElementById("uploadForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        const fileInput = document.getElementById("imageInput");
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "img-fluid rounded shadow mt-3";
                img.style.maxWidth = "300px";
                const preview = document.getElementById("galleryGrid");
                preview.innerHTML = "";
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

function logout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "soteeFashion.html";
}

// live section for both youtude and facebook
async function initLive() {
    try {
        const response = await fetch('/data/settings.yml');
        const raw = await response.text();
        const config = jsyaml.load(raw);

        const settings = config.live_settings || {};
        const isLive = settings.live_active;
        const liveUrl = settings.live_url || '';
        const liveDesc = settings.live_desc || '';
        const prevUrl = settings.previous_live_url || '';
        const prevDesc = settings.previous_live_desc || '';

        // LIVE section
        if (isLive && liveUrl) {
            document.getElementById('live-container').style.display = 'block';
            document.getElementById('no-live').style.display = 'none';
            document.getElementById('live-desc').innerText = liveDesc;
            document.getElementById('live-frame').innerHTML = getEmbedFrame(liveUrl);
        } else {
            document.getElementById('live-container').style.display = 'none';
            document.getElementById('no-live').style.display = 'block';
        }

        // PREVIOUS section
        if (prevUrl) {
            document.getElementById('previous-live').style.display = 'block';
            document.getElementById('prev-desc').innerText = prevDesc;
            document.getElementById('prev-frame').innerHTML = getEmbedFrame(prevUrl);
        } else {
            document.getElementById('previous-live').style.display = 'none';
        }

    } catch (e) {
        console.error('Failed to load live settings:', e);
    }
}

function getEmbedFrame(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = extractYouTubeID(url);
        return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    }
    if (url.includes('facebook.com')) {
        return `<iframe
    src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1"
    width="100%" height="100%" style="border:none;overflow:hidden" scrolling="no" frameborder="0"
    allowfullscreen></iframe>`;
    }
    return `<p class="text-warning">Unsupported video platform. Only YouTube and Facebook Live are supported.</p>`;
}

function extractYouTubeID(url) {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') {
            return u.pathname.substring(1);
        } else {
            return u.searchParams.get('v');
        }
    } catch {
        return '';
    }
}

document.addEventListener('DOMContentLoaded', initLive);
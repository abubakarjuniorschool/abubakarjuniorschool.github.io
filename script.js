// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Close menu after clicking a link
document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Gallery lightbox
function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = src;
    lightbox.classList.add("active");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
}


document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".iron-works-grid");
    const lightbox = document.getElementById("ironLightbox");

    if (!gallery || !lightbox) return;

    const items = Array.from(
        gallery.querySelectorAll(".iron-work-card")
    );

    const lightboxImage = document.getElementById("ironLightboxImage");
    const lightboxTitle = document.getElementById("ironLightboxTitle");
    const lightboxCounter = document.getElementById("ironLightboxCounter");

    const closeButton = lightbox.querySelector(".iron-lightbox-close");
    const prevButton = lightbox.querySelector(".iron-lightbox-prev");
    const nextButton = lightbox.querySelector(".iron-lightbox-next");

    if (
        !items.length ||
        !lightboxImage ||
        !lightboxTitle ||
        !lightboxCounter ||
        !closeButton ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }

    let currentIndex = 0;
    let previousFocus = null;

    const showImage = (index) => {
        currentIndex = (index + items.length) % items.length;

        const item = items[currentIndex];
        const image = item.querySelector("img");

        lightboxImage.src = item.href;
        lightboxImage.alt = image?.alt || "";

        lightboxTitle.textContent =
            item.dataset.title || image?.alt || "أعمال الحديد";

        lightboxCounter.textContent =
            `${currentIndex + 1} / ${items.length}`;
    };

    const openLightbox = (index) => {
        previousFocus = document.activeElement;

        showImage(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("iron-lightbox-locked");

        closeButton.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("iron-lightbox-locked");

        lightboxImage.removeAttribute("src");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }

        previousFocus = null;
    };

    items.forEach((item, index) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    prevButton.addEventListener("click", () => {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showImage(currentIndex - 1);
        }

        if (event.key === "ArrowLeft") {
            showImage(currentIndex + 1);
        }
    });
});

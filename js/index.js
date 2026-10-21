
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navbarCollapse = document.querySelector("#mainNav");
    const navLinks = document.querySelectorAll("#mainNav .nav-link");

    const yearElement =
        document.querySelector("#currentYear") ||
        document.querySelector("#tadFooterYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const updateNavbar = () => {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        }
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    let menu = null;

    if (navbarCollapse && window.bootstrap?.Collapse) {
        menu = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
            toggle: false
        });

        if (menuToggle) {
            const syncMenuState = (isOpen) => {
                menuToggle.classList.toggle("active", isOpen);
                menuToggle.setAttribute("aria-expanded", String(isOpen));
            };

            navbarCollapse.addEventListener("show.bs.collapse", () => {
                syncMenuState(true);
            });

            navbarCollapse.addEventListener("hide.bs.collapse", () => {
                syncMenuState(false);
            });

            if (!menuToggle.hasAttribute("data-bs-toggle")) {
                menuToggle.addEventListener("click", (event) => {
                    event.preventDefault();
                    menu.toggle();
                });
            }
        }

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (
                    window.innerWidth < 992 &&
                    navbarCollapse.classList.contains("show")
                ) {
                    menu.hide();
                }
            });
        });
    } else if (navbarCollapse && menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navbarCollapse.classList.toggle("show");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove("show");
                    menuToggle.classList.remove("active");
                    menuToggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

 const sections = document.querySelectorAll(
    "#home, #about, #services, #why-us, #work-process, #gallery, #contact-us"
);

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const activeLink = document.querySelector(
                        `#mainNav .nav-link[href="#${entry.target.id}"]`
                    );

                    if (!activeLink) return;

                    navLinks.forEach((link) => {
                        link.classList.remove("active");
                    });

                    activeLink.classList.add("active");
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    const gallery = document.querySelector(".tad-gallery");

    if (gallery) {
        const items = Array.from(
            gallery.querySelectorAll(".tad-gallery-item")
        );

        const lightbox = gallery.querySelector("#tadGalleryLightbox");
        const lightboxImage = gallery.querySelector(
            ".tad-gallery-lightbox-image"
        );
        const closeButton = gallery.querySelector(".tad-gallery-close");
        const prevButton = gallery.querySelector(".tad-gallery-prev");
        const nextButton = gallery.querySelector(".tad-gallery-next");
        const counter = gallery.querySelector(".tad-gallery-counter");

        if (
            items.length &&
            lightbox &&
            lightboxImage &&
            closeButton &&
            prevButton &&
            nextButton &&
            counter
        ) {
            let currentIndex = 0;
            let previousFocus = null;

            const showImage = (index) => {
                currentIndex = (index + items.length) % items.length;

                const item = items[currentIndex];
                const image = item.querySelector("img");

                lightboxImage.src = item.href;
                lightboxImage.alt =
                    image?.alt || "صورة من أعمال مؤسسة طيف الضل 2";

                counter.textContent = `${currentIndex + 1} / ${items.length}`;
            };

            const openLightbox = (index) => {
                previousFocus = document.activeElement;

                showImage(index);

                lightbox.classList.add("is-open");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.classList.add("tad-gallery-locked");

                closeButton.focus();
            };

            const closeLightbox = () => {
                lightbox.classList.remove("is-open");
                lightbox.setAttribute("aria-hidden", "true");
                document.body.classList.remove("tad-gallery-locked");

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
        }
    }

    const form = document.getElementById("tadContactForm");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameField = document.getElementById("tadContactName");
            const phoneField = document.getElementById("tadContactPhone");
            const serviceField = document.getElementById("tadContactService");
            const messageField = document.getElementById("tadContactMessage");

            if (!nameField || !phoneField || !serviceField || !messageField) {
                console.error("تأكدي من وجود جميع حقول نموذج التواصل.");
                return;
            }

            const name = nameField.value.trim();
            const phone = phoneField.value.trim();
            const service = serviceField.value.trim();
            const message = messageField.value.trim();

            if (!name || !phone || !service) {
                form.reportValidity();
                return;
            }

            const whatsappMessage = [
                "مرحباً، أرغب في طلب خدمة من مؤسسة طيف الضل 2.",
                "",
                `الاسم: ${name}`,
                `رقم الهاتف: ${phone}`,
                `الخدمة المطلوبة: ${service}`,
                `تفاصيل الطلب: ${message || "لا توجد تفاصيل إضافية"}`
            ].join("\n");

            const whatsappURL =
                "https://wa.me/966562172756?text=" +
                encodeURIComponent(whatsappMessage);

            window.open(whatsappURL, "_blank", "noopener,noreferrer");

            form.reset();
        });
    }
});

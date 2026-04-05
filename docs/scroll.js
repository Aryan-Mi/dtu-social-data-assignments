/* ═══════════════════════════════════════════════════════════════════════════
   Scroll Observer — progress bar, step activation, fade-in animations
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    // ── Reading progress bar ─────────────────────────────────────────────────
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        const updateProgress = () => {
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable > 0) {
                const pct = (window.scrollY / scrollable) * 100;
                progressBar.style.width = pct.toFixed(2) + "%";
            }
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    // ── Step activation (sticky scroll sections) ────────────────────────────
    // When a step enters the central band of the viewport, mark it active.
    // All other steps in the same section become inactive.
    const stepObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const section = entry.target.closest(".sticky-section__steps");
                    if (section) {
                        section
                            .querySelectorAll(".step")
                            .forEach((s) => s.classList.remove("is-active"));
                    }
                    entry.target.classList.add("is-active");
                }
            });
        },
        {
            rootMargin: "-30% 0px -30% 0px",
            threshold: 0.1,
        }
    );

    document.querySelectorAll(".step").forEach((el) => stepObserver.observe(el));

    // ── Fade-in animations (non-sticky prose sections) ──────────────────────
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    fadeObserver.unobserve(entry.target); // animate only once
                }
            });
        },
        {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.08,
        }
    );

    // Auto-tag direct prose children for staggered fade-in
    document
        .querySelectorAll(".narrative-section .prose > *")
        .forEach((el, i) => {
            el.classList.add("fade-in");
            el.style.transitionDelay = `${i * 0.07}s`;
            fadeObserver.observe(el);
        });

    // ── Activate first step in each section on load ──────────────────────────
    document.querySelectorAll(".sticky-section__steps").forEach((section) => {
        const firstStep = section.querySelector(".step");
        if (firstStep) firstStep.classList.add("is-active");
    });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   Scroll Observer — activates .step elements and fade-in animations
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    // ── Step activation (sticky scroll sections) ────────────────────────────
    // When a step is ~40% visible in the viewport, mark it as active.
    // All other steps in the same section become inactive.
    const stepObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Deactivate siblings
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
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.1,
        }
    );

    // Auto-tag prose children for fade-in
    document
        .querySelectorAll(".narrative-section .prose > *")
        .forEach((el, i) => {
            el.classList.add("fade-in");
            el.style.transitionDelay = `${i * 0.08}s`;
            fadeObserver.observe(el);
        });

    // ── Activate first step on load ─────────────────────────────────────────
    document.querySelectorAll(".sticky-section__steps").forEach((section) => {
        const firstStep = section.querySelector(".step");
        if (firstStep) {
            firstStep.classList.add("is-active");
        }
    });
})();

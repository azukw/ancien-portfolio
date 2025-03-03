gsap.registerPlugin(Draggable);

window.onload = function () {
    const timeline = document.querySelector('.timeline');
    const scroller = document.querySelector('.scroller');
    const container = document.querySelector('.container');
    const images = document.querySelectorAll('.container .img'); // Sélectionne les images dans .container
    const gap = parseInt(window.getComputedStyle(document.body).fontSize);
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    let maxDragX;

    // Fonction pour recalculer les valeurs nécessaires
    function recalculateValues() {
        const imageWidth = images[0].offsetWidth + gap + 20; // Largeur d'une image + marge
        maxDragX = Math.max(0, images.length * imageWidth - window.innerWidth + 2 * gap);
        updateContainerPosition(gsap.getProperty(scroller, "x"));
    }

    // Calcul initial des valeurs
    recalculateValues();

    // Désactive le drag & drop natif des images
    images.forEach(img => {
        img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    function updateContainerPosition(scrollerX) {
        let progress = scrollerX / maxDragX;
        let containerX = -progress * ((images.length * (images[0].offsetWidth + gap + 20) - window.innerWidth) / 1.15);
        gsap.to(container, {
            x: containerX,
            duration: 0.6,
            ease: "power3.out",
        });
    }

    // Scroll avec la molette
    window.addEventListener("wheel", function (event) {
        event.preventDefault();
        let delta = event.deltaY;
        let newX = gsap.getProperty(scroller, "x") + delta;
        newX = Math.max(0, Math.min(newX, maxDragX));

        gsap.to(scroller, { x: newX, duration: 0.01, ease: "power3.out" });
        updateContainerPosition(newX);
    }, { passive: false });

    // Drag avec la souris
    container.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDown = true;
        isDragging = false;
        startX = e.pageX;
        scrollLeft = gsap.getProperty(scroller, "x");
        container.style.cursor = "grabbing";
    });

    container.addEventListener("mouseup", () => {
        isDown = false;
        setTimeout(() => isDragging = false, 50);
        container.style.cursor = "default";
    });

    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;

        const moveX = e.pageX - startX;
        let newX = Math.max(0, Math.min(scrollLeft - moveX, maxDragX));

        gsap.to(scroller, { x: newX, duration: 0.5, ease: "power3.out" });
        updateContainerPosition(newX);
    });

    // Empêche le faux clic après un glissement
    container.addEventListener("click", (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Recalculer les valeurs lors du redimensionnement de la fenêtre
    window.addEventListener("resize", recalculateValues);
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".img").forEach(img => {
        img.addEventListener("mouseenter", function () {
            const title = img.getAttribute("data-title");
            const number = img.getAttribute("data-number");
            const tech = img.getAttribute("data-tech");
            const year = img.getAttribute("data-year");

            img.querySelector(".project-number").textContent = `// ${number}`;
            img.querySelector(".project-title").textContent = title;
            img.querySelector(".project-tech").textContent = `${tech} - ${year}`;
        });
    });
});

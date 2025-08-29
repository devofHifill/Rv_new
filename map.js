const svgOverlay = document.getElementById("overlay-svg");
const modal = document.getElementById("errorModal");
const tooltip = document.getElementById("tooltip");
const baseImg = document.querySelector(".map-container img");

const fillColors = {
  booked: "#b22222",       // red (same as CSS legend/tooltip)
  available: "#228B22",    // green
  "available-soon": "#DAA520" // yellow
};

// Wait until image is loaded to set viewBox
baseImg.onload = () => {
  svgOverlay.setAttribute("viewBox", `0 0 ${baseImg.naturalWidth} ${baseImg.naturalHeight}`);
  svgOverlay.setAttribute("preserveAspectRatio", "xMidYMid meet");

  // Load cabins from JSON after viewBox is set
  fetch("cabins.json")
    .then(res => res.json())
    .then(cabins => {
      cabins.forEach(cabin => {
        const coords = cabin.coords.split(",").map(Number);
        const points = [];
        for (let i = 0; i < coords.length; i += 2) {
          points.push(`${coords[i]},${coords[i + 1]}`);
        }

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.join(" "));
        polygon.setAttribute("fill", fillColors[cabin.status] || "#ccc");
        polygon.setAttribute("opacity", "0.5");

        // Accessibility
        polygon.setAttribute("role", "button");
        polygon.setAttribute("aria-label", `${cabin.name} - ${cabin.status.replace("-", " ")}`);

        // Custom tooltip
        polygon.addEventListener("mousemove", (e) => {
          tooltip.style.display = "block";
          tooltip.textContent = `${cabin.name} - ${cabin.status.replace("-", " ")}`;

          // Reset + add class
          tooltip.classList.remove("booked", "available", "available-soon");
          tooltip.classList.add(cabin.status);

          // Position tooltip
          tooltip.style.left = (e.pageX + 15) + "px";
          tooltip.style.top = (e.pageY + 15) + "px";
        });

        polygon.addEventListener("mouseleave", () => {
          tooltip.style.display = "none";
        });

        // Click behavior
        polygon.addEventListener("click", (e) => {
          e.preventDefault();
          if (cabin.status === "booked") {
            openModal();
          } else if (cabin.status === "available" && cabin.href) {
            window.location.href = cabin.href;
          }
          // available-soon = no redirect, tooltip only
        });

        svgOverlay.appendChild(polygon);
      });
    })
    .catch(err => console.error("Error loading cabins.json:", err));
};

// Modal controls
function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

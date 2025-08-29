const svgOverlay = document.getElementById("overlay-svg");
const modal = document.getElementById("errorModal");
const tooltip = document.getElementById("tooltip");

const fillColors = {
  booked: "#FF7F7F",          // red
  available: "#7FFF7F",       // green
  "available-soon": "#FFD966" // yellow
};

// Load cabins from JSON
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

      // Remove browser default tooltip
      polygon.removeAttribute("title");

      // Custom tooltip
      polygon.addEventListener("mousemove", (e) => {
        tooltip.style.display = "block";
        tooltip.textContent = `${cabin.name} - ${cabin.status.replace("-", " ")}`;

        // Reset classes
        tooltip.classList.remove("booked", "available", "available-soon");

        // Add class based on status
        tooltip.classList.add(cabin.status);

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
        // available-soon = no redirect, just tooltip
      });

      svgOverlay.appendChild(polygon);
    });
  })
  .catch(err => console.error("Error loading cabins.json:", err));

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

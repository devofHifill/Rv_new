const svgOverlay = document.getElementById("overlay-svg");
const modal = document.getElementById("errorModal");
const tooltip = document.getElementById("tooltip");

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
      polygon.setAttribute("fill", cabin.status === "booked" ? "#FF7F7F" : "#7FFF7F");
      polygon.setAttribute("opacity", "0.5");

      // Tooltip
      polygon.addEventListener("mousemove", (e) => {
        tooltip.style.display = "block";
        tooltip.textContent = `${cabin.name} - ${cabin.status}`;
        tooltip.style.left = (e.pageX + 10) + "px";
        tooltip.style.top = (e.pageY + 10) + "px";
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
      });

      svgOverlay.appendChild(polygon);
    });
  });

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

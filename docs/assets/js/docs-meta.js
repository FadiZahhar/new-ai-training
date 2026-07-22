(() => {
  const article = document.querySelector(".md-content__inner");
  if (!article) return;
  if (article.querySelector(".doc-meta-footer")) return;

  const path = window.location.pathname || "/";
  const last = new Date(document.lastModified);
  const formatted = Number.isNaN(last.getTime()) ? "Unknown" : `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;

  const footer = document.createElement("div");
  footer.className = "doc-meta-footer";
  footer.innerHTML = `
    <p><strong>Owner:</strong> AI Training Team</p>
    <p><strong>Last updated:</strong> ${formatted}</p>
    <p><strong>Path:</strong> <code>${path}</code></p>
  `;
  article.appendChild(footer);
})();

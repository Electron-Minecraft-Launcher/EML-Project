async function includeHTML(selector, file) {
  const el = document.querySelector(selector);
  const res = await fetch(file);
  if (res.ok) el.innerHTML = await res.text();
}
document.body.style.opacity = "0"
await includeHTML("header", `/static/layout/header.html`)
await includeHTML("footer", `/static/layout/footer.html`)
document.body.style.opacity = "1"
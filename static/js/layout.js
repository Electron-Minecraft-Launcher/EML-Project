async function includeHTML(selector, file) {
  const el = document.querySelector(selector);
  const res = await fetch(file);
  if (res.ok) el.innerHTML = await res.text();
}
const LOC = globalThis.location.protocol + "//" + globalThis.location.hostname
document.body.style.opacity = "0"
await includeHTML("header", `/static/layout/header.html`)
await includeHTML("footer", `/static/layout/footer.html`)
// await includeHTML("header", `${LOC}/static/layout/header.html`)
// await includeHTML("footer", `${LOC}/static/layout/footer.html`)
document.body.style.opacity = "1"
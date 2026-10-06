// 30 dots, 10 highlighted (1 in 3), revealed with a stagger
const dots = document.getElementById("dots"),
  hits = new Set();
while (hits.size < 10) hits.add(Math.floor(Math.random() * 30));
for (let i = 0; i < 30; i++) {
  const d = document.createElement("i");
  if (hits.has(i)) {
    d.className = "hit";
    d.style.transitionDelay =
      (hits.size ? [...hits].indexOf(i) * 70 : 0) + "ms";
  }
  dots.appendChild(d);
}
const btn = document.getElementById("revealBtn"),
  cap = document.getElementById("dotsCap");
function toggle() {
  const on = dots.classList.toggle("reveal");
  btn.textContent = on ? "Hide" : "Reveal 1 in 3";
  cap.textContent = on
    ? "10 of these 30 women will experience violence in their lifetime."
    : "Each dot is a woman. Tap to see how many are affected.";
}
btn.addEventListener("click", toggle);
dots.addEventListener("click", toggle);

// counters
const fmt = (n) => n.toLocaleString("en-US");
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target,
        to = +el.dataset.to,
        suf = el.dataset.suffix || "";
      if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
        el.textContent = fmt(to) + suf;
        return;
      }
      const t0 = performance.now();
      (function s(t) {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = fmt(Math.round(to * p)) + suf;
        if (p < 1) requestAnimationFrame(s);
      })(t0);
    }),
  { threshold: 0.4 },
);
document.querySelectorAll(".count").forEach((c) => io.observe(c));

// myth cards
document.querySelectorAll(".mf").forEach((c) =>
  c.addEventListener("click", () => {
    c.setAttribute("aria-expanded", c.classList.toggle("open"));
  }),
);

// pledge form
document.getElementById("pledge").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  let ok = true;
  f.querySelectorAll("input,select").forEach((i) => {
    const v = i.checkValidity();
    i.classList.toggle("is-invalid", !v);
    if (!v) ok = false;
  });
  const m = document.getElementById("pledgeMsg");
  if (ok) {
    m.textContent =
      "Thank you, " +
      f.name.value.trim() +
      ". You pledged to " +
      f.vow.value +
      ".";
    f.reset();
  } else m.textContent = "";
});

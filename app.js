const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#yr").textContent = new Date().getFullYear();

// Scroll reveal. IntersectionObserver, not a scroll listener.
if (!reduced && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// ---- terminal ----
const term = $("#term"), out = $("#term-out"), input = $("#term-input"), hint = $("#hint");
const hist = []; let hi = 0, opener = null;
const print = (html) => { out.insertAdjacentHTML("beforeend", html + "\n"); out.scrollTop = out.scrollHeight; };
if (!reduced) hint.classList.add("pulse");

const commands = {
  help: () => print([
    `<span class="c">about</span>          who I am`,
    `<span class="c">skills</span>         my tech superpowers`,
    `<span class="c">projects</span>       list projects`,
    `<span class="c">open</span> &lt;name&gt;    details, e.g. <span class="d">open orion</span>`,
    `<span class="c">goto</span> &lt;section&gt; jump on the page: projects, skills, about, contact`,
    `<span class="c">aws</span>            how this site is hosted`,
    `<span class="c">contact</span>        reach me`,
    `<span class="c">theme</span> <span class="d">dark|light</span>`,
    `<span class="c">fortune</span>        a motto`,
    `<span class="c">clear</span>, <span class="c">exit</span>`].join("\n")),
  about: () => print("Jason Oladipo Hughes. Final-year Software Engineering student at Nile University of Nigeria (GPA 4.8).\nSole founder of Migaki Studio. Backend engineer in Abuja."),
  skills: () => print(Object.entries(DATA.skills).map(([k, v]) => `<span class="c">${esc(k)}</span>\n  ${esc(v)}`).join("\n")),
  projects: () => print(DATA.projects.map(([id, n]) => `<span class="c">${id.padEnd(11)}</span> ${esc(n)}`).join("\n") + `\n<span class="d">Type: open &lt;name&gt;</span>`),
  open: (a) => {
    const p = DATA.projects.find(([id, n]) => id === a.toLowerCase() || n.toLowerCase() === a.toLowerCase());
    if (!p) return print(`No project "${esc(a)}". Try <span class="c">projects</span>.`);
    print(`<span class="c">${esc(p[1])}</span>\n${esc(p[2]).replace(/(https:\/\/\S+)/, '<a href="$1" target="_blank" rel="noopener">$1</a>')}`);
  },
  goto: (a) => {
    const el = document.getElementById(a.toLowerCase());
    if (!el) return print("Sections: projects, skills, about, contact");
    closeTerm(); el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  },
  aws: () => print(esc(DATA.aws)),
  contact: () => print(DATA.contact.map(([k, v, h]) => `${k.padEnd(9)} <a href="${h}" target="_blank" rel="noopener">${esc(v)}</a>`).join("\n")),
  theme: (a) => {
    const t = a.toLowerCase();
    if (t !== "dark" && t !== "light") return print("Usage: theme dark | light");
    document.documentElement.dataset.theme = t; print(`Theme set to ${t}.`);
  },
  fortune: () => print(esc(DATA.mottos[Math.floor(Math.random() * DATA.mottos.length)])),
  clear: () => { out.innerHTML = ""; },
  exit: () => closeTerm(),
};
commands.ls = commands.projects; commands.whoami = commands.about;
commands.sudo = () => print("Nice try.");

function run(raw) {
  const [cmd, ...rest] = raw.trim().split(/\s+/);
  if (!cmd) return;
  print(`<span class="c">$</span> ${esc(raw)}`);
  const fn = commands[cmd.toLowerCase()];
  fn ? fn(rest.join(" ")) : print(`command not found: ${esc(cmd)}. Type <span class="c">help</span>.`);
}

function openTerm() {
  opener = document.activeElement; term.hidden = false; hint.hidden = true;
  if (!out.innerHTML) print(`<span class="c">Hi, I'm Jason.</span> Type <span class="c">help</span> to explore, or <span class="c">open orion</span> to start.`);
  input.focus();
}
function closeTerm() { term.hidden = true; hint.hidden = false; if (opener && opener.focus) opener.focus(); }

for (const id of ["#term-open", "#term-open-2", "#hint"]) $(id).addEventListener("click", openTerm);
$("#term-close").addEventListener("click", closeTerm);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { hist.push(input.value); hi = hist.length; run(input.value); input.value = ""; }
  else if (e.key === "ArrowUp" && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
  else if (e.key === "ArrowDown") { hi = Math.min(hi + 1, hist.length); input.value = hist[hi] || ""; }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !term.hidden) closeTerm();
  else if (e.key === "`" && term.hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openTerm(); }
});

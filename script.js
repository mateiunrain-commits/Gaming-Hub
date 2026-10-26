const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const games = [
  {name:"VALORANT",category:"Shooter",type:"TACTICAL FPS",symbol:"◈",color:"#ff5e77",desc:"Precizie, strategie și abilități unice.",url:"https://playvalorant.com/"},
  {name:"FORTNITE",category:"Competitive",type:"BATTLE ROYALE",symbol:"✦",color:"#5d8dff",desc:"Construiește, luptă și fii ultimul în picioare.",url:"https://www.fortnite.com/"},
  {name:"MINECRAFT",category:"Adventure",type:"SANDBOX",symbol:"▦",color:"#6ee58a",desc:"Construiește-ți propria lume, bloc cu bloc.",url:"https://www.minecraft.net/"},
  {name:"BRAWL STARS",category:"Competitive",type:"ACTION ARENA",symbol:"★",color:"#ffbd4a",desc:"Bătălii rapide, brawleri și multă acțiune.",url:"https://supercell.com/en/games/brawlstars/"},
  {name:"APEX LEGENDS",category:"Shooter",type:"HERO SHOOTER",symbol:"△",color:"#ff665f",desc:"Mișcare rapidă și lupte în echipă.",url:"https://www.ea.com/games/apex-legends"},
  {name:"ROCKET LEAGUE",category:"Competitive",type:"ARCADE SPORTS",symbol:"⚽",color:"#50e8f4",desc:"Fotbal cu mașini și goluri spectaculoase.",url:"https://www.rocketleague.com/"}
];
const artGradients = {
  "VALORANT":"linear-gradient(135deg,#321b35,#16182c)",
  "FORTNITE":"linear-gradient(135deg,#172d5b,#281a4a)",
  "MINECRAFT":"linear-gradient(135deg,#163d31,#192a32)",
  "BRAWL STARS":"linear-gradient(135deg,#49301b,#2e1d31)",
  "APEX LEGENDS":"linear-gradient(135deg,#4a1c25,#211628)",
  "ROCKET LEAGUE":"linear-gradient(135deg,#123b4c,#171d3b)"
};
function gameCard(game){
  return `<article class="game-card">
    <div class="game-art" style="background:${artGradients[game.name]};--art-color:${game.color}">
      <span class="game-label">${game.type}</span><span class="game-symbol" aria-hidden="true">${game.symbol}</span>
      <button class="game-open" data-open="${game.name}" aria-label="Deschide pagina ${game.name}" title="Pagina oficială">↗</button>
    </div>
    <div class="game-info"><h3>${game.name}</h3><p>${game.desc}</p><div class="game-meta"><span class="game-category">${game.category.toUpperCase()}</span><span>OFFICIAL SITE ↗</span></div></div>
  </article>`;
}
function renderGames(){
  $("#featuredGames").innerHTML = games.slice(0,3).map(gameCard).join("");
  filterGames();
}
let activeFilter = "All";
function filterGames(){
  const term = ($("#gameSearch")?.value || "").trim().toLowerCase();
  const filtered = games.filter(g => (activeFilter === "All" || g.category === activeFilter) &&
    `${g.name} ${g.category} ${g.desc} ${g.type}`.toLowerCase().includes(term));
  $("#allGames").innerHTML = filtered.map(gameCard).join("");
  $("#emptyState").classList.toggle("hidden", filtered.length > 0);
}
function showToast(message){
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function goTo(view){
  const names = {overview:"Overview",games:"Game Hub",arcade:"Arcade",profile:"Profil gamer"};
  if(!names[view]) return;
  $$(".view").forEach(section => section.classList.toggle("active", section.id === `${view}View`));
  $$(".nav-item[data-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  $("#crumb").textContent = names[view];
  $("#sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-view]").forEach(btn => btn.addEventListener("click", () => goTo(btn.dataset.view)));
$$("[data-goto]").forEach(btn => btn.addEventListener("click", () => goTo(btn.dataset.goto)));
$("#jumpProfile").addEventListener("click", () => goTo("profile"));
$("#topProfile").addEventListener("click", () => goTo("profile"));
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

document.addEventListener("click", event => {
  const openButton = event.target.closest("[data-open]");
  if(openButton){
    const game = games.find(g => g.name === openButton.dataset.open);
    if(game) window.open(game.url, "_blank", "noopener,noreferrer");
  }
});

$("#gameSearch").addEventListener("input", filterGames);
$$(".filter").forEach(btn => btn.addEventListener("click", () => {
  activeFilter = btn.dataset.filter;
  $$(".filter").forEach(item => item.classList.toggle("active", item === btn));
  filterGames();
}));

function applyTheme(theme){
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem("godsite-theme", theme);
}
function toggleTheme(){
  const next = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(next);
  showToast(next === "light" ? "Tema light activată ☀" : "Tema neon dark activată ✦");
}
$("#themeToggle").addEventListener("click", toggleTheme);
$("#quickTheme").addEventListener("click", toggleTheme);
$("#fxToggle").addEventListener("click", () => {
  document.body.classList.toggle("no-fx");
  const enabled = !document.body.classList.contains("no-fx");
  localStorage.setItem("godsite-fx", enabled ? "on" : "off");
  showToast(enabled ? "Efecte neon activate ✨" : "Efecte neon dezactivate");
});
if(localStorage.getItem("godsite-theme")) applyTheme(localStorage.getItem("godsite-theme"));
if(localStorage.getItem("godsite-fx") === "off") document.body.classList.add("no-fx");

function updateClock(){
  $("#clock").textContent = new Intl.DateTimeFormat("ro-RO",{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());
}
updateClock();
setInterval(updateClock,1000);

const savedProfile = JSON.parse(localStorage.getItem("godsite-profile") || "null");
const colorMap = {violet:["#9b72ff","#50e8f4"],cyan:["#50e8f4","#9b72ff"],pink:["#ff67cf","#8e72ff"],green:["#63efb2","#50c9f4"]};
function setAccent(color, save = true){
  const pair = colorMap[color] || colorMap.violet;
  document.documentElement.style.setProperty("--accent",pair[0]);
  document.documentElement.style.setProperty("--purple",pair[0]);
  document.documentElement.style.setProperty("--cyan",pair[1]);
  $$(".color-swatch").forEach(btn => btn.classList.toggle("selected",btn.dataset.color === color));
  if(save){
    const profile = JSON.parse(localStorage.getItem("godsite-profile") || "{}");
    profile.color = color;
    localStorage.setItem("godsite-profile",JSON.stringify(profile));
  }
}
function renderProfile(name,bio){
  const safeName = (name || "The_Vexor").trim().slice(0,18) || "The_Vexor";
  const safeBio = (bio || "").trim().slice(0,90);
  $("#previewName").textContent = safeName;
  $("#miniName").textContent = safeName;
  $("#profileAvatar").textContent = safeName.slice(0,1).toUpperCase();
  $("#topProfile").textContent = safeName.slice(0,1).toUpperCase();
  $("#previewBio").textContent = safeBio || "Ready to level up. ⚡";
}
if(savedProfile){
  $("#playerName").value = savedProfile.name || "The_Vexor";
  $("#playerBio").value = savedProfile.bio || "Just here to level up. ⚡";
  renderProfile(savedProfile.name,savedProfile.bio);
  if(savedProfile.color) setAccent(savedProfile.color,false);
}
$$(".color-swatch").forEach(btn => btn.addEventListener("click", () => setAccent(btn.dataset.color)));
$("#playerName").addEventListener("input", () => renderProfile($("#playerName").value,$("#playerBio").value));
$("#playerBio").addEventListener("input", () => renderProfile($("#playerName").value,$("#playerBio").value));
$("#profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const profile = {name:$("#playerName").value.trim() || "The_Vexor",bio:$("#playerBio").value.trim(),color:$(".color-swatch.selected")?.dataset.color || "violet"};
  localStorage.setItem("godsite-profile",JSON.stringify(profile));
  renderProfile(profile.name,profile.bio);
  showToast("Profil salvat în browser! ✓");
  $("#formNote").textContent = "Salvat cu succes. Modificările rămân pe acest dispozitiv.";
});

let reactionState = "idle", startTimeout = null, startTime = 0;
let best = Number(localStorage.getItem("godsite-best-time") || 0);
$("#bestTime").textContent = best ? `${best} ms` : "— ms";
function resetReaction(){
  clearTimeout(startTimeout);
  reactionState = "idle";
  $("#reactionZone").className = "reaction-zone";
  $("#reactionIcon").textContent = "✦";
  $("#reactionMessage").textContent = "READY?";
  $("#reactionSub").textContent = "Apasă START ca să începi";
  $("#startReaction").disabled = false;
  $("#startReaction").style.opacity = "1";
  $("#startReaction").innerHTML = 'Start game <span>▷</span>';
}
$("#startReaction").addEventListener("click", () => {
  clearTimeout(startTimeout);
  reactionState = "waiting";
  $("#reactionZone").className = "reaction-zone waiting";
  $("#reactionIcon").textContent = "⌛";
  $("#reactionMessage").textContent = "WAIT FOR GREEN";
  $("#reactionSub").textContent = "Nu apăsa încă...";
  $("#startReaction").disabled = true;
  $("#startReaction").style.opacity = ".5";
  $("#arcadeNote").textContent = "Concentrează-te... și așteaptă verdele!";
  startTimeout = setTimeout(() => {
    if(reactionState !== "waiting") return;
    reactionState = "go";
    startTime = performance.now();
    $("#reactionZone").className = "reaction-zone go";
    $("#reactionIcon").textContent = "⚡";
    $("#reactionMessage").textContent = "NOW! CLICK!";
    $("#reactionSub").textContent = "Apasă aici cât de repede poți";
  }, 1400 + Math.random() * 2600);
});
$("#reactionZone").addEventListener("click", () => {
  if(reactionState === "waiting"){
    reactionState = "early";
    clearTimeout(startTimeout);
    $("#reactionZone").className = "reaction-zone early";
    $("#reactionIcon").textContent = "✕";
    $("#reactionMessage").textContent = "TOO EARLY!";
    $("#reactionSub").textContent = "Ai apăsat înainte de verde.";
    $("#startReaction").disabled = false;
    $("#startReaction").style.opacity = "1";
    $("#startReaction").innerHTML = 'Try again <span>↻</span>';
    $("#arcadeNote").textContent = "Răbdarea contează! Încearcă din nou.";
  }else if(reactionState === "go"){
    const ms = Math.round(performance.now() - startTime);
    reactionState = "done";
    $("#reactionZone").className = "reaction-zone";
    $("#reactionIcon").textContent = "✦";
    $("#reactionMessage").textContent = `${ms} ms`;
    $("#reactionSub").textContent = ms < 250 ? "Reflexe excelente!" : ms < 400 ? "Foarte bine! Mai încearcă." : "Poți bate timpul acesta!";
    $("#startReaction").disabled = false;
    $("#startReaction").style.opacity = "1";
    $("#startReaction").innerHTML = 'Play again <span>↻</span>';
    if(!best || ms < best){
      best = ms;
      localStorage.setItem("godsite-best-time",String(best));
      $("#bestTime").textContent = `${best} ms`;
      $("#arcadeNote").textContent = "RECORD NOU! Cel mai bun timp al tău. 🏆";
      showToast("Record nou! ⚡ " + ms + " ms");
      const points = Number(localStorage.getItem("godsite-points") || 250) + 50;
      localStorage.setItem("godsite-points",String(points));
      $("#auraPoints").innerHTML = `${points} <span>AP</span>`;
    }else{
      $("#arcadeNote").textContent = "Nice try! Mai joacă o rundă pentru a-ți bate recordul.";
    }
  }
});
renderGames();
const savedPoints = Number(localStorage.getItem("godsite-points") || 250);
$("#auraPoints").innerHTML = `${savedPoints} <span>AP</span>`;

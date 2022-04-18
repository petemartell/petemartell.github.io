const ordbog = ord.split(',');
const vaelgOrd = () => ordbog[Math.floor(Math.random() * ordbog.length)];
const korrekt = vaelgOrd();
const input = document.getElementById("input");
const gaetknap = document.getElementById("gaet");
const rubrikker = document.getElementsByTagName("div");
let forsoeg = 0;

const tjekSvar = () => {
  let gaet = input.value.toLowerCase();
  if (gaet.length === 5 && ordbog.includes(gaet)) {
    for (let i = 0; i < 5; i++) {
      rubrikker[i + 5 * forsoeg].innerHTML = gaet[i].toUpperCase();
      rubrikker[i + 5 * forsoeg].style.backgroundColor
        = rubrikker[i + 5 * forsoeg].style.borderColor 
        = gaet[i] === korrekt[i] ? "#6aaa64" : korrekt.includes(gaet[i]) ? "#c9b458" : "#3a3a3c";
    }
    if (gaet === korrekt) {
        tillykke();
    } else if (forsoeg === 5) {
        fiasko();
    }
    forsoeg++;
    input.value = "";
  }
}

input.addEventListener("keydown", function onEvent(event) {
  if (event.key === "Enter") tjekSvar();
  if(!/\p{L}/u.test(event.key)) event.preventDefault();
});
gaetknap.addEventListener("click", tjekSvar);

const tillykke = () => {
  document.body.innerHTML += `<div id="besked"><h1>Tillykke, du vandt!</h1><h3>Du er velkommen til at spille igen<br> med et nyt ord:</h3><button onclick="window.location.reload();">NYT SPIL</button></div>`;
}
const fiasko = () => {
  document.body.innerHTML += `<div id="besked"><h1>Desværre!</h1><h3>Ordet var "${korrekt}".<br>Du er velkommen til at spille igen<br> med et nyt ord:</h3><button onclick="window.location.reload();">NYT SPIL</button></div>`;
}


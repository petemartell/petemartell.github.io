const ordbog = ord.split(',');
const vaelgOrd = () => ordbog[Math.floor(Math.random() * ordbog.length)];
const korrekt = vaelgOrd();
const bogstaver = [...taster.values()].reduce((acc, tast) => [...acc, tast.innerText.toLowerCase()], []);

let gyldig = [];
let forsoeg = 0;
let svar = '';
let tastelyttere = new Map();

const forkertBogstav = (bogstav) => {
  taster[bogstaver.indexOf(bogstav)].style.backgroundColor = 'var(--dark-gray)';
  return 'var(--dark-gray)';
}

const forkertPlads = (i) => {
  if ([...svar].some((_, j) => i != j && svar[i] != svar[j] && svar[i] === korrekt[j])) {
    return 'var(--sickly-yellow)';
  } else {
    return 'var(--dark-gray)';
  }  
}

const farvelaeg = () => {
  for (let i = 0; i < 5; i++) {
    plade[i + 5 * forsoeg].style.backgroundColor
      = plade[i + 5 * forsoeg].style.borderColor 
      = svar[i] === korrekt[i] ?  'var(--forest-green)' : korrekt.includes(svar[i]) ? forkertPlads(i) : forkertBogstav(svar[i]);
  }
}

const tjekSvar = () => {
  if (ordbog.includes(svar)) {
    farvelaeg();
    if (svar === korrekt) {
      sendBesked(`<h2>Tillykke, du vandt!</h2><h3>Ordet var ganske rigtigt "${korrekt}".<br><br>Du er velkommen til at spille igen med et nyt ord:</h3><button onclick="window.location.reload();" class="knap" autofocus>NYT SPIL</button>`, false);
      stopIndtastning();
    } else if (forsoeg === 5) {
      sendBesked(`<h2>Desværre!</h2><h3>Det korrekte ord var "${korrekt}".<br><br>Du er velkommen til at spille igen med et nyt ord:</h3><button onclick="window.location.reload();" class="knap">NYT SPIL</button>`, false);
      stopIndtastning();
    }
    forsoeg++;
    svar = '';
  } else {
    sendBesked("<h3>Dit gæt er ikke på listen<br>over gyldige ord.</h3>", true);    
  }
}

const startIndtastning = () => {
  document.addEventListener('keydown', lytFysiskTastatur);
  slet.addEventListener('click', lytBackspace);
  retur.addEventListener('click', lytRetur);
  
  for (let tast of taster) {
    gyldig.push(tast.innerText.toLowerCase());
    tastelyttere.set(tast, (event) => {
      if (svar.length < 5) {
        let bogstav = document.createElement('div');
        bogstav.className = 'bogstav';
        bogstav.innerHTML = tast.innerText;
        svar += tast.innerText.toLowerCase();
        plade[svar.length - 1 + 5*forsoeg].appendChild(bogstav);
      }
    });
    tast.addEventListener('click', tastelyttere.get(tast));
  }
}

const stopIndtastning = () => {
  document.removeEventListener('keydown', lytFysiskTastatur);
  slet.removeEventListener('click', lytBackspace);
  retur.removeEventListener('click', lytRetur);
  tastelyttere.forEach((tast, lytTast) => tast.removeEventListener('click', lytTast));
}

const lytFysiskTastatur = (event) => {
  let tast = event.key.toLowerCase();
  if (gyldig.includes(tast) && svar.length < 5) {
    svar += tast;
    let bogstav = document.createElement('div');
    bogstav.className = 'bogstav';
    bogstav.innerHTML = tast;
    plade[svar.length - 1 + 5*forsoeg].appendChild(bogstav);
  } else if (tast === 'backspace' && svar.length > 0) {
    svar = svar.slice(0, -1);
    plade[svar.length + 5*forsoeg].innerHTML = '';
  } else if (tast === 'enter' && svar.length === 5) {
    tjekSvar();
  }
}

const lytBackspace = (event) => {
  if (svar.length > 0) {
    svar = svar.slice(0, -1);
    plade[svar.length + 5*forsoeg].innerHTML = '';
  }
}

const lytRetur = (event) => {
  if (svar.length === 5) {
    tjekSvar();
  }
}

const sendBesked = (indhold, skalForsvinde) => {
  let besked = document.createElement('div');
  besked.className = 'besked';
  besked.innerHTML = indhold;
  document.body.appendChild(besked);
  besked.style.opacity = '1';
  if (skalForsvinde) {
    window.setTimeout(lukBesked, 1300, besked);
  } else {
    let kryds = document.createElement('div');
    kryds.className = 'kryds';
    kryds.innerHTML = '×';
    besked.appendChild(kryds);
    let skygge = document.createElement('div');
    skygge.className = 'skygge';
    document.body.appendChild(skygge);
    kryds.addEventListener('click', (event) => { 
      lukBesked(besked); 
      document.body.removeChild(skygge); 
    });
  }
}

const lukBesked = (besked) => {
  besked.style.opacity = '0';
  window.setTimeout(() => document.body.removeChild(besked), 350);
}

alert(korrekt);
startIndtastning();
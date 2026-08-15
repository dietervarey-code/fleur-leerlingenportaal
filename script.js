/* ========================================
   WEER
======================================== */

const weerCodes = {
    0:  { icoon: "☀️",  naam: "Stralend zonnig" },
    1:  { icoon: "🌤️", naam: "Overwegend zonnig" },
    2:  { icoon: "⛅",  naam: "Wisselend bewolkt" },
    3:  { icoon: "☁️",  naam: "Bewolkt" },
    45: { icoon: "🌫️", naam: "Mistig" },
    48: { icoon: "🌫️", naam: "IJsmist" },
    51: { icoon: "🌦️", naam: "Lichte motregen" },
    53: { icoon: "🌦️", naam: "Motregen" },
    55: { icoon: "🌧️", naam: "Zware motregen" },
    56: { icoon: "🌨️", naam: "IJzel" },
    57: { icoon: "🌨️", naam: "Zware ijzel" },
    61: { icoon: "🌧️", naam: "Lichte regen" },
    63: { icoon: "🌧️", naam: "Regen" },
    65: { icoon: "🌧️", naam: "Zware regen" },
    66: { icoon: "🌨️", naam: "Bevriezende regen" },
    67: { icoon: "🌨️", naam: "Zware bevriezende regen" },
    71: { icoon: "❄️",  naam: "Lichte sneeuw" },
    73: { icoon: "❄️",  naam: "Sneeuw" },
    75: { icoon: "❄️",  naam: "Zware sneeuw" },
    77: { icoon: "🌨️", naam: "IJskristallen" },
    80: { icoon: "🌦️", naam: "Lichte buien" },
    81: { icoon: "🌧️", naam: "Buien" },
    82: { icoon: "⛈️",  naam: "Zware buien" },
    85: { icoon: "🌨️", naam: "Sneeuwbuien" },
    86: { icoon: "🌨️", naam: "Zware sneeuwbuien" },
    95: { icoon: "⛈️",  naam: "Onweer" },
    96: { icoon: "⛈️",  naam: "Onweer met hagel" },
    99: { icoon: "⛈️",  naam: "Zwaar onweer met hagel" }
};


function haalWeer() {

    const element =
        document.getElementById("weer-status");

    if (!element) {
        return;
    }

    if (!navigator.geolocation) {
        element.textContent = "";
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(positie) {

            const lat =
                positie.coords.latitude.toFixed(4);

            const lon =
                positie.coords.longitude.toFixed(4);

            fetch(
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=" + lat +
                "&longitude=" + lon +
                "&current=temperature_2m,apparent_temperature,weather_code" +
                "&timezone=auto"
            )
            .then(function(r) {
                return r.json();
            })
            .then(function(data) {

                const temp =
                    Math.round(
                        data.current.temperature_2m
                    );

                const gevoels =
                    Math.round(
                        data.current.apparent_temperature
                    );

                const code =
                    data.current.weather_code;

                const weer =
                    weerCodes[code] ||
                    { icoon: "🌡️", naam: "Onbekend" };

                let html =
                    weer.icoon +
                    " <strong>" + temp + "°C</strong>" +
                    " · " + weer.naam;

                // Voeltemperatuur tonen als die erg verschilt
                if (Math.abs(gevoels - temp) >= 3) {
                    html +=
                        " <span class='gevoels'>" +
                        "(voelt als " + gevoels + "°)" +
                        "</span>";
                }

                element.innerHTML = html;

            })
            .catch(function() {
                element.textContent = "";
            });

        },

        function() {
            // Locatie geweigerd — geen weer tonen
            element.textContent = "";
        },

        {
            timeout:     8000,
            maximumAge:  600000  // 10 min cache
        }

    );

}


/* ========================================
   SCHOOLSTATUS
======================================== */

const vandaag = new Date();

const jaar =
    vandaag.getFullYear();

const maand =
    vandaag.getMonth() + 1;

const dag =
    vandaag.getDate();


const datum =
    `${jaar}-${String(maand).padStart(2, "0")}-${String(dag).padStart(2, "0")}`;


const vrijeDagen = {

    "2026-10-07":
        "🧑‍🏫 Pedagogische studiedag",

    "2026-11-11":
        "🕊️ Wapenstilstand",

    "2027-01-20":
        "🧑‍🏫 Pedagogische studiedag",

    "2027-04-21":
        "🧑‍🏫 Pedagogische studiedag",

    "2027-05-06":
        "🇧🇪 Hemelvaartsdag",

    "2027-05-07":
        "🌉 Brugdag",

    "2027-05-17":
        "🕊️ Pinkstermaandag"

};


const vakanties = [

    {
        naam:
            "☀️ Zomervakantie",

        begin:
            "2026-07-01",

        einde:
            "2026-08-31"
    },

    {
        naam:
            "🍂 Herfstvakantie",

        begin:
            "2026-11-02",

        einde:
            "2026-11-07"
    },

    {
        naam:
            "🎄 Kerstvakantie",

        begin:
            "2026-12-21",

        einde:
            "2027-01-03"
    },

    {
        naam:
            "🌷 Krokusvakantie",

        begin:
            "2027-02-08",

        einde:
            "2027-02-14"
    },

    {
        naam:
            "🐣 Paasvakantie",

        begin:
            "2027-03-29",

        einde:
            "2027-04-11"
    },

    {
        naam:
            "☀️ Zomervakantie",

        begin:
            "2027-07-01",

        einde:
            "2027-08-31"
    }

];


function toonSchoolStatus() {

    let bericht =
        "📚 Vandaag is een schooldag!";


    if (vrijeDagen[datum]) {

        bericht =
            `🎉 Vandaag heb je geen school!<br>
            ${vrijeDagen[datum]}`;

    }
    else {

        for (
            const vakantie of vakanties
        ) {

            if (
                datum >= vakantie.begin &&
                datum <= vakantie.einde
            ) {

                bericht =
                    `🏖️ Vandaag heb je vakantie!<br>
                    ${vakantie.naam}`;

                break;

            }

        }

    }


    const status =
        document.getElementById(
            "school-status"
        );


    if (status) {

        status.innerHTML =
            bericht;

    }

}


/* ========================================
   LESSEN
======================================== */

let lessen =
    JSON.parse(
        localStorage.getItem("lessen")
    ) || [];


let geselecteerdIcono  = "📖";
let lessenBewerkIndex  = null;


function voegLesToe() {

    lessenBewerkIndex = null;
    geselecteerdIcono = "📖";

    document.getElementById(
        "les-naam"
    ).value = "";

    document.querySelectorAll(
        ".icoon-optie"
    ).forEach(function(btn) {
        btn.classList.remove("geselecteerd");
    });

    const eersteKnop =
        document.querySelector(".icoon-optie");

    if (eersteKnop) {
        eersteKnop.classList.add("geselecteerd");
    }

    document.querySelector(
        "#les-popup .reset-button"
    ).textContent = "+ Toevoegen";

    document.getElementById(
        "les-popup"
    ).style.display = "flex";

    setTimeout(function() {
        document.getElementById(
            "les-naam"
        ).focus();
    }, 100);

}


function kiesIcono(icoon) {

    geselecteerdIcono = icoon;

    document.querySelectorAll(
        ".icoon-optie"
    ).forEach(function(btn) {

        btn.classList.toggle(
            "geselecteerd",
            btn.textContent.trim() === icoon
        );

    });

}


function bevestigLes() {

    const naam =
        document.getElementById(
            "les-naam"
        ).value.trim();


    if (naam === "") {

        document.getElementById(
            "les-naam"
        ).focus();

        return;

    }


    if (lessenBewerkIndex !== null) {

        lessen[lessenBewerkIndex] = {
            icoon: geselecteerdIcono,
            naam: naam
        };

    } else {

        lessen.push({
            icoon: geselecteerdIcono,
            naam: naam
        });

    }


    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );


    toonLessen();

    sluitLesPopup();

}


function sluitLesPopup() {

    lessenBewerkIndex = null;

    document.getElementById(
        "les-popup"
    ).style.display = "none";

}


function bewerkLes(index) {

    const les = lessen[index];
    lessenBewerkIndex = index;
    geselecteerdIcono = les.icoon || "📖";

    document.getElementById(
        "les-naam"
    ).value = les.naam || "";

    document.querySelectorAll(
        "#icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {
        btn.classList.toggle(
            "geselecteerd",
            btn.textContent.trim() === geselecteerdIcono
        );
    });

    document.querySelector(
        "#les-popup .reset-button"
    ).textContent = "✓ Opslaan";

    document.getElementById(
        "les-popup"
    ).style.display = "flex";

    setTimeout(function() {
        document.getElementById(
            "les-naam"
        ).focus();
    }, 100);

}


function toonLessen() {

    const lijst =
        document.getElementById(
            "lessen"
        );


    if (!lijst) {
        return;
    }


    lijst.innerHTML = "";


    if (lessen.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen lessen toegevoegd.
            </p>`;

        return;

    }


    lessen.forEach(
        function(les, index) {

            const icoon =
                typeof les === "object"
                    ? les.icoon
                    : "📚";

            const naam =
                typeof les === "object"
                    ? les.naam
                    : les;

            lijst.innerHTML += `

                <div class="les">

                    <span>
                        ${icoon} ${naam}
                    </span>

                    <div class="item-acties">

                        <button
                            class="bewerk"
                            onclick="bewerkLes(${index})"
                            title="Bewerken">
                            ✏️
                        </button>

                        <button
                            class="verwijder"
                            onclick="verwijderLes(${index})">
                            🗑️
                        </button>

                    </div>

                </div>

            `;

        }
    );

}


function verwijderLes(index) {

    lessen.splice(
        index,
        1
    );


    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );


    toonLessen();

}


/* ========================================
   TAKEN
======================================== */

let taken =
    JSON.parse(
        localStorage.getItem("taken")
    ) || [];


/* --- Popup-status --- */

let geselecteerdVak =
    null;

let nieuwVakModus =
    false;

let geselecteerdNieuwVakIcono =
    "📖";

let schattingMinuten =
    15;

let taakBewerkIndex =
    null;


/* --- Timer --- */

let timerInterval =
    null;


function formatTijd(seconden) {

    if (seconden <= 0) {
        return "0:00";
    }

    const h =
        Math.floor(seconden / 3600);

    const m =
        Math.floor(
            (seconden % 3600) / 60
        );

    const s =
        seconden % 60;


    if (h > 0) {

        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    }

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

}


function huidigeTijdVanTaak(taak) {

    const looptijd =
        taak.looptijd || 0;

    const loopStatus =
        taak.loopStatus || "gestopt";

    const startTijdstip =
        taak.startTijdstip || null;


    if (
        loopStatus === "bezig" &&
        startTijdstip
    ) {

        return looptijd +
            Math.floor(
                (Date.now() - startTijdstip) / 1000
            );

    }

    return looptijd;

}


/* --- Timer acties --- */

function startTimer(index) {

    // Stop eventueel andere lopende timers
    taken.forEach(function(t, i) {
        if (
            i !== index &&
            t.loopStatus === "bezig"
        ) {
            const elapsed =
                Math.floor(
                    (Date.now() - t.startTijdstip) / 1000
                );
            taken[i].looptijd += elapsed;
            taken[i].loopStatus = "gepauzeerd";
            taken[i].startTijdstip = null;
        }
    });

    taken[index].loopStatus =
        "bezig";

    taken[index].startTijdstip =
        Date.now();


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    if (!timerInterval) {

        timerInterval =
            setInterval(
                updateTimerDisplays,
                1000
            );

    }

}


function pauzeerTimer(index) {

    const elapsed =
        Math.floor(
            (Date.now() - taken[index].startTijdstip) / 1000
        );

    taken[index].looptijd += elapsed;
    taken[index].loopStatus = "gepauzeerd";
    taken[index].startTijdstip = null;


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    stopIntervalAlsNiemandLoopt();

}


function stopTimer(index) {

    if (
        taken[index].loopStatus === "bezig" &&
        taken[index].startTijdstip
    ) {

        const elapsed =
            Math.floor(
                (Date.now() - taken[index].startTijdstip) / 1000
            );

        taken[index].looptijd += elapsed;

    }

    taken[index].loopStatus = "gestopt";
    taken[index].startTijdstip = null;


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    stopIntervalAlsNiemandLoopt();

}


function resetTimer(index) {

    taken[index].looptijd = 0;
    taken[index].loopStatus = "gestopt";
    taken[index].startTijdstip = null;


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

}


function stopIntervalAlsNiemandLoopt() {

    const isIemandBezig =
        taken.some(
            function(t) {
                return t.loopStatus === "bezig";
            }
        );


    if (!isIemandBezig && timerInterval) {

        clearInterval(timerInterval);
        timerInterval = null;

    }

}


function updateTimerDisplays() {

    taken.forEach(function(taak, index) {

        if (taak.loopStatus === "bezig") {

            const el =
                document.getElementById(
                    "timer-display-" + index
                );


            if (el) {

                el.textContent =
                    formatTijd(
                        huidigeTijdVanTaak(taak)
                    );

            }

        }

    });

}


/* --- Taak popup --- */

function voegTaakToe() {

    taakBewerkIndex = null;
    geselecteerdVak = null;
    nieuwVakModus = false;
    geselecteerdNieuwVakIcono = "📖";
    schattingMinuten = 15;


    document.getElementById(
        "taak-naam"
    ).value = "";

    document.getElementById(
        "schatting-waarde"
    ).textContent = "15";

    document.getElementById(
        "nieuw-vak-naam"
    ).value = "";


    // Standaard: morgen als deadline
    const morgen = new Date();
    morgen.setDate(morgen.getDate() + 1);

    document.getElementById(
        "taak-deadline"
    ).value =
        `${morgen.getFullYear()}-${String(morgen.getMonth() + 1).padStart(2, "0")}-${String(morgen.getDate()).padStart(2, "0")}`;


    vulVakKiezer();

    document.querySelector(
        "#taak-popup .reset-button"
    ).textContent = "+ Toevoegen";

    document.getElementById(
        "taak-popup"
    ).style.display = "flex";


    setTimeout(function() {

        document.getElementById(
            "taak-naam"
        ).focus();

    }, 150);

}


function vulVakKiezer() {

    const kiezer =
        document.getElementById(
            "vak-kiezer"
        );


    kiezer.innerHTML = "";

    const sectie =
        document.getElementById(
            "nieuw-vak-sectie"
        );

    sectie.style.display = "none";


    if (lessen.length === 0) {

        // Geen lessen: direct nieuw vak tonen
        toonNieuwVakSectie();

        return;

    }


    lessen.forEach(function(les, index) {

        const icoon =
            typeof les === "object"
                ? les.icoon
                : "📚";

        const naam =
            typeof les === "object"
                ? les.naam
                : les;


        const chip =
            document.createElement("button");

        chip.type = "button";
        chip.className = "vak-chip";
        chip.dataset.index = index;
        chip.textContent = `${icoon} ${naam}`;


        chip.addEventListener(
            "click",
            function() {
                kiesVakInPopup(
                    { icoon, naam },
                    chip
                );
            }
        );


        kiezer.appendChild(chip);

    });


    // Knop: nieuw vak
    const nieuwKnop =
        document.createElement("button");

    nieuwKnop.type = "button";
    nieuwKnop.className = "vak-chip nieuw-vak";
    nieuwKnop.textContent = "＋ Nieuw vak";

    nieuwKnop.addEventListener(
        "click",
        toonNieuwVakSectie
    );

    kiezer.appendChild(nieuwKnop);

}


function kiesVakInPopup(vak, chip) {

    geselecteerdVak = vak;
    nieuwVakModus = false;


    document.querySelectorAll(
        ".vak-chip"
    ).forEach(function(c) {
        c.classList.remove("geselecteerd");
    });

    chip.classList.add("geselecteerd");


    document.getElementById(
        "nieuw-vak-sectie"
    ).style.display = "none";

}


function toonNieuwVakSectie() {

    nieuwVakModus = true;
    geselecteerdVak = null;


    document.querySelectorAll(
        ".vak-chip"
    ).forEach(function(c) {
        c.classList.remove("geselecteerd");
    });


    const nieuwKnop =
        document.querySelector(
            ".vak-chip.nieuw-vak"
        );

    if (nieuwKnop) {
        nieuwKnop.classList.add("geselecteerd");
    }


    const sectie =
        document.getElementById(
            "nieuw-vak-sectie"
        );

    sectie.style.display = "block";


    // Selecteer eerste icoon
    document.querySelectorAll(
        "#nieuw-vak-icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {
        btn.classList.remove("geselecteerd");
    });

    const eersteIcono =
        document.querySelector(
            "#nieuw-vak-icoon-kiezer .icoon-optie"
        );

    if (eersteIcono) {
        eersteIcono.classList.add("geselecteerd");
    }

    setTimeout(function() {
        document.getElementById(
            "nieuw-vak-naam"
        ).focus();
    }, 100);

}


function kiesNieuwVakIcono(icoon) {

    geselecteerdNieuwVakIcono = icoon;

    document.querySelectorAll(
        "#nieuw-vak-icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {

        btn.classList.toggle(
            "geselecteerd",
            btn.textContent.trim() === icoon
        );

    });

}


function veranderSchatting(delta) {

    schattingMinuten =
        Math.max(
            5,
            Math.min(180, schattingMinuten + delta)
        );

    document.getElementById(
        "schatting-waarde"
    ).textContent =
        schattingMinuten;

}


function bevestigTaak() {

    const taakNaam =
        document.getElementById(
            "taak-naam"
        ).value.trim();


    if (taakNaam === "") {

        document.getElementById(
            "taak-naam"
        ).focus();

        return;

    }


    // Nieuw vak aanmaken als nodig
    if (nieuwVakModus) {

        const nieuwNaam =
            document.getElementById(
                "nieuw-vak-naam"
            ).value.trim();


        if (nieuwNaam === "") {

            document.getElementById(
                "nieuw-vak-naam"
            ).focus();

            return;

        }

        geselecteerdVak = {
            icoon: geselecteerdNieuwVakIcono,
            naam: nieuwNaam
        };


        // Voeg ook toe aan lessen
        lessen.push({
            icoon: geselecteerdNieuwVakIcono,
            naam: nieuwNaam
        });

        localStorage.setItem(
            "lessen",
            JSON.stringify(lessen)
        );

        toonLessen();

    }


    if (!geselecteerdVak) {

        document.getElementById(
            "vak-kiezer"
        ).style.outline =
            "2px solid #ff6b6b";

        setTimeout(function() {

            document.getElementById(
                "vak-kiezer"
            ).style.outline = "";

        }, 1000);

        return;

    }


    const deadlineWaarde =
        document.getElementById(
            "taak-deadline"
        ).value || null;


    if (taakBewerkIndex !== null) {

        // Behoud timer-gegevens bij bewerking
        const bestaand = taken[taakBewerkIndex];

        taken[taakBewerkIndex] = {
            vak:          geselecteerdVak,
            naam:         taakNaam,
            klaar:        bestaand.klaar        || false,
            deadline:     deadlineWaarde,
            schatting:    schattingMinuten,
            looptijd:     bestaand.looptijd     || 0,
            loopStatus:   bestaand.loopStatus   || "gestopt",
            startTijdstip: bestaand.startTijdstip || null
        };

    } else {

        taken.push({
            vak:          geselecteerdVak,
            naam:         taakNaam,
            klaar:        false,
            deadline:     deadlineWaarde,
            schatting:    schattingMinuten,
            looptijd:     0,
            loopStatus:   "gestopt",
            startTijdstip: null
        });

    }


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    sluitTaakPopup();

}


function sluitTaakPopup() {

    taakBewerkIndex = null;

    document.getElementById(
        "taak-popup"
    ).style.display = "none";

}


function bewerkTaak(index) {

    const taak = taken[index];
    taakBewerkIndex = index;

    geselecteerdVak           = taak.vak || null;
    nieuwVakModus             = false;
    geselecteerdNieuwVakIcono = "📖";
    schattingMinuten          = taak.schatting || 15;

    document.getElementById(
        "taak-naam"
    ).value = taak.naam || "";

    document.getElementById(
        "schatting-waarde"
    ).textContent = schattingMinuten;

    document.getElementById(
        "nieuw-vak-naam"
    ).value = "";

    document.getElementById(
        "taak-deadline"
    ).value = taak.deadline || "";

    vulVakKiezer();

    // Selecteer het juiste vak in de kiezer
    if (geselecteerdVak) {

        const zoekTekst =
            geselecteerdVak.icoon + " " + geselecteerdVak.naam;

        document.querySelectorAll(
            ".vak-chip:not(.nieuw-vak)"
        ).forEach(function(chip) {

            if (chip.textContent.trim() === zoekTekst) {
                chip.classList.add("geselecteerd");
            }

        });

    }

    document.querySelector(
        "#taak-popup .reset-button"
    ).textContent = "✓ Opslaan";

    document.getElementById(
        "taak-popup"
    ).style.display = "flex";

    setTimeout(function() {
        document.getElementById(
            "taak-naam"
        ).focus();
    }, 150);

}


/* --- Deadline hulpfuncties --- */

function deadlineKlasse(dateString) {

    if (!dateString) return null;

    const v = new Date();

    const vandaagStr =
        `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, "0")}-${String(v.getDate()).padStart(2, "0")}`;

    const m = new Date(v);
    m.setDate(m.getDate() + 1);

    const morgenStr =
        `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-${String(m.getDate()).padStart(2, "0")}`;


    if (dateString < vandaagStr) return "verstreken";
    if (dateString === vandaagStr) return "vandaag";
    if (dateString === morgenStr) return "morgen";
    return "toekomst";

}


function deadlineTekst(dateString, klasse) {

    if (!dateString) return "";

    const [j, ma, d] =
        dateString.split("-").map(Number);

    const datum =
        new Date(j, ma - 1, d);

    const tekst =
        datum.toLocaleDateString("nl-BE", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

    const iconen = {
        verstreken: "❗",
        vandaag:    "🔥",
        morgen:     "⚡",
        toekomst:   "📅"
    };

    return `<span class="deadline-badge ${klasse}">${iconen[klasse]} ${tekst}</span>`;

}


/* ========================================
   HOBBY'S
======================================== */

let hobbies =
    JSON.parse(
        localStorage.getItem("hobbies")
    ) || [];


let evenementen =
    JSON.parse(
        localStorage.getItem("evenementen")
    ) || {};


let huidigKalenderDag = null;


const DAGKORTE =
    ["zo", "ma", "di", "wo", "do", "vr", "za"];

const DAGVOLUIT =
    ["zondag", "maandag", "dinsdag", "woensdag",
     "donderdag", "vrijdag", "zaterdag"];


/* --- Week helpers --- */

function getMaandag() {

    const v = new Date();
    v.setHours(0, 0, 0, 0);

    const dag = v.getDay();
    const offset =
        dag === 0 ? -6 : 1 - dag;

    const maandag = new Date(v);
    maandag.setDate(v.getDate() + offset);

    return maandag;

}


function getDatumString(datum) {

    return `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, "0")}-${String(datum.getDate()).padStart(2, "0")}`;

}


function getWeekString() {

    const maandag = getMaandag();

    const start =
        new Date(maandag.getFullYear(), 0, 1);

    const weekNr =
        Math.ceil(
            ((maandag - start) / 86400000 +
             start.getDay() + 1) / 7
        );

    return `${maandag.getFullYear()}-W${String(weekNr).padStart(2, "0")}`;

}


function getHobbyDatumDezeWeek(hobby) {

    const maandag = getMaandag();

    // dag: 0=zo, 1=ma ... 6=za
    // Offset from Monday: ma→0, di→1 ... za→5, zo→6
    const offset =
        hobby.dag === 0 ? 6 : hobby.dag - 1;

    const datum = new Date(maandag);
    datum.setDate(maandag.getDate() + offset);

    return datum;

}


/* --- Skip-beheer (niet deze week) --- */

function getOvergeslagenIds() {

    const opgeslagen =
        JSON.parse(
            localStorage.getItem("overgeslagen")
            || '{"week":"","ids":[]}'
        );

    if (opgeslagen.week !== getWeekString()) {
        return [];
    }

    return opgeslagen.ids || [];

}


function slaanOver(hobbyId) {

    const ids = getOvergeslagenIds();

    if (!ids.includes(hobbyId)) {
        ids.push(hobbyId);
    }

    localStorage.setItem(
        "overgeslagen",
        JSON.stringify({
            week: getWeekString(),
            ids: ids
        })
    );

    toonHobbies();
    toonTaken();

}


function herstelHobby(hobbyId) {

    const ids =
        getOvergeslagenIds()
            .filter(function(id) {
                return id !== hobbyId;
            });

    localStorage.setItem(
        "overgeslagen",
        JSON.stringify({
            week: getWeekString(),
            ids: ids
        })
    );

    toonHobbies();
    toonTaken();

}


/* --- Hobby popup --- */

let geselecteerdHobbyIcono = "⚽";
let geselecteerdDag        = 1;
let hobbyBewerkIndex       = null;


function voegHobbyToe() {

    hobbyBewerkIndex = null;
    geselecteerdHobbyIcono = "⚽";
    geselecteerdDag = 1;


    document.getElementById(
        "hobby-naam"
    ).value = "";

    document.getElementById(
        "hobby-van"
    ).value = "14:00";

    document.getElementById(
        "hobby-tot"
    ).value = "16:00";


    document.querySelectorAll(
        "#hobby-icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {
        btn.classList.remove("geselecteerd");
    });

    const eersteIcono =
        document.querySelector(
            "#hobby-icoon-kiezer .icoon-optie"
        );

    if (eersteIcono) {
        eersteIcono.classList.add("geselecteerd");
    }


    document.querySelectorAll(
        ".dag-chip"
    ).forEach(function(btn) {
        btn.classList.toggle(
            "geselecteerd",
            parseInt(btn.dataset.dag) === 1
        );
    });


    document.querySelector(
        "#hobby-popup .reset-button"
    ).textContent = "+ Toevoegen";

    document.getElementById(
        "hobby-popup"
    ).style.display = "flex";


    setTimeout(function() {
        document.getElementById(
            "hobby-naam"
        ).focus();
    }, 100);

}


function kiesHobbyIcono(icoon) {

    geselecteerdHobbyIcono = icoon;

    document.querySelectorAll(
        "#hobby-icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {

        btn.classList.toggle(
            "geselecteerd",
            btn.textContent.trim() === icoon
        );

    });

}


function kiesDag(dag) {

    geselecteerdDag = dag;

    document.querySelectorAll(
        ".dag-chip"
    ).forEach(function(btn) {

        btn.classList.toggle(
            "geselecteerd",
            parseInt(btn.dataset.dag) === dag
        );

    });

}


function bevestigHobby() {

    const naam =
        document.getElementById(
            "hobby-naam"
        ).value.trim();


    if (!naam) {

        document.getElementById(
            "hobby-naam"
        ).focus();

        return;

    }

    const van =
        document.getElementById("hobby-van").value;

    const tot =
        document.getElementById("hobby-tot").value;


    if (!van || !tot) {
        return;
    }


    const hobbyData = {
        id:     hobbyBewerkIndex !== null
                    ? hobbies[hobbyBewerkIndex].id
                    : Date.now(),
        icoon:  geselecteerdHobbyIcono,
        naam:   naam,
        dag:    geselecteerdDag,
        vanUur: van,
        totUur: tot
    };

    if (hobbyBewerkIndex !== null) {
        hobbies[hobbyBewerkIndex] = hobbyData;
    } else {
        hobbies.push(hobbyData);
    }


    localStorage.setItem(
        "hobbies",
        JSON.stringify(hobbies)
    );


    toonHobbies();
    toonTaken();
    sluitHobbyPopup();

}


function sluitHobbyPopup() {

    hobbyBewerkIndex = null;

    document.getElementById(
        "hobby-popup"
    ).style.display = "none";

}


function bewerkHobby(index) {

    const hobby = hobbies[index];
    hobbyBewerkIndex = index;

    geselecteerdHobbyIcono = hobby.icoon || "⚽";
    geselecteerdDag        = hobby.dag !== undefined ? hobby.dag : 1;

    document.getElementById(
        "hobby-naam"
    ).value = hobby.naam || "";

    document.getElementById(
        "hobby-van"
    ).value = hobby.vanUur || "14:00";

    document.getElementById(
        "hobby-tot"
    ).value = hobby.totUur || "16:00";

    // Selecteer icoon
    document.querySelectorAll(
        "#hobby-icoon-kiezer .icoon-optie"
    ).forEach(function(btn) {
        btn.classList.toggle(
            "geselecteerd",
            btn.textContent.trim() === geselecteerdHobbyIcono
        );
    });

    // Selecteer dag
    document.querySelectorAll(
        ".dag-chip"
    ).forEach(function(btn) {
        btn.classList.toggle(
            "geselecteerd",
            parseInt(btn.dataset.dag) === geselecteerdDag
        );
    });

    document.querySelector(
        "#hobby-popup .reset-button"
    ).textContent = "✓ Opslaan";

    document.getElementById(
        "hobby-popup"
    ).style.display = "flex";

    setTimeout(function() {
        document.getElementById(
            "hobby-naam"
        ).focus();
    }, 100);

}


/* --- Hobby beheer weergeven --- */

function toonHobbies() {

    const lijst =
        document.getElementById("hobbies");

    if (!lijst) return;


    lijst.innerHTML = "";


    if (hobbies.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen hobby's toegevoegd.
            </p>`;

        return;

    }

    const overgeslagenIds =
        getOvergeslagenIds();


    hobbies.forEach(function(hobby, index) {

        const isOvergeslagen =
            overgeslagenIds.includes(hobby.id);

        const datumDezeWeek =
            getHobbyDatumDezeWeek(hobby);

        const dagLabel =
            DAGVOLUIT[hobby.dag];


        lijst.innerHTML += `

            <div class="hobby-rij ${isOvergeslagen ? "overgeslagen" : ""}">

                <div class="hobby-rij-info">

                    <div class="hobby-rij-naam">
                        ${hobby.icoon} ${hobby.naam}
                    </div>

                    <div class="hobby-rij-schema">
                        ${dagLabel} · ${hobby.vanUur} – ${hobby.totUur}
                    </div>

                </div>


                <div class="hobby-rij-acties">

                    <button
                        class="hobby-week-knop ${isOvergeslagen ? "herstel" : ""}"
                        onclick="${isOvergeslagen
                            ? `herstelHobby(${hobby.id})`
                            : `slaanOver(${hobby.id})`}">
                        ${isOvergeslagen
                            ? "↺ Toch erbij"
                            : "Niet deze week"}
                    </button>

                    <button
                        class="bewerk"
                        onclick="bewerkHobby(${index})"
                        title="Bewerken">
                        ✏️
                    </button>

                    <button
                        class="verwijder"
                        onclick="verwijderHobby(${index})">
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


function verwijderHobby(index) {

    hobbies.splice(index, 1);

    localStorage.setItem(
        "hobbies",
        JSON.stringify(hobbies)
    );

    toonHobbies();
    toonTaken();

}


/* --- Gecombineerde planning --- */

function toonHobbyBlok(lijst, hobby, datumStr, hobbyIndex) {

    const [j, ma, d] =
        datumStr.split("-").map(Number);

    const datum = new Date(j, ma - 1, d);

    const dagKort =
        DAGKORTE[datum.getDay()];

    const maandKort =
        datum.toLocaleDateString("nl-BE", {
            month: "short"
        });


    lijst.innerHTML += `

        <div class="hobby-blok">

            <div class="hobby-blok-info">

                <div class="hobby-blok-naam">
                    ${hobby.icoon} ${hobby.naam}
                </div>

                <div class="hobby-blok-tijd">
                    ${dagKort}. ${d} ${maandKort} · ${hobby.vanUur} – ${hobby.totUur}
                </div>

            </div>

            <div class="item-acties">

                <button
                    class="bewerk"
                    onclick="bewerkHobby(${hobbyIndex})"
                    title="Bewerken">
                    ✏️
                </button>

                <button
                    class="hobby-blok-overslaan"
                    onclick="slaanOver(${hobby.id})"
                    title="Niet deze week">
                    ✕
                </button>

            </div>

        </div>

    `;

}


/* --- Taken weergeven --- */

function toonTaken() {

    const lijst =
        document.getElementById(
            "taken"
        );


    if (!lijst) {
        return;
    }


    lijst.innerHTML = "";


    // --- Datumgrenzen voor hobby's ---
    const v = new Date();
    v.setHours(0, 0, 0, 0);

    const vandaagStr = getDatumString(v);

    const maandag = getMaandag();
    const zondag = new Date(maandag);
    zondag.setDate(maandag.getDate() + 6);
    const zondagStr = getDatumString(zondag);

    const overgeslagenIds = getOvergeslagenIds();


    // --- Hobby-items bouwen en sorteren op datum/tijd ---
    const hobbyItems = [];

    hobbies.forEach(function(hobby, hobbyIdx) {

        if (overgeslagenIds.includes(hobby.id)) {
            return;
        }

        const datumDezeWeek =
            getHobbyDatumDezeWeek(hobby);

        const datumStr =
            getDatumString(datumDezeWeek);

        if (
            datumStr >= vandaagStr &&
            datumStr <= zondagStr
        ) {

            hobbyItems.push({
                hobby:      hobby,
                hobbyIndex: hobbyIdx,
                datumStr:   datumStr,
                sortKey:    datumStr + " " + hobby.vanUur
            });

        }

    });

    hobbyItems.sort(function(a, b) {
        return a.sortKey.localeCompare(b.sortKey);
    });


    if (hobbyItems.length === 0 && taken.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen taken of hobby's gepland.
            </p>`;

        return;

    }


    // --- Hobby's eerst (gesorteerd op datum) ---
    hobbyItems.forEach(function(item) {

        toonHobbyBlok(
            lijst,
            item.hobby,
            item.datumStr,
            item.hobbyIndex
        );

    });


    // --- Taken (in jouw volgorde, sleepbaar) ---
    taken.forEach(function(taak, index) {

        const vak =
            taak.vak || null;

        const vakLabel =
            vak
                ? `<span class="taak-vak">${vak.icoon} ${vak.naam}</span>`
                : "";

        const dlKlasse =
            deadlineKlasse(taak.deadline || null);

        const deadlineBadge =
            dlKlasse
                ? deadlineTekst(taak.deadline, dlKlasse)
                : "";

        const schatting =
            taak.schatting || 0;

        const loopStatus =
            taak.loopStatus || "gestopt";

        const huidigeSec =
            huidigeTijdVanTaak(taak);


        // Timer knoppen
        let timerKnoppen = "";

        if (loopStatus !== "bezig") {

            timerKnoppen +=
                `<button
                    class="timer-knop start"
                    onclick="startTimer(${index})">
                    ▶ Start
                </button>`;

        } else {

            timerKnoppen +=
                `<button
                    class="timer-knop pauze"
                    onclick="pauzeerTimer(${index})">
                    ⏸ Pauze
                </button>`;

        }

        if (
            loopStatus === "bezig" ||
            loopStatus === "gepauzeerd"
        ) {

            timerKnoppen +=
                `<button
                    class="timer-knop stop"
                    onclick="stopTimer(${index})">
                    ⏹ Stop
                </button>`;

        }

        if (
            huidigeSec > 0 &&
            loopStatus === "gestopt"
        ) {

            timerKnoppen +=
                `<button
                    class="timer-knop reset"
                    onclick="resetTimer(${index})"
                    title="Opnieuw beginnen">
                    ↺
                </button>`;

        }


        // Tijd vergelijken
        let tijdLabel = "";

        if (
            schatting > 0 &&
            huidigeSec > 0 &&
            loopStatus === "gestopt"
        ) {

            const schattingSec =
                schatting * 60;

            const verschil =
                huidigeSec - schattingSec;


            if (verschil > 30) {

                tijdLabel =
                    `<span class="te-lang">
                        +${formatTijd(verschil)} over tijd
                    </span>`;

            } else if (verschil < -30) {

                tijdLabel =
                    `<span class="op-tijd">
                        −${formatTijd(Math.abs(verschil))} onder schatting
                    </span>`;

            } else {

                tijdLabel =
                    `<span class="op-tijd">
                        ✓ Precies op tijd!
                    </span>`;

            }

        }


        const schattingLabel =
            schatting > 0
                ? `<span class="taak-schatting">⏱ ${schatting} min</span>`
                : "";


        lijst.innerHTML += `

            <div class="taak ${taak.klaar ? "klaar" : ""}"
                 draggable="true"
                 data-taak-index="${index}">

                <div class="taak-top">

                    <span
                        class="sleep-greep"
                        title="Slepen om te herordenen">
                        ⠿
                    </span>

                    <label>

                        <input
                            type="checkbox"
                            ${taak.klaar ? "checked" : ""}
                            onchange="taakKlaar(${index})"
                        >

                        ${vakLabel}
                        ${taak.naam}

                    </label>


                    <div class="item-acties">

                        <button
                            class="bewerk"
                            onclick="bewerkTaak(${index})"
                            title="Bewerken">
                            ✏️
                        </button>

                        <button
                            class="verwijder"
                            onclick="verwijderTaak(${index})">
                            🗑️
                        </button>

                    </div>

                </div>

                ${deadlineBadge}

                <div class="taak-timer">

                    <div class="timer-info">

                        ${schattingLabel}

                        <span
                            class="timer-display"
                            id="timer-display-${index}">
                            ${formatTijd(huidigeSec)}
                        </span>

                        ${tijdLabel}

                    </div>


                    <div class="timer-knoppen">
                        ${timerKnoppen}
                    </div>

                </div>

            </div>

        `;

    });


    // Start interval als er een lopende timer is
    const heeftLopende =
        taken.some(
            function(t) {
                return t.loopStatus === "bezig";
            }
        );

    if (heeftLopende && !timerInterval) {

        timerInterval =
            setInterval(
                updateTimerDisplays,
                1000
            );

    } else if (!heeftLopende && timerInterval) {

        clearInterval(timerInterval);
        timerInterval = null;

    }

}


/* ========================================
   SLEPEN TAKEN (drag & drop)
======================================== */

let _sleepVanIndex = null;
let _sleepDoel     = null;
let _touchKloon    = null;
let _touchOrigEl   = null;


function initSlepenTaken() {

    const lijst =
        document.getElementById("taken");

    if (!lijst || lijst._sleepInit) return;
    lijst._sleepInit = true;


    /* --- Desktop: HTML5 drag events (event delegation) --- */

    lijst.addEventListener("dragstart", function(e) {

        const el =
            e.target.closest(".taak[draggable]");

        if (!el || el.dataset.taakIndex === undefined) return;

        _sleepVanIndex =
            parseInt(el.dataset.taakIndex);

        e.dataTransfer.effectAllowed = "move";

        // Klein uitstel zodat de ghost nog zichtbaar is
        setTimeout(function() {
            el.classList.add("sleep-bezig");
        }, 0);

    });


    lijst.addEventListener("dragend", function() {

        document.querySelectorAll(
            ".taak.sleep-bezig, .taak.sleep-voor, .taak.sleep-na"
        ).forEach(function(el) {
            el.classList.remove(
                "sleep-bezig", "sleep-voor", "sleep-na"
            );
        });

        _sleepVanIndex = null;
        _sleepDoel     = null;

    });


    lijst.addEventListener("dragover", function(e) {

        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        const el =
            e.target.closest(".taak[draggable]");

        document.querySelectorAll(
            ".taak.sleep-voor, .taak.sleep-na"
        ).forEach(function(t) {
            t.classList.remove("sleep-voor", "sleep-na");
        });

        if (el && el.dataset.taakIndex !== undefined) {

            const rect = el.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (e.clientY < midY) {
                el.classList.add("sleep-voor");
                _sleepDoel = {
                    index:   parseInt(el.dataset.taakIndex),
                    positie: "voor"
                };
            } else {
                el.classList.add("sleep-na");
                _sleepDoel = {
                    index:   parseInt(el.dataset.taakIndex),
                    positie: "na"
                };
            }

        }

    });


    lijst.addEventListener("drop", function(e) {

        e.preventDefault();

        if (
            _sleepVanIndex === null ||
            !_sleepDoel ||
            _sleepDoel.index === _sleepVanIndex
        ) return;

        pasVolgordeToe(_sleepVanIndex, _sleepDoel);

    });


    /* --- Mobiel: touch events via sleep-greep --- */

    lijst.addEventListener("touchstart", function(e) {

        const greep =
            e.target.closest(".sleep-greep");

        if (!greep) return;

        const el =
            greep.closest(".taak[draggable]");

        if (!el || el.dataset.taakIndex === undefined) return;

        _sleepVanIndex = parseInt(el.dataset.taakIndex);
        _touchOrigEl   = el;

        const rect  = el.getBoundingClientRect();

        // Kloon van de kaart om mee te slepen
        _touchKloon = el.cloneNode(true);

        _touchKloon.style.cssText = [
            "position:fixed",
            "left:"   + rect.left   + "px",
            "top:"    + rect.top    + "px",
            "width:"  + rect.width  + "px",
            "opacity:0.88",
            "z-index:9999",
            "pointer-events:none",
            "box-shadow:0 8px 24px rgba(0,0,0,0.22)",
            "border-radius:14px",
            "transition:none"
        ].join(";");

        document.body.appendChild(_touchKloon);
        el.style.opacity = "0.25";

        e.preventDefault();

    }, { passive: false });


    lijst.addEventListener("touchmove", function(e) {

        if (_sleepVanIndex === null || !_touchKloon) return;

        e.preventDefault();

        const touch  = e.touches[0];
        const kloonH = _touchKloon.offsetHeight;
        const kloonW = _touchKloon.offsetWidth;

        _touchKloon.style.top  =
            (touch.clientY - kloonH / 2) + "px";

        _touchKloon.style.left =
            (touch.clientX - kloonW / 2) + "px";


        // Vind element onder de vinger
        _touchKloon.style.visibility = "hidden";

        const onderEl =
            document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );

        _touchKloon.style.visibility = "";


        document.querySelectorAll(
            ".taak.sleep-voor, .taak.sleep-na"
        ).forEach(function(t) {
            t.classList.remove("sleep-voor", "sleep-na");
        });


        const doelTaak =
            onderEl
                ? onderEl.closest(".taak[draggable]")
                : null;

        if (doelTaak && doelTaak !== _touchOrigEl) {

            const rect = doelTaak.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (touch.clientY < midY) {
                doelTaak.classList.add("sleep-voor");
                _sleepDoel = {
                    index:   parseInt(doelTaak.dataset.taakIndex),
                    positie: "voor"
                };
            } else {
                doelTaak.classList.add("sleep-na");
                _sleepDoel = {
                    index:   parseInt(doelTaak.dataset.taakIndex),
                    positie: "na"
                };
            }

        } else {
            _sleepDoel = null;
        }

    }, { passive: false });


    lijst.addEventListener("touchend", function() {

        if (_touchKloon) {
            _touchKloon.remove();
            _touchKloon = null;
        }

        if (_touchOrigEl) {
            _touchOrigEl.style.opacity = "";
            _touchOrigEl = null;
        }

        document.querySelectorAll(
            ".taak.sleep-voor, .taak.sleep-na"
        ).forEach(function(t) {
            t.classList.remove("sleep-voor", "sleep-na");
        });

        if (
            _sleepVanIndex !== null &&
            _sleepDoel !== null &&
            _sleepDoel.index !== _sleepVanIndex
        ) {
            pasVolgordeToe(_sleepVanIndex, _sleepDoel);
        }

        _sleepVanIndex = null;
        _sleepDoel     = null;

    });

}


function pasVolgordeToe(vanIndex, doel) {

    const taak = taken.splice(vanIndex, 1)[0];

    // Bereken nieuwe positie na de splice
    // (alle indices na vanIndex schuiven 1 omlaag)
    let nieuweIndex = doel.index;

    if (doel.positie === "na") {
        nieuweIndex++;
    }

    if (doel.index > vanIndex) {
        nieuweIndex--;
    }

    nieuweIndex =
        Math.max(0, Math.min(taken.length, nieuweIndex));

    taken.splice(nieuweIndex, 0, taak);

    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );

    toonTaken();

}


function taakKlaar(index) {

    // Stop timer als die loopt
    if (taken[index].loopStatus === "bezig") {

        const elapsed =
            Math.floor(
                (Date.now() - taken[index].startTijdstip) / 1000
            );

        taken[index].looptijd += elapsed;
        taken[index].loopStatus = "gestopt";
        taken[index].startTijdstip = null;

    }

    taken[index].klaar =
        !taken[index].klaar;


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    stopIntervalAlsNiemandLoopt();

}


function verwijderTaak(index) {

    // Stop timer als die loopt
    if (taken[index].loopStatus === "bezig") {

        stopIntervalAlsNiemandLoopt();

    }

    taken.splice(index, 1);


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

}


/* ========================================
   KLEUREN HULPFUNCTIE
======================================== */

function markeerSwatch(gridId, kleur) {

    document.querySelectorAll(
        "#" + gridId + " .kleur-swatch"
    ).forEach(function(swatch) {

        swatch.classList.toggle(
            "geselecteerd",
            swatch.dataset.kleur === kleur
        );

    });

}


/* ========================================
   ACHTERGRONDKLEUR
======================================== */

function kiesAchtergrond(kleur) {

    document.documentElement
        .style
        .setProperty(
            "--achtergrond-kleur",
            kleur
        );


    localStorage.setItem(
        "achtergrond",
        kleur
    );


    markeerSwatch(
        "achtergrond-grid",
        kleur
    );

}


/* ========================================
   MENU KLEUR
======================================== */

function kiesMenuKleur(kleur) {

    document.documentElement
        .style
        .setProperty(
            "--menu-kleur",
            kleur
        );


    localStorage.setItem(
        "menuKleur",
        kleur
    );


    markeerSwatch(
        "menu-kleur-grid",
        kleur
    );

}


/* ========================================
   KLEUREN RESETTEN
======================================== */

function resetKleuren() {

    const achtergrond =
        "#eef4ff";

    const menu =
        "#ffffff";


    kiesAchtergrond(achtergrond);

    kiesMenuKleur(menu);

}


/* ========================================
   INSTELLINGEN OPENEN
======================================== */

function openSettings() {

    document.getElementById(
        "settings"
    ).style.display =
        "flex";

}


/* ========================================
   INSTELLINGEN SLUITEN
======================================== */

function closeSettings() {

    document.getElementById(
        "settings"
    ).style.display =
        "none";

}


/* ========================================
   OPGESLAGEN KLEUREN LADEN
======================================== */

function laadKleuren() {

    const opgeslagenAchtergrond =
        localStorage.getItem("achtergrond")
        || "#eef4ff";


    const opgeslagenMenu =
        localStorage.getItem("menuKleur")
        || "#ffffff";


    document.documentElement
        .style
        .setProperty(
            "--achtergrond-kleur",
            opgeslagenAchtergrond
        );


    document.documentElement
        .style
        .setProperty(
            "--menu-kleur",
            opgeslagenMenu
        );


    markeerSwatch(
        "achtergrond-grid",
        opgeslagenAchtergrond
    );


    markeerSwatch(
        "menu-kleur-grid",
        opgeslagenMenu
    );

}


/* ========================================
   SUPABASE SYNC MET E-MAIL LOGIN
======================================== */

let supabaseClient   = null;
let currentUser      = null;
let _syncTimeout     = null;
let _isLadenVanCloud = false;


// Intercept localStorage.setItem voor automatische cloud-sync
const _origSetItem = localStorage.setItem.bind(localStorage);

localStorage.setItem = function(sleutel, waarde) {

    _origSetItem(sleutel, waarde);

    if (!_isLadenVanCloud && currentUser) {

        const syncSleutels = [
            "lessen", "taken", "hobbies",
            "overgeslagen", "achtergrond", "menuKleur",
            "evenementen", "profielfoto"
        ];

        if (syncSleutels.includes(sleutel)) {
            syncNaarCloud();
        }

    }

};


function initSupabase() {

    if (typeof supabase === "undefined") {
        console.warn("Supabase SDK niet geladen");
        return;
    }

    supabaseClient =
        supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


    // Luister naar login/logout
    supabaseClient.auth.onAuthStateChange(
        function(event, session) {

            currentUser = session ? session.user : null;

            toonAanmeldStatus(currentUser);

            // Chat bijwerken bij login/logout
            toonChatStatus();

            if (currentUser) {

                laadVanCloud(function() {
                    toonLessen();
                    toonHobbies();
                    toonTaken();
                    laadKleuren();
                    laadProfielFoto();

                    const heeftLopende =
                        taken.some(function(t) {
                            return t.loopStatus === "bezig";
                        });

                    if (heeftLopende && !timerInterval) {
                        timerInterval =
                            setInterval(updateTimerDisplays, 1000);
                    }
                });

            }

        }
    );

}


function aanmelden() {

    const email =
        document.getElementById("login-email").value.trim();

    const wachtwoord =
        document.getElementById("login-wachtwoord").value;


    if (!email || !wachtwoord) {
        toonSyncStatus(
            "⚠ Vul je e-mail en wachtwoord in",
            "#e74c3c"
        );
        return;
    }

    if (!supabaseClient) {
        toonSyncStatus(
            "⚠ Supabase niet geconfigureerd",
            "#e74c3c"
        );
        return;
    }

    toonSyncStatus("⏳ Aanmelden…", "#f39c12");

    supabaseClient.auth
        .signInWithPassword({ email: email, password: wachtwoord })
        .then(function(result) {

            if (result.error) {
                toonSyncStatus(
                    "⚠ Fout: " + result.error.message,
                    "#e74c3c"
                );
            }
            // onAuthStateChange verwerkt de rest

        });

}


function registreren() {

    const email =
        document.getElementById("login-email").value.trim();

    const wachtwoord =
        document.getElementById("login-wachtwoord").value;


    if (!email || !wachtwoord) {
        toonSyncStatus(
            "⚠ Vul je e-mail en wachtwoord in",
            "#e74c3c"
        );
        return;
    }

    if (wachtwoord.length < 6) {
        toonSyncStatus(
            "⚠ Wachtwoord: minstens 6 tekens",
            "#e74c3c"
        );
        return;
    }

    toonSyncStatus("⏳ Account aanmaken…", "#f39c12");

    supabaseClient.auth
        .signUp({ email: email, password: wachtwoord })
        .then(function(result) {

            if (result.error) {
                toonSyncStatus(
                    "⚠ Fout: " + result.error.message,
                    "#e74c3c"
                );
            } else if (result.data.user && !result.data.session) {
                // E-mailbevestiging vereist
                toonSyncStatus(
                    "📧 Check je e-mail om te bevestigen",
                    "#27ae60"
                );
            }
            // Als session bestaat: onAuthStateChange verwerkt de rest

        });

}


function afmelden() {

    if (supabaseClient) {
        supabaseClient.auth.signOut();
    }

}


function syncNaarCloud() {

    if (!supabaseClient || !currentUser) return;

    clearTimeout(_syncTimeout);

    _syncTimeout = setTimeout(function() {

        const data = {
            lessen:       JSON.parse(localStorage.getItem("lessen")       || "[]"),
            taken:        JSON.parse(localStorage.getItem("taken")        || "[]"),
            hobbies:      JSON.parse(localStorage.getItem("hobbies")      || "[]"),
            overgeslagen: JSON.parse(localStorage.getItem("overgeslagen") || '{"week":"","ids":[]}'),
            evenementen:  JSON.parse(localStorage.getItem("evenementen")  || "{}"),
            achtergrond:  localStorage.getItem("achtergrond")  || "#eef4ff",
            menuKleur:    localStorage.getItem("menuKleur")    || "#ffffff",
            profielfoto:  localStorage.getItem("profielfoto")  || null,
            bijgewerkt:   new Date().toISOString()
        };

        supabaseClient
            .from("portalen")
            .upsert(
                {
                    user_id:     currentUser.id,
                    data:        data,
                    updated_at:  new Date().toISOString()
                },
                { onConflict: "user_id" }
            )
            .then(function(result) {

                if (result.error) {
                    toonSyncStatus("⚠ Sync mislukt", "#e74c3c");
                    console.error(result.error);
                } else {
                    toonSyncStatus("✓ Opgeslagen in cloud", "#27ae60");
                }

            });

    }, 800);

}


function laadVanCloud(callback) {

    if (!supabaseClient || !currentUser) {
        callback && callback();
        return;
    }

    toonSyncStatus("⏳ Gegevens laden…", "#f39c12");

    supabaseClient
        .from("portalen")
        .select("data")
        .eq("user_id", currentUser.id)
        .single()
        .then(function(result) {

            if (result.error && result.error.code !== "PGRST116") {

                toonSyncStatus("⚠ Kan niet verbinden", "#e74c3c");
                console.error(result.error);

            } else if (result.data && result.data.data) {

                pasCloudDataToe(result.data.data);
                toonSyncStatus("✓ Gesynchroniseerd", "#27ae60");

            } else {

                // Eerste keer aanmelden: sla lokale data op
                syncNaarCloud();
                toonSyncStatus("✓ Profiel aangemaakt", "#27ae60");

            }

            callback && callback();

        });

}


function pasCloudDataToe(data) {

    _isLadenVanCloud = true;

    if (Array.isArray(data.lessen)) {
        lessen = data.lessen;
        _origSetItem("lessen", JSON.stringify(lessen));
    }

    if (Array.isArray(data.taken)) {
        taken = data.taken;
        _origSetItem("taken", JSON.stringify(taken));
    }

    if (Array.isArray(data.hobbies)) {
        hobbies = data.hobbies;
        _origSetItem("hobbies", JSON.stringify(hobbies));
    }

    if (data.overgeslagen) {
        _origSetItem(
            "overgeslagen",
            JSON.stringify(data.overgeslagen)
        );
    }

    if (data.evenementen) {
        evenementen = data.evenementen;
        _origSetItem("evenementen", JSON.stringify(evenementen));
    }

    if (data.achtergrond) {
        _origSetItem("achtergrond", data.achtergrond);
    }

    if (data.menuKleur) {
        _origSetItem("menuKleur", data.menuKleur);
    }

    if (data.profielfoto) {
        _origSetItem("profielfoto", data.profielfoto);
        toonProfielFoto(data.profielfoto);
    }

    _isLadenVanCloud = false;

}


/* ========================================
   PROFIELFOTO
======================================== */

function laadProfielFoto() {

    const opgeslagen =
        localStorage.getItem("profielfoto");

    if (opgeslagen) {
        toonProfielFoto(opgeslagen);
    }

}


function kiesProfielFoto() {

    const invoer =
        document.getElementById("profiel-foto-invoer");

    if (invoer) {
        invoer.value = "";   // reset zodat dezelfde foto opnieuw gekozen kan worden
        invoer.click();
    }

}


function verwerkProfielFoto(bestand) {

    if (!bestand) return;

    const lezer = new FileReader();

    lezer.onload = function(e) {

        const afbeelding = new Image();

        afbeelding.onload = function() {

            // Bijsnijden tot vierkant en verkleinen naar 300×300
            const canvas =
                document.createElement("canvas");

            canvas.width  = 300;
            canvas.height = 300;

            const ctx = canvas.getContext("2d");

            // Centraal bijsnijden (square crop)
            const grootte =
                Math.min(afbeelding.width, afbeelding.height);

            const sx =
                (afbeelding.width  - grootte) / 2;

            const sy =
                (afbeelding.height - grootte) / 2;

            ctx.drawImage(
                afbeelding,
                sx, sy, grootte, grootte,
                0, 0, 300, 300
            );

            // PNG: transparantie behouden (geen zwarte hoeken bij JPEG)
            const dataUrl =
                canvas.toDataURL("image/png");


            _origSetItem("profielfoto", dataUrl);

            toonProfielFoto(dataUrl);

            if (currentUser) {
                syncNaarCloud();
            }

        };

        afbeelding.src = e.target.result;

    };

    lezer.readAsDataURL(bestand);

}


function toonProfielFoto(dataUrl) {

    // Klein avatar in de header
    const headerAvatar =
        document.getElementById("header-avatar");

    if (headerAvatar) {

        headerAvatar.style.backgroundImage =
            "url('" + dataUrl + "')";

        headerAvatar.textContent = "";
        headerAvatar.classList.add("heeft-foto");

    }


    // Groot welkom-avatar op de hoofdpagina
    const welkomAvatar =
        document.getElementById("welkom-avatar");

    if (welkomAvatar) {

        welkomAvatar.style.backgroundImage =
            "url('" + dataUrl + "')";

        welkomAvatar.textContent = "";
        welkomAvatar.classList.add("heeft-foto");

    }


    // Groot avatar in de instellingen
    const settingsAvatar =
        document.getElementById("settings-avatar");

    if (settingsAvatar) {

        settingsAvatar.style.backgroundImage =
            "url('" + dataUrl + "')";

        settingsAvatar.classList.add("heeft-foto");

        const placeholder =
            document.getElementById("profiel-placeholder");

        if (placeholder) {
            placeholder.style.display = "none";
        }

    }

    // Verwijder-knop zichtbaar maken
    const verwijderKnop =
        document.getElementById("foto-verwijder-knop");

    if (verwijderKnop) {
        verwijderKnop.style.display = "";
    }

}


function verwijderProfielFoto() {

    localStorage.removeItem("profielfoto");

    const headerAvatar =
        document.getElementById("header-avatar");

    if (headerAvatar) {
        headerAvatar.style.backgroundImage = "";
        headerAvatar.textContent = "👤";
        headerAvatar.classList.remove("heeft-foto");
    }


    const welkomAvatar =
        document.getElementById("welkom-avatar");

    if (welkomAvatar) {
        welkomAvatar.style.backgroundImage = "";
        welkomAvatar.textContent = "👤";
        welkomAvatar.classList.remove("heeft-foto");
    }


    const settingsAvatar =
        document.getElementById("settings-avatar");

    if (settingsAvatar) {
        settingsAvatar.style.backgroundImage = "";
        settingsAvatar.classList.remove("heeft-foto");

        const placeholder =
            document.getElementById("profiel-placeholder");

        if (placeholder) {
            placeholder.style.display = "";
        }
    }

    // Verwijder-knop weer verbergen
    const verwijderKnop =
        document.getElementById("foto-verwijder-knop");

    if (verwijderKnop) {
        verwijderKnop.style.display = "none";
    }


    if (currentUser) {
        syncNaarCloud();
    }

}


function toonAanmeldStatus(user) {

    const afgesloten =
        document.getElementById("login-afgesloten");

    const aangemeld =
        document.getElementById("login-aangemeld");

    const naamEl =
        document.getElementById("login-naam");


    if (user) {

        if (afgesloten) afgesloten.style.display = "none";
        if (aangemeld)  aangemeld.style.display  = "block";
        if (naamEl)     naamEl.textContent = user.email;

    } else {

        if (afgesloten) afgesloten.style.display = "block";
        if (aangemeld)  aangemeld.style.display  = "none";

    }

}


function toonSyncStatus(tekst, kleur) {

    const el =
        document.getElementById("sync-status");

    if (!el) return;

    el.textContent = tekst;
    el.style.color = kleur;

    clearTimeout(el._timer);

    el._timer = setTimeout(function() {
        if (el.textContent === tekst) {
            el.textContent = "";
        }
    }, 5000);

}


/* ========================================
   KALENDER AFSPRAKEN
======================================== */

function kiesKalenderDag(dagStr) {

    huidigKalenderDag = dagStr;

    const [j, ma, d] =
        dagStr.split("-").map(Number);

    const dagDatum =
        new Date(j, ma - 1, d);

    const label =
        dagDatum.toLocaleDateString("nl-BE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });


    document.getElementById(
        "event-popup-datum"
    ).textContent = "📅 " + label;

    document.getElementById(
        "event-invoer"
    ).value = "";

    toonEventLijst();

    document.getElementById(
        "event-popup"
    ).style.display = "flex";

    setTimeout(function() {
        document.getElementById(
            "event-invoer"
        ).focus();
    }, 100);

}


function toonEventLijst() {

    const lijst =
        document.getElementById("event-lijst");

    if (!lijst) return;


    const events =
        evenementen[huidigKalenderDag] || [];

    lijst.innerHTML = "";


    if (events.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Geen afspraken voor deze dag.
            </p>`;

        return;

    }


    events.forEach(function(event, index) {

        lijst.innerHTML += `

            <div class="event-item" id="event-item-${index}">

                <span class="event-tekst" id="event-tekst-${index}">
                    ${event}
                </span>

                <div class="item-acties">

                    <button
                        class="bewerk"
                        id="event-bewerk-knop-${index}"
                        onclick="bewerkEvent(${index})"
                        title="Bewerken">
                        ✏️
                    </button>

                    <button
                        class="verwijder"
                        onclick="verwijderEvent(${index})">
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });

}


function voegEventToe() {

    const invoer =
        document.getElementById("event-invoer");

    const tekst = invoer.value.trim();

    if (!tekst) return;


    if (!evenementen[huidigKalenderDag]) {
        evenementen[huidigKalenderDag] = [];
    }

    evenementen[huidigKalenderDag].push(tekst);


    localStorage.setItem(
        "evenementen",
        JSON.stringify(evenementen)
    );


    invoer.value = "";

    toonEventLijst();
    toonKalender();

}


function verwijderEvent(index) {

    if (!evenementen[huidigKalenderDag]) return;

    evenementen[huidigKalenderDag].splice(index, 1);

    if (evenementen[huidigKalenderDag].length === 0) {
        delete evenementen[huidigKalenderDag];
    }


    localStorage.setItem(
        "evenementen",
        JSON.stringify(evenementen)
    );


    toonEventLijst();
    toonKalender();

}


function bewerkEvent(index) {

    const events =
        evenementen[huidigKalenderDag] || [];

    const origineleTekst =
        events[index] || "";

    const tekstSpan =
        document.getElementById("event-tekst-" + index);

    const bewerkKnop =
        document.getElementById("event-bewerk-knop-" + index);

    if (!tekstSpan) return;

    // Vervang tekst door invoerveld
    tekstSpan.innerHTML =
        `<input
            type="text"
            class="tekst-invoer event-bewerk-invoer"
            id="event-bewerk-invoer-${index}"
            value="${origineleTekst.replace(/"/g, '&quot;')}"
            onkeydown="if(event.key==='Enter') slaEventBewerkingOp(${index})"
        >`;

    const invoer =
        document.getElementById(
            "event-bewerk-invoer-" + index
        );

    if (invoer) {
        invoer.focus();
        invoer.select();
    }

    // Verander bewerkknop in opslaanknop
    if (bewerkKnop) {
        bewerkKnop.textContent = "✓";
        bewerkKnop.onclick = function() {
            slaEventBewerkingOp(index);
        };
    }

}


function slaEventBewerkingOp(index) {

    const invoer =
        document.getElementById(
            "event-bewerk-invoer-" + index
        );

    if (!invoer) return;

    const nieuweTekst = invoer.value.trim();

    if (!nieuweTekst) return;

    evenementen[huidigKalenderDag][index] = nieuweTekst;

    localStorage.setItem(
        "evenementen",
        JSON.stringify(evenementen)
    );

    toonEventLijst();
    toonKalender();

}


function sluitEventPopup() {

    document.getElementById(
        "event-popup"
    ).style.display = "none";

    huidigKalenderDag = null;

}


/* ========================================
   SCHOOLKALENDER
======================================== */

function toonKalender() {

    const container =
        document.getElementById("kalender");

    if (!container) return;

    container.innerHTML = "";

    const maandNamen = [
        "", "januari", "februari", "maart",
        "april", "mei", "juni", "juli",
        "augustus", "september", "oktober",
        "november", "december"
    ];

    const dagNamen =
        ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

    // Volledig schooljaar: september 2026 t/m augustus 2027
    const schoolMaanden = [
        { jaar: 2026, maand: 9  },
        { jaar: 2026, maand: 10 },
        { jaar: 2026, maand: 11 },
        { jaar: 2026, maand: 12 },
        { jaar: 2027, maand: 1  },
        { jaar: 2027, maand: 2  },
        { jaar: 2027, maand: 3  },
        { jaar: 2027, maand: 4  },
        { jaar: 2027, maand: 5  },
        { jaar: 2027, maand: 6  },
        { jaar: 2027, maand: 7  },
        { jaar: 2027, maand: 8  }
    ];


    schoolMaanden.forEach(function({ jaar, maand }) {

        const blok =
            document.createElement("div");

        blok.className = "kalender-maand";


        // Maandtitel
        const titel =
            document.createElement("div");

        titel.className = "kalender-maand-naam";
        titel.textContent =
            maandNamen[maand] + " " + jaar;

        blok.appendChild(titel);


        // Grid
        const grid =
            document.createElement("div");

        grid.className = "kalender-grid";


        // Dag-header rij (Ma Di Wo Do Vr Za Zo)
        dagNamen.forEach(function(d) {

            const h = document.createElement("div");
            h.className = "kalender-dag-naam";
            h.textContent = d;
            grid.appendChild(h);

        });


        // Lege cellen vóór de eerste dag
        const eerstedag =
            new Date(jaar, maand - 1, 1);

        let startOffset = eerstedag.getDay();

        // Omzetten naar maandag = 0
        startOffset =
            startOffset === 0 ? 6 : startOffset - 1;

        for (let i = 0; i < startOffset; i++) {

            const leeg =
                document.createElement("div");

            leeg.className = "kalender-dag leeg";
            grid.appendChild(leeg);

        }


        // Dagen van de maand
        const aantalDagen =
            new Date(jaar, maand, 0).getDate();


        for (let d = 1; d <= aantalDagen; d++) {

            const dagStr =
                `${jaar}-${String(maand).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

            const cel =
                document.createElement("div");

            cel.className = "kalender-dag klikbaar";

            const dagEvents =
                evenementen[dagStr] || [];

            cel.innerHTML =
                `<span class="dag-nr">${d}</span>` +
                (dagEvents.length > 0
                    ? `<span class="event-stip"></span>`
                    : "");

            cel.addEventListener(
                "click",
                (function(ds) {
                    return function() {
                        kiesKalenderDag(ds);
                    };
                })(dagStr)
            );


            // Weekend
            const dagDatum =
                new Date(jaar, maand - 1, d);

            const dagNr = dagDatum.getDay();

            if (dagNr === 0 || dagNr === 6) {
                cel.classList.add("weekend");
            }


            // Vakantie
            for (const v of vakanties) {

                if (
                    dagStr >= v.begin &&
                    dagStr <= v.einde
                ) {
                    cel.classList.add("vakantie");
                    cel.title = v.naam;
                    break;
                }

            }


            // Vrije dag (overschrijft vakantie-stijl)
            if (vrijeDagen[dagStr]) {

                cel.classList.remove("vakantie");
                cel.classList.add("vrij");
                cel.title = vrijeDagen[dagStr];

            }


            // Vandaag
            if (dagStr === datum) {
                cel.classList.add("vandaag");
            }


            grid.appendChild(cel);

        }


        blok.appendChild(grid);
        container.appendChild(blok);

    });

}


/* ========================================
   CHAT
======================================== */

let chatKanaal       = null;
let chatGeladen      = false;


/* HTML escapen zodat berichten nooit scripts kunnen injecteren */
function escapeHtml(tekst) {

    return String(tekst)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}


/* Toont of verbergt de chat-invoer afhankelijk van login */
function toonChatStatus() {

    const invoerSectie =
        document.getElementById("chat-invoer-sectie");

    const aanmeldMelding =
        document.getElementById("chat-aanmeld-melding");

    if (currentUser) {

        if (invoerSectie)    invoerSectie.style.display    = "flex";
        if (aanmeldMelding)  aanmeldMelding.style.display  = "none";

        if (!chatGeladen) {
            laadChatBerichten();
            aboneerOpChat();
            chatGeladen = true;
        }

    } else {

        if (invoerSectie)    invoerSectie.style.display    = "none";
        if (aanmeldMelding)  aanmeldMelding.style.display  = "block";

    }

}


/* Haalt de laatste 80 berichten op uit Supabase */
function laadChatBerichten() {

    if (!supabaseClient) {
        return;
    }

    const lijst =
        document.getElementById("chat-berichten");

    if (lijst) {
        lijst.innerHTML =
            "<p class='chat-laden'>⏳ Berichten laden…</p>";
    }

    supabaseClient
        .from("berichten")
        .select("*")
        .order("aangemaakt_op", { ascending: true })
        .limit(80)
        .then(function(resultaat) {

            if (!lijst) return;

            if (resultaat.error) {

                lijst.innerHTML =
                    "<p class='chat-fout'>" +
                    "⚠️ Chat niet beschikbaar. Zorg dat de 'berichten' tabel aangemaakt is in Supabase." +
                    "</p>";

                return;

            }

            lijst.innerHTML = "";

            const berichten = resultaat.data || [];

            if (berichten.length === 0) {

                lijst.innerHTML =
                    "<p class='chat-leeg'>Nog geen berichten. Zeg als eerste hallo! 👋</p>";

            } else {

                berichten.forEach(function(b) {
                    voegChatBerichtToe(b, false);
                });

            }

            scrollChatNaarOnder();

        });

}


/* Voegt één bericht-element toe aan de lijst */
function voegChatBerichtToe(b, nieuw) {

    const lijst =
        document.getElementById("chat-berichten");

    if (!lijst) {
        return;
    }

    // Verwijder "leeg" of "laden" placeholder
    const placeholder =
        lijst.querySelector(".chat-leeg, .chat-laden");

    if (placeholder) {
        placeholder.remove();
    }

    const isEigen =
        currentUser && b.user_id === currentUser.id;

    const tijd =
        new Date(b.aangemaakt_op)
            .toLocaleTimeString("nl-BE", {
                hour:   "2-digit",
                minute: "2-digit"
            });

    const div = document.createElement("div");
    div.className =
        "chat-bericht " + (isEigen ? "eigen" : "ander");

    if (nieuw) {
        div.classList.add("nieuw");
    }

    div.innerHTML =
        (!isEigen
            ? "<div class='chat-naam'>" +
              escapeHtml(b.gebruikersnaam) +
              "</div>"
            : "") +
        "<div class='chat-bubbel'>" +
        escapeHtml(b.bericht) +
        "</div>" +
        "<div class='chat-tijd'>" + tijd + "</div>";

    lijst.appendChild(div);

}


/* Scrollt de chatlijst naar het laatste bericht */
function scrollChatNaarOnder() {

    const lijst =
        document.getElementById("chat-berichten");

    if (lijst) {
        lijst.scrollTop = lijst.scrollHeight;
    }

}


/* Verstuurt een nieuw bericht naar Supabase */
function stuurChatBericht() {

    if (!supabaseClient || !currentUser) {
        return;
    }

    const invoer =
        document.getElementById("chat-invoer");

    const tekst =
        invoer ? invoer.value.trim() : "";

    if (!tekst) {
        return;
    }

    // Gebruikersnaam: deel voor @ in het e-mailadres
    const naam =
        currentUser.email.split("@")[0];

    invoer.value = "";
    invoer.focus();

    supabaseClient
        .from("berichten")
        .insert({
            user_id:        currentUser.id,
            gebruikersnaam: naam,
            bericht:        tekst
        })
        .then(function(resultaat) {

            if (resultaat.error) {

                console.warn(
                    "Bericht sturen mislukt:",
                    resultaat.error
                );

            }

        });

}


/* Abonneert op nieuwe berichten via Supabase Realtime */
function aboneerOpChat() {

    if (!supabaseClient) {
        return;
    }

    // Verwijder eventueel oud kanaal
    if (chatKanaal) {
        supabaseClient.removeChannel(chatKanaal);
    }

    chatKanaal =
        supabaseClient
            .channel("publieke-chat")
            .on(
                "postgres_changes",
                {
                    event:  "INSERT",
                    schema: "public",
                    table:  "berichten"
                },
                function(payload) {

                    voegChatBerichtToe(payload.new, true);
                    scrollChatNaarOnder();

                }
            )
            .subscribe();

}


/* ========================================
   PAGINANAVIGATIE (zijbalk)
======================================== */

const paginaNamen = {
    welkom:   "Mijn Portaal",
    lessen:   "📚 Lessen",
    hobbies:  "🎮 Hobby's",
    planning: "📋 Planning",
    kalender: "📅 Kalender",
    chat:     "💬 Chat"
};


function toonPagina(paginaId) {

    // Verberg alle pagina's
    document.querySelectorAll(".pagina").forEach(function(p) {
        p.classList.remove("actief");
    });

    // Toon de gevraagde pagina
    const pagina =
        document.getElementById("pagina-" + paginaId);

    if (pagina) {
        pagina.classList.add("actief");
    }

    // Markeer actief nav-item
    document.querySelectorAll(".nav-item[data-pagina]").forEach(function(btn) {
        btn.classList.toggle(
            "actief",
            btn.dataset.pagina === paginaId
        );
    });

    // Update mobiele titelbalk
    const mobieltitel =
        document.querySelector(".mobiel-header h1");

    if (mobieltitel) {
        mobieltitel.textContent =
            paginaNamen[paginaId] || "Mijn Portaal";
    }

    // Sla huidige pagina op
    localStorage.setItem("huidigePagina", paginaId);

    // Scroll naar boven
    window.scrollTo(0, 0);

    // Pagina-specifieke acties
    if (paginaId === "chat") {
        toonChatStatus();
    }

}


/* ========================================
   PAGINA STARTEN
======================================== */

window.onload =
    function() {

        toonSchoolStatus();

        // Huidig weer ophalen (via geolocatie + Open-Meteo)
        haalWeer();

        // Supabase starten (laadt cloud-data via onAuthStateChange)
        initSupabase();

        // Eerste render met lokale data (direct zichtbaar)
        toonLessen();
        toonHobbies();
        toonTaken();
        toonKalender();
        laadKleuren();

        // Slepen activeren
        initSlepenTaken();

        // Profielfoto laden
        laadProfielFoto();

        // Herstel laatste pagina (of start op welkom)
        const opgeslagenPagina =
            localStorage.getItem("huidigePagina") || "welkom";

        toonPagina(opgeslagenPagina);


        // Herstart interval als er lopende timers zijn
        const heeftLopende =
            taken.some(
                function(t) {
                    return t.loopStatus === "bezig";
                }
            );

        if (heeftLopende) {

            timerInterval =
                setInterval(
                    updateTimerDisplays,
                    1000
                );

        }

    };

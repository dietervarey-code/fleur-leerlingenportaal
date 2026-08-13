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


let geselecteerdIcono = "📖";


function voegLesToe() {

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


    lessen.push({
        icoon: geselecteerdIcono,
        naam: naam
    });


    localStorage.setItem(
        "lessen",
        JSON.stringify(lessen)
    );


    toonLessen();

    sluitLesPopup();

}


function sluitLesPopup() {

    document.getElementById(
        "les-popup"
    ).style.display = "none";

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

                    <button
                        class="verwijder"
                        onclick="verwijderLes(${index})">

                        🗑️

                    </button>

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


    taken.push({
        vak: geselecteerdVak,
        naam: taakNaam,
        klaar: false,
        deadline: deadlineWaarde,
        schatting: schattingMinuten,
        looptijd: 0,
        loopStatus: "gestopt",
        startTijdstip: null
    });


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

    sluitTaakPopup();

}


function sluitTaakPopup() {

    document.getElementById(
        "taak-popup"
    ).style.display = "none";

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
let geselecteerdDag = 1;


function voegHobbyToe() {

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


    hobbies.push({
        id: Date.now(),
        icoon: geselecteerdHobbyIcono,
        naam: naam,
        dag: geselecteerdDag,
        vanUur: van,
        totUur: tot
    });


    localStorage.setItem(
        "hobbies",
        JSON.stringify(hobbies)
    );


    toonHobbies();
    toonTaken();
    sluitHobbyPopup();

}


function sluitHobbyPopup() {

    document.getElementById(
        "hobby-popup"
    ).style.display = "none";

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

function toonHobbyBlok(lijst, hobby, datumStr) {

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

            <button
                class="hobby-blok-overslaan"
                onclick="slaanOver(${hobby.id})"
                title="Niet deze week">
                ✕
            </button>

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


    // --- Gecombineerde items bouwen ---
    const items = [];

    hobbies.forEach(function(hobby) {

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

            items.push({
                type: "hobby",
                hobby: hobby,
                datumStr: datumStr,
                sortKey: datumStr + " " + hobby.vanUur
            });

        }

    });

    taken.forEach(function(taak, index) {

        items.push({
            type: "taak",
            taak: taak,
            index: index,
            sortKey:
                (taak.deadline || "9999-12-31") + " 23:59"
        });

    });

    items.sort(function(a, b) {
        return a.sortKey.localeCompare(b.sortKey);
    });


    if (items.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen taken of hobby's gepland.
            </p>`;

        return;

    }


    items.forEach(function(item) {

        if (item.type === "hobby") {

            toonHobbyBlok(
                lijst,
                item.hobby,
                item.datumStr
            );

            return;

        }


        // --- Taak ---
        const taak = item.taak;
        const index = item.index;

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

            <div class="taak ${taak.klaar ? "klaar" : ""}">

                <div class="taak-top">

                    <label>

                        <input
                            type="checkbox"
                            ${taak.klaar ? "checked" : ""}
                            onchange="taakKlaar(${index})"
                        >

                        ${vakLabel}
                        ${taak.naam}

                    </label>


                    <button
                        class="verwijder"
                        onclick="verwijderTaak(${index})">
                        🗑️
                    </button>

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
   FIREBASE SYNC MET GOOGLE LOGIN
======================================== */

let db          = null;
let auth        = null;
let currentUser = null;
let _syncTimeout      = null;
let _isLadenVanCloud  = false;


// Intercept localStorage.setItem voor automatische cloud-sync
const _origSetItem = localStorage.setItem.bind(localStorage);

localStorage.setItem = function(sleutel, waarde) {

    _origSetItem(sleutel, waarde);

    if (!_isLadenVanCloud && currentUser) {

        const syncSleutels = [
            "lessen", "taken", "hobbies",
            "overgeslagen", "achtergrond", "menuKleur"
        ];

        if (syncSleutels.includes(sleutel)) {
            syncNaarCloud();
        }

    }

};


function initFirebase() {

    if (
        !window.firebaseConfig ||
        firebaseConfig.apiKey === "VERVANG-MET-JOUW-API-KEY"
    ) {
        return; // Nog niet geconfigureerd
    }

    try {

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        db   = firebase.firestore();
        auth = firebase.auth();


        // Luister naar login/logout
        auth.onAuthStateChanged(function(user) {

            currentUser = user;

            toonAanmeldStatus(user);

            if (user) {

                // Gegevens laden vanuit cloud
                laadVanCloud(function() {
                    toonLessen();
                    toonHobbies();
                    toonTaken();
                    laadKleuren();

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

        });

    } catch (e) {
        console.error("Firebase fout:", e);
    }

}


function aanmelden() {

    if (!auth) {
        toonSyncStatus(
            "⚠ Firebase nog niet geconfigureerd",
            "#e74c3c"
        );
        return;
    }

    const provider =
        new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .catch(function(err) {
            toonSyncStatus("⚠ Aanmelden mislukt", "#e74c3c");
            console.error(err);
        });

}


function afmelden() {

    if (auth) {
        auth.signOut();
    }

}


function getDocRef() {

    if (!db || !currentUser) return null;

    return db
        .collection("portalen")
        .doc(currentUser.uid);

}


function syncNaarCloud() {

    const ref = getDocRef();
    if (!ref) return;

    clearTimeout(_syncTimeout);

    _syncTimeout = setTimeout(function() {

        const data = {
            lessen:       JSON.parse(localStorage.getItem("lessen")       || "[]"),
            taken:        JSON.parse(localStorage.getItem("taken")        || "[]"),
            hobbies:      JSON.parse(localStorage.getItem("hobbies")      || "[]"),
            overgeslagen: JSON.parse(localStorage.getItem("overgeslagen") || '{"week":"","ids":[]}'),
            achtergrond:  localStorage.getItem("achtergrond")  || "#eef4ff",
            menuKleur:    localStorage.getItem("menuKleur")    || "#ffffff",
            bijgewerkt:   new Date().toISOString()
        };

        ref.set(data)
            .then(function() {
                toonSyncStatus("✓ Opgeslagen in cloud", "#27ae60");
            })
            .catch(function(err) {
                toonSyncStatus("⚠ Sync mislukt", "#e74c3c");
                console.error(err);
            });

    }, 800);

}


function laadVanCloud(callback) {

    const ref = getDocRef();

    if (!ref) {
        callback && callback();
        return;
    }

    toonSyncStatus("⏳ Gegevens laden…", "#f39c12");

    ref.get()
        .then(function(doc) {

            if (doc.exists) {

                pasCloudDataToe(doc.data());
                toonSyncStatus("✓ Gesynchroniseerd", "#27ae60");

            } else {

                // Eerste keer aanmelden: sla lokale data op
                syncNaarCloud();
                toonSyncStatus("✓ Profiel aangemaakt", "#27ae60");

            }

            callback && callback();

        })
        .catch(function(err) {
            toonSyncStatus("⚠ Kan niet verbinden", "#e74c3c");
            console.error(err);
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

    if (data.achtergrond) {
        _origSetItem("achtergrond", data.achtergrond);
    }

    if (data.menuKleur) {
        _origSetItem("menuKleur", data.menuKleur);
    }

    _isLadenVanCloud = false;

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
        if (naamEl)     naamEl.textContent =
            user.displayName || user.email;

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

    // Schooljaar: september 2026 t/m juni 2027
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
        { jaar: 2027, maand: 6  }
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

            cel.className = "kalender-dag";
            cel.textContent = d;


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
   PAGINA STARTEN
======================================== */

window.onload =
    function() {

        toonSchoolStatus();

        // Firebase starten (laadt cloud-data via onAuthStateChanged)
        initFirebase();

        // Eerste render met lokale data (direct zichtbaar)
        toonLessen();
        toonHobbies();
        toonTaken();
        toonKalender();
        laadKleuren();


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

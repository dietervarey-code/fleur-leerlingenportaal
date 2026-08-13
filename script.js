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


function voegTaakToe() {

    const taak =
        prompt(
            "Welke taak wil je toevoegen?"
        );


    if (
        taak !== null &&
        taak.trim() !== ""
    ) {

        taken.push({

            naam:
                taak.trim(),

            klaar:
                false

        });


        localStorage.setItem(
            "taken",
            JSON.stringify(taken)
        );


        toonTaken();

    }

}


function toonTaken() {

    const lijst =
        document.getElementById(
            "taken"
        );


    if (!lijst) {
        return;
    }


    lijst.innerHTML = "";


    if (taken.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen taken toegevoegd.
            </p>`;

        return;

    }


    taken.forEach(
        function(taak, index) {

            lijst.innerHTML += `

                <div class="taak
                    ${taak.klaar ? "klaar" : ""}">

                    <label>

                        <input
                            type="checkbox"
                            ${taak.klaar ? "checked" : ""}
                            onchange="taakKlaar(${index})"
                        >

                        ✏️ ${taak.naam}

                    </label>


                    <button
                        class="verwijder"
                        onclick="verwijderTaak(${index})">

                        🗑️

                    </button>

                </div>

            `;

        }
    );

}


function taakKlaar(index) {

    taken[index].klaar =
        !taken[index].klaar;


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

}


function verwijderTaak(index) {

    taken.splice(
        index,
        1
    );


    localStorage.setItem(
        "taken",
        JSON.stringify(taken)
    );


    toonTaken();

}


/* ========================================
   DOELEN
======================================== */

let doelen =
    JSON.parse(
        localStorage.getItem("doelen")
    ) || [];


function voegDoelToe() {

    const doel =
        prompt(
            "Welk doel wil je toevoegen?"
        );


    if (
        doel !== null &&
        doel.trim() !== ""
    ) {

        doelen.push(
            doel.trim()
        );


        localStorage.setItem(
            "doelen",
            JSON.stringify(doelen)
        );


        toonDoelen();

    }

}


function toonDoelen() {

    const lijst =
        document.getElementById(
            "doelen"
        );


    if (!lijst) {
        return;
    }


    lijst.innerHTML = "";


    if (doelen.length === 0) {

        lijst.innerHTML =
            `<p class="leeg">
                Nog geen doelen toegevoegd.
            </p>`;

        return;

    }


    doelen.forEach(
        function(doel, index) {

            lijst.innerHTML += `

                <div class="doel">

                    <span>
                        🎯 ${doel}
                    </span>

                    <button
                        class="verwijder"
                        onclick="verwijderDoel(${index})">

                        🗑️

                    </button>

                </div>

            `;

        }
    );

}


function verwijderDoel(index) {

    doelen.splice(
        index,
        1
    );


    localStorage.setItem(
        "doelen",
        JSON.stringify(doelen)
    );


    toonDoelen();

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
   PAGINA STARTEN
======================================== */

window.onload =
    function() {

        toonSchoolStatus();

        toonLessen();

        toonTaken();

        toonDoelen();

        laadKleuren();

    };

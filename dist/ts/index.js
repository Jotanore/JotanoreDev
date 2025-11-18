console.log("tres");
const logo = document.getElementById('nav-logo');
const indexButton = document.getElementById('index-button');
const experienceButton = document.getElementById('experience-button');
const statsButton = document.getElementById('stats-button');
const projectsButton = document.getElementById('projects-button');
const contactButton = document.getElementById('contact-button');
const indexContainer = document.getElementById('index-container');
const experienceContainer = document.getElementById('experience-container');
const statsContainer = document.getElementById('stats-container');
const projectsContainer = document.getElementById('projects-container');
const contactContainer = document.getElementById('contact-container');
const line = document.getElementById("timeline-draw");
const eventsUp = document.getElementById("events-up");
const eventsDown = document.getElementById("events-down");
const eventsUpVertical = document.getElementById("events-up-vertical");
const eventsDownVertical = document.getElementById("events-down-vertical");
let isExperienceVisible = false;
// Datos de ejemplo
const studies = [
    { year: "", title: "" },
    { year: "2020-2023", title: "FP Superior Desarollo de Videojuegos" },
    { year: "", title: "" },
    { year: "", title: "" },
    { year: "", title: "" },
    { year: "2024", title: "Curso Javascript from Zero to Expert" },
    { year: "2025", title: `Bootcamp Desarrollo Fullstack <br> Curso Desarollo en Java` },
];
const jobs = [
    { year: "2018-2019", title: "Esports Coach @ Baskonia" },
    { year: "2020", title: "Expendedor @ Avia <br> Freelance eSports Coach" },
    { year: "2021", title: "Freelance eSports Coach" },
    { year: "2022", title: "Auxiliar @ Dreamfit <br> Gaming Content Leader @ Cracked.club <br> Freelance eSports Coach" },
    { year: "->", title: "" },
    { year: "2024", title: "Monitor Polivalente @ Dreamfit" },
    { year: "->", title: "" },
];
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton, contactButton);
    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);
    contactButton.addEventListener('click', showContact);
    createEvent(eventsUp, studies, "text-blue-400");
    createEvent(eventsDown, jobs, "text-yellow-400");
    createEventVertical(eventsUpVertical, studies, "text-blue-400");
    createEventVertical(eventsDownVertical, jobs, "text-yellow-400");
    drawProjects();
});
function showIndex() {
    indexContainer.classList.remove('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');
    console.log('index');
}
function showExperience() {
    experienceContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');
    if (!isExperienceVisible) {
        timelineAnimation();
        timelineAnimationVertical();
        isExperienceVisible = true;
    }
    console.log('experience');
}
function showStats() {
    statsContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');
    console.log('experience');
}
function showProjects() {
    projectsContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');
    console.log('projects');
}
function showContact() {
    contactContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    console.log('contact');
}
async function getProjects() {
    try {
        const response = await fetch('./src/api/projects.json');
        if (!response.ok)
            throw new Error('Error getting projects');
        const projects = await response.json();
        return projects;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
async function drawProjects() {
    const projects = await getProjects();
    console.log("saddasdf" + projects);
    projects.forEach((project) => {
        const projectContainer = document.getElementById('projects-container');
        const html = `
            <div class="col max-w-72">
                <div class="card">
                <img src="${project.img}" class="card-img-top max-h-60" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${project.name}</h5>
                    <p class="card-text">${project.description}</p>
                </div>
                <div class="card-footer">
                    <a href="${project.link}" class="btn btn-primary text-body-secondary">Link</a>
                </div>
                </div>
            </div>
            `;
        projectContainer?.insertAdjacentHTML('beforeend', html);
    });
}
const createEvent = (container, data, colorClass) => {
    data.forEach(event => {
        const div = document.createElement("div");
        div.className = `event text-center w-1/5 ${colorClass}`;
        div.innerHTML = `<div class="text-sm font-bold">${event.year}</div><div>${event.title}</div>`;
        container.appendChild(div);
    });
};
function timelineAnimation() {
    // Animar línea
    setTimeout(() => {
        line.classList.add("animate");
    }, 100);
    // Mostrar eventos escalonadamente, sincronizando estudio + trabajo
    const totalDuration = 3200; // duración total de la línea
    const steps = studies.length; // número de puntos (asumimos igual para estudios y trabajos)
    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;
        setTimeout(() => {
            const upEvent = eventsUp.children[i];
            const downEvent = eventsDown.children[i];
            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
    }
}
;
const createEventVertical = (container, data, colorClass) => {
    data.forEach(event => {
        const div = document.createElement("div");
        div.className = `event mb-12 w-44 text-center ${colorClass}`;
        div.innerHTML = `
            <div class="text-sm font-bold">${event.year}</div>
            <div>${event.title}</div>
        `;
        container.appendChild(div);
    });
};
function timelineAnimationVertical() {
    const lineVertical = document.getElementById("timeline-vertical-draw");
    // animamos la línea
    setTimeout(() => {
        lineVertical.classList.add("animate");
    }, 100);
    const steps = studies.length;
    const totalDuration = 3200;
    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;
        setTimeout(() => {
            const upEvent = eventsUpVertical.children[i];
            const downEvent = eventsDownVertical.children[i];
            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
    }
}
export {};
//# sourceMappingURL=index.js.map
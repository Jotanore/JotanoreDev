const logo = document.getElementById('nav-logo');
const indexButton = document.getElementById('index-button');
const experienceButton = document.getElementById('experience-button');
const statsButton = document.getElementById('stats-button');
const projectsButton = document.getElementById('projects-button');
const indexContainer = document.getElementById('index-container');
const experienceContainer = document.getElementById('experience-container');
const statsContainer = document.getElementById('stats-container');
const projectsContainer = document.getElementById('projects-container');
const fadedContainerTop = document.getElementById('fade-top');
const fadedContainerBottom = document.getElementById('fade-top');
const line = document.getElementById("timeline-draw");
const eventsUp = document.getElementById("events-up");
const eventsDown = document.getElementById("events-down");
const eventsUpVertical = document.getElementById("events-up-vertical");
const eventsDownVertical = document.getElementById("events-down-vertical");
let isExperienceVisible = false;
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
    { year: "►", title: "" },
    { year: "2024", title: "Monitor Polivalente @ Dreamfit" },
    { year: "►", title: "" },
];
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton);
    document.getElementById("btn-es")?.addEventListener('click', () => languageManager('es'));
    document.getElementById("btn-en")?.addEventListener('click', () => languageManager('en'));
    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);
    createEvent(eventsUp, studies, "text-stone-600", "flex flex-col-reverse");
    createEvent(eventsDown, jobs, "text-yellow-500", "flex flex-col");
    createEventVertical(eventsUpVertical, studies, "text-stone-600", "text-right");
    createEventVertical(eventsDownVertical, jobs, "text-yellow-500", "text-left");
    drawProjects();
    setDriverLicenseTime();
    setVisibleStats();
    showIndex();
});
async function getTexts() {
    try {
        const response = await fetch('./src/api/texts.json');
        if (!response.ok)
            throw new Error('Error getting texts');
        const projects = await response.json();
        console.log(projects);
        return projects;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
async function languageManager(lang) {
    if (lang === 'es') {
        document.getElementById('btn-es')?.classList.add('btn-dark');
        document.getElementById('btn-en')?.classList.add('btn-outline-dark');
        document.getElementById('btn-es')?.classList.remove('btn-outline-dark');
        document.getElementById('btn-en')?.classList.remove('btn-dark');
    }
    else {
        document.getElementById('btn-es')?.classList.remove('btn-dark');
        document.getElementById('btn-en')?.classList.remove('btn-outline-dark');
        document.getElementById('btn-en')?.classList.add('btn-dark');
        document.getElementById('btn-es')?.classList.add('btn-outline-dark');
    }
    const [texts] = await getTexts();
    //NAV
    //MENU
    const indexMenuText = document.getElementById('index-menu-text') ? document.getElementById('index-menu-text') : null;
    const experienceMenuText = document.getElementById('experience-menu-text') ? document.getElementById('experience-menu-text') : null;
    const statsMenuText = document.getElementById('stats-menu-text') ? document.getElementById('stats-menu-text') : null;
    const projectsMenuText = document.getElementById('projects-menu-text') ? document.getElementById('projects-menu-text') : null;
    if (indexMenuText)
        indexMenuText.textContent = texts[lang].menu.index;
    if (experienceMenuText)
        experienceMenuText.textContent = texts[lang].menu.experience;
    if (statsMenuText)
        statsMenuText.textContent = texts[lang].menu.skills;
    if (projectsMenuText)
        projectsMenuText.textContent = texts[lang].menu.projects;
    //INDEX
    const job = document.getElementById('job') ? document.getElementById('job') : null;
    const description = document.getElementById('description') ? document.getElementById('description') : null;
    const cvButton = document.getElementById('cv-button') ? document.getElementById('cv-button') : null;
    if (job)
        job.textContent = texts[lang].index.job;
    if (description)
        description.textContent = texts[lang].index.description;
    if (cvButton)
        if (lang === 'en') {
            cvButton.setAttribute('href', './src/docs/CV-EN.pdf');
        }
        else {
            cvButton.setAttribute('href', './src/docs/CV-ES.pdf');
        }
    //EXPERIENCE
    //STATS
    //PROJECTS
}
function showIndex() {
    titleManager('Jotadev');
    indexContainer.classList.remove('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');
    console.log('index');
}
function showExperience() {
    titleManager('Experience');
    experienceContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');
    if (!isExperienceVisible) {
        timelineAnimation();
        timelineAnimationVertical();
        isExperienceVisible = true;
    }
    console.log('experience');
}
function showStats() {
    titleManager('Skills');
    statsContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');
    console.log('experience');
}
function showProjects() {
    titleManager('Projects');
    projectsContainer.classList.remove('hidden');
    fadedContainerTop.classList.remove('hidden');
    fadedContainerBottom.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    console.log('projects');
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
    projects.forEach((project) => {
        const projectContainer = document.getElementById('projects');
        const html = `
            <div class="col max-w-72">
                <div class="card h-full">
                <img src="${project.img}" class="card-img-top max-h-60" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${project.name}</h5>
                    <p class="card-text">${project.description}</p>
                </div>
                <div class="card-footer">
                    ${project.link ? `<a href="${project.link}" class="btn btn-dark">Link</a>` : ''}
                    <a href="${project.github}" class="btn btn-outline-dark">GitHub Repo</a>
                </div>
                </div>
            </div>
            `;
        projectContainer?.insertAdjacentHTML('beforeend', html);
    });
}
const createEvent = (container, data, colorClass, textAlignClass) => {
    data.forEach(event => {
        const div = document.createElement("div");
        div.className = `event text-center w-1/5 ${colorClass} ${textAlignClass}`;
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
const createEventVertical = (container, data, colorClass, textAlignClass) => {
    data.forEach(event => {
        const div = document.createElement("div");
        div.className = `event text-[15px] ${colorClass} ${textAlignClass} event-vertical`;
        div.innerHTML = `
            <div class="text-sm font-bold">${event.year == "►" ? "▼" : event.year}</div>
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
function setDriverLicenseTime() {
    const MotoDriverLicenseTime = document.getElementById('moto-driver-license-time');
    const CarDriverLicenseTime = document.getElementById('car-driver-license-time');
    const carLicenseMonth = 7;
    const carLicenseYear = 2017;
    const motoLicenseMonth = 9;
    const motoLicenseYear = 2023;
    const todayMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();
    const carTime = (todayMonth - carLicenseMonth) >= 0 ? (todayYear - carLicenseYear) : (todayYear - carLicenseYear) - 1;
    const motoTime = (todayMonth - motoLicenseMonth) >= 0 ? (todayYear - motoLicenseYear) : (todayYear - motoLicenseYear) - 1;
    MotoDriverLicenseTime.innerHTML = `${motoTime} years. Own motorcycle`;
    CarDriverLicenseTime.innerHTML = `${carTime} years. Own car`;
}
function setVisibleStats() {
    const collapses = document.querySelectorAll('.vis');
    collapses.forEach(collapse => {
        collapse.classList.add('visible');
    });
}
function titleManager(name) {
    logo.innerHTML = name;
}
export {};
//# sourceMappingURL=index.js.map
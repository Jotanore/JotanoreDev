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
let projects;
let projectTexts;
let isExperienceVisible = false;
let isSpanish = true;
let activeView = "index";
let textsData;
let timelineTimeouts = [];
let timelineTimeoutsVertical = [];
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("btn-es")?.addEventListener('click', () => {
        isSpanish = true;
        languageManager('es');
        drawProjects();
        const langData = textsData[isSpanish ? 'es' : 'en'];
        refreshExperience();
        createEvent(eventsUp, langData.experience.studies, "text-stone-600", "flex flex-col-reverse");
        createEvent(eventsDown, langData.experience.jobs, "text-yellow-500", "flex flex-col");
        createEventVertical(eventsUpVertical, langData.experience.studies, "text-stone-600", "text-right");
        createEventVertical(eventsDownVertical, langData.experience.jobs, "text-yellow-500", "text-left");
        timelineAnimation();
        timelineAnimationVertical();
    });
    document.getElementById("btn-en")?.addEventListener('click', () => {
        isSpanish = false;
        languageManager('en');
        drawProjects();
        const langData = textsData[isSpanish ? 'es' : 'en'];
        refreshExperience();
        createEvent(eventsUp, langData.experience.studies, "text-stone-600", "flex flex-col-reverse");
        createEvent(eventsDown, langData.experience.jobs, "text-yellow-500", "flex flex-col");
        createEventVertical(eventsUpVertical, langData.experience.studies, "text-stone-600", "text-right");
        createEventVertical(eventsDownVertical, langData.experience.jobs, "text-yellow-500", "text-left");
        timelineAnimation();
        timelineAnimationVertical();
    });
    textsData = await getTexts();
    projects = await getProjects();
    const langData = textsData[isSpanish ? 'es' : 'en'];
    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);
    languageManager('es');
    drawProjects();
    setDriverLicenseTime();
    setVisibleStats();
    showIndex();
    createEvent(eventsUp, langData.experience.studies, "text-stone-600", "flex flex-col-reverse");
    createEvent(eventsDown, langData.experience.jobs, "text-yellow-500", "flex flex-col");
    createEventVertical(eventsUpVertical, langData.experience.studies, "text-stone-600", "text-right");
    createEventVertical(eventsDownVertical, langData.experience.jobs, "text-yellow-500", "text-left");
});
async function getTexts() {
    try {
        const response = await fetch('./src/api/texts.json');
        if (!response.ok)
            throw new Error('Error getting texts');
        const [projects] = await response.json();
        console.log(projects);
        return projects;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
async function languageManager(lang) {
    isSpanish = (lang === 'es');
    const langData = textsData[isSpanish ? 'es' : 'en'];
    updateTitle();
    if (isSpanish) {
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
    //MENU
    const indexMenuText = document.getElementById('index-menu-text') ? document.getElementById('index-menu-text') : null;
    const experienceMenuText = document.getElementById('experience-menu-text') ? document.getElementById('experience-menu-text') : null;
    const statsMenuText = document.getElementById('stats-menu-text') ? document.getElementById('stats-menu-text') : null;
    const projectsMenuText = document.getElementById('projects-menu-text') ? document.getElementById('projects-menu-text') : null;
    if (indexMenuText)
        indexMenuText.textContent = langData.menu.index;
    if (experienceMenuText)
        experienceMenuText.textContent = langData.menu.experience;
    if (statsMenuText)
        statsMenuText.textContent = langData.menu.skills;
    if (projectsMenuText)
        projectsMenuText.textContent = langData.menu.projects;
    //INDEX
    const job = document.getElementById('job') ? document.getElementById('job') : null;
    const description = document.getElementById('description') ? document.getElementById('description') : null;
    const cvButton = document.getElementById('cv-button') ? document.getElementById('cv-button') : null;
    if (job)
        job.textContent = langData.index.job;
    if (description)
        description.textContent = langData.index.description;
    if (cvButton)
        if (lang === 'en') {
            cvButton.setAttribute('href', './src/docs/CV-EN.pdf');
        }
        else {
            cvButton.setAttribute('href', './src/docs/CV-ES.pdf');
        }
    //EXPERIENCE
    //STATS
    const programmingLanguagesButton = document.getElementById('programming-languages-button') ? document.getElementById('programming-languages-button') : null;
    const frontEndButton = document.getElementById('front-end-button') ? document.getElementById('front-end-button') : null;
    const backEndButton = document.getElementById('back-end-button') ? document.getElementById('back-end-button') : null;
    const softSkillsButton = document.getElementById('soft-skills-button') ? document.getElementById('soft-skills-button') : null;
    const extrasButton = document.getElementById('extras-button') ? document.getElementById('extras-button') : null;
    if (programmingLanguagesButton)
        programmingLanguagesButton.textContent = langData.stats.languages;
    if (frontEndButton)
        frontEndButton.textContent = langData.stats.frontend;
    if (backEndButton)
        backEndButton.textContent = langData.stats.backend;
    if (softSkillsButton)
        softSkillsButton.textContent = langData.stats.softskills;
    if (extrasButton)
        extrasButton.textContent = langData.stats.extras;
    const initiativeTitle = document.getElementById('initiative-title') ? document.getElementById('initiative-title') : null;
    const stressTitle = document.getElementById('stress-title') ? document.getElementById('stress-title') : null;
    const analyticalTitle = document.getElementById('analytical-title') ? document.getElementById('analytical-title') : null;
    const knowledgeTitle = document.getElementById('knowledge-title') ? document.getElementById('knowledge-title') : null;
    const communicationTitle = document.getElementById('communication-title') ? document.getElementById('communication-title') : null;
    const problemTitle = document.getElementById('problem-title') ? document.getElementById('problem-title') : null;
    if (initiativeTitle)
        initiativeTitle.textContent = langData.stats.initiative;
    if (stressTitle)
        stressTitle.textContent = langData.stats.stress;
    if (analyticalTitle)
        analyticalTitle.textContent = langData.stats.analytical;
    if (knowledgeTitle)
        knowledgeTitle.textContent = langData.stats.knowledge;
    if (communicationTitle)
        communicationTitle.textContent = langData.stats.communication;
    if (problemTitle)
        problemTitle.textContent = langData.stats.problem;
    const spanishTitle = document.getElementById('spanish-title') ? document.getElementById('spanish-title') : null;
    const spanishSkill = document.getElementById('spanish-level') ? document.getElementById('spanish-level') : null;
    const englishTitle = document.getElementById('english-title') ? document.getElementById('english-title') : null;
    const englishSkill = document.getElementById('english-level') ? document.getElementById('english-level') : null;
    const carTitle = document.getElementById('car-driver-license-title') ? document.getElementById('car-driver-license-title') : null;
    const bikeTitle = document.getElementById('moto-driver-license-title') ? document.getElementById('moto-driver-license-title') : null;
    if (spanishTitle)
        spanishTitle.textContent = langData.stats.spanish;
    if (spanishSkill)
        spanishSkill.textContent = langData.stats.spanishskill;
    if (englishTitle)
        englishTitle.textContent = langData.stats.english;
    if (englishSkill)
        englishSkill.textContent = langData.stats.englishskill;
    if (carTitle)
        carTitle.textContent = langData.stats.car;
    if (bikeTitle)
        bikeTitle.textContent = langData.stats.bike;
    setDriverLicenseTime();
    //PROJECTS
}
function showIndex() {
    activeView = 'index';
    updateTitle();
    indexContainer.classList.remove('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');
    console.log('index');
}
function showExperience() {
    activeView = 'experience';
    updateTitle();
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
    activeView = 'stats';
    updateTitle();
    statsContainer.classList.remove('hidden');
    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');
    console.log('experience');
}
function showProjects() {
    activeView = 'projects';
    updateTitle();
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
        const response = await fetch('./src/api/projectTexts.json');
        if (!response.ok)
            throw new Error('Error getting project texts');
        projectTexts = await response.json();
        console.log(projectTexts);
    }
    catch (error) {
        console.log(error);
    }
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
    const lang = isSpanish ? 'es' : 'en';
    const projectContainer = document.getElementById('projects');
    if (projectContainer)
        projectContainer.innerHTML = '';
    projects.forEach((project) => {
        const projectActiveTexts = projectTexts[lang][project.description];
        const html = `
            <div class="col h-[26rem] max-w-72">
                <div class="card h-full flex flex-col">
                <img src="${project.img}" class="card-img-top max-h-36 object-cover" alt="...">
                <div class="card-body flex-1 ">
                    <h5 class="card-title">${project.name}</h5>
                    <p class="card-text">${projectActiveTexts}</p>
                </div>
                <div class="card-footer mt-auto">
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
    timelineTimeouts.forEach(timeout => clearTimeout(timeout));
    timelineTimeouts = [];
    line.style.transition = "transform 0s";
    line.style.transform = "scaleX(0)";
    setTimeout(() => {
        line.style.transition = "transform 3s linear";
        line.style.transform = "scaleX(1)";
    }, 100);
    const langData = textsData[isSpanish ? 'es' : 'en'];
    // Mostrar eventos escalonadamente, sincronizando estudio + trabajo
    const totalDuration = 3200; // duración total de la línea
    const steps = langData.experience.studies.length; // número de puntos (asumimos igual para estudios y trabajos)
    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;
        const timeout = setTimeout(() => {
            const upEvent = eventsUp.children[i];
            const downEvent = eventsDown.children[i];
            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
        timelineTimeouts.push(timeout);
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
    timelineTimeoutsVertical.forEach(timeout => clearTimeout(timeout));
    timelineTimeoutsVertical = [];
    lineVertical.style.transition = "transform 0s";
    lineVertical.style.transform = "scaleY(0)";
    const langData = textsData[isSpanish ? 'es' : 'en'];
    const steps = langData.experience.studies.length;
    // animamos la línea
    setTimeout(() => {
        lineVertical.style.transition = "transform 3s linear";
        lineVertical.style.transform = "scaleY(1)";
    }, 100);
    const totalDuration = 3200;
    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;
        const timeout = setTimeout(() => {
            const upEvent = eventsUpVertical.children[i];
            const downEvent = eventsDownVertical.children[i];
            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
        timelineTimeoutsVertical.push(timeout);
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
    MotoDriverLicenseTime.innerHTML = isSpanish ? `${motoTime} años. Propia moto.` : `${motoTime} years. Own motorcycle.`;
    CarDriverLicenseTime.innerHTML = isSpanish ? `${carTime} años. Coche propio.` : `${carTime} years. Own car.`;
}
function setVisibleStats() {
    const collapses = document.querySelectorAll('.vis');
    collapses.forEach(collapse => {
        collapse.classList.add('visible');
    });
}
function updateTitle() {
    const lang = isSpanish ? 'es' : 'en';
    titleManager(textsData.titles[activeView][lang]);
}
function titleManager(name) {
    logo.innerHTML = name;
}
function refreshExperience() {
    eventsUp.innerHTML = '';
    eventsDown.innerHTML = '';
    eventsUpVertical.innerHTML = '';
    eventsDownVertical.innerHTML = '';
}
export {};
//# sourceMappingURL=index.js.map
import type { Project, EventData } from "../models/models.ts";

const logo:HTMLAnchorElement = document.getElementById('nav-logo') as HTMLAnchorElement;
const indexButton: HTMLButtonElement = document.getElementById('index-button') as HTMLButtonElement;
const experienceButton: HTMLButtonElement = document.getElementById('experience-button') as HTMLButtonElement;
const statsButton: HTMLButtonElement = document.getElementById('stats-button') as HTMLButtonElement;
const projectsButton: HTMLButtonElement = document.getElementById('projects-button') as HTMLButtonElement;

const indexContainer: HTMLDivElement = document.getElementById('index-container') as HTMLDivElement;
const experienceContainer: HTMLDivElement = document.getElementById('experience-container') as HTMLDivElement;
const statsContainer: HTMLDivElement = document.getElementById('stats-container') as HTMLDivElement;
const projectsContainer: HTMLDivElement = document.getElementById('projects-container') as HTMLDivElement;
const fadedContainerTop: HTMLDivElement = document.getElementById('fade-top') as HTMLDivElement;
const fadedContainerBottom: HTMLDivElement = document.getElementById('fade-top') as HTMLDivElement;

const line = document.getElementById("timeline-draw") as HTMLDivElement;
const eventsUp = document.getElementById("events-up") as HTMLDivElement;
const eventsDown = document.getElementById("events-down") as HTMLDivElement;
const eventsUpVertical = document.getElementById("events-up-vertical") as HTMLDivElement;
const eventsDownVertical = document.getElementById("events-down-vertical") as HTMLDivElement;

let isExperienceVisible: boolean = false;
let isSpanish: boolean = true;
let activeView: "index" | "experience" | "stats" | "projects" = "index";

const studies: EventData[] = [
    { year: "", title: "" },
    { year: "2020-2023", title: "FP Superior Desarollo de Videojuegos" },
    { year: "", title: "" },
    { year: "", title: "" },
    { year: "", title: "" },
    { year: "2024", title: "Curso Javascript from Zero to Expert" },
    { year: "2025", title: `Bootcamp Desarrollo Fullstack <br> Curso Desarollo en Java` },

];

const jobs: EventData[] = [
    { year: "2018-2019", title: "Esports Coach @ Baskonia" },
    { year: "2020", title: "Expendedor @ Avia <br> Freelance eSports Coach" },
    { year: "2021", title: "Freelance eSports Coach" },
    { year: "2022", title: "Auxiliar @ Dreamfit <br> Gaming Content Leader @ Cracked.club <br> Freelance eSports Coach" },
    { year: "►", title: "" },
    { year: "2024", title: "Monitor Polivalente @ Dreamfit" },
    { year: "►", title: "" },
];

const titles = {
  index: {
        es: 'Jotadev',
        en: 'Jotadev' 
    },
  experience: { 
        es: 'Experiencia',
        en: 'Experience' 
    },
  stats: { 
        es: 'Habilidades',
        en: 'Skills' 
    },
  projects: { 
        es: 'Proyectos',
        en: 'Projects' }
};


document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton);

    document.getElementById("btn-es")?.addEventListener('click', () => {
        isSpanish = true;
        languageManager('es');
    });
    document.getElementById("btn-en")?.addEventListener('click', () => {
        isSpanish = false;
        languageManager('en');
    });
    
    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);

    
    createEvent(eventsUp, studies, "text-stone-600", "flex flex-col-reverse");
    createEvent(eventsDown, jobs, "text-yellow-500", "flex flex-col");
    createEventVertical(eventsUpVertical, studies, "text-stone-600", "text-right");
    createEventVertical(eventsDownVertical, jobs, "text-yellow-500", "text-left");

    languageManager('es');
    drawProjects();
    setDriverLicenseTime();
    setVisibleStats()
    showIndex();
    
});

async function getTexts():Promise<any>{

    try{
        const response = await fetch('./src/api/texts.json');
        if (!response.ok) throw new Error('Error getting texts');

        const projects = await response.json();

        console.log(projects);
        return projects;

    }catch(error){
        console.log(error);
        return [];
    }
}


async function languageManager(lang: "es" | "en"):Promise<void>{

    isSpanish = (lang === 'es');
    updateTitle();

    if (isSpanish){
        document.getElementById('btn-es')?.classList.add('btn-dark');
        document.getElementById('btn-en')?.classList.add('btn-outline-dark');

        document.getElementById('btn-es')?.classList.remove('btn-outline-dark');
        document.getElementById('btn-en')?.classList.remove('btn-dark');
    }else{
        document.getElementById('btn-es')?.classList.remove('btn-dark');
        document.getElementById('btn-en')?.classList.remove('btn-outline-dark');

        document.getElementById('btn-en')?.classList.add('btn-dark');
        document.getElementById('btn-es')?.classList.add('btn-outline-dark');
    }

    const [texts] = await getTexts();

    //MENU
    const indexMenuText: HTMLElement | null = document.getElementById('index-menu-text')? document.getElementById('index-menu-text') : null;
    const experienceMenuText: HTMLElement | null = document.getElementById('experience-menu-text')? document.getElementById('experience-menu-text') : null;
    const statsMenuText: HTMLElement | null = document.getElementById('stats-menu-text')? document.getElementById('stats-menu-text') : null;
    const projectsMenuText: HTMLElement | null = document.getElementById('projects-menu-text')? document.getElementById('projects-menu-text') : null;

    if (indexMenuText) indexMenuText.textContent = texts[lang].menu.index;
    if (experienceMenuText) experienceMenuText.textContent = texts[lang].menu.experience;
    if (statsMenuText) statsMenuText.textContent = texts[lang].menu.skills;
    if (projectsMenuText) projectsMenuText.textContent = texts[lang].menu.projects;

    //INDEX
    const job: HTMLElement | null = document.getElementById('job')? document.getElementById('job') : null;
    const description: HTMLElement | null = document.getElementById('description')? document.getElementById('description') : null;
    const cvButton: HTMLElement | null = document.getElementById('cv-button')? document.getElementById('cv-button') : null;

    if (job) job.textContent = texts[lang].index.job;
    if (description) description.textContent = texts[lang].index.description;
    if (cvButton)
        if(lang === 'en'){
        cvButton.setAttribute('href', './src/docs/CV-EN.pdf');
    }else{
        cvButton.setAttribute('href', './src/docs/CV-ES.pdf');
    }

    //EXPERIENCE
    //STATS
    const programmingLanguagesButton: HTMLElement | null = document.getElementById('programming-languages-button')? document.getElementById('programming-languages-button') : null;
    const frontEndButton: HTMLElement | null = document.getElementById('front-end-button')? document.getElementById('front-end-button') : null;
    const backEndButton: HTMLElement | null = document.getElementById('back-end-button')? document.getElementById('back-end-button') : null;
    const softSkillsButton: HTMLElement | null = document.getElementById('soft-skills-button')? document.getElementById('soft-skills-button') : null;
    const extrasButton: HTMLElement | null = document.getElementById('extras-button')? document.getElementById('extras-button') : null;

    if (programmingLanguagesButton) programmingLanguagesButton.textContent = texts[lang].stats.languages;
    if (frontEndButton) frontEndButton.textContent = texts[lang].stats.frontend;
    if (backEndButton) backEndButton.textContent = texts[lang].stats.backend;
    if (softSkillsButton) softSkillsButton.textContent = texts[lang].stats.softskills;
    if (extrasButton) extrasButton.textContent = texts[lang].stats.extras;

    const initiativeTitle = document.getElementById('initiative-title')? document.getElementById('initiative-title') : null;
    const stressTitle = document.getElementById('stress-title')? document.getElementById('stress-title') : null;
    const analyticalTitle = document.getElementById('analytical-title')? document.getElementById('analytical-title') : null;
    const knowledgeTitle = document.getElementById('knowledge-title')? document.getElementById('knowledge-title') : null;
    const communicationTitle = document.getElementById('communication-title')? document.getElementById('communication-title') : null;
    const problemTitle = document.getElementById('problem-title')? document.getElementById('problem-title') : null;

    if (initiativeTitle) initiativeTitle.textContent = texts[lang].stats.initiative;
    if (stressTitle) stressTitle.textContent = texts[lang].stats.stress;
    if (analyticalTitle) analyticalTitle.textContent = texts[lang].stats.analytical;
    if (knowledgeTitle) knowledgeTitle.textContent = texts[lang].stats.knowledge;
    if (communicationTitle) communicationTitle.textContent = texts[lang].stats.communication;
    if (problemTitle) problemTitle.textContent = texts[lang].stats.problem;

    const spanishTitle = document.getElementById('spanish-title')? document.getElementById('spanish-title') : null;
    const spanishSkill = document.getElementById('spanish-level')? document.getElementById('spanish-level') : null;
    const englishTitle = document.getElementById('english-title')? document.getElementById('english-title') : null;
    const englishSkill = document.getElementById('english-level')? document.getElementById('english-level') : null;
    const carTitle = document.getElementById('car-driver-license-title')? document.getElementById('car-driver-license-title') : null;
    const bikeTitle = document.getElementById('moto-driver-license-title')? document.getElementById('moto-driver-license-title') : null;


    if (spanishTitle) spanishTitle.textContent = texts[lang].stats.spanish;
    if (spanishSkill) spanishSkill.textContent = texts[lang].stats.spanishskill;
    if (englishTitle) englishTitle.textContent = texts[lang].stats.english;
    if (englishSkill) englishSkill.textContent = texts[lang].stats.englishskill;
    if (carTitle) carTitle.textContent = texts[lang].stats.car;
    if (bikeTitle) bikeTitle.textContent = texts[lang].stats.bike;
    setDriverLicenseTime()



    //PROJECTS
}

function showIndex():void{

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

function showExperience():void{

    activeView = 'experience';
    updateTitle();

    experienceContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainerTop.classList.add('hidden');
    fadedContainerBottom.classList.add('hidden');

    if(!isExperienceVisible){
        timelineAnimation();
        timelineAnimationVertical();
        isExperienceVisible = true;   
    }

    console.log('experience');
}

function showStats():void{

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

function showProjects():void{

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


async function getProjects():Promise<Project[]>{

    try{
        const response = await fetch('./src/api/projects.json');
        if (!response.ok) throw new Error('Error getting projects');

        const projects = await response.json();

        return projects;

    }catch(error){
        console.log(error);
        return [];
    }
}

async function drawProjects():Promise<void>{

    const projects: Project[] = await getProjects();

    projects.forEach((project: Project) => {

        const projectContainer = document.getElementById('projects') as HTMLDivElement | null;

        const html: string = `
            <div class="col max-w-72">
                <div class="card h-full">
                <img src="${project.img}" class="card-img-top max-h-60" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${project.name}</h5>
                    <p class="card-text">${project.description}</p>
                </div>
                <div class="card-footer">
                    ${project.link? `<a href="${project.link}" class="btn btn-dark">Link</a>` : ''}
                    <a href="${project.github}" class="btn btn-outline-dark">GitHub Repo</a>
                </div>
                </div>
            </div>
            `;

        projectContainer?.insertAdjacentHTML('beforeend', html);



    })
}

const createEvent = (container: HTMLDivElement, data: EventData[], colorClass: string, textAlignClass: string) => {
    data.forEach(event => {
    const div = document.createElement("div");
    div.className = `event text-center w-1/5 ${colorClass} ${textAlignClass}`;
    div.innerHTML = `<div class="text-sm font-bold">${event.year}</div><div>${event.title}</div>`;
    container.appendChild(div);
    });
};

function timelineAnimation():void{
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
            const upEvent = eventsUp.children[i] as HTMLDivElement;
            const downEvent = eventsDown.children[i] as HTMLDivElement;

            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
    }

};

const createEventVertical = (container: HTMLDivElement, data: EventData[], colorClass: string, textAlignClass: string):void => {
    data.forEach(event => {
        const div = document.createElement("div");
        div.className = `event text-[15px] ${colorClass} ${textAlignClass} event-vertical`;
        div.innerHTML = `
            <div class="text-sm font-bold">${event.year == "►"? "▼" : event.year}</div>
            <div>${event.title}</div>
        `;
        container.appendChild(div);
    });
};

function timelineAnimationVertical():void {
    const lineVertical = document.getElementById("timeline-vertical-draw") as HTMLDivElement;
    

    // animamos la línea
    setTimeout(() => {
        lineVertical.classList.add("animate");
    }, 100);

    const steps = studies.length;
    const totalDuration = 3200;

    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;

        setTimeout(() => {
            const upEvent = eventsUpVertical.children[i] as HTMLDivElement;
            const downEvent = eventsDownVertical.children[i] as HTMLDivElement;

            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);
    }
}

function setDriverLicenseTime():void{

    const MotoDriverLicenseTime = document.getElementById('moto-driver-license-time') as HTMLDivElement;
    const CarDriverLicenseTime = document.getElementById('car-driver-license-time') as HTMLDivElement;

    const carLicenseMonth: number = 7;
    const carLicenseYear: number = 2017;

    const motoLicenseMonth: number = 9;
    const motoLicenseYear: number = 2023;

    const todayMonth: number = new Date().getMonth();
    const todayYear: number = new Date().getFullYear();

    const carTime: number = (todayMonth - carLicenseMonth) >= 0 ? (todayYear - carLicenseYear) : (todayYear - carLicenseYear) - 1; 
    const motoTime: number = (todayMonth - motoLicenseMonth) >= 0 ? (todayYear - motoLicenseYear) : (todayYear - motoLicenseYear) - 1; 

    
    MotoDriverLicenseTime.innerHTML = isSpanish ? `${motoTime} años. Propia moto.` : `${motoTime} years. Own motorcycle.`;
    CarDriverLicenseTime.innerHTML = isSpanish ? `${carTime} años. Coche propio.` : `${carTime} years. Own car.`;

    
}

function setVisibleStats():void{
    
   const collapses = document.querySelectorAll<HTMLDivElement>('.vis');

    collapses.forEach(collapse => {
        collapse.classList.add('visible');
});
}

function updateTitle(): void {

  const lang = isSpanish ? 'es' : 'en';
  titleManager(titles[activeView][lang]);
}

function titleManager(name: string):void{

    logo.innerHTML = name;

}




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
let textsData: any;
let timelineTimeouts: number[] = [];
let timelineTimeoutsVertical: number[] = [];



document.addEventListener('DOMContentLoaded', async () => {

    document.getElementById("btn-es")?.addEventListener('click', () => {
        isSpanish = true;
        languageManager('es');

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
    const langData = textsData[isSpanish ? 'es' : 'en'];
    
    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);

    languageManager('es');
    drawProjects();
    setDriverLicenseTime();
    setVisibleStats()
    showIndex();
    
    createEvent(eventsUp, langData.experience.studies, "text-stone-600", "flex flex-col-reverse");
    createEvent(eventsDown, langData.experience.jobs, "text-yellow-500", "flex flex-col");
    createEventVertical(eventsUpVertical, langData.experience.studies, "text-stone-600", "text-right");
    createEventVertical(eventsDownVertical, langData.experience.jobs, "text-yellow-500", "text-left");
});

async function getTexts():Promise<any>{

    try{
        const response = await fetch('./src/api/texts.json');
        if (!response.ok) throw new Error('Error getting texts');

        const [projects] = await response.json();

        console.log(projects);
        return projects;

    }catch(error){
        console.log(error);
        return [];
    }
}


async function languageManager(lang: "es" | "en"):Promise<void>{

    isSpanish = (lang === 'es');
    const langData = textsData[isSpanish ? 'es' : 'en'];

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


    //MENU
    const indexMenuText: HTMLElement | null = document.getElementById('index-menu-text')? document.getElementById('index-menu-text') : null;
    const experienceMenuText: HTMLElement | null = document.getElementById('experience-menu-text')? document.getElementById('experience-menu-text') : null;
    const statsMenuText: HTMLElement | null = document.getElementById('stats-menu-text')? document.getElementById('stats-menu-text') : null;
    const projectsMenuText: HTMLElement | null = document.getElementById('projects-menu-text')? document.getElementById('projects-menu-text') : null;

    if (indexMenuText) indexMenuText.textContent = langData.menu.index;
    if (experienceMenuText) experienceMenuText.textContent = langData.menu.experience;
    if (statsMenuText) statsMenuText.textContent = langData.menu.skills;
    if (projectsMenuText) projectsMenuText.textContent = langData.menu.projects;

    //INDEX
    const job: HTMLElement | null = document.getElementById('job')? document.getElementById('job') : null;
    const description: HTMLElement | null = document.getElementById('description')? document.getElementById('description') : null;
    const cvButton: HTMLElement | null = document.getElementById('cv-button')? document.getElementById('cv-button') : null;

    if (job) job.textContent = langData.index.job;
    if (description) description.textContent = langData.index.description;
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

    if (programmingLanguagesButton) programmingLanguagesButton.textContent = langData.stats.languages;
    if (frontEndButton) frontEndButton.textContent = langData.stats.frontend;
    if (backEndButton) backEndButton.textContent = langData.stats.backend;
    if (softSkillsButton) softSkillsButton.textContent = langData.stats.softskills;
    if (extrasButton) extrasButton.textContent = langData.stats.extras;

    const initiativeTitle = document.getElementById('initiative-title')? document.getElementById('initiative-title') : null;
    const stressTitle = document.getElementById('stress-title')? document.getElementById('stress-title') : null;
    const analyticalTitle = document.getElementById('analytical-title')? document.getElementById('analytical-title') : null;
    const knowledgeTitle = document.getElementById('knowledge-title')? document.getElementById('knowledge-title') : null;
    const communicationTitle = document.getElementById('communication-title')? document.getElementById('communication-title') : null;
    const problemTitle = document.getElementById('problem-title')? document.getElementById('problem-title') : null;

    if (initiativeTitle) initiativeTitle.textContent = langData.stats.initiative;
    if (stressTitle) stressTitle.textContent = langData.stats.stress;
    if (analyticalTitle) analyticalTitle.textContent = langData.stats.analytical;
    if (knowledgeTitle) knowledgeTitle.textContent = langData.stats.knowledge;
    if (communicationTitle) communicationTitle.textContent = langData.stats.communication;
    if (problemTitle) problemTitle.textContent = langData.stats.problem;

    const spanishTitle = document.getElementById('spanish-title')? document.getElementById('spanish-title') : null;
    const spanishSkill = document.getElementById('spanish-level')? document.getElementById('spanish-level') : null;
    const englishTitle = document.getElementById('english-title')? document.getElementById('english-title') : null;
    const englishSkill = document.getElementById('english-level')? document.getElementById('english-level') : null;
    const carTitle = document.getElementById('car-driver-license-title')? document.getElementById('car-driver-license-title') : null;
    const bikeTitle = document.getElementById('moto-driver-license-title')? document.getElementById('moto-driver-license-title') : null;


    if (spanishTitle) spanishTitle.textContent = langData.stats.spanish;
    if (spanishSkill) spanishSkill.textContent = langData.stats.spanishskill;
    if (englishTitle) englishTitle.textContent = langData.stats.english;
    if (englishSkill) englishSkill.textContent = langData.stats.englishskill;
    if (carTitle) carTitle.textContent = langData.stats.car;
    if (bikeTitle) bikeTitle.textContent = langData.stats.bike;
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

    timelineTimeouts.forEach(timeout => clearTimeout(timeout));
    timelineTimeouts = [];

    line.style.transition = "transform 0s";
    line.style.transform = "scaleX(0)"

    setTimeout(() => {
        line.style.transition = "transform 3s linear";
        line.style.transform = "scaleX(1)"
    }, 100);

    const langData = textsData[isSpanish ? 'es' : 'en'];
    // Mostrar eventos escalonadamente, sincronizando estudio + trabajo
    const totalDuration = 3200; // duración total de la línea
    const steps = langData.experience.studies.length; // número de puntos (asumimos igual para estudios y trabajos)

    for (let i = 0; i < steps; i++) {
        const delay = (i / steps) * totalDuration;

        const timeout = setTimeout(() => {
            const upEvent = eventsUp.children[i] as HTMLDivElement;
            const downEvent = eventsDown.children[i] as HTMLDivElement;

            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
            
        }, delay);

        
        timelineTimeouts.push(timeout);
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

    timelineTimeoutsVertical.forEach(timeout => clearTimeout(timeout));
    timelineTimeoutsVertical = [];

    lineVertical.style.transition = "transform 0s";
    lineVertical.style.transform = "scaleY(0)"


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
            const upEvent = eventsUpVertical.children[i] as HTMLDivElement;
            const downEvent = eventsDownVertical.children[i] as HTMLDivElement;

            upEvent.classList.add("visible");
            downEvent.classList.add("visible");
        }, delay);

        timelineTimeoutsVertical.push(timeout);
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
  titleManager(textsData.titles[activeView][lang]);
}

function titleManager(name: string):void{

    logo.innerHTML = name;

}

function refreshExperience(): void {
    eventsUp.innerHTML = '';
    eventsDown.innerHTML = '';
    eventsUpVertical.innerHTML = '';
    eventsDownVertical.innerHTML = '';
}




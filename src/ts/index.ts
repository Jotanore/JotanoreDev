console.log("tres");

import type { Project, EventData } from "../models/models.ts";

const logo:HTMLAnchorElement = document.getElementById('nav-logo') as HTMLAnchorElement;
const indexButton: HTMLButtonElement = document.getElementById('index-button') as HTMLButtonElement;
const experienceButton: HTMLButtonElement = document.getElementById('experience-button') as HTMLButtonElement;
const statsButton: HTMLButtonElement = document.getElementById('stats-button') as HTMLButtonElement;
const projectsButton: HTMLButtonElement = document.getElementById('projects-button') as HTMLButtonElement;
const contactButton: HTMLButtonElement = document.getElementById('contact-button') as HTMLButtonElement;

const indexContainer: HTMLDivElement = document.getElementById('index-container') as HTMLDivElement;
const experienceContainer: HTMLDivElement = document.getElementById('experience-container') as HTMLDivElement;
const statsContainer: HTMLDivElement = document.getElementById('stats-container') as HTMLDivElement;
const projectsContainer: HTMLDivElement = document.getElementById('projects-container') as HTMLDivElement;
const fadedContainer: HTMLDivElement = document.getElementById('fade-top') as HTMLDivElement;

const line = document.getElementById("timeline-draw") as HTMLDivElement;
const eventsUp = document.getElementById("events-up") as HTMLDivElement;
const eventsDown = document.getElementById("events-down") as HTMLDivElement;
const eventsUpVertical = document.getElementById("events-up-vertical") as HTMLDivElement;
const eventsDownVertical = document.getElementById("events-down-vertical") as HTMLDivElement;

let isExperienceVisible: boolean = false;

// Datos de ejemplo
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


document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton, contactButton);

    logo.addEventListener('click', showIndex);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);

    
    createEvent(eventsUp, studies, "text-blue-400", "flex flex-col-reverse");
    createEvent(eventsDown, jobs, "text-yellow-400", "flex flex-col");
    createEventVertical(eventsUpVertical, studies, "text-blue-400", "text-right");
    createEventVertical(eventsDownVertical, jobs, "text-yellow-400", "text-left");

    drawProjects();
    setDriverLicenseTime();
    setVisibleStats()
    
});

function showIndex():void{

    indexContainer.classList.remove('hidden');

    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainer.classList.add('hidden');

    console.log('index');
}

function showExperience():void{

    experienceContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainer.classList.add('hidden');

    if(!isExperienceVisible){
        timelineAnimation();
        timelineAnimationVertical();
        isExperienceVisible = true;   
    }

    console.log('experience');
}

function showStats():void{

    statsContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    fadedContainer.classList.add('hidden');

    console.log('experience');
}

function showProjects():void{

    projectsContainer.classList.remove('hidden');
    fadedContainer.classList.remove('hidden');

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
        div.className = `event w-44 ${colorClass} ${textAlignClass}`;
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

    MotoDriverLicenseTime.innerHTML = `${motoTime} years. Own motorcycle`;
    CarDriverLicenseTime.innerHTML = `${carTime} years. Own car`;

    
}

function setVisibleStats():void{
    
   const collapses = document.querySelectorAll<HTMLDivElement>('.vis');

    collapses.forEach(collapse => {
        collapse.classList.add('visible');
});
}






console.log("tres");

import type { Project, EventData } from "../models/models.ts";

const indexButton: HTMLButtonElement = document.getElementById('index-button') as HTMLButtonElement;
const experienceButton: HTMLButtonElement = document.getElementById('experience-button') as HTMLButtonElement;
const statsButton: HTMLButtonElement = document.getElementById('stats-button') as HTMLButtonElement;
const projectsButton: HTMLButtonElement = document.getElementById('projects-button') as HTMLButtonElement;
const contactButton: HTMLButtonElement = document.getElementById('contact-button') as HTMLButtonElement;

const indexContainer: HTMLDivElement = document.getElementById('index-container') as HTMLDivElement;
const experienceContainer: HTMLDivElement = document.getElementById('experience-container') as HTMLDivElement;
const statsContainer: HTMLDivElement = document.getElementById('stats-container') as HTMLDivElement;
const projectsContainer: HTMLDivElement = document.getElementById('projects-container') as HTMLDivElement;
const contactContainer: HTMLDivElement = document.getElementById('contact-container') as HTMLDivElement;

const line = document.getElementById("timeline-draw") as HTMLDivElement;
const eventsUp = document.getElementById("events-up") as HTMLDivElement;
const eventsDown = document.getElementById("events-down") as HTMLDivElement;

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
      { year: "->", title: "" },
  { year: "2024", title: "Monitor Polivalente @ Dreamfit" },
        { year: "->", title: "" },
];


document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton, contactButton);

    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);
    contactButton.addEventListener('click', showContact);

    
    createEvent(eventsUp, studies, "text-blue-400");
    createEvent(eventsDown, jobs, "text-yellow-400");

        drawProjects();
    
});

function showIndex():void{

    indexContainer.classList.remove('hidden');
    
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');

    console.log('index');
}

function showExperience():void{

    experienceContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');

    if(!isExperienceVisible){
        timelineAnimation();
        isExperienceVisible = true;   
    }

    console.log('experience');
}

function showStats():void{

    statsContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');

    console.log('experience');
}

function showProjects():void{

    projectsContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    contactContainer.classList.add('hidden');

    console.log('projects');
}

function showContact():void{

    contactContainer.classList.remove('hidden');

    indexContainer.classList.add('hidden');
    experienceContainer.classList.add('hidden');
    statsContainer.classList.add('hidden');
    projectsContainer.classList.add('hidden');

    console.log('contact');
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
    console.log("saddasdf" + projects);

    projects.forEach((project: Project) => {

        const projectContainer = document.getElementById('projects-container') as HTMLDivElement | null;

        const html: string = `
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



    })
}

const createEvent = (container: HTMLDivElement, data: EventData[], colorClass: string) => {
    data.forEach(event => {
    const div = document.createElement("div");
    div.className = `event text-center w-1/5 ${colorClass}`;
    div.innerHTML = `<div class="text-sm font-bold">${event.year}</div><div>${event.title}</div>`;
    container.appendChild(div);
    });
};

function timelineAnimation(){
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






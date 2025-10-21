/* eslint-disable no-undef */
console.log("tres");
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    console.log(indexButton, experienceButton, statsButton, projectsButton, contactButton);
    indexButton.addEventListener('click', showIndex);
    experienceButton.addEventListener('click', showExperience);
    statsButton.addEventListener('click', showStats);
    projectsButton.addEventListener('click', showProjects);
    contactButton.addEventListener('click', showContact);
    getProjects();
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
        console.log(projects);
        return projects;
    }
    catch (error) {
        console.log(error);
    }
}
export {};
//# sourceMappingURL=index.js.map
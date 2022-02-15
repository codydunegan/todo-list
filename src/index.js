import './style.css';
import { Priority, createElement, createIcon } from './modules/Utils';
import Project from './modules/Project';
import Task from './modules/Task';
import { format, isToday, isThisWeek } from 'date-fns'
import createTaskElement from './modules/TaskElement';


let taskDivs;
let editDivs;
let deleteDivs;
let checkmarkDivs;
let linkDivs;

const content = document.querySelector('#content');
const projectList = document.querySelector('#projectlist');
const tagList = document.querySelector('#taglist');

let projects = [];
let editedTask = null;
let editedTaskProject = '';



function generateTestData() {
    let defaultProject = new Project('default');

    let task1 = new Task('Task1', 'Task1 Description', format(new Date(), 'eee MM/dd/yyyy'), Priority.HIGH, ['work']);
    defaultProject.addTask(task1);

    let task2 = new Task('Task2', 'Task2 Description', format(new Date('02/18/2022'), 'eee MM/dd/yyyy'), Priority.LOW, ['work', '2lazy', 'maybelater']);
    defaultProject.addTask(task2);

    projects.push(defaultProject);


    let project2 = new Project('project 2');

    let task3 = new Task('Task3', '', format(new Date('03/04/2022'), 'eee MM/dd/yyyy'), Priority.MEDUIM);
    project2.addTask(task3); 

    projects.push(project2);


    let project3 = new Project('project 3');

    let task4 = new Task('Task4', 'dfa sdfa sdfas dfas dfasd asdfasdf asdf asdf', format(new Date(), 'eee MM/dd/yyyy'), Priority.URGENT, ['work']);
    project3.addTask(task4); 

    projects.push(project3);
}

if (!localStorage.getItem('todo-tasks') || JSON.parse(localStorage.getItem('todo-tasks')).length < 1) {
    generateTestData();
}
else {
    loadFromLocalStorage();
}

generateLists();
generateTasksFromProjectList(projects);

function loadFromLocalStorage() {
    let storageObj = JSON.parse(localStorage.getItem('todo-tasks'));

    let loadedProjects = []
    for (const pObj of storageObj) {
        let project = new Project(pObj.name);
        
        for (const tObj of pObj.taskList) {
            let task = new Task(tObj.title, tObj.description, tObj.dueDate, tObj.priority, tObj.tags);
            project.addTask(task);
        }

        loadedProjects.push(project);
    }

    projects = loadedProjects;
}

function saveToLocalStorage() {
    localStorage.setItem('todo-tasks', JSON.stringify(projects));
}

function generateLists() {
    saveToLocalStorage();

    generateProjectList();
    generateTagList();
    addProjectTagListLinkEventListeners();
}

function generateProjectList() {
    projectList.innerText = '';

    projects.forEach(project => {
        let link = createElement('div', 'link');
        link.id = `project-${project.name.replace(' ', '')}`;
        let icon = createIcon('mdi:folder-search');
    
        link.appendChild(icon);
        icon.insertAdjacentText('afterend', project.name);

        projectList.appendChild(link);
    });
}

function generateTagList() {
    tagList.innerText = '';

    let tempTagList = [];

    projects.forEach(project => {
        for (let task of project.getTasks()) {
            let details = task.getDetails();

            tempTagList = [...tempTagList, ...details.tags];
        }
    });

    tempTagList = [...new Set(tempTagList)];
    tempTagList.forEach(tag => {
        let link = createElement('div', 'link');
        link.id = `tag-${tag.replace(' ', '')}`;
        let icon = createIcon('mdi:tag-text');
    
        link.appendChild(icon);
        icon.insertAdjacentText('afterend', tag);
    
        tagList.appendChild(link);
    });
}

function filterTasksByTags(desiredTag) {
    let matchingTasks = {};

    projects.forEach(project => {
        matchingTasks[project.name] = [];

        let tasks = project.getTasks();
        tasks.forEach(task => {
            let tags = task.getDetails().tags;
            let matchingTags = [];
            tags.forEach(tag => {
                if (tag.replace(' ', '') === desiredTag)  {
                    matchingTags.push(task);
                }
            })

            matchingTasks[project.name] = [...new Set(matchingTags)];
        })

        if (matchingTasks[project.name].length < 1) {
            delete matchingTasks[project.name];
        }
    })

    return matchingTasks;
}

function filterTasksByDate(desiredDate) {
    let matchingTasks = {};

    projects.forEach(project => {
        matchingTasks[project.name] = [];

        let tasks = project.getTasks();
        tasks.forEach(task => {
            let date = new Date(task.getDetails().dueDate);

            if (desiredDate === 'today' && isToday(date)) {
                matchingTasks[project.name].push(task);
            }
            else if (desiredDate === 'week' && isThisWeek(date)) {
                matchingTasks[project.name].push(task);
            }
        })

        if (matchingTasks[project.name].length < 1) {
            delete matchingTasks[project.name];
        }
    })

    return matchingTasks;
}

function filterTasks(type, item) {
    switch(type) {
        case 'inbox':
            if (item === 'inbox') {
                generateTasksFromProjectList(projects);
                break;
            }
            let filteredDates = filterTasksByDate(item);
            generateTasksFromProjectObject(filteredDates);
            break;
        case 'project':
            let filteredProject = projects.filter(project => project.name.replace(' ', '') === item);
            if (filteredProject.length > 0) {
                generateTasksFromProjectList(filteredProject);
            }
            break;
        case 'tag':
            let filteredTags = filterTasksByTags(item);
            generateTasksFromProjectObject(filteredTags);
            break;
        default:
            generateTasksFromProjectList(projects);
            break;
    }
}

function generateTasksFromProjectObject(projectObject) {
    content.innerText = '';

    for (let projectName in projectObject) {
        if (projectObject[projectName].length > 0) {
            for (let task of projectObject[projectName]) {
                let taskDiv = createTaskElement(task.getDetails(), projectName);
                content.appendChild(taskDiv);
            }
        }
    }

    addTaskEventListeners();
}

function generateTasksFromProjectList(projectList) {
    content.innerText = '';

    projectList.forEach(project => {
        for (let task of project.getTasks()) {
            let taskDiv = createTaskElement(task.getDetails(), project.name);
            content.appendChild(taskDiv);
        }
    })

    addTaskEventListeners();
}

function addProjectTagListLinkEventListeners() {
    linkDivs = document.querySelectorAll('.link');
    linkDivs.forEach(link => link.addEventListener('click', handleLinkClicked));
}

function addTaskEventListeners() {
    taskDivs = document.querySelectorAll('.expand');
    taskDivs.forEach(task => task.addEventListener('click', toggleTaskDetails));
    
    checkmarkDivs = document.querySelectorAll('.checkmark');
    checkmarkDivs.forEach(checkmark => checkmark.addEventListener('click', toggleTaskCompleted));

    editDivs = document.querySelectorAll('.edit-btn');
    editDivs.forEach(toedit => toedit.addEventListener('click', editTask));

    deleteDivs = document.querySelectorAll('.delete-btn');
    deleteDivs.forEach(todelete => todelete.addEventListener('click', deleteTask));
}

function toggleTaskDetails(event) {
    let target = event.currentTarget;
    let svg = target.firstChild;

    let task = target.closest('.task');
    let details = task.querySelector('.task-details');
    details.classList.toggle('show');

    let detailsShown = details.classList.contains('show');
    let icon = detailsShown ? 'mdi:arrow-collapse' : 'mdi:arrow-expand';
    svg.setAttribute('data-icon', icon);
}

function toggleTaskCompleted(event) {
    let target = event.currentTarget;
    let svg = target.firstChild;
    let task = target.closest('.task');

    let currentIcon = svg.getAttribute('data-icon');
    let checked = currentIcon === 'mdi:checkbox-blank-circle-outline';

    let newIcon = 'mdi:checkbox-blank-circle-outline';
    if (checked) {
        newIcon = 'mdi:checkbox-marked-circle-outline';
        svg.style.color = 'green';
        task.classList.add('completed');
    }
    else {
        svg.removeAttribute('style');
        task.classList.remove('completed');
    }

    svg.setAttribute('data-icon', newIcon);
}

function getTaskFromDiv(taskDiv) {
    let projectName = taskDiv.querySelector('.project').innerText;

    let taskTitle = taskDiv.querySelector('.title').innerText;
    let taskDueDate = taskDiv.querySelector('.duedate').innerText;
    let taskPriority = taskDiv.querySelector('.priority').innerText;
    let taskDescription = taskDiv.querySelector('.description').innerText;
    
    let project = projects.find(p => p.name === projectName);

    let task = project.getTasks().find(t => {
        if (t.title === taskTitle &&
        t.dueDate === taskDueDate &&
        t.priority === taskPriority &&
        t.description === taskDescription) return t;
    })

    return { task, project };
}

function editTask(event) {
    let taskDiv = event.currentTarget.closest('.task');

    let { task, project } = getTaskFromDiv(taskDiv);
    
    editedTask = task;
    editedTaskProject = project.name;
    toggleTaskModal();
}

function deleteTask(event) {
    let taskDiv = event.currentTarget.closest('.task');

    let { task, project } = getTaskFromDiv(taskDiv);

    let index = project.getTasks().indexOf(task);
    
    if (index > -1) {
        project.getTasks().splice(index, 1);
    }

    if (project.getTasks().length < 1) {
        let projectIndex = projects.indexOf(project);

        if (projectIndex > -1) {
            projects.splice(projectIndex, 1);
        }
    }

    generateLists();
    generateTasksFromProjectList(projects);
}

function handleLinkClicked(event) {
    let id = event.target.id;
    let split = id.split('-');

    linkDivs.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    if (split.length < 2) return;
    filterTasks(split[0], split[1]);
}

function expandAll() {
    let taskDivs = document.querySelectorAll('.task');

    taskDivs.forEach(task => {
        let details = task.querySelector('.task-details');
        details.classList.add('show');

        let svg = task.querySelector('.expand').firstChild;
        svg.setAttribute('data-icon', 'mdi:arrow-collapse');
    });
}

function collapseAll() {
    let taskDivs = document.querySelectorAll('.task');

    taskDivs.forEach(task => {
        let details = task.querySelector('.task-details');
        details.classList.remove('show');

        let svg = task.querySelector('.expand').firstChild;
        svg.setAttribute('data-icon', 'mdi:arrow-expand');
    });
}

function resetModalData() {
    newTaskTitleDiv.value = '';
    newTaskProjectListDiv.value = '';
    
    newTaskProjectListSelect.innerText = '';
    projects.forEach(project => {
        let option = document.createElement('option');
        option.value = project.name;
        newTaskProjectListSelect.appendChild(option);
    })

    newTaskPriorityDiv.value = '';

    newTaskDateDiv.setAttribute('min', format(new Date(), 'yyyy-MM-dd'));
    newTaskDateDiv.value = format(new Date(), 'yyyy-MM-dd');

    newTaskDescriptionDiv.value = '';
    newTaskTagsDiv.value = '';
}

function loadTaskIntoModal() {
    resetModalData();

    if (editedTask !== null) {
        newTaskTitleDiv.value = editedTask.getDetails().title;
        newTaskProjectListDiv.value = editedTaskProject;
        newTaskPriorityDiv.value = editedTask.getDetails().priority;
        newTaskDateDiv.value = format(new Date(editedTask.getDetails().dueDate), 'yyyy-MM-dd');
        newTaskDescriptionDiv.value = editedTask.getDetails().description;
        newTaskTagsDiv.value = editedTask.getDetails().tags.join(' ');
    }
}

function toggleTaskModal() {
    newTaskModal.classList.toggle('show-modal');

    if (newTaskModal.classList.contains('show-modal')) {
        loadTaskIntoModal();
    }
}

function addTask() {
    let taskObj = {};
    taskObj.title = newTaskTitleDiv.value;
    taskObj.project = projects.find(p => p.name === newTaskProjectListDiv.value) || newTaskProjectListDiv.value;
    taskObj.priority = Priority[newTaskPriorityDiv.value.toUpperCase()];
    taskObj.dueDate = format(new Date(newTaskDateDiv.value), 'eee MM/dd/yyyy');
    taskObj.description = newTaskDescriptionDiv.value;
    taskObj.tags = newTaskTagsDiv.value.split(' ').filter(tag => tag);

    if (taskObj.title === '' || taskObj.project === undefined || taskObj.priority === undefined) {
        return;
    }

    if (typeof taskObj.project === 'string') {
        taskObj.project = new Project(newTaskProjectListDiv.value)
        projects.push(taskObj.project);
    }

    if (editedTask == null) {
        let task = new Task(taskObj.title, taskObj.description, taskObj.dueDate, taskObj.priority, taskObj.tags);
        taskObj.project.addTask(task);
    }
    else {
        editedTask.title = taskObj.title;
        editedTask.description = taskObj.description;
        editedTask.dueDate = taskObj.dueDate;
        editedTask.priority = taskObj.priority;
        editedTask.tags = taskObj.tags;

        editedTask == null;
    }

    generateLists();
    generateTasksFromProjectList(projects);

    toggleTaskModal();
}

function windowClick(event) {
    if (event.target === newTaskModal) {
        editedTask = null;
        toggleTaskModal();
    }
}

const expandAllBtn = document.querySelector('#expandall');
expandAllBtn.addEventListener('click', expandAll);

const collapseAllBtn = document.querySelector('#collapseall');
collapseAllBtn.addEventListener('click', collapseAll);

const newTaskBtn = document.querySelector('#newtask');
newTaskBtn.addEventListener('click', toggleTaskModal);

const newTaskModal = document.querySelector('.newtaskmodal');
const newTaskTitleDiv = document.querySelector('#task-title');
const newTaskDateDiv = document.querySelector('#task-date');
const newTaskProjectListDiv = document.querySelector('#task-project');
const newTaskProjectListSelect = document.querySelector('#task-projects');
const newTaskPriorityDiv = document.querySelector('#task-priority');
const newTaskDescriptionDiv = document.querySelector('#task-description');
const newTaskTagsDiv = document.querySelector('#task-tags');
const newTaskSubmitBtn = document.querySelector('#submitNewTask')
newTaskSubmitBtn.addEventListener('click', addTask);

window.addEventListener('click', windowClick);
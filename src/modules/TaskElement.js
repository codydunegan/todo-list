import { createElement, createIcon } from "./Utils";

export default function createTaskElement(task, project) {
    let taskElement = createElement('div', 'task');
    let taskHeader = createElement('div', 'task-header');
    let taskDetails = createElement('div', 'task-details');
    taskDetails.classList.add('show'); // expand by default

    let checkmark = createElement('div', 'checkmark');
    let checkIcon = createIcon('mdi:checkbox-blank-circle-outline');
    checkmark.appendChild(checkIcon);
    taskHeader.appendChild(checkmark);

    let title = createElement('span', 'title');
    title.innerText = task.title;
    taskHeader.appendChild(title);

    let dueDate = createElement('span', 'duedate');
    let dateIcon = createIcon('mdi:clipboard-text-clock-outline');
    dueDate.appendChild(dateIcon);
    dateIcon.insertAdjacentText('afterend', task.dueDate);
    taskHeader.appendChild(dueDate);

    let priority = createElement('span', 'priority');
    priority.classList.add(task.priority.toLowerCase());
    priority.innerText = task.priority;
    taskHeader.appendChild(priority);

    let expand = createElement('div', 'expand');
    let expandIcon = createIcon('mdi:arrow-expand');
    expand.appendChild(expandIcon);
    taskHeader.appendChild(expand);

    let description = createElement('div', 'description');
    description.innerText = task.description;
    taskDetails.appendChild(description);

    let projectTags = createElement('div', 'projecttags');

    let editBtn = createElement('button', 'edit');
    editBtn.classList.add('edit-btn');
    let editIcon = createIcon('mdi:playlist-edit');
    editBtn.appendChild(editIcon);
    projectTags.appendChild(editBtn);

    let deleteBtn = createElement('button', 'delete');
    deleteBtn.classList.add('delete-btn');
    let deleteIcon = createIcon('mdi:playlist-remove');
    deleteBtn.appendChild(deleteIcon);
    projectTags.appendChild(deleteBtn);

    let tags = createElement('div', 'tags');
    task.tags.forEach(tag => {
        let tagElement = createElement('span', 'tag');
        let tagIcon = createIcon('mdi:tag-text');
        tagElement.appendChild(tagIcon);
        tagIcon.insertAdjacentText('afterend', tag);

        tags.appendChild(tagElement);
    });
    projectTags.appendChild(tags);

    let projectElement = createElement('div', 'project');
    let projectIcon = createIcon('mdi:folder-search');
    projectElement.appendChild(projectIcon);
    projectIcon.insertAdjacentText('afterend', project);
    projectTags.appendChild(projectElement);

    taskDetails.appendChild(projectTags);

    taskElement.appendChild(taskHeader);
    taskElement.appendChild(taskDetails);

    return taskElement;
}
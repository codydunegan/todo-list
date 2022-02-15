import { Priority } from './Utils';

export default class Task {
    constructor(title, description, dueDate, priority = Priority.LOW, tags = []) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.tags = tags;
    }

    getDetails() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            tags: this.tags
        }
    }

    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    setTags(tags) {
        this.tags = tags;
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    removeTag(tag) {

    }

    setProject(project) {
        this.project = project;
    }

    getProject() {
        return this.project || 'Unknown';
    }
}
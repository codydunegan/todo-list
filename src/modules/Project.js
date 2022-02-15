export default class Project {
    constructor(name) {
        this.setName(name);
        this.setTaskList([]);
    }

    setName(name) {
        this.name = name;
    }

    getTasks() {
        return this.taskList;
    }

    setTaskList(list) {
        this.taskList = list;
    }

    addTask(task) {
        this.taskList.push(task);
    }

    removeTask(task) {
        
    }
}
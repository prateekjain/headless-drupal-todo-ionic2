import {Page} from 'ionic/ionic';
import {ToDoService} from '../services/todolistservice';


@Page({
    templateUrl: 'build/pages/todolist/todolist.html'
    providers: [ToDoService]
})
export class ToDoList {


    constructor(toDoService:ToDoService) {
        this.toDoService = toDoService;
        this.csrfToken = '';
        this.items = [];
        this.loading = false;

        this.toDoService.getCSRF().subscribe(
            data => {

            this.csrfToken = data._body;

    },
        err => console.log(err),
            () => {
            this.toDoService.setAuthHeader(this.csrfToken);
            this.getTasks()
        }
    );

    }

    getTasks() {

        this.loading = true;
        this.toDoService.getToDo().subscribe(
            data => {
            this.items = [];
        for (let task of data) {
            // changing the response according to our need
            this.items.push({
                itemId: task.nid,
                text: task.title,
                completed: task.field_status === 'True',
                editMode: false
            });
        }


    },
        err => console.log(err),
            () => {
            // remove the loading message
            this.loading = false;
        }
    );
    }

    addItem() {

        if (this.newItem) {
            //this.push = {title: this.newItem, completed: false};
            // creating a task in the back end
            this.loading = true;
            this.toDoService.createTask(this.newItem).subscribe(
                data => {
                this.loading = false;
            this.getTasks();
        },
            err => console.log(err)
        );
        }

        this.newItem = '';
    }
    toggle(item) {
        var index = this.items.indexOf(item);
        this.items[index].completed = !this.items[index].completed;
        this.itemUpdated(this.items[index]);
    }

    removeItem(item) {

        var index = this.items.indexOf(item);


        this.loading = true;
        // now deleting the task from our back-end
        this.toDoService.deleteTask(this.items[index].itemId).subscribe(
            data => {
            this.loading = false;
        this.items.splice(index, 1);
    },
        err => console.log(err),

    );

    }
    enterEditMode(element: HTMLInputElement, item) {
        var index = this.items.indexOf(item);
        this.items[index].editMode = true;
        if (this.items[index].editMode) {
            setTimeout(() => { element.focus(); }, 0);
        }
    }
    cancelEdit(element: HTMLInputElement, item) {
        var index = this.items.indexOf(item);
        this.items[index].editMode = false;
        element.value = this.items[index].text;
    }

    commitEdit(updatedText: string, item) {

        var index = this.items.indexOf(item);
        this.items[index].editMode = false;
        this.items[index].text = updatedText;
        this.itemUpdated(this.items[index]);
    }

    itemUpdated(item) {
        // update the node here
        if (item.itemId) {
            // creating a task in the back end
            this.toDoService.updateTask(item).subscribe(
                data => {
                this.loading = false;
        },
            err => console.log(err),

        );
        }
    }

}

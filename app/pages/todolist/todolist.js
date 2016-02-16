import {Page} from 'ionic/ionic';
import {TodoService} from '../services/todolistservice';


@Page({
    templateUrl: 'build/pages/todolist/todolist.html'
    providers: [TodoService]
})
export class TodoList {


    constructor(todoService:TodoService) {
        this.todoService = todoService;
        this.todos = [];
        this.loading = false;

        this.getTodos();

    }

    getTodos() {

        this.loading = true;
        this.todoService.getToDo().subscribe(
            data => {
            this.todos = [];
        for (let todoItem of data) {
            // changing the response according to our need
            this.todos.push({
                todoId: todoItem.nid,
                text: todoItem.title,
                completed: todoItem.field_status === 'True',
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

    addTodo() {

        if (this.newTodo) {
            // creating a todo in the back end
            this.loading = true;
            this.todoService.createTodo(this.newTodo).subscribe(
                data => {
                this.loading = false;
            this.getTodos();
        },
            err => console.log(err)
        );
        }

        this.newTodo = '';
    }
    toggle(todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].completed = !this.todos[index].completed;
        this.todoUpdated(this.todos[index]);
    }

    removeTodo(todo) {

        var index = this.todos.indexOf(todo);


        this.loading = true;
        // now deleting the todo from our back-end
        this.todoService.deleteTodo(this.todos[index].todoId).subscribe(
            data => {
            this.loading = false;
        this.todos.splice(index, 1);
    },
        err => console.log(err),

    );

    }
    enterEditMode(element: HTMLInputElement, todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = true;
        if (this.todos[index].editMode) {
            setTimeout(() => { element.focus(); }, 0);
        }
    }
    cancelEdit(element: HTMLInputElement, todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = false;
        element.value = this.todos[index].text;
    }

    commitEdit(updatedText: string, todo) {

        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = false;
        this.todos[index].text = updatedText;
        this.todoUpdated(this.todos[index]);
    }

    todoUpdated(todo) {
        // update the node here
        if (todo.todoId) {
            // updating a todo in the back end
            this.todoService.updateTodo(todo).subscribe(
                data => {
                this.loading = false;
        },
            err => console.log(err),

        );
        }
    }

}

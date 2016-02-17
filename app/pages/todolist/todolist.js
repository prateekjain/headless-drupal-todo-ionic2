/**
 * Component class for Todo
 */
import {Page} from 'ionic/ionic';
import {TodoService} from '../services/todolistservice';

/**
 * Page Component in Ionic
 */
@Page({
    templateUrl: 'build/pages/todolist/todolist.html'
    providers: [TodoService]
})

/**
 * Class TodoList
 */
export class TodoList {

    /**
     * Constructor for initializing variables
     * @param todoService
     */
    constructor(todoService:TodoService) {
        this.todoService = todoService;
        this.todos = [];
        this.loading = false;
        this.csrfToken = '';

        this.todoService.getCSRF().subscribe(
            data => {
                this.csrfToken = data._body;
            },
            err => {
                console.log(err);
            },
            () => {
                this.todoService.setAuthHeader(this.csrfToken);
                this.getTodos();
            }

        );
        this.getTodos();

    }

    /**
     * To get all the todos
     */
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
                completed: todoItem.field_complete === '1',
                editMode: false
            });
        }


    },
        //If error comes, this will be called
        err => console.log(err),
            () => {
            // remove the loading message
            this.loading = false;
        }
    );
    }

    /**
     * To add a todo
     */
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

    /**
     * To mark a todo as done or not done
     * @param todo
     */
    toggle(todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].completed = !this.todos[index].completed;
        this.todoUpdated(this.todos[index]);
    }

    /**
     * To delete a todo
     * @param todo
     */
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

    /**
     * Changes the todo UI element to input box
     * @param element
     * @param todo
     */
    enterEditMode(element: HTMLInputElement, todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = true;
        if (this.todos[index].editMode) {
            setTimeout(() => { element.focus(); }, 0);
        }
    }

    /**
     * Cancels the edit mode of todo
     * @param element
     * @param todo
     */
    cancelEdit(element: HTMLInputElement, todo) {
        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = false;
        element.value = this.todos[index].text;
    }

    /**
     * Called to confirm the todo is edited
     * @param updatedText
     * @param todo
     */
    commitEdit(updatedText: string, todo) {

        var index = this.todos.indexOf(todo);
        this.todos[index].editMode = false;
        this.todos[index].text = updatedText;
        this.todoUpdated(this.todos[index]);
    }

    /**
     * Updates the todo at the backend
     * @param todo
     */
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

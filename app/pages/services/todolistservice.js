/**
 * @file
 * Provides integration with REST webservices
 *
 */

import { Inject } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import 'rxjs/add/operator/map';

/**
 * Class which can be used to call web services
 */
export class TodoService {

    constructor(@Inject(Http) http: Http) {
    this.http = http;
    //Base URL of the Drupal backend
    //this.rootURL = "http://d8.local";
    //this.rootUrl = "http://dev-headless-training.pantheon.io";
    this.rootUrl = "http://headlesstraining.local";

    //Configurable username and password
    //A screen can be created for asking user to enter the credentials
    this.username = "dummy";
    this.password = "dummy";

}
/**
 * Get CSRF Token
 */

getCSRF() {
    return this.http.get(this.rootUrl + "/rest/session/token").map(res => res);
}

/**
 * Helper function to set the authentication header
 * @param csrfToken CSRF Token to make the http requests
 */
setAuthHeader(csrfToken) {

    var string = this.username + ':' + this.password;

    // encode the String
    var encodedString = 'Basic ' + btoa(string);

    var authHeader = new Headers();
    authHeader.append('Content-Type', "application/json");
    authHeader.append('Authorization', encodedString);
    authHeader.append('X-CSRF-Token', csrfToken);

    this.authHeader = authHeader;

}

/**
 * To get the list of all the todos
 */
getToDo() {
    var url = this.rootUrl + '/rest/views/todo/list';
    return this.http.get(url, {headers: this.authHeader}).map(res => res.json());
}

/**
 * To create the Todo
 * @param title
 *
 */
createTodo(title) {
    var url = this.rootUrl + '/entity/node';

    // creating the request body
    var body = {
        'type': [{'target_id': 'todo'}],
        'title': [{'value': title}],
    };

    // creating the request
    return this.http.post(url, JSON.stringify(body), {headers: this.authHeader}).map(res => res);
}

/**
 * To delete the todo
 * @param nid Unique nid of the todo
 */
deleteTodo(nid) {
    if (nid) {

        var url = this.rootUrl +  '/node/' + nid;
        // creating the request
        return this.http.delete(url, {headers: this.authHeader}).map(res => res);
    }
}

/**
 * To update the todo
 * @param todo Todo object
 */
updateTodo(todo) {
    if (todo) {
        var url = this.rootUrl +  '/node/' + todo.todoId;

        // creating an correct integer value for complete field
        var completed = 0;
        if (todo.completed) {
            completed = 1;
        }
        // creating the request body
        var body = {
            'type': [{'target_id': 'todo'}],
            'title': [{'value': todo.text}],
            'field_complete': [{'value': completed}]
        };

        // creating the request
        return this.http.patch(url, JSON.stringify(body), {headers: this.authHeader}).map(res => res);
    }
}

}
import { Inject } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import 'rxjs/add/operator/map';

export class ToDoService {

    constructor(@Inject(Http) http: Http) {
        this.http = http;
        this.rootURL = "http://d8.local";
        this.username = "rob";
        this.password = "rob";

    }

    getCSRF() {
        console.log("getting CSRF");
        return this.http.get(this.rootURL + "/rest/session/token").map(res => res);
    }

    setAuthHeader(csrfToken) {

        var string = this.username + ':' + this.password;

        // encode the String
        var encodedString = 'Basic ' + btoa(string);

        var authHeader = new Headers();
        authHeader.append('Content-Type', "application/json");
        authHeader.append('X-CSRF-Token', csrfToken);
        authHeader.append('Authorization', encodedString);

        this.authHeader = authHeader;

    }
    getToDo(csrfToken) {
        var url = this.rootURL + '/rest/view/todo/list';
        var header = new Headers();
        header.append('Content-Type', "application/json");
        header.append('X-CSRF-Token', csrfToken);
        //header.append('Authorization', encodedString);
        return this.http.get(url, {headers: header}).map(res => res.json());
    }

createTask(title) {
    var url = this.rootURL + '/entity/node';

    // creating the request body
    var body: Object = {
        'type': [{'target_id': 'todo'}],
        'title': [{'value': title}],
    };

    // creating the request
    return this.http.post(url, JSON.stringify(body), {headers: this.authHeader}).map(res => res);
}

deleteTask(nid) {
    if (nid) {

        var url = this.rootURL +  '/node/' + nid;
        // creating the request
        return this.http.delete(url, {headers: this.authHeader}).map(res => res);
    }
}

updateTask(item) {
    if (item) {
        var url = this.rootURL +  '/node/' + item.itemId;

        // creating an correct integer value for complete field
        var completed = 0;
        if (item.completed) {
            completed = 1;
        }
        // creating the request body
        var body: Object = {
            'type': [{'target_id': 'todo'}],
            'title': [{'value': item.text}],
            'field_status': [{'value': completed}]
        };

        // creating the request
        return this.http.patch(url, JSON.stringify(body), {headers: this.authHeader}).map(res => res);
    }
}

}
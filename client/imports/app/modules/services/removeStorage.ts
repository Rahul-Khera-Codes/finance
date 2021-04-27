import {Injectable} from '@angular/core';
@Injectable()
export class RemoveStorageService {
    constructor() {}
    removeData() {
        localStorage.removeItem('login_time'); // removing login time from localstorage
        localStorage.removeItem('Meteor.loginToken'); // rm login tokens
        localStorage.removeItem('Meteor.loginTokenExpires'); // from localstorage
        localStorage.removeItem('Meteor.userId'); // rm user id also from localstorage
    }
}

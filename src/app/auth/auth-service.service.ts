import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';
const BASEUURL = 'http://localhost:3000';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private userN: string;
    private authStatusListener = new Subject<boolean>()
    private userfetchedUpdated = new Subject<{email: any, usernamefetched: any, departmentfetched: any, registrationofetched: any }>();
  constructor(private http: HttpClient,
              private router: Router) { }

    createUser(email: string, image: File, username: string, department: string, registration: string ) {
        // const authData: AuthData = {email: email};
        const userData =  new FormData();
        userData.append('email', email);
        // userData.append('password', password);
        userData.append('username', username);
        userData.append('image', image, email);
        userData.append( 'department', department);
        userData.append('registration', registration);
        console.log(userData);
        this.http.post(`${BASEUURL}/api/user/signup`, userData)
            .subscribe(response => {
                console.log(response);
                this.router.navigate(['/login']);
            });
    }


    getName() {
        return localStorage.getItem('username');
    }

    login(email: string, password: string) {
        // const authData: AuthData = {email: email, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string, username: string, department: string, profileimg: string}>(
            `${BASEUURL}/api/user/login`,
            {email, password})
            .subscribe( response => {
                const token = response.token;
                console.log(response);
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.userN = response.username;
                    this.authStatusListener.next(true);
                    console.log('here');
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
                    console.log(expirationDate);
                    console.log(response.profileimg);
                    this.saveAuthData( token, expirationDate, this.userId, this.userN, response.department, response.profileimg);
                    this.router.navigate(['/menu/menu']).then();
                }
            } , error => {
                console.log('error');
                this.router.navigate(['/']).then();
            });

    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }

    getToken() {
        return this .token;
    }

    autoAuthUser() {
        const authInformation =  this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer( duration: number ) {
        console.log('Setting timer:' + duration);
        this.tokenTimer = setTimeout(() => {
                this.logout();
            },
            duration * 1000);
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.userN = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);

    }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userNam: string, department: string, profileimg: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', userNam);
        localStorage.setItem('department', department);
        localStorage.setItem('profileimg', profileimg);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('department');
        localStorage.removeItem('profileimg');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if ( !token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }

    getProfile() {
        this.http.get<{email: any,
            username: any, department: any, registrationo: any}>
        (`${BASEUURL}/api/user/profile`)
            .pipe(map((postData) => {
                return { email: postData.email, usernamefetched: postData.username,
                    departmentfetched: postData.department, registrationofetched: postData.registrationo};
            }))
            .subscribe( transformedGroupPost => {
                this.userfetchedUpdated.next( {
                    email: transformedGroupPost.email,
                    usernamefetched: transformedGroupPost.usernamefetched,
                    departmentfetched: transformedGroupPost.departmentfetched,
                    registrationofetched: transformedGroupPost.registrationofetched
                });
            });
    }

    getProfileUpdateListener() {
        return this.userfetchedUpdated.asObservable();
    }

    public updateUser(id: string , username: string, password: string) {


        console.log(id + '\n' + username + '\n' + password);


        const userData = {

            username: username,
            password: password
        };
        console.log(userData);
        this.http.put<{userId: string, username: string}>
        (`${BASEUURL}/api/user/edit/`, userData)
            .subscribe(response => {
                console.log(response);
                localStorage.removeItem('username');
                localStorage.setItem('username', response.username);
                this.router.navigate(['/menu/menu']);
            });
    }





}

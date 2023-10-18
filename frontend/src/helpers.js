import axios from 'axios';
import Cookies from 'js-cookie';
import { USER_API_URL } from './config';

export function logout() {

    const cookie = Cookies.get('user');
    if (cookie) {
        //clear user from cookie
        axios.post(USER_API_URL + "/user/clearCookie");
        Cookies.remove('user');
        console.log("logged out");

        // Refresh the page
        window.location.reload();
    } else {
        console.log("not logged in");
    }
    return;
}
import xs, {Stream, MemoryStream} from 'xstream';
import {DOMSource} from '@cycle/dom/xstream-typings';
import {div, a, form, span, input, label, VNode} from '@cycle/dom';
import { RequestOptions } from '@cycle/http';

export type Sources = {
  DOM: DOMSource,
};
export type Sinks = {
  DOM: Stream<VNode>,
  HTTP: Stream<RequestOptions>
}

function view(): Stream<VNode> {
    return xs.of(
            form('.form',[
                div('.mdl-textfield mdl-js-textfield mdl-textfield--floating-label', [
                    input('#login_username', 
                        {attrs: {
                            type: 'text', 
                            pattern:"^[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\\.[a-zA-Z]{2,6}$", 
                            class: 'mdl-textfield__input'}}),
                    label('#label_for_login_username', 
                        {attrs: {
                            for: 'login_username',
                            class: 'mdl-textfield__label'
                        }}, 'Username...'),
                    span('#err_for_login_username',
                        {attrs:{
                            class:'mdl-textfield__error'
                        }}, 'Username is invalid!')]
                    ),
                div('.mdl-textfield mdl-js-textfield mdl-textfield--floating-label', [
                    input('#login_password', 
                        {attrs: {
                            type: 'password', 
                            pattern:"^\.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!#$%&? \"])\.*$", 
                            class: 'mdl-textfield__input'}}),
                    label('#label_for_login_password', 
                        {attrs: {
                            for: 'login_password',
                            class: 'mdl-textfield__label'
                        }}, 'Password...'),
                    span('#err_for_login_password', {attrs: {
                        class:'mdl-textfield__error'
                    }}, 'Password is invalid!')]
                    ),
                div('.mdl-layout-spacer', [
                    a('#btn_login', 
                        {attrs: {
                            href:'#', 
                            class: 'mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored'
                        }}, 'Login'),
                    a('#btn_register', 
                        {attrs: {
                            href:'#',
                            class:'mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--blue-grey'
                        }}, 'Register')
                    ])
                ]
            )
        );
}

// read effects: read the username and password
// write effect: write http request to server api
// write effects: display the home page

function Login(sources:Sources): Sinks {
    const username$ = sources.DOM.select('#login_username').events('input')
        .map(ev => (<HTMLInputElement>ev.target).value);
    const password$ = sources.DOM.select('#login_password').events('input')
        .map(ev => (<HTMLInputElement>ev.target).value);
    
    const loginClick$ = sources.DOM.select('#btn_login').events('click');
    const loginData$ = xs.combine(username$, password$)
        .map(([username, password]) => loginClick$.mapTo({username, password}))
        .flatten();
    const request$ = loginData$.map(credentials => ({
        category: 'register',
        url: '/login',
        method: 'GET',
        send: credentials
    }));
    const vdom$ = view();
    return {
        DOM: vdom$,
        HTTP: request$
    };    
};

export default Login;
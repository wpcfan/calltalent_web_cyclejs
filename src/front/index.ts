import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import Login from './Login';
// import BmiCalculator from './BmiCalculator';
// const main = BmiCalculator;
const main = Login

run(main, {
  DOM: makeDOMDriver('#main-container'),
  HTTP: makeHTTPDriver()
});
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import App from './components/App';
import Link from './components/direction/Link'
import Admin from './components/Admin';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<header>
				<h3>Бесплатный рекламный онлайн-чат</h3>
			</header>
			<Switch>
				<Route exact path="/admin" render={() => <Admin />} />
				<Route path="/links" render={() => <Link />} />
				<Route path="*" render={() => <App />} />
			</Switch>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();

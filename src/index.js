import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';
import App from './components/App';
import Admin from './components/Admin';
import Links from './components/direction/Links';
import Sites from './components/direction/Sites';
import Banner468 from './components/direction/Banner468';
import Banner300 from './components/direction/Banner300';
import Banner200 from './components/direction/Banner200';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<header>
				<h3>Рекламный чат</h3>
				<menu>
					<Link to="/">
						<li>Онлайн-чат</li>
					</Link>
					<b>Добавить рекламу</b>
					<Link to="/sites">
						<li>Сайты</li>
					</Link>
					<Link to="/links">
						<li>Ссылки</li>
					</Link>
					<Link to="/banner468x60">
						<li>Баннеры 468x60</li>
					</Link>
					<Link to="/banner200x300">
						<li>Баннеры 200x300</li>
					</Link>
					<Link to="/banner200x200">
						<li>Баннеры 200x200</li>
					</Link>
				</menu>
			</header>
			<Switch>
				<Route exact path="/admin" render={() => <Admin />} />
				<Route path="/sites" render={() => <Sites />} />
				<Route path="/links" render={() => <Links />} />
				<Route
					path="/banner468x60"
					render={() => <Banner468 type="banner468" />}
				/>
				<Route
					path="/banner200x300"
					render={() => <Banner300 type="banner300" />}
				/>
				<Route
					path="/banner200x200"
					render={() => <Banner200 type="banner200" />}
				/>
				<Route path="*" render={() => <App />} />
			</Switch>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();

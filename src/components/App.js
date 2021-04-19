import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { urlAd, keyAd } from '../constants/api.json';
import InputText from '../elements/InputText';
import './App.css';

const App = () => {
	const [send, setSend] = useState(false);

	const [inputMessageValue, setInputMessageValue] = useState('');
	const inputMessageRef = useRef(inputMessageValue);

	const [inputNameValue, setInputNameValue] = useState('');
	const [inputMailValue, setinputMailValue] = useState('');

	const [data, setData] = useState(null); // рекламный контент
	// добавление рекламного контента
	useLayoutEffect(() => {
		let req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			// eslint-disable-next-line
			if (req.readyState == XMLHttpRequest.DONE) {
				const result = JSON.parse(req.responseText).record;
				setData(() => result);
				for (let i = 0; i < result.header.banners.length; i++) {
					let script = document.createElement('script');
					script.src = result.header.banners[i].div.split(`'`)[3];
					script.async = true;
					document.body.appendChild(script);
				}
				for (let i = 0; i < result.header.linkslot.length; i++) {
					let script = document.createElement('script');
					script.src = result.header.linkslot[i].div.split(`'`)[13];
					script.async = true;
					document.body.appendChild(script);
				}
				for (let i = 0; i < result.footer.linkslot.length; i++) {
					let script = document.createElement('script');
					script.src = result.footer.linkslot[i].div.split(`'`)[13];
					script.async = true;
					document.body.appendChild(script);
				}
			}
		};
		req.open('GET', urlAd, true);
		req.setRequestHeader('X-Master-Key', keyAd);
		req.send();

		console.log(`
	   _ _                    
 _ __ (_) | _____  ___  _ __  
| '_ \\| | |/ / __|/ _ \\| '_ \\ 
| | | | |   <\\__ \\ (_) | | | |
|_| |_|_|_|\\_\\___/\\___/|_| |_|

Powered on ReactJS 
by https://github.com/n1ks0N
			`);
	}, []);

	const sendMessage = () => {
		let allow = true;
		setData((prev) => {
			if (allow) {
				allow = false;
				let arr = prev['directions']['chat'];
				if (arr.length >= 20) {
					arr.splice(0, 1);
				}
				let result = []; // измененное сообщение с готовыми ссылками в чате
				inputMessageValue.replace(
					/((?:https?:\/\/|ftps?:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,})|(\n+|(?:(?!(?:https?:\/\/|ftp:\/\/|\bwww\.)(?:(?![.,?!;:()]*(?:\s|$))[^\s]){2,}).)+)/gim,
					(m, link, text) => {
						result.push(
							link
								? `<a href=${(link[0] === 'w' ? '//' : '') + link} key=${
										result.length
								  } target='_blank'>${link}</a>`
								: text
						);
					}
				);
				arr.push({
					message: `${result.join('')}`,
					date: `${new Date()}`,
					mail: `${inputMailValue}`,
					name: `${inputNameValue}`
				});
				return {
					...prev,
					['directions']: {
						...prev['directions'],
						['chat']: arr
					}
				};
			} else {
				return prev;
			}
		});
		setSend(true);
	};
	useEffect(() => {
		const element = document.querySelector('.chat__content');
		element.scrollTop = element.scrollHeight; // прокрутка окна чата при добавлении нового сообщения
		if (send) {
			// отправка новых данных
			let req = new XMLHttpRequest();
			req.open('PUT', urlAd, true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.setRequestHeader('X-Master-Key', keyAd);
			req.send(JSON.stringify(data));
			setSend(false);
		}
	}, [send]);
	const changeInputs = ({ param, name }) => {
		switch (name) {
			case 'name':
				setInputNameValue(param);
				break;
			case 'mail':
				setinputMailValue(param);
				break;
			default:
				setInputMessageValue(inputMessageRef.current.value);
		}
	};
	return (
		<>
			<div className="bg"></div>
			<main>
				<div className="header">
					{/* рекламная секция linkslot */}
					<div className="ad__list ad__list__links">
						{!!data &&
							data.header.textButtons.map((data, i) => (
								<a
									className="ad__list__links"
									key={i}
									target="_blank"
									rel="noreferrer"
									href={`${data.link}`}
								>
									{data.text}
								</a>
							))}
					</div>
					<div className="ad__list">
						{!!data &&
							data.header.linkslot.map((data, i) => (
								<div key={i} dangerouslySetInnerHTML={{ __html: data.div }} />
							))}
					</div>
					<div className="ad__list">
						{!!data &&
							data.header.banners.map((data, i) => (
								<div key={i} dangerouslySetInnerHTML={{ __html: data.div }} />
							))}
					</div>
				</div>
				<div className="app">
					<h1 align="center">Бесплатный рекламный онлайн-чат</h1>
					<h2 align="center"></h2>
					<div className="main">
						<div className="chat">
							<div className="chat__content">
								{!!data &&
									data.directions.chat.map((data, i) => (
										<div className="chat__message" key={i}>
											<div className="chat__header">
												<span>{data.name || 'Anonymous'}</span>&nbsp;
												<span>{data.mail}</span>
											</div>
											<div className="chat__body">
												<p
													className="chat__text"
													dangerouslySetInnerHTML={{ __html: data.message }}
												/>
												<span>
													{data.date.split(' ').splice(0, 5).join(' ')}
												</span>
												&nbsp;
												<span>#{i}</span>
											</div>
										</div>
									))}
							</div>
							<div className="chat__form">
								<div className="form-group">
									<div className="form-group__info">
										<InputText
											type="text"
											value={inputNameValue}
											name="name"
											placeholder="Иван Иванов"
											change={changeInputs}
										/>
										<InputText
											type="mail"
											value={inputMailValue}
											name="mail"
											placeholder="example@mail.ru"
											change={changeInputs}
										/>
									</div>
									<textarea
										className="form-control chat__form__textarea"
										id="message"
										rows="1"
										placeholder="Сообщение..."
										ref={inputMessageRef}
										onChange={(e) => changeInputs(e.target.id)}
									/>
								</div>
								<button
									type="button"
									className="btn btn-success"
									onClick={sendMessage}
								>
									Отправить
								</button>
							</div>
						</div>
					</div>
					<div className="ad__list ad__list__column">
						{!!data &&
							data.footer.banners.map((data, i) => (
								<div key={i} dangerouslySetInnerHTML={{ __html: data.div }} />
							))}
					</div>
				</div>
				<div className="ad__list">
					{!!data &&
						data.footer.linkslot.map((data, i) => (
							<div key={i} dangerouslySetInnerHTML={{ __html: data.div }} />
						))}
				</div>
			</main>
			<footer>
				<div className="footer__socials">
					<h2 className="footer__title">
						{!!data && data.footer.name[0].text}
					</h2>
					<div className="footer__links">
						{!!data &&
							data.footer.socials.map((data, i) => (
								<a key={i} href={data.link} className="footer__link">
									{data.text}
								</a>
							))}
					</div>
				</div>
				<div className="hider">
					© 2021 <br />
					Создание сайтов — Nikson
				</div>
			</footer>
			<div
				className="ya-share2"
				data-curtain
				data-size="l"
				data-shape="round"
				data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,viber,whatsapp,moimir"
			/>
		</>
	);
};

export default App;

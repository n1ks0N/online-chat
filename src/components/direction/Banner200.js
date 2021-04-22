import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { urlAd, keyAd } from '../../constants/api.json';
import InputText from '../../elements/InputText';
import '../App.css';
import './direction.css';

const Banner200 = ({ type }) => {
	const [send, setSend] = useState(false);
	const [count, setCount] = useState(7);
	const [title, setTitle] = useState('');

	const [inputTextValue, setInputTextValue] = useState('');
	const [inputLinkValue, setInputLinkValue] = useState('');
	const inputFileRef = useRef(null);

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

		setTitle(window.location.pathname.split('/banner')[1]);
	}, []);

	const changesInput = ({ param, name }) => {
		switch (name) {
			case 'text':
				setInputTextValue(param);
				break;
			case 'link':
				setInputLinkValue(param);
				break;
			default:
				return;
		}
	};
	const sendNewAdd = () => {
		const createData = (value) => {
			let allow = true;
			setData((prev) => {
				if (
					allow &&
					inputLinkValue.length > 0 &&
					(inputTextValue.length > 0 || inputFileRef.current.files.length > 0)
				) {
					allow = false; // eslint-disable-next-line
					let arr = prev['directions'][`${type}`];
					if (arr.length >= 20) {
						arr.pop();
					}
					arr.unshift({
						img: value,
						link: inputLinkValue.includes('://')
							? inputLinkValue.split('://')[1]
							: inputLinkValue
					});
					return {
						...prev, // eslint-disable-next-line
						['directions']: {
							...prev['directions'], // eslint-disable-next-line
							[`${type}`]: arr
						}
					};
				} else {
					return prev;
				}
			});
			setSend(true);
		};

		if (inputFileRef.current.files.length !== 0) {
			let reader = new FileReader();
			reader.readAsDataURL(inputFileRef.current.files[0]);
			reader.onload = () => {
				createData(reader.result);
			};
		} else if (inputTextValue.length !== 0) {
			createData(inputTextValue);
		}
	};
	useEffect(() => {
		if (send) {
			let req = new XMLHttpRequest();
			req.open('PUT', urlAd, true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.setRequestHeader('X-Master-Key', keyAd);
			req.send(JSON.stringify(data));
			setSend(false);
			setCount(7);
		} // eslint-disable-next-line
	}, [send]);

	useEffect(() => {
		// счётчик
		document.querySelector('.main__add-btn').disabled =
			count === 0 ? false : true;
		document.querySelector('#text0').disabled = count === 0 ? false : true;
		document.querySelector('#FormControlFile1').disabled =
			count === 0 ? false : true;
		document.querySelector('#link1').disabled = count === 0 ? false : true;
	}, [count]);
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
					<h1 align="center">Баннеры {title}</h1>
					<h2 align="center">
						Вам осталось {count} кликов, чтобы добавить свой баннер
					</h2>
					<div className="main">
						<div className="main__form">
							<div>
								<div className="form-group">
									<label htmlFor="FormControlFile1">
										Загрузите изображение баннера с компьютера или по ссылке
									</label>
									<input
										type="file"
										className="form-control-file"
										id="FormControlFile1"
										ref={inputFileRef}
										multiple={false}
										accept="image/*"
									/>
									<InputText
										text="Ссылка на изображение"
										type="url"
										value={inputTextValue}
										name="text"
										placeholder="https://example.jpg"
										change={changesInput}
										i="0"
									/>
								</div>
								<InputText
									text="Ссылка на сайт"
									type="url"
									value={inputLinkValue}
									name="link"
									placeholder="https://example.com"
									change={changesInput}
									i="1"
								/>
							</div>
							<button
								type="button"
								className="btn main__add-btn btn-success"
								onClick={sendNewAdd}
								title="Кликните на ссылки, чтобы добавить свою"
							>
								Добавить
							</button>
						</div>
						<div className="links__wrapper">
							{!!data &&
								data.directions[type].map((data, i) => (
									<div className="links__wrapper__item" key={i}>
										<a
											href={`//${data.link}`}
											onClick={() =>
												setCount((prev) => (prev > 0 ? --prev : 0))
											}
											target="_blank"
											className="links__wrapper__a"
											rel="noreferrer"
										>
											<img src={data.img} alt="banner" className={`${type}`} />
										</a>
										<span>#{++i}</span>
									</div>
								))}
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

export default Banner200;

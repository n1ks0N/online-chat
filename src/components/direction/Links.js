import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo
} from 'react';
import { urlAd, keyAd } from '../../constants/api.json';
import InputText from '../../elements/InputText';
import '../App.css';

const Links = () => {
  const [count, setCount] = useState(7);

  const [inputTextValue, setInputTextValue] = useState('')
  const [inputLinkValue, setInputLinkValue] = useState('')

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
  }, []);

  const changesInput = ({ param, name }) => {
    switch (name) {
      case 'text':
        setInputTextValue(param)
        break;
      case 'link':
        setInputLinkValue(param)
        break;
    }
  }

  useEffect(() => {
    document.querySelector('.main__add-btn').disabled = count === 0 ? false : true
  }, [count])
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
          <h1 align="center">Ссылки</h1>
          <h2 align="center">Вам осталось {count} кликов, чтобы добавить свою ссылку</h2>
          <div className="main">
            <div>
              <InputText
                text="Текст ссылки"
                type="text"
                value={inputTextValue}
                name="text"
                placeholder="Какой-то текст..."
                change={changesInput}
              />
              <InputText
                text="Ссылка"
                type="url"
                value={inputLinkValue}
                name="link"
                placeholder="https://example.com"
                change={changesInput}
              />
              <button type="button" className="btn main__add-btn btn-success" disabled>Добавить</button>
            </div>
            <div>
              {!!data &&
                data.directions.links.map((data, i) => (
                  <div key={i}>
                    <a href={data.link} onClick={() => setCount((prev) => prev > 0 ? --prev : 0)} target="_blank">
                      {data.text}
                    </a>
                    <span>#{i}</span>
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

export default Links;

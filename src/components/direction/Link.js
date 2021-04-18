import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo
} from 'react';
import { urlAd, keyAd } from '../../constants/api.json';
import '../App.css';

const App = () => {
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
    req.open('GET', "urlAd", true);
    req.setRequestHeader('X-Master-Key', keyAd);
    req.send();
  }, []);
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
                <div
                  key={i}
                  dangerouslySetInnerHTML={{ __html: data.div }}
                />
              ))}
          </div>
          <div className="ad__list">
            {!!data &&
              data.header.banners.map((data, i) => (
                <div
                  key={i}
                  dangerouslySetInnerHTML={{ __html: data.div }}
                />
              ))}
          </div>
        </div>
        <div className="app">
          <h1 align="center">Сервис сокращения ссылок</h1>
          <h2 align="center">Сократите ссылку в один шаг:</h2>
          <div className="main">
            LINK
          </div>
          <div className="ad__list ad__list__column">
            {!!data &&
              data.footer.banners.map((data, i) => (
                <div
                  key={i}
                  dangerouslySetInnerHTML={{ __html: data.div }}
                />
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
            {!!data &&
              data.footer.name[0].text
            }
          </h2>
          <div className="footer__links">
            {!!data &&
              data.footer.socials.map((data, i) => (
                <a key={i} href={data.link} className="footer__link">{data.text}</a>
              ))}
          </div>
        </div>
        <div className="hider">
          © 2021 <br />
							Создание сайтов — Nikson
						</div>
      </footer>
      <div className="ya-share2" data-curtain data-size="l" data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,twitter,viber,whatsapp,moimir" />
    </>
  );
};

export default App;

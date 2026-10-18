
import { useEffect, useState } from 'react';
import GL from './GL.jsx';
import HeroGL from './HeroGL.jsx';
import Loader from './Loader.jsx';
import Admin from './Admin.jsx';
import { DEFAULT_SITE_CONTENT, isValidSiteContent } from './siteContent.js';
import { supabase } from './supabaseClient.js';

const wa = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

const L = (e) => e.currentTarget.classList.add('ld');
const img = (name) => `/images/${name}.jpg`;

function useReveal(ready) {
  useEffect(() => {
    if (!ready) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.rv').forEach((el) => io.observe(el));

    let frame;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--sy', window.scrollY);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ready]);
}

const Tag = ({ children }) => (
  <span className="tag">{children}</span>
);

const Sec = ({ id, tag, title, children, aside }) => (
  <section id={id} className="sec">
    <div className="wrap">
      <div className="rv">
        <Tag>{tag}</Tag>
      </div>

      <div className="sec-h">
        <h2 className="rv">{title}</h2>
        {aside && <p className="rv aside">{aside}</p>}
      </div>

      {children}
    </div>
  </section>
);

const Lines = ({ text }) =>
  text.split('\n').map((line, index) => (
    <span key={`${index}-${line}`}>
      {index > 0 && <br />}
      {line}
    </span>
  ));

function Website() {
  const [site, setSite] = useState(DEFAULT_SITE_CONTENT);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(DEFAULT_SITE_CONTENT.gallery.categories[0]);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [top, setTop] = useState(true);

  useReveal(ready);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('id', 'main')
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) return;
        if (!isValidSiteContent(data.content)) {
          throw new Error('Saved site content has an invalid structure.');
        }
        if (active) setSite(data.content);
      })
      .catch((error) => {
        console.error('Could not load website content from Supabase:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.title = site.seo.title;
    [
      ['meta[name="description"]', site.seo.description],
      ['meta[property="og:title"]', site.seo.title],
      ['meta[property="og:description"]', site.seo.description],
      ['meta[name="twitter:title"]', site.seo.title],
      ['meta[name="twitter:description"]', site.seo.description],
    ].forEach(([selector, content]) => {
      const meta = document.querySelector(selector);
      if (meta) meta.setAttribute('content', content);
    });
  }, [site]);

  useEffect(() => {
    setCat(site.gallery.categories[0]);
  }, [site.gallery.categories]);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY < 60);

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth >= 1040) setOpen(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || !ready ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, ready]);

  const go = () => setOpen(false);
  const NAV = [
    ['story', site.navigation.story],
    ['why', site.navigation.why],
    ['rooms', site.navigation.rooms],
    ['gallery', site.navigation.gallery],
    ['experiences', site.navigation.experiences],
    ['reviews', site.navigation.reviews],
    ['book', site.navigation.book],
  ];
  const whatsapp = (
    message = `Hi! I would like to check availability at ${site.brand.name} Homestay.`
  ) => wa(site.contact.whatsappNumber, message);

  return (
    <>
      <style>{`
        /* Keep room photos clean: no price labels or pseudo-element overlays. */
        .room .ph { position: relative; overflow: hidden; }
        .room .ph::before,
        .room .ph::after { content: none !important; display: none !important; }
        .room .ph img { display: block; width: 100%; height: 100%; object-fit: cover; }
      `}</style>
      {!gone && (
        <Loader
          onReveal={() => setReady(true)}
          onDone={() => setGone(true)}
          title={site.loader.title}
          location={site.loader.location}
          region={site.loader.region}
          tagline={site.loader.tagline}
        />
      )}

      <GL />

      <header
        className={
          'nav' +
          (top && !open ? ' top' : '') +
          (open ? ' open' : '')
        }
      >
        <div className="wrap nav-in">
          <a href="#top" className="brand" onClick={go}>
            <img src={img(site.brand.logoImage)} alt={`${site.brand.name} logo`} />
            {site.brand.name}
          </a>

          <nav className="dnav" aria-label="Main navigation">
            {NAV.slice(0, 6).map(([id, label]) => (
              <a key={id} href={'#' + id}>
                {label}
              </a>
            ))}
          </nav>

          <a className="pill dark nav-cta" href="#book">
            {site.navigation.book}
          </a>

          <button
            className="burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <nav
        className={open ? 'menu open' : 'menu'}
        aria-label="Mobile navigation"
      >
        {NAV.map(([id, label]) => (
          <a key={id} href={'#' + id} onClick={go}>
            {label}
          </a>
        ))}

        <a className="pill dark" href={whatsapp()} onClick={go}>
          {site.hero.bookButton}
        </a>
      </nav>

      <main id="top">
        <section
          className="hero"
          style={{
            backgroundImage: `url(${img(site.hero.slides[0]?.image || 'home')})`,
          }}
        >
          <HeroGL slides={site.hero.slides} />

          <div className="wrap hero-in">
            <h1 className="rv">
              <Lines text={site.hero.title} />
            </h1>

            <div className="hero-row rv">
              <p>{site.hero.description}</p>

              <div className="btns">
                <a className="pill" href="#rooms">
                  {site.hero.roomsButton}
                </a>

                <a className="pill dark" href={whatsapp()}>
                  {site.hero.bookButton}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap stats rv">
            {site.stats.map(({ value, label }) => (
              <div key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <Sec
          id="story"
          tag={site.story.tag}
          title={
            <Lines text={site.story.title} />
          }
        >
          <div className="two">
            {site.story.paragraphs.map((paragraph, index) => (
              <p className="rv" key={`${index}-${paragraph}`}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="frame rv">
            <img
              src={img(site.story.image)}
              alt={site.story.imageAlt}
              style={{
                transform: 'translateY(calc(var(--sy) * -0.03px))',
              }}
              loading="lazy"
              onLoad={L}
              onError={L}
            />
          </div>
        </Sec>

        <Sec
          id="why"
          tag={site.why.tag}
          title={site.why.title}
        >
          <div className="grid3">
            {site.why.items.map(({ title, description }) => (
              <div className="cell rv" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </Sec>

        <Sec
          id="rooms"
          tag={site.rooms.tag}
          title={site.rooms.title}
          aside={site.rooms.aside}
        >
          <div className="rooms">
            {site.rooms.items.map((room) => (
              <article className="room rv" key={room.name}>
                <div className="ph">
                  <img
                    src={img(room.image)}
                    alt={room.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={L}
                    onError={L}
                  />
                </div>

                <div className="room-b">
                  <div className="room-t">
                    <h3>{room.name}</h3>

                    <b>
                      ₹{room.price}
                      <small> / {room.rateUnit}</small>
                    </b>
                  </div>

                  <p className="meta">
                    {room.guests} · {room.details}
                  </p>

                  <p>{room.description}</p>

                  <ul>
                    {room.amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>

                  <a
                    className="pill dark"
                    href={whatsapp(
                      `Hi! I would like to enquire about ${room.name}. The listed starting rate is ₹${room.price} per ${room.rateUnit}. Check-in: , Check-out: , Guests: . Please confirm availability and the final price.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {site.rooms.enquireButton}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Sec>

        <Sec
          id="gallery"
          tag={site.gallery.tag}
          title={site.gallery.title}
        >
          <div className="chips rv">
            {site.gallery.categories.map((category) => (
              <button
                key={category}
                className={
                  'pill' + (cat === category ? ' dark' : '')
                }
                onClick={() => setCat(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="gal">
            {site.gallery.items
              .filter(
                (picture) =>
                  cat === site.gallery.categories[0] ||
                  picture.category === cat
              )
              .map((picture, index) => (
              <figure
                key={`${picture.image}-${picture.alt}`}
                className={
                  'rv' + (index % 5 === 0 ? ' wide' : '')
                }
              >
                <img
                  src={img(picture.image)}
                  alt={picture.alt}
                  loading="lazy"
                  decoding="async"
                  onLoad={L}
                  onError={L}
                />
                <figcaption>{picture.alt}</figcaption>
              </figure>
            ))}
          </div>
        </Sec>

        <Sec
          id="experiences"
          tag={site.experiences.tag}
          title={site.experiences.title}
          aside={site.experiences.aside}
        >
          <div className="list">
            {site.experiences.items.map(({ title, description, distance }) => (
              <div className="row rv" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>{distance}</span>
              </div>
            ))}
          </div>

          <div className="grid3 seas">
            {site.experiences.seasons.map(({ title, dates, description }) => (
              <div className="cell rv" key={title}>
                <span className="meta">{dates}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>

          <p className="meta rv">{site.experiences.packingNote}</p>
        </Sec>

        <Sec
          id="reviews"
          tag={site.reviews.tag}
          title={site.reviews.title}
        >
          {site.reviews.items.map(({ quote, citation }) => (
            <blockquote className="rv" key={citation}>
              <p>{quote}</p>
              <cite>{citation}</cite>
            </blockquote>
          ))}
        </Sec>

        <Sec id="faq" tag={site.faq.tag} title={site.faq.title}>
          <div className="list">
            {site.faq.items.map(({ question, answer }) => (
              <details className="rv" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </Sec>

        <Sec
          id="find"
          tag={site.find.tag}
          title={site.find.title}
        >
          <div className="grid3">
            <div className="cell rv">
              <h3>{site.find.addressTitle}</h3>
              <p>{site.contact.address}</p>

              <a
                className="pill"
                href={site.contact.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                {site.find.mapButton}
              </a>
            </div>

            {site.find.directions.map(({ title, description }) => (
              <div className="cell rv" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </Sec>

        <section id="book" className="cta">
          <div className="wrap">
            <h2 className="rv">
              <Lines text={site.booking.title} />
            </h2>

            <p className="rv">{site.booking.description}</p>

            <a
              className="pill dark big rv"
              href={whatsapp()}
              target="_blank"
              rel="noreferrer"
            >
              {site.booking.button}
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div>
            <b>{site.footer.title}</b>
            <p>{site.footer.description}</p>
          </div>

          <div className="fl">
            {[
              ['rooms', site.navigation.rooms],
              ['gallery', site.navigation.gallery],
              ['experiences', site.navigation.experiences],
              ['reviews', site.navigation.reviews],
              ['faq', site.navigation.faq],
              ['find', site.navigation.find],
              ['book', site.navigation.contact],
            ].map(([id, label]) => (
              <a key={id} href={'#' + id}>
                {label}
              </a>
            ))}
          </div>

          <div>
            <a href={`tel:${site.contact.whatsappNumber}`}>
              {site.contact.phoneDisplay}
            </a>

            <a href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>

            <p>{site.contact.address}</p>
          </div>

          <small>
            © {new Date().getFullYear()} {site.footer.copyright}
          </small>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return window.location.pathname.replace(/\/+$/, '') === '/admin' ? (
    <Admin />
  ) : (
    <Website />
  );
}

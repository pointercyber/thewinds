
import { useEffect, useState } from 'react';
import GL from './GL.jsx';
import HeroGL from './HeroGL.jsx';
import Loader from './Loader.jsx';

const PHONE = '919990815181';

const wa = (
  message = 'Hi! I would like to check availability at The Winds Homestay.'
) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

const L = (e) => e.currentTarget.classList.add('ld');
const img = (name) => `/images/${name}.jpg`;

const NAV = [
  ['story', 'Our Story'],
  ['why', 'Why Stay'],
  ['rooms', 'Rooms & Rates'],
  ['gallery', 'Gallery'],
  ['experiences', 'Experiences'],
  ['reviews', 'Reviews'],
  ['book', 'Book Your Stay'],
];

const ROOMS = [
  // {
  //   n: 'Private Room',
  //   p: '1,100',
  //   g: 'Per Room',
  //   b: 'One room · Two-bedroom apartment',
  //   i: 'bedroom',
  //   d: 'A comfortable private room in our two-bedroom apartment, perfect for travellers looking for a peaceful and affordable stay in Meppadi, Wayanad.',
  //   a: [
  //     'Comfortable bedroom',
  //     'Wi-Fi',
  //     'Hot water',
  //     'Peaceful surroundings',
  //     'Comfortable bedding',
  //     'Ideal for solo travellers and couples',
  //   ],
  // },
  {
    n: 'Full Apartment',
    p: '1,100',
    g: 'Per person',
    b: 'Entire apartment · Two bedrooms',
    i: 'suite',
    d: 'Enjoy the complete two-bedroom apartment with your family or group. Relax in your own space and experience the comfort and peaceful surroundings of Wayanad.',
    a: [
      'Entire two-bedroom apartment',
      'Private space for your group',
      'Comfortable bedrooms',
      'Wi-Fi',
      'Hot water',
      'Ideal for families and groups',
    ],
  },
];

const PICS = [
  ['home', 'The Home', 'Homestay surrounded by trees'],
  ['hills', 'Green Views', 'Tea hills from the sit-out'],
  ['living', 'Interiors', 'Living area'],
  ['bedroom', 'Interiors', 'Bedroom'],
  ['kitchen', 'Interiors', 'Kitchen'],
  ['bath', 'Interiors', 'Bathroom'],
  ['suite', 'Interiors', 'Bedroom doorway'],
  ['desk', 'Interiors', 'Lounge and work nook'],
];

const EXP = [
  [
    'Off-Road Mountain Jeep Safari',
    '4x4 trails, stream stops and sunset viewpoints, with drivers arranged by the host.',
    '3–4 hours · Starts at the homestay',
  ],
  [
    'Wayanad 900 Kandi Glass Bridge',
    'Glass skywalk above the forest, zip-lining, giant swings and canopy views.',
    '8.5 km · Approximately 18 min drive',
  ],
  [
    'Tea Estate & Aromatics Walks',
    'Walk through tea, cardamom and pepper plantations with birdwatching and a lesson in tea making.',
    '1–2 hours · Around the homestay',
  ],
  [
    'Soochipara & Meenmutty Waterfalls',
    'Explore forest trails, waterfalls and viewpoints in the Western Ghats.',
    'Approximately 14 km · Travel time varies',
  ],
];

const SEAS = [
  [
    'Winter Mist',
    'Oct – Feb',
    'Cool weather and misty hills. Carry a light fleece or shawl.',
  ],
  [
    'Pleasant Summer',
    'Mar – May',
    'Enjoy green hills and outdoor activities.',
  ],
  [
    'Verdant Monsoon',
    'Jun – Sep',
    'Experience lush landscapes and waterfalls. Bring waterproofs and grippy shoes.',
  ],
];

const FAQ = [
  [
    'Check-in and check-out times?',
    'Check-in from 1:00 PM and check-out by 11:00 AM. Early or late arrivals may be possible with prior notice.',
  ],
  [
    'What are the room rates?',
    'The private room starts at ₹1,100 per person. The full two-bedroom apartment starts at ₹2,400 per person. Confirm the final price with the host.',
  ],
  [
    'Is food available?',
    'Ask the host about home-cooked Kerala food, breakfast and other meal options.',
  ],
  [
    'Is parking available?',
    'Please confirm parking availability with the host before booking.',
  ],
  [
    'How close are the attractions?',
    '900 Kandi Glass Bridge, Soochipara Falls and other Wayanad attractions are accessible from Meppadi. Ask the host for current travel times and access conditions.',
  ],
  [
    'How do I book?',
    'Message or call +91 99908 15181 with your check-in date, check-out date, number of guests and preferred accommodation.',
  ],
  [
    'What is the cancellation policy?',
    'Ask the host about cancellations, date changes and applicable charges before confirming your booking.',
  ],
];

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

export default function App() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState('All Photos');
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [top, setTop] = useState(true);

  useReveal(ready);

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
            <img src={img('logo')} alt="The Winds logo" />
            The Winds
          </a>

          <nav className="dnav" aria-label="Main navigation">
            {NAV.slice(0, 6).map(([id, label]) => (
              <a key={id} href={'#' + id}>
                {label}
              </a>
            ))}
          </nav>

          <a className="pill dark nav-cta" href="#book">
            Book Your Stay
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

        <a className="pill dark" href={wa()} onClick={go}>
          Book on WhatsApp
        </a>
      </nav>

      <main id="top">
        <section className="hero">
          <HeroGL />

          <div className="wrap hero-in">
            <h1 className="rv">
              THE WINDS
              <br />
              HOMESTAY
            </h1>

            <div className="hero-row rv">
              <p>
                A peaceful home in the hills of Wayanad. Green
                views, cozy rooms and a slower kind of stay.
                Rooms from ₹1,100 per person.
              </p>

              <div className="btns">
                <a className="pill" href="#rooms">
                  Rooms & Rates
                </a>

                <a className="pill dark" href={wa()}>
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap stats rv">
            {[
              ['2', 'bedrooms in the apartment'],
              ['₹1,100', 'private room per person'],
              ['₹2,400', 'full apartment per person'],
              ['24/7', 'WhatsApp enquiries'],
            ].map(([value, label]) => (
              <div key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <Sec
          id="story"
          tag="Our Story"
          title={
            <>
              A HOME IN THE HILLS,
              <br />
              MADE FOR SLOW DAYS.
            </>
          }
        >
          <div className="two">
            <p className="rv">
              Tucked among the greenery of Meppadi, The Winds
              Homestay is a peaceful place surrounded by tea
              estates and cool mountain air. Comfortable rooms,
              warm interiors and beautiful surroundings make
              room for unhurried mornings and quiet evenings.
            </p>

            <p className="rv">
              Whether you are travelling alone, visiting with
              friends or spending time with family, find a
              comfortable base for exploring Wayanad. Stay
              with us. Feel at home.
            </p>
          </div>

          <div className="frame rv">
            <img
              src={img('hills')}
              alt="Green tea hills of Meppadi"
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
          tag="Why Stay"
          title="WHY STAY WITH US"
        >
          <div className="grid3">
            {[
              [
                'Cozy rooms',
                'Comfortable bedrooms for a relaxing stay in the hills.',
              ],
              [
                'Flexible stays',
                'Choose a single room or book the complete apartment.',
              ],
              [
                'Scenic surroundings',
                'Discover tea plantations, green valleys and the Western Ghats.',
              ],
              [
                'Warm hospitality',
                'Get local guidance and help planning nearby activities.',
              ],
              [
                'Explore Wayanad',
                'Use Meppadi as a base for exploring local attractions.',
              ],
              [
                'Clear pricing',
                'Starting rates of ₹1,100 and ₹2,400 per person for the two options.',
              ],
            ].map(([title, description]) => (
              <div className="cell rv" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </Sec>

        <Sec
          id="rooms"
          tag="Rooms & Rates"
          title="FIND YOUR STAY"
          aside="Rates are per person. Confirm the final price, occupancy, facilities and availability with the host before booking."
        >
          <div className="rooms">
            {ROOMS.map((room) => (
              <article className="room rv" key={room.n}>
                <div className="ph">
                  <img
                    src={img(room.i)}
                    alt={room.n}
                    loading="lazy"
                    decoding="async"
                    onLoad={L}
                    onError={L}
                  />
                </div>

                <div className="room-b">
                  <div className="room-t">
                    <h3>{room.n}</h3>

                    <b>
                      ₹{room.p}
                      <small> / person</small>
                    </b>
                  </div>

                  <p className="meta">
                    {room.g} · {room.b}
                  </p>

                  <p>{room.d}</p>

                  <ul>
                    {room.a.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>

                  <a
                    className="pill dark"
                    href={wa(
                      `Hi! I would like to enquire about ${room.n}. The listed starting rate is ₹${room.p} per person. Check-in: , Check-out: , Guests: . Please confirm availability and the final price.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Enquire & Book
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Sec>

        <Sec
          id="gallery"
          tag="Gallery"
          title="THE HOME & ITS VIEWS"
        >
          <div className="chips rv">
            {[
              'All Photos',
              'The Home',
              'Interiors',
              'Green Views',
            ].map((category) => (
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
            {PICS.filter(
              (picture) =>
                cat === 'All Photos' || picture[1] === cat
            ).map(([file, , description], index) => (
              <figure
                key={file}
                className={
                  'rv' + (index % 5 === 0 ? ' wide' : '')
                }
              >
                <img
                  src={img(file)}
                  alt={description}
                  loading="lazy"
                  decoding="async"
                  onLoad={L}
                  onError={L}
                />
                <figcaption>{description}</figcaption>
              </figure>
            ))}
          </div>
        </Sec>

        <Sec
          id="experiences"
          tag="Experiences"
          title="THINGS TO DO NEARBY"
          aside="Distances and travel times are estimates. Ask the host about current access conditions."
        >
          <div className="list">
            {EXP.map(([title, description, distance]) => (
              <div className="row rv" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>{distance}</span>
              </div>
            ))}
          </div>

          <div className="grid3 seas">
            {SEAS.map(([title, season, description]) => (
              <div className="cell rv" key={title}>
                <span className="meta">{season}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>

          <p className="meta rv">
            Pack a light jacket, comfortable walking shoes,
            mosquito repellent, waterproofs and a camera.
          </p>
        </Sec>

        <Sec
          id="reviews"
          tag="Reviews"
          title="GUEST WORDS"
        >
          <blockquote className="rv">
            <p>
              A peaceful stay with balcony views of misty hills.
              Courteous hosts who helped with our 900 Kandi
              passes, and a home-cooked Kerala breakfast of
              appam and stew.
            </p>

            <cite>
              Aditya Nair, Bangalore · Couple's getaway · 5 stars
            </cite>
          </blockquote>
        </Sec>

        <Sec id="faq" tag="FAQ" title="GOOD TO KNOW">
          <div className="list">
            {FAQ.map(([question, answer]) => (
              <details className="rv" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </Sec>

        <Sec
          id="find"
          tag="Find Us"
          title="MEPPADI, WAYANAD"
        >
          <div className="grid3">
            <div className="cell rv">
              <h3>Address</h3>
              <p>
                Meppadi, Wayanad District, Kerala 673577, India
              </p>

              <a
                className="pill"
                href="https://www.google.com/maps/search/?api=1&query=The+Winds+Homestay+Meppadi+Wayanad"
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>
            </div>

            <div className="cell rv">
              <h3>By air and train</h3>
              <p>
                Calicut Airport and Kozhikode Railway Station
                are options for reaching Wayanad. Travel time
                varies with the route and road conditions.
              </p>
            </div>

            <div className="cell rv">
              <h3>By road from Bangalore</h3>
              <p>
                Travel via Mysore, Gundlupet, Bandipur and
                Sultan Bathery towards Meppadi. Check current
                route conditions before travelling.
              </p>
            </div>
          </div>
        </Sec>

        <section id="book" className="cta">
          <div className="wrap">
            <h2 className="rv">
              COME AS A GUEST.
              <br />
              FEEL LIKE YOU'RE HOME.
            </h2>

            <p className="rv">
              Planning a Wayanad getaway? Message the host
              with your dates, number of guests and preferred
              accommodation to check availability and prices.
            </p>

            <a
              className="pill dark big rv"
              href={wa()}
              target="_blank"
              rel="noreferrer"
            >
              Book on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div>
            <b>The Winds, Homestay · Wayanad</b>
            <p>
              A peaceful homestay in Meppadi, surrounded by
              greenery and mountain air. Stay with us. Feel at home.
            </p>
          </div>

          <div className="fl">
            {[
              ['rooms', 'Rooms & Rates'],
              ['gallery', 'Gallery'],
              ['experiences', 'Experiences'],
              ['reviews', 'Reviews'],
              ['faq', 'FAQ'],
              ['find', 'Find Us'],
              ['book', 'Contact'],
            ].map(([id, label]) => (
              <a key={id} href={'#' + id}>
                {label}
              </a>
            ))}
          </div>

          <div>
            <a href="tel:+919990815181">
              +91 99908 15181
            </a>

            <a href="mailto:windshomestay@gmail.com">
              windshomestay@gmail.com
            </a>

            <p>
              Meppadi, Wayanad District, Kerala 673577, India
            </p>
          </div>

          <small>
            © 2026 The Winds Homestay, Meppadi · Wayanad · Kerala.
          </small>
        </div>
      </footer>
    </>
  );
}

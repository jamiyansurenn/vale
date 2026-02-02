const { useEffect, useMemo, useRef, useState } = React;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createHearts = (count = 12) =>
  Array.from({ length: count }, (_, index) => ({
    id: `heart-${index}`,
    left: Math.floor(Math.random() * 92) + 4,
    delay: Math.random() * 6,
    size: Math.floor(Math.random() * 18) + 16,
    opacity: Math.random() * 0.35 + 0.45,
  }));

const App = () => {
  const playgroundRef = useRef(null);
  const noBtnRef = useRef(null);

  const [yesScale, setYesScale] = useState(1.1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [loveMeter, setLoveMeter] = useState(12);
  const [lastYesAt, setLastYesAt] = useState(null);
  const [yesCount, setYesCount] = useState(null);

  const hearts = useMemo(() => createHearts(14), []);
  const firebaseEnabled =
    window.firebaseConfig &&
    window.firebaseConfig.apiKey &&
    !window.firebaseConfig.apiKey.includes("PASTE");

  const getDatabase = () => {
    if (!firebaseEnabled || !window.firebase) return null;
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(window.firebaseConfig);
    }
    return window.firebase.database();
  };

  const moveNoButton = () => {
    const playground = playgroundRef.current;
    const noBtn = noBtnRef.current;
    if (!playground || !noBtn) return;

    const maxX = playground.clientWidth - noBtn.offsetWidth;
    const maxY = playground.clientHeight - noBtn.offsetHeight;

    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;

    setNoPos({
      x: clamp(nextX, 0, maxX),
      y: clamp(nextY, 0, maxY),
    });
  };

  const growYes = (amount = 0.06) => {
    setYesScale((prev) => clamp(prev + amount, 1, 2.4));
  };

  const tease = (amount) => {
    moveNoButton();
    growYes(amount);
    setLoveMeter((prev) => clamp(prev + 7, 12, 100));
  };

  const handleYes = () => {
    setAccepted(true);
    const db = getDatabase();
    if (!db) return;
    const now = new Date().toISOString();
    db.ref("valentine/lastYes").set(now);
    db.ref("valentine/yesCount").transaction((count) => (count || 0) + 1);
    db.ref("valentine/responses").push({
      at: now,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      ua: navigator.userAgent || "",
    });
  };

  useEffect(() => {
    const handleResize = () => moveNoButton();
    moveNoButton();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const db = getDatabase();
    if (!db) return undefined;

    const lastYesRef = db.ref("valentine/lastYes");
    const countRef = db.ref("valentine/yesCount");

    lastYesRef.on("value", (snapshot) => setLastYesAt(snapshot.val() || null));
    countRef.on("value", (snapshot) =>
      setYesCount(typeof snapshot.val() === "number" ? snapshot.val() : null)
    );

    return () => {
      lastYesRef.off();
      countRef.off();
    };
  }, []);

  return (
    <main className="page">
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <section className="card" aria-live="polite">
        <header className="hero">
          <p className="emoji" aria-hidden="true">
            💘
          </p>
          <div>
            <h1>Халинаа,
            чи KDL-ийн Валентайн болох уу? 💘</h1>
            <p className="subtitle">Зүгээр л “тийм” гэж хэлээрэй.</p>
          </div>
        </header>

        <div className={`sections ${accepted ? "is-grid" : "is-single"}`}>
          <div className="section">
            <p className="section-title">Тийм гэж хэлээрэй</p>
            <div className="playground" ref={playgroundRef}>
              <button
                className="btn yes"
                type="button"
                style={{ transform: `scale(${yesScale})` }}
                disabled={accepted}
                onClick={handleYes}
              >
                Yes
              </button>
              {!accepted && (
                <button
                  className="btn no"
                  ref={noBtnRef}
                  type="button"
                  style={{ left: `${noPos.x}px`, top: `${noPos.y}px` }}
                  onMouseEnter={() => tease(0.08)}
                  onClick={() => tease(0.1)}
                >
                  No
                </button>
              )}
            </div>
            <p className="result" role="status">
              {accepted ? "Yay! Болзъё, Валентайн 💖" : "Үгүй товчийг барьж чадах уу?"}
            </p>
            {firebaseEnabled && (
              <div className="live-status">
                <p className="status-title">Live status</p>
                <p className="status-line">
                  Сүүлд “Тийм” дарсан:{" "}
                  {lastYesAt ? new Date(lastYesAt).toLocaleString() : "одоо алга"}
                </p>
                {yesCount !== null && (
                  <p className="status-line">Нийт “Тийм”: {yesCount}</p>
                )}
              </div>
            )}
            {accepted && (
              <div className="celebrate">
                <span>🎉 Чи “тийм” гэж хэллээ!</span>
                <span>💌 Баруун талын сюрпризүүдийг хараарай</span>
              </div>
            )}
            {accepted && (
              <div className="yes-plan">
                <p className="plan-title">Дараа нь юу болох вэ</p>
                <ul className="plan-list">
                  <li>📞 Би залгаад “6 цагт уулзъя юу?”</li>
                  <li>🌹 Цэцэг + жижигхэн бэлэг</li>
                  <li>🍰 Амттан авч гоё зураг дарна</li>
                  <li>🚶‍♀️ Орой алхалт + smoothie 💋</li>
                </ul>
                <div className="smooch" aria-label="smooch">
                  Mua 💋
                </div>
              </div>
            )}
          </div>

          {accepted && (
            <>
              <div className="section reveal">
                <p className="section-title">Бид хоёр инээж байсан мөчүүд энд бий.
                Чиний “Тийм” тэднийг буцааж магадгүй.</p>
                <ul className="feature-list">
                  <li>Зарим түүх “Үгүй”-гээр дуусдаггүй.
                  Магадгүй нэг “Тийм”-ээр үргэлжилдэг.</li>
                  <li>Үгүй зугтах тусам love meter өснө</li>
                  <li>Бидний хооронд асуулт л үлдсэн.
                  Хариулт нь энд байна.</li>
                  <li>“Үгүй” гэдэг нь түр азналт.
                  “Тийм” гэдэг нь бид.</li>
                </ul>
                <div className="meter">
                  <div className="meter-label">Love meter</div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: `${loveMeter}%` }} />
                  </div>
                </div>
              </div>

              <div className="section reveal">
                <p className="section-title">“Тийм” гэх шалтгаанууд</p>
                <div className="chips">
                  <span>✨ Хөөрхөн болзоо</span>
                  <span>🍓 Амттан</span>
                  <span>🎶 Дуут плейлист</span>
                  <span>📸 Гоё зураг</span>
                  <span>🫶 Тэврэлт</span>
                  <span>🌙 Орой алхалт</span>
                </div>
                <p className="note">
                  Эдгээрийг хүссэнээрээ өөрчилж болно.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

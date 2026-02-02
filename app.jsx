const { useMemo, useState } = React;

const createHearts = (count = 12) =>
  Array.from({ length: count }, (_, index) => ({
    id: `heart-${index}`,
    left: Math.floor(Math.random() * 92) + 4,
    delay: Math.random() * 6,
    size: Math.floor(Math.random() * 18) + 16,
    opacity: Math.random() * 0.35 + 0.45,
  }));

const App = () => {
  const [accepted, setAccepted] = useState(false);
  const [loveMeter, setLoveMeter] = useState(12);

  const hearts = useMemo(() => createHearts(14), []);

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
            <h1>Чи миний Валентайн болох уу?</h1>
            <p className="subtitle">Зүгээр л “тийм” гэж хэлээрэй.</p>
          </div>
        </header>

        <div className={`sections ${accepted ? "is-grid" : "is-single"}`}>
          <div className="section">
            <p className="section-title">Тийм гэж хэлээрэй</p>
            <div className="playground">
              <button
                className="btn yes"
                type="button"
                disabled={accepted}
                onClick={() => setAccepted(true)}
              >
                Yes
              </button>
              <button
                className="btn no"
                type="button"
                disabled={accepted}
              >
                No
              </button>
            </div>
            <p className="result" role="status">
              {accepted ? "Yay! Болзъё, Валентайн 💖" : "Үгүй товчийг барьж чадах уу?"}
            </p>
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
                  <li>🚶‍♀️ Орой алхалт + смүүч 💋</li>
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
                <p className="section-title">Хөөрхөн фичерууд</p>
                <ul className="feature-list">
                  <li>Хөвөгч зүрхнүүд</li>
                  <li>Үгүй зугтах тусам love meter өснө</li>
                  <li>Тийм товч томорно</li>
                  <li>Зөөлөн пастел өнгө</li>
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

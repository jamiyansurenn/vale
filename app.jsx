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

  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [loveMeter, setLoveMeter] = useState(12);

  const hearts = useMemo(() => createHearts(14), []);

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

  useEffect(() => {
    const handleResize = () => moveNoButton();
    moveNoButton();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            <h1>Will you be my Valentine?</h1>
            <p className="subtitle">Just say yes, please.</p>
          </div>
        </header>

        <div className="sections">
          <div className="section">
            <p className="section-title">Say yes here</p>
            <div className="playground" ref={playgroundRef}>
              <button
                className="btn yes"
                type="button"
                style={{ transform: `scale(${yesScale})` }}
                disabled={accepted}
                onMouseEnter={() => growYes(0.03)}
                onClick={() => setAccepted(true)}
              >
                Yes
              </button>
              <button
                className="btn no"
                ref={noBtnRef}
                type="button"
                disabled={accepted}
                style={{ left: `${noPos.x}px`, top: `${noPos.y}px` }}
                onMouseEnter={() => tease(0.08)}
                onClick={() => tease(0.1)}
              >
                No
              </button>
            </div>
            <p className="result" role="status">
              {accepted ? "Yay! See you, Valentine 💖" : "Catch the No button if you can."}
            </p>
            {accepted && (
              <div className="celebrate">
                <span>🎉 You said yes!</span>
                <span>💌 Check the surprises on the right</span>
              </div>
            )}
            {accepted && (
              <div className="yes-plan">
                <p className="plan-title">What happens next</p>
                <ul className="plan-list">
                  <li>📞 I call you and say: “See you at 6?”</li>
                  <li>🌹 I bring flowers + a little gift</li>
                  <li>🍰 We grab sweets and take cute photos</li>
                  <li>🚶‍♀️ We end with a night walk and a smooch</li>
                </ul>
                <div className="smooch" aria-label="smooch">
                  Mua 💋
                </div>
              </div>
            )}
          </div>

          {accepted ? (
            <>
              <div className="section reveal">
                <p className="section-title">Cute features</p>
                <ul className="feature-list">
                  <li>Floating hearts background</li>
                  <li>Love meter rises when No runs</li>
                  <li>Yes button grows with each try</li>
                  <li>Soft gradient, pastel theme</li>
                </ul>
                <div className="meter">
                  <div className="meter-label">Love meter</div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: `${loveMeter}%` }} />
                  </div>
                </div>
              </div>

              <div className="section reveal">
                <p className="section-title">Reasons to say yes</p>
                <div className="chips">
                  <span>✨ Cute date</span>
                  <span>🍓 Sweet treats</span>
                  <span>🎶 Cozy playlist</span>
                  <span>📸 Lovely photos</span>
                  <span>🫶 Lots of hugs</span>
                  <span>🌙 Night walk</span>
                </div>
                <p className="note">
                  You can customize these lines for your crush.
                </p>
              </div>
            </>
          ) : (
            <div className="section tease">
              <p className="section-title">Secret area</p>
              <p className="note">
                Say yes to unlock cute features and reasons.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

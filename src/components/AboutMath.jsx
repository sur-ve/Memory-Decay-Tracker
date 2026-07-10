export default function AboutMath() {
  return (
    <div className="app-panel">
      <div className="about-eyebrow">How it works</div>
      <div className="about-title-row">
        <h2 className="about-title">The forgetting curve</h2>
        <a
          href="https://en.wikipedia.org/wiki/Forgetting_curve"
          target="_blank"
          rel="noopener noreferrer"
          className="about-wiki-link"
          title="Forgetting curve — Wikipedia"
        >
          <img
            src="https://en.wikipedia.org/favicon.ico"
            alt="Wikipedia"
            className="about-wiki-icon"
          />
        </a>
      </div>
      <p className="about-lead">
        Retention is modelled with an exponential decay function — the same shape Ebbinghaus observed
        in 1885. Memory fades fast at first, then levels off.
      </p>

      <div className="about-formula-block">
        <div className="about-formula-text">
          R = e<sup>−t / (S·30 + 1)</sup>
        </div>
        <div className="about-formula-legend">
          <div className="about-legend-row">
            <span className="about-legend-key">R</span> retention (0 – 1)
          </div>
          <div className="about-legend-row">
            <span className="about-legend-key">t</span> days since last practice
          </div>
          <div className="about-legend-row">
            <span className="about-legend-key">S</span> memory strength (0 – 1)
          </div>
        </div>
      </div>

      <hr className="about-divider" />

      <div className="about-facts">
        <div className="about-fact">
          <div className="about-fact-title">Why exponential?</div>
          <p className="about-fact-body">
            Forgetting is fastest right after learning and slows over time — exponential decay matches
            this shape.
          </p>
        </div>
        <div className="about-fact">
          <div className="about-fact-title">What is the learning path?</div>
          <p className="about-fact-body">
            Your actual history: retention decays between sessions, then jumps to 100% each time you
            practice.
          </p>
        </div>
      </div>
    </div>
  );
}

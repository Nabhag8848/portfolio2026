import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sabbatical() {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    if (lightbox) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div className="blog-container">
      <Link to="/" className="blog-back-link">
        ← Back
      </Link>
      <h1 className="blog-header">Sabbatical</h1>
      <p className="blog-paragraph">
        After wrapping up my last role in May, I decided to take a genuine break
        from work — something I'd been putting off in the name of momentum. The
        idea was simple: rest, reset, and return with clarity. What I didn't
        expect was for that break to turn into one of the most important periods
        of personal and professional growth I've experienced.
      </p>

      <section className="blog-section">
        <h3 className="section-header">When Rest Became a Wake-Up Call</h3>
        <p className="blog-paragraph">
          Shortly after stepping away from work, I started noticing things I'd
          been brushing aside for months:
        </p>
        <ul className="blog-list">
          <li>I was tired all the time.</li>
          <li>I struggled to focus.</li>
          <li>My memory felt unreliable.</li>
          <li>Even my tongue felt sticky.</li>
        </ul>
        <p className="blog-paragraph">
          Hoping it was just burnout, I tried interviewing again — but something
          was off. I wasn't cognitively there.
        </p>
        <p className="blog-paragraph">
          A few tests later, in late August, I finally understood why:
        </p>
        <p className="blog-paragraph">
          My Vitamin D3 level was 6.28 ng/mL, which is severely low, and my
          Vitamin B12 was also significantly deficient. Those vague symptoms
          weren't just stress — they were my body signaling a deeper imbalance.
        </p>
        <div className="blog-image-grid">
          <figure
            className="blog-image-card"
            onClick={() =>
              setLightbox({
                src: "/d3.jpeg",
                caption: "Vitamin D3",
                alt: "Vitamin D3 lab result",
              })
            }
          >
            <img src="/d3.jpeg" alt="Vitamin D3 lab result" />
            <figcaption>Vitamin D3</figcaption>
          </figure>
          <figure
            className="blog-image-card"
            onClick={() =>
              setLightbox({
                src: "/b12.jpeg",
                caption: "Vitamin B12",
                alt: "Vitamin B12 lab result",
              })
            }
          >
            <img src="/b12.jpeg" alt="Vitamin B12 lab result" />
            <figcaption>Vitamin B12</figcaption>
          </figure>
        </div>
      </section>

      {lightbox && (
        <div
          className="blog-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.caption} - expanded view`}
          onClick={() => setLightbox(null)}
        >
          <div
            className="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="blog-modal-close"
              onClick={() => setLightbox(null)}
            >
              Close
            </button>
            <img src={lightbox.src} alt={lightbox.alt} />
            <footer>{lightbox.caption}</footer>
          </div>
        </div>
      )}

      <section className="blog-section">
        <h3 className="section-header">
          Rebuilding Slowly: Health First, Learning Next
        </h3>
        <p className="blog-paragraph">
          Once I began my treatment protocol, I made conscious and simple
          changes:
        </p>
        <ul className="blog-list">
          <li>
            I started running every day, even if just for a short while
          </li>
          <li>
            I spent 20 minutes in sunlight, three times a day, to naturally
            boost Vitamin D
          </li>
          <li>I prioritized rest without guilt</li>
        </ul>
        <p className="blog-paragraph">
          Instead of pushing myself back into work, I used the break to heal —
          and to learn.
        </p>
        <p className="blog-paragraph">
          I filled long-standing knowledge gaps thoughtfully, returning to core
          web topics through platforms like{" "}
          <a
            className="green-link"
            href="https://web.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            web.dev
          </a>{" "}
          (
          <a
            className="green-link"
            href="https://github.com/Nabhag8848/web.dev/tree/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            reference
          </a>
          ). As my memory was unreliable and I wasn't able to study really deep
          technical topics, I focused on things I'd always wanted to understand
          better.
        </p>
        <p className="blog-paragraph">
          I also documented parts of my journey as I started feeling better in
          my{" "}
          <a
            className="green-link"
            href="https://github.com/Nabhag8848/goals/wiki"
            target="_blank"
            rel="noopener noreferrer"
          >
            goals wiki
          </a>
          .
        </p>
        <p className="blog-paragraph">
          In parallel, I kept coding to stay in flow. Two highlights stand out:
        </p>
        <p className="blog-paragraph">
          I built a Chrome extension for TwentyCRM that scrapes lead data from
          LinkedIn and directly upserts it into the CRM — saving manual entry
          and making the process seamless. (
          <a
            className="green-link"
            href="https://github.com/twentyhq/twenty/pull/15521"
            target="_blank"
            rel="noopener noreferrer"
          >
            reference
          </a>
          )
        </p>
        <p className="blog-paragraph">
          I also built LYO, a virtual fitting room that lets you try outfits
          before you buy, right in your browser. It works as a browser extension
          for Myntra, allowing users to upload their photo once and see how
          clothes look on them instantly. The extension generates multiple
          avatars from a single photo and overlays clothing items from Myntra,
          creating a seamless virtual try-on experience that helps shoppers make
          confident purchasing decisions. (
          <a
            className="green-link"
            href="https://lyo.fashion"
            target="_blank"
            rel="noopener noreferrer"
          >
            reference
          </a>
          ) — check out a quick live demo below.
        </p>
        <div className="blog-tweet-container">
          <iframe
            src="https://platform.twitter.com/embed/Tweet.html?id=2008835655355551829&theme=dark&dnt=true"
            width="550"
            height="800"
            frameBorder="0"
            scrolling="no"
            allow="encrypted-media"
            title="Twitter Tweet"
          />
        </div>
      </section>

      <section className="blog-section">
        <h3 className="section-header">What This Time Gave Me</h3>
        <p className="blog-paragraph">
          This wasn't just a break. It was a reset — physically, mentally, and
          technically.
        </p>
        <ul className="blog-list">
          <li>
            I learned that energy and clarity start with health
          </li>
          <li>
            I rediscovered the joy of learning without pressure
          </li>
          <li>
            I realized that pausing is not the opposite of progress — sometimes,
            it's how you find new direction
          </li>
        </ul>
        <p className="blog-paragraph">
          The time I took off didn't set me back. It gave me space to grow.
        </p>
      </section>

      <section className="blog-section">
        <h3 className="section-header">What's Next</h3>
        <p className="blog-paragraph">
          Now that my energy is returning and my routine feels grounded, I'm
          excited to explore new opportunities again.
        </p>
        <p className="blog-paragraph">
          If you're building something meaningful and value ownership, clarity,
          and thoughtful engineering — I'd love to talk.
        </p>
      </section>
    </div>
  );
}

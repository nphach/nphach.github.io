import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import "./App.css";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const colorize = (el: HTMLDivElement) => {
    el.style.backgroundColor = "black";

    window.setTimeout(() => {
      el.style.backgroundColor = "transparent";
    }, 300);
  };

  const getBlocks = () => {
    const blockSize = windowWidth * 0.05;
    const blockCount = Math.ceil(window.innerHeight / blockSize);

    return Array.from({ length: blockCount }, (_, index) => (
      <div
        key={index}
        className="block"
        onMouseEnter={(e) => colorize(e.currentTarget)}
      />
    ));
  };

  return (
    <main className="appContainer">
      <div className="deviceLayer">
        <div className="device">
          <img
            className="deviceBase"
            src="/assets/base/base.svg"
            alt="Tamagotchi base"
          />

          <div className="content">
            <p>refresh in progress</p>
            <div className="buttonRow">
              <Button asChild variant="outline">
                <a
                  href="https://github.com/nphach/"
                  target="_blank"
                  rel="noreferrer"
                >
                  github
                </a>
              </Button>

              <Button asChild variant="outline">
                <a
                  href="https://www.linkedin.com/in/nphach/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin
                </a>
              </Button>

              <Button asChild variant="outline">
                <a href="mailto:nikkiphach@gmail.com">email</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        {Array.from({ length: 20 }, (_, index) => (
          <div key={index} className="column">
            {getBlocks()}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

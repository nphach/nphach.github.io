import Portrait from '../assets/me.png';
import { useRef, useEffect } from 'react';

export default function Header() {
  const container = useRef();
  const img = useRef();

  useEffect(() => {
    const manageMouseMove = (event) => {
      const { clientX, clientY } = event
      const containerPosition = container.current.getBoundingClientRect();
      const x = clientX - containerPosition.x
      const y = clientY - containerPosition.y 
      img.current.style.top = y + "px";
      img.current.style.left = x + "px";
      draw(x, y)
    }

    const draw = (x, y) => {
      const trail = document.createElement("img");
      trail.src = Portrait;
      trail.classList.add(
        'absolute', 'h-[500px]', 'w-auto', 'transform', '-translate-x-2/4', '-translate-y-2/4', 'z-[1]', 'opacity-65'
      );
      trail.style.top = y + "px";
      trail.style.left = x + "px";
      container.current.append(trail);

      if (container.current.childNodes.length > 60) {
        erase();
      } else {
        setTimeout(() => {
          erase();
        }, 3000);
      }
    }

    const erase = () => {
      container.current.removeChild(container.current.childNodes[1]);
    }

    document.addEventListener('mousemove', manageMouseMove);

    return () => {
      document.removeEventListener('mousemove', manageMouseMove);
    }
  }, []);

  return (
    <section id="home" className="justify-content-center align-items-center h-screen w-screen flex">
      <div ref={container} className="h-full w-full relative overflow-hidden bg-[#000000]">
      <img ref={img} src={Portrait} alt="me" className="h-[500px] w-auto absolute z-[2] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4" draggable="false" />
        <div className="absolute inset-0 flex justify-center items-center z-[4]">
        </div>
      </div>
    </section>
  )
}
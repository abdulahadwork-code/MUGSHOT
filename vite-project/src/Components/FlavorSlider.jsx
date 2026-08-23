import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Slider = ({ menu }) => {
  const sliderRef = useRef();

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;

    if (!isTablet) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1500}px`,
          scrub: true,
          pin: true,
        },
      });

      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1500}px`,
        ease: "power1.inOut",
      });
    }

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
      },
    });

    titleTl
      .to(".first-text-split", { xPercent: -30, ease: "power1.inOut" })
      .to(".flavor-text-scroll", { xPercent: -22, ease: "power1.inOut" }, "<")
      .to(".second-text-split", { xPercent: -10, ease: "power1.inOut" }, "<");
  });

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {menu.map((flavor) => (
          <div
            key={flavor._id}
            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
          >
            <img src={`/images/${flavor.color}-bg.svg`} alt="" className="absolute bottom-0" />
            <img src={`/images/${flavor.color}-drink.webp`} alt="" className="drinks" />
            <img src={`/images/${flavor.color}-elements.webp`} alt="" className="elements" />
            <h1>{flavor.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlavorSlider = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  if (menu.length === 0) return <div className="h-80" />;

  return <Slider menu={menu} />;
};

export default FlavorSlider;
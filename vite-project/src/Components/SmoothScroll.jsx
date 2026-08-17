import { useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Make sure an old smoother does not remain active
    const existingSmoother = ScrollSmoother.get();

    if (existingSmoother) {
      existingSmoother.kill();
    }

    // Create ONE ScrollSmoother instance
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // Refresh ScrollTrigger after everything is rendered
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      if (smoother) {
        smoother.kill();
      }

      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
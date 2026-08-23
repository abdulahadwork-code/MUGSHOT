import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

const HeroSection = () => {

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });


  useGSAP(() => {

    // ==========================================
    // HERO INTRO ANIMATION
    // ==========================================

    const introTimeline = gsap.timeline({
      delay: 0.3,
    });


    introTimeline
      .to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      })

      .to(
        ".hero-text-scroll",
        {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.out",
        },
        "-=0.3"
      )

      .from(
        ".hero-title",
        {
          y: 80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "1% top",
        end: "bottom top",
        scrub: true,
      },
    });


    heroTimeline.to(".hero-container", {
      rotate: 7,
      scale: 0.9,
      yPercent: 30,
      ease: "power1.inOut",
    });

    return () => {

      introTimeline.kill();

      heroTimeline.kill();

    };

  });


  return (

    <section className="bg-main-bg">

      <div className="hero-container relative overflow-hidden">

        {isTablet ? (

          <>
            {isMobile && (
              <img
                src="/images/hero-bg.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <img
              src="/images/hero-img.png"
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto"
            />
          </>

        ) : (

          <video
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to top, rgba(34,33,35,0.55) 0%, rgba(34,33,35,0.28) 40%, rgba(34,33,35,0) 70%)",
          }}
        />


        <div
          className="
            hero-content
            relative
            z-10
            opacity-0
          "
        >


          <div
            className="
              relative
              z-30
              overflow-visible
            "
          >

            <h1
              className="
                hero-title
                relative
                z-30
              "
            >
              Freaking Delicious
            </h1>

          </div>

          <div
            className="
              hero-text-scroll
              relative
              z-20
            "
            style={{
              clipPath:
                "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            }}
          >

            <div className="hero-subtitle">

              <h1>
                Arabica + Caffeine
              </h1>

            </div>

          </div>


          <h2
            className="
              relative
              z-20
            "
          >
            Live life to the fullest with MUGSHOT:
            shatter sleepy mornings and embrace your inner
            barista with every deliciously smooth sip.
          </h2>


          <div
            className="
              hero-button
              relative
              z-20
            "
          >

            <p>
              Sip a MUGSHOT
            </p>

          </div>


        </div>

      </div>

    </section>

  );
};

export default HeroSection;
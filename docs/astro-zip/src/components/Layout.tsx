import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate elements that fade in on scroll
      gsap.utils.toArray('.fade-in-scroll').forEach((element: unknown) => {
        gsap.fromTo(element as Element, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: element as Element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate elements that slide in from left
      gsap.utils.toArray('.slide-in-left').forEach((element: unknown) => {
        gsap.fromTo(element as Element,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: element as Element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate elements that slide in from right
      gsap.utils.toArray('.slide-in-right').forEach((element: unknown) => {
        gsap.fromTo(element as Element,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: element as Element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, layoutRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={layoutRef} className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout;

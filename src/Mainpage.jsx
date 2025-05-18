import React, { useEffect } from 'react';
import './Mainpage.css'; // Optional: for styling
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger once
    threshold: 0.1    // Trigger when 10% of the element is in view
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
};

const MainPage = () => {
  return (
    <div className="main-page">
      <AnimatedSection>
        <header className="hero-section">
          <h1>Welcome to Mune!</h1>
          <p>The revolutionary way to order and enjoy your food.</p>
          {/* You can add a call to action button here, e.g., <button>Learn More</button> */}
        </header>
      </AnimatedSection>

      <AnimatedSection>
        <section className="product-introduction">
          <h2>Discover Mune</h2>
          <p>
            Mune simplifies your dining experience. Scan a QR code at your table,
            browse the digital menu, place your order, and pay – all from your smartphone.
            No more waiting for a server or handling physical menus.
          </p>
          {/* You can add more details, features, or images here */}
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="about-us">
          <h2>About Us</h2>
          <p>
            We are a passionate team dedicated to transforming the restaurant industry
            through innovative technology. Our mission is to make dining out more
            convenient, efficient, and enjoyable for everyone.
          </p>
          {/* You can add more details about your team, company history, or values here */}
        </section>
      </AnimatedSection>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Mune. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;

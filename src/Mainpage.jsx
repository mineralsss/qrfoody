import React, { useEffect } from 'react';
import './Mainpage.css'; // Optional: for styling
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom';

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

const featureVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
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

const Feature = ({ icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div 
      className="feature-item"
      ref={ref}
      custom={index} 
      initial="hidden"
      animate={controls}
      variants={featureVariants}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

const MainPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/landing');
  };

  return (
    <div className="main-page">
      <AnimatedSection>
        <header className="hero-section">
          <h1>Chào mừng đến với <span className="highlight">Mune!</span></h1>
          <p className="hero-subtitle">Giải pháp đặt món thông minh cho nhà hàng hiện đại</p>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowForwardIcon />}
            onClick={handleGetStarted}
            className="hero-button"
          >
            Trải Nghiệm Ngay
          </Button>
          <div className="hero-image"></div>
        </header>
      </AnimatedSection>

      <AnimatedSection>
        <section className="product-introduction">
          <h2>Khám Phá <span className="highlight">Mune</span></h2>
          <p className="section-description">
            Mune đơn giản hóa trải nghiệm ăn uống của bạn. Quét mã QR tại bàn,
            duyệt thực đơn kỹ thuật số, đặt món và thanh toán – tất cả từ điện thoại thông minh.
            Không cần đợi phục vụ hay chạm vào thực đơn giấy.
          </p>
          
          <div className="features-container">
            <Feature 
              icon={<RestaurantIcon fontSize="large" />}
              title="Đặt Món Dễ Dàng"
              description="Duyệt thực đơn và đặt món chỉ với vài thao tác chạm"
              index={0}
            />
            <Feature 
              icon={<PhoneAndroidIcon fontSize="large" />}
              title="Trải Nghiệm Di Động"
              description="Mã QR dễ dàng giúp bạn truy cập thực đơn trên thiết bị di động"
              index={1}
            />
            <Feature 
              icon={<CreditCardIcon fontSize="large" />}
              title="Thanh Toán Nhanh Chóng"
              description="Thanh toán dễ dàng, hóa đơn rõ ràng và tiết kiệm thời gian"
              index={2}
            />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="testimonial-section">
          <div className="testimonial-content">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              Sử dụng Mune đã giúp chúng tôi tăng doanh thu 30% và cải thiện trải nghiệm khách hàng. Đây là công cụ không thể thiếu cho nhà hàng hiện đại.
            </p>
            <p className="testimonial-author">- Nguyễn Văn A, Chủ Nhà Hàng Phố Đông</p>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="about-us">
          <h2>Về Chúng Tôi</h2>
          <p className="section-description">
            Chúng tôi là một đội ngũ đam mê công nghệ và ẩm thực, 
            với sứ mệnh chuyển đổi ngành công nghiệp nhà hàng thông qua 
            công nghệ sáng tạo. Mục tiêu của chúng tôi là biến việc 
            ăn uống bên ngoài trở nên thuận tiện, hiệu quả và 
            thú vị hơn cho tất cả mọi người.
          </p>
          <Button 
            variant="outlined" 
            size="large"
            className="about-button"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            Liên Hệ Với Chúng Tôi
          </Button>
        </section>
      </AnimatedSection>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Mune. Đã đăng ký bản quyền.</p>
      </footer>
    </div>
  );
};

export default MainPage;

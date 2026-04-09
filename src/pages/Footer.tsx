// Footer.tsx
import React, { useState } from 'react';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaBlog,
  FaImages,
  FaCalendarCheck,
  FaCreditCard,
  FaFileContract,
  FaMapMarkerAlt
} from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Here you would typically send the email to your backend
      console.log('Subscribing email:', email);
      
      setSnackbarMessage('Successfully subscribed to newsletter!');
      setSnackbarOpen(true);
      setEmail('');
      
    } catch (error) {
      setSnackbarMessage('Failed to subscribe. Please try again.');
      setSnackbarOpen(true);
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

 

  const footerLinks = {
    about: [
      { text: 'Blog', href: '', icon: <FaBlog size={14} /> },
      { text: 'Gallery', href: '/gallery', icon: <FaImages size={14} /> },
      { text: 'Tours', href: '/trips', icon: <FaMapMarkerAlt style={{ marginRight: '4px' }} /> },
    ],
    support: [
      { text: 'Contact us', href: '/contact', icon: <FaEnvelope size={14} /> },
      { text: 'Whatsapp', href: 'https://wa.me/1234567890', icon: <FaWhatsapp size={14} /> },
      { text: 'Call Center', href: 'tel:+1234567890', icon: <FaPhone size={14} /> }
    ],
    account: [
      { text: 'Booking', href: '/bookingview', icon: <FaCalendarCheck size={14} /> },
      { text: 'Payments', href: '/payments', icon: <FaCreditCard size={14} /> },
      { text: 'Terms & Conditions', href: '/terms', icon: <FaFileContract size={14} /> }
    ]
  };

   const handlelinks = (link: string) =>{
    
    navigate(link,{
        replace: true
    })

  }

  const socialLinks = [
    { icon: <FaInstagram />, href: 'https://instagram.com/travauni', label: 'Instagram' },
    { icon: <FaFacebookF />, href: 'https://facebook.com/travauni', label: 'Facebook' },
    { icon: <FaTwitter />, href: 'https://twitter.com/travauni', label: 'Twitter' },
    { icon: <FaLinkedinIn />, href: 'https://linkedin.com/company/travauni', label: 'LinkedIn' }
  ];

  return (
    <div id='footer'>
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-grid">
            {/* About Us Column */}
            <div className="footer-column">
              <h3 className="footer-heading">About Us</h3>
              <div className="footer-links">
                {footerLinks.about.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="footer-link"
                  >
                    <span className="footer-link-icon">{link.icon}</span>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Support Column */}
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <div className="footer-links">
                {footerLinks.support.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="footer-link"
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <span className="footer-link-icon">{link.icon}</span>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Account Column */}
            <div className="footer-column">
              <h3 className="footer-heading">Account</h3>
              <div className="footer-links">
                {footerLinks.account.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    onClick={()=>handlelinks(link.href)}
                    className="footer-link"
                  >
                    <span className="footer-link-icon">{link.icon}</span>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="footer-column">
              <h3 className="footer-heading">Newsletter</h3>
              <p className="footer-description">
                Don't miss out on the exciting world of travel – subscribe now and embark on a journey of discovery with us.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="newsletter-input-group">
                  <div className="email-input-wrapper">
                    <FaEnvelope className="email-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="email-input"
                      required
                    />
                  </div>
                  <button type="submit" className="subscribe-button">
                    <FaPaperPlane />
                  </button>
                </div>
              </form>

              {/* Social Links */}
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p className="copyright">
              © 2026 Travauni, All Rights Reserved
            </p>
            
            <div className="footer-bottom-links">
              <a href="/privacy" className="bottom-link">
                Privacy Policy
              </a>
              <a href="/terms" className="bottom-link">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Success/Error Notification */}
      {snackbarOpen && (
        <div className={`snackbar ${snackbarMessage.includes('Failed') ? 'error' : 'success'}`}>
          <div className="snackbar-content">
            <span>{snackbarMessage}</span>
            <button onClick={handleSnackbarClose} className="snackbar-close">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
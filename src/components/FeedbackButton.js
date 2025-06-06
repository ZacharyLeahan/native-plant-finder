import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FeedbackButton.css';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001');

const FEEDBACK_ENDPOINT = `${API_BASE_URL}/api/feedback`;

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default function FeedbackButton({ hasSearched, zipCode, favoritesActive }) {
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [removed, setRemoved] = useState(false);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  // Show button after search, scroll, and delay
  useEffect(() => {
    if (!hasSearched || removed) return;

    let hasScrolled = window.scrollY > 100; // check immediately
    let timeout;

    const onScroll = () => {
      if (window.scrollY > 100) {
        hasScrolled = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    
    // Show button after 8 seconds if user has scrolled
    timeout = setTimeout(() => {
      if (hasScrolled) {
        setShowButton(true);
      }
    }, 8000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, [hasSearched, removed]);

  useEffect(() => {
    if (!showModal || !isMobile()) return;
    const textarea = textareaRef.current;
    const modal = modalRef.current;
    if (!textarea || !modal) return;
    const handleFocus = () => {
      setTimeout(() => {
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350); // Wait for keyboard animation
    };
    textarea.addEventListener('focus', handleFocus);
    return () => {
      textarea.removeEventListener('focus', handleFocus);
    };
  }, [showModal]);

  // Remove button handler
  const handleRemove = (e) => {
    e.stopPropagation();
    setRemoved(true);
  };

  // Modal submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      console.log('Feedback submitted with zip code:', zipCode || 'No zip code provided');
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          message,
          userAgent: navigator.userAgent,
          isMobile: isMobile(),
          zipCode: zipCode || '',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setMessage('');
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Modal close
  const handleClose = () => {
    setShowModal(false);
    setMessage('');
    setSuccess(false);
  };

  return (
    <>
      <AnimatePresence>
        {showButton && !removed && !favoritesActive && (
          <motion.button
            className="feedback-fab"
            title="Send Feedback"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            whileHover={{ scale: 1.1, boxShadow: '0 6px 24px rgba(76,175,80,0.25)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setShowModal(true)}
          >
            <span role="img" aria-label="Feedback">💬</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={`feedback-modal-bg${isMobile() ? ' mobile' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`feedback-modal${isMobile() ? ' mobile' : ''}`}
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              ref={modalRef}
            >
              <button className="feedback-modal-close" onClick={handleClose} aria-label="Close">&times;</button>
              <form onSubmit={handleSubmit}>
                <h2>How'd we do?</h2>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us anything. If you leave your email we will reply."
                  rows={isMobile() ? 6 : 4}
                  disabled={submitting || success}
                  required
                  autoFocus
                />
                <div className="feedback-modal-actions">
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="feedback-modal-submit"
                  >
                    {submitting ? 'Sending...' : success ? 'Thank you!' : 'Share Feedback'}
                  </button>
                  <button
                    type="button"
                    className="feedback-modal-remove"
                    onClick={handleRemove}
                    tabIndex={-1}
                  >
                    Dismiss
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 
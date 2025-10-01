import React, { useState } from 'react';
import styles from './Company.module.scss';

/**
 * Company Contact page component
 */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally integrate with your API to send the contact form
    console.log('Contact form submitted:', formData);

    // Simulate a successful submission
    setFormStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <>
      <header className={styles['page-header']}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Reach out with your questions, feedback, or inquiries and our
          team will get back to you soon.
        </p>
      </header>

      {/* Two-column layout with equal 50% width sections */}
      <div className={styles['two-col-grid']}>
        <section className={styles.section}>
          <h2>Get in Touch</h2>

          <div className={styles.card}>
            <h3>Our Office</h3>
            <address>
              <p>Keizergracht 123</p>
              <p>1015 CW Amsterdam</p>
              <p>The Netherlands</p>
            </address>
          </div>

          <div className={styles.card + ' ' + styles['mt-32']}>
            <h3>Contact Information</h3>
            <p>
              <strong>Phone:</strong> +31 20 123 4567
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:info@huishelder.nl" style={{ color: '#3A4F41' }}>
                info@huishelder.nl
              </a>
            </p>
            <p>
              <strong>Working Hours:</strong> Monday-Friday, 9:00-17:00
            </p>
          </div>

          <div className={styles.card + ' ' + styles['mt-32']}>
            <h3>Follow Us</h3>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <a href="#" aria-label="LinkedIn" style={{ color: '#3A4F41' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" style={{ color: '#3A4F41' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" style={{ color: '#3A4F41' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" style={{ color: '#3A4F41' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Send us a Message</h2>

          {formStatus === 'success' && (
            <div className={styles['message-box'] + ' ' + styles.success}>
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          )}

          {formStatus === 'error' && (
            <div className={styles['message-box'] + ' ' + styles.error}>
              <p>There was a problem sending your message. Please try again.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['form-group']}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Please select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Property Listing">Property Listing</option>
                <option value="Buying Process">Buying Process</option>
                <option value="Selling Process">Selling Process</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Send Message
            </button>
          </form>
        </section>
      </div>

      <section className={styles.section + ' ' + styles['mt-32']}>
        <h2>Visit Our Office</h2>
        <div
          style={{
            height: '400px',
            backgroundColor: '#EAE6E1',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '24px',
          }}
        >
          <p>Map will be displayed here</p>
          {/* 
            Map component would go here
            For production, you would integrate Google Maps, Mapbox, etc.
          */}
        </div>
      </section>
    </>
  );
};

export default Contact;

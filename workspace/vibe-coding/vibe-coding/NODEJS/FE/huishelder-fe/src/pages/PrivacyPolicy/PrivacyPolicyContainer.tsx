import React from 'react';
import styles from './PrivacyPolicy.module.scss';

const PrivacyPolicyContainer: React.FC = () => {
  return (
    <>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.lastUpdated}>Last updated: May 1, 2025</div>

      <section className={styles.section}>
        <h2>Introduction</h2>
        <p>
          At HuisHelder, we respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we look after your personal data when you
          visit our website and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section className={styles.section}>
        <h2>The Data We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which
          we have grouped together as follows:
        </p>
        <ul className={styles.bulletList}>
          <li>
            <span className={styles.bulletHeading}>Identity Data</span> includes first name, last
            name, username or similar identifier.
          </li>
          <li>
            <span className={styles.bulletHeading}>Contact Data</span> includes billing address,
            email address and telephone numbers.
          </li>
          <li>
            <span className={styles.bulletHeading}>Property Data</span> includes information about
            real estate properties you list or search for.
          </li>
          <li>
            <span className={styles.bulletHeading}>Technical Data</span> includes internet protocol
            (IP) address, your login data, browser type and version, time zone setting and location,
            browser plug-in types and versions, operating system and platform, and other technology
            on the devices you use to access this website.
          </li>
          <li>
            <span className={styles.bulletHeading}>Usage Data</span> includes information about how
            you use our website, products and services.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use
          your personal data in the following circumstances:
        </p>
        <ul className={styles.bulletList}>
          <li>To register you as a new customer.</li>
          <li>To process and deliver our services including managing payments.</li>
          <li>To manage our relationship with you.</li>
          <li>
            To personalize your experience and deliver relevant content and property listings.
          </li>
          <li>To improve our website, products/services, marketing, and customer relationships.</li>
          <li>To recommend properties that may be of interest to you.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from
          being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In
          addition, we limit access to your personal data to those employees, agents, contractors
          and other third parties who have a business need to know.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your Legal Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to
          your personal data, including the right to:
        </p>
        <ul className={styles.bulletList}>
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please
          contact us:
        </p>
        <div className={styles.contactInfo}>
          <p>Email: privacy@huishelder.nl</p>
          <p>Phone: +31 (0) 20 123 4567</p>
          <p>Address: Prinsengracht 125, 1015 Amsterdam, Netherlands</p>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyContainer;

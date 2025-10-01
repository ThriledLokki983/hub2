import React from 'react';
import styles from './TermsOfService.module.scss';

const TermsOfServiceContainer: React.FC = () => {
  return (
    <>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.lastUpdated}>Last updated: May 1, 2025</div>

      <section className={styles.section}>
        <h2>Introduction</h2>
        <p>
          Welcome to HuisHelder. These terms and conditions outline the rules and regulations for
          the use of our website and services. By accessing this website, we assume you accept these
          terms and conditions in full. Do not continue to use HuisHelder if you do not accept all
          of the terms and conditions stated on this page.
        </p>
      </section>

      <section className={styles.section}>
        <h2>License to Use Website</h2>
        <p>
          Unless otherwise stated, HuisHelder and/or its licensors own the intellectual property
          rights for all material on the site. All intellectual property rights are reserved. You
          may view, use, and share content on our site for personal, non-commercial purposes subject
          to the restrictions outlined in these terms and conditions.
        </p>
      </section>

      <section className={styles.section}>
        <h2>User Accounts</h2>
        <p>
          When you create an account with us, you guarantee that the information you provide is
          accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete
          information may result in the immediate termination of your account on our service.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account and password,
          including but not limited to the restriction of access to your computer and/or account.
          You agree to accept responsibility for any and all activities or actions that occur under
          your account and/or password.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Real Estate Listings</h2>
        <p>
          All property information displayed on HuisHelder is believed to be accurate but is not
          guaranteed and should be independently verified. HuisHelder is not responsible for any
          inaccuracies in the information provided to us by property owners, agents, or other
          parties.
        </p>
        <p>When you list a property on our platform, you confirm that:</p>
        <ul className={styles.bulletList}>
          <li>You have the legal right to sell, rent, or otherwise market the property</li>
          <li>All information provided is accurate, complete, and not misleading</li>
          <li>You will promptly update any information that changes</li>
          <li>All images and content you upload do not infringe on any third-party rights</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>User Conduct and Prohibited Activities</h2>
        <p>
          You may not use our platform for any illegal, harmful, or exploitative purposes.
          Prohibited activities include but are not limited to:
        </p>
        <ul className={styles.bulletList}>
          <li>Posting fraudulent or misleading property listings</li>
          <li>Attempting to circumvent our fee structure</li>
          <li>Harassing other users</li>
          <li>Using automated systems to access or scrape data</li>
          <li>Uploading malicious code or content</li>
          <li>Impersonating others or creating false accounts</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Limitation of Liability</h2>
        <p>
          HuisHelder shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages, including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of or inability to
          access or use the service; (ii) any conduct or content of any third party on the service;
          (iii) any content obtained from the service; and (iv) unauthorized access, use, or
          alteration of your transmissions or content, whether based on warranty, contract, tort
          (including negligence), or any other legal theory, whether or not we have been informed of
          the possibility of such damage.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. If we make material changes to
          these terms, we will notify you through our website or by other means to provide you with
          the opportunity to review the changes before they become effective.
        </p>
        <p>
          Your continued use of our website after we publish or notify you of changes constitutes
          your acceptance of the revised terms and conditions.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us:</p>
        <div className={styles.contactInfo}>
          <p>Email: legal@huishelder.nl</p>
          <p>Phone: +31 (0) 20 123 4567</p>
          <p>Address: Prinsengracht 125, 1015 Amsterdam, Netherlands</p>
        </div>
      </section>
    </>
  );
};

export default TermsOfServiceContainer;

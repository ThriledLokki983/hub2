import React from 'react';
import styles from './Company.module.scss';

/**
 * Company About Us page component
 */
const About: React.FC = () => {
  return (
    <>
      <header className={styles['page-header']}>
        <h1>About HuisHelder</h1>
        <p>
          Connecting buyers and sellers through an elegant, user-friendly experience in the Dutch
          real estate market since 2020.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Our Story</h2>
        <p>
          HuisHelder began with a simple vision: to create a transparent, efficient, and enjoyable
          real estate experience for the Netherlands. Founded in 2020 by a team of real estate
          professionals and technology experts, we've grown to become one of the country's most
          trusted property platforms.
        </p>
        <p>
          Our name, "HuisHelder," combines the Dutch word for house ("huis") with "helder," meaning
          clear or transparent – reflecting our core mission to bring clarity to every step of your
          property journey.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          We strive to make property transactions transparent, efficient, and accessible for
          everyone. By combining cutting-edge technology with deep market expertise, we're
          transforming how the Dutch market approaches real estate.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Transparency</h3>
            <p>
              We believe in complete honesty throughout the buying and selling process, with clear
              information at every step.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Innovation</h3>
            <p>
              Our platform leverages the latest technology to simplify complex processes and create
              intuitive experiences.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Community</h3>
            <p>
              We're building connections between buyers, sellers, and communities across the
              Netherlands.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Our Team</h2>
        <p>
          Our diverse team brings together decades of experience in real estate, technology, and
          customer service. We're united by a passion for innovation and a commitment to excellence
          in everything we do.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Emma van der Berg</h3>
            <p>Co-Founder & CEO</p>
            <p>
              With 15 years of experience in Dutch real estate, Emma leads our vision and strategy.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Jan de Vries</h3>
            <p>Co-Founder & CTO</p>
            <p>
              Jan oversees our technology, bringing 12 years of software engineering experience.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Sophie Bakker</h3>
            <p>Chief Operating Officer</p>
            <p>
              Sophie ensures our day-to-day operations run smoothly with her extensive background in
              operations.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Our Values</h2>
        <ul className={styles.list}>
          <li>
            <strong>Transparency:</strong> We believe in honest, open communication in all
            transactions.
          </li>
          <li>
            <strong>Innovation:</strong> We continuously seek better ways to serve our clients.
          </li>
          <li>
            <strong>Expertise:</strong> We bring professional knowledge and insight to every
            interaction.
          </li>
          <li>
            <strong>Community:</strong> We're committed to strengthening the communities we serve.
          </li>
          <li>
            <strong>Sustainability:</strong> We promote environmentally conscious practices in real
            estate.
          </li>
        </ul>
      </section>
    </>
  );
};

export default About;

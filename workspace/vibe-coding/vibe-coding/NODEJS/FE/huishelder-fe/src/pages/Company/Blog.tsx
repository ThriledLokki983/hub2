import React, { useState } from 'react';
import styles from './Company.module.scss';

/**
 * Blog post interface
 */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

/**
 * Company Blog page component
 */
const Blog: React.FC = () => {
  // Sample blog posts - would typically come from an API
  const allPosts: BlogPost[] = [
    {
      id: 'blog-001',
      title: 'Top 10 Amsterdam Neighborhoods for Young Professionals',
      excerpt:
        'Discover the best areas in Amsterdam for career-focused individuals looking to balance work and lifestyle.',
      content: 'Full blog content would go here...',
      author: 'Emma Jansen',
      date: 'May 3, 2025',
      category: 'Neighborhoods',
      imageUrl: 'https://placekitten.com/800/450', // Placeholder image
    },
    {
      id: 'blog-002',
      title: 'How the New Housing Regulations Affect Dutch Buyers',
      excerpt:
        'An analysis of the latest policy changes and what they mean for prospective homeowners.',
      content: 'Full blog content would go here...',
      author: 'Thomas de Vries',
      date: 'April 27, 2025',
      category: 'Market Trends',
      imageUrl: 'https://placekitten.com/801/450', // Placeholder image
    },
    {
      id: 'blog-003',
      title: 'Sustainable Home Improvements That Increase Property Value',
      excerpt:
        "Eco-friendly renovations that not only help the planet but also boost your home's market value.",
      content: 'Full blog content would go here...',
      author: 'Lisa Bakker',
      date: 'April 18, 2025',
      category: 'Home Improvement',
      imageUrl: 'https://placekitten.com/802/450', // Placeholder image
    },
    {
      id: 'blog-004',
      title: 'Navigating Mortgage Options for First-time Buyers',
      excerpt:
        'A comprehensive guide to finding the right financing solution when purchasing your first home.',
      content: 'Full blog content would go here...',
      author: 'Jan Smit',
      date: 'April 10, 2025',
      category: 'Finance',
      imageUrl: 'https://placekitten.com/803/450', // Placeholder image
    },
    {
      id: 'blog-005',
      title: 'The Rise of Smart Homes in the Netherlands',
      excerpt:
        'How Dutch homeowners are embracing technology to make their properties more efficient and comfortable.',
      content: 'Full blog content would go here...',
      author: 'Sophie van den Berg',
      date: 'April 2, 2025',
      category: 'Technology',
      imageUrl: 'https://placekitten.com/804/450', // Placeholder image
    },
  ];

  // State for category filtering
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Get unique categories for the filter
  const categories = Array.from(new Set(allPosts.map(post => post.category)));

  // Filter posts based on selected category
  const displayedPosts = categoryFilter
    ? allPosts.filter(post => post.category === categoryFilter)
    : allPosts;

  return (
    <>
      <header className={styles['page-header']}>
        <h1>HuisHelder Blog</h1>
        <p>Insights, trends, and expert advice on the Dutch property market</p>
      </header>

      <section className={styles.section}>
        <h2>Featured Articles</h2>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Categories</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategoryFilter(null)}
              className={`${styles.button} ${categoryFilter === null ? '' : styles.secondary}`}
              style={{ padding: '8px 16px' }}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.button} ${categoryFilter === category ? '' : styles.secondary}`}
                style={{ padding: '8px 16px' }}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {displayedPosts.map(post => (
            <div key={post.id} className={styles.card} style={{ overflow: 'hidden' }}>
              <div
                style={{
                  height: '200px',
                  marginBottom: '16px',
                  marginLeft: '-24px',
                  marginRight: '-24px',
                  marginTop: '-24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: '#F4C77B',
                    color: '#3A4F41',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  {post.category}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', lineHeight: '1.3', marginBottom: '8px' }}>
                {post.title}
              </h3>

              <p
                style={{
                  color: '#6E7673',
                  fontSize: '14px',
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </p>

              <p style={{ marginBottom: '16px' }}>{post.excerpt}</p>

              <a
                href={`#/blog/${post.id}`}
                style={{
                  display: 'inline-block',
                  color: '#3A4F41',
                  fontWeight: '600',
                  textDecoration: 'none',
                  borderBottom: '2px solid #F4C77B',
                  paddingBottom: '2px',
                }}
              >
                Read Article
              </a>
            </div>
          ))}
        </div>

        {displayedPosts.length === 0 && (
          <div className={styles['message-box']}>
            <p>No articles found for this category. Please try another category.</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Stay Updated</h2>
        <p>
          Subscribe to our newsletter to receive the latest insights and trends in the Dutch real
          estate market. We send a curated selection of articles every two weeks.
        </p>

        <form className={styles.form} style={{ maxWidth: '600px', margin: '24px auto' }}>
          <div className={styles['form-row']}>
            <div className={styles['form-group']}>
              <label htmlFor="newsletter-email">Your Email Address</label>
              <input type="email" id="newsletter-email" placeholder="name@example.com" required />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className={styles.button}>
                Subscribe
              </button>
            </div>
          </div>

          <div
            style={{
              fontSize: '14px',
              color: '#6E7673',
              marginTop: '8px',
              textAlign: 'center',
            }}
          >
            By subscribing, you agree to receive marketing emails from HuisHelder. You can
            unsubscribe at any time.
          </div>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Most Popular Topics</h2>

        <div
          className={styles.grid}
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
        >
          {categories.map(category => (
            <div
              key={category}
              className={styles.card}
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => setCategoryFilter(category)}
            >
              <h3>{category}</h3>
              <p style={{ color: '#6E7673' }}>
                {allPosts.filter(post => post.category === category).length} Articles
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Blog;

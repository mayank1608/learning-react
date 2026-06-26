import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSitemap } from '../services/api';
import './Sitemap.css';

const FALLBACK_DATA = {
  pages: [
    { name: 'Home', path: '/', description: 'Main landing page with featured products' },
    { name: 'Login', path: '/login', description: 'User authentication page' },
    { name: 'Sitemap', path: '/sitemap', description: 'Complete site navigation map' },
  ],
  sections: [
    { name: 'Hero Banner', anchor: 'hero' },
    { name: 'Featured Products', anchor: 'featured' },
    { name: 'Categories', anchor: 'categories' },
    { name: 'Trending Products', anchor: 'trending' },
    { name: 'Newsletter', anchor: 'newsletter' },
    { name: 'Footer', anchor: 'footer' },
  ],
  api_endpoints: [
    { method: 'GET', path: '/api/v1/products', description: 'List products' },
    { method: 'GET', path: '/api/v1/categories', description: 'List categories' },
    { method: 'POST', path: '/api/v1/auth/login', description: 'User login' },
    { method: 'POST', path: '/api/v1/auth/register', description: 'User registration' },
    { method: 'GET', path: '/api/v1/cart', description: 'View cart' },
    { method: 'GET', path: '/api/v1/sitemap', description: 'Site map data' },
  ],
};

function Sitemap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSitemap()
      .then((response) => setData(response))
      .catch(() => setData(FALLBACK_DATA))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sitemap-page">
      <header className="sitemap-header">
        <Link to="/" className="sitemap-back">← Back to Home</Link>
        <h1>Site <span>Map</span></h1>
        <p>A complete overview of all pages, sections, and API endpoints available in the ShopEY e-commerce platform.</p>
      </header>

      <main className="sitemap-content">
        {loading && (
          <div className="sitemap-loading">
            <div className="sitemap-spinner" />
            <p>Loading sitemap...</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* Pages Section */}
            <section className="sitemap-section">
              <h2 className="sitemap-section-title">
                <span className="section-icon">📄</span> Pages
              </h2>
              <p className="sitemap-section-subtitle">All navigable pages in the application</p>
              <div className="sitemap-grid">
                {data.pages.map((page) => (
                  <Link to={page.path} key={page.path} className="sitemap-card">
                    <h3 className="sitemap-card-name">{page.name}</h3>
                    <span className="sitemap-card-path">{page.path}</span>
                    {page.description && (
                      <p className="sitemap-card-description">{page.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>

            {/* Home Sections */}
            <section className="sitemap-section">
              <h2 className="sitemap-section-title">
                <span className="section-icon">🏠</span> Home Sections
              </h2>
              <p className="sitemap-section-subtitle">Sections within the home page</p>
              <div className="sitemap-grid">
                {data.sections.map((section) => (
                  <Link to={`/#${section.anchor}`} key={section.anchor} className="sitemap-card">
                    <h3 className="sitemap-card-name">{section.name}</h3>
                    <span className="sitemap-card-path">#{section.anchor}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* API Endpoints */}
            <section className="sitemap-section">
              <h2 className="sitemap-section-title">
                <span className="section-icon">⚡</span> API Endpoints
              </h2>
              <p className="sitemap-section-subtitle">Available backend API routes</p>
              <div className="sitemap-grid">
                {data.api_endpoints.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="sitemap-api-card">
                    <div className="sitemap-api-method-row">
                      <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <span className="sitemap-api-path">{endpoint.path}</span>
                    </div>
                    {endpoint.description && (
                      <p className="sitemap-api-description">{endpoint.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Sitemap;

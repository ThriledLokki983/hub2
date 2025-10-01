import { ResumeData, WorkExperience, Education, Project, Skill } from '../data/resume';

// Helper function to format experience
const formatExperience = (experience: WorkExperience) => `
  <div class="resume-experience-item">
    <div class="resume-experience-header">
      <div class="resume-experience-title">
        <h3>${experience.position}</h3>
        <h4>${experience.company}</h4>
      </div>
      <div class="resume-experience-meta">
        <span class="resume-period">${experience.period}</span>
        <span class="resume-location">${experience.location}</span>
      </div>
    </div>
    <ul class="resume-experience-description">
      ${experience.description.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div class="resume-technologies">
      <strong>Technologies:</strong> ${experience.technologies.join(' • ')}
    </div>
  </div>
`;

// Helper function to format education
const formatEducation = (education: Education) => `
  <div class="resume-education-item">
    <div class="resume-education-header">
      <div class="resume-education-title">
        <h3>${education.degree}</h3>
        <h4>${education.institution}</h4>
      </div>
      <div class="resume-education-meta">
        <span class="resume-period">${education.period}</span>
        <span class="resume-location">${education.location}</span>
      </div>
    </div>
    ${education.details ? `
      <ul class="resume-education-details">
        ${education.details.map(detail => `<li>${detail}</li>`).join('')}
      </ul>
    ` : ''}
  </div>
`;

// Helper function to format projects
const formatProject = (project: Project) => `
  <div class="resume-project-item">
    <div class="resume-project-header">
      <h3>${project.name}</h3>
      <div class="resume-project-links">
        ${project.links.github ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} on GitHub">GitHub</a>` : ''}
        ${project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} live demo">Live Demo</a>` : ''}
      </div>
    </div>
    <p class="resume-project-description">${project.description}</p>
    <div class="resume-technologies">
      <strong>Technologies:</strong> ${project.technologies.join(' • ')}
    </div>
  </div>
`;

// Helper function to format skills
const formatSkills = (skill: Skill) => `
  <div class="resume-skill-category">
    <h3>${skill.category}</h3>
    <p>${skill.items.join(' • ')}</p>
  </div>
`;

// Main resume component
export const resumePage = (resumeData: ResumeData) => {
  const { personalInfo, summary, experience, education, projects, skills } = resumeData;
  
  return `
    <div class="resume-container">
      <!-- Resume Header -->
      <header class="resume-header">
        <div class="resume-header-content">
          <h1 class="resume-name">${personalInfo.name}</h1>
          <h2 class="resume-title">${personalInfo.title}</h2>
          
          <div class="resume-contact">
            <div class="resume-contact-group">
              <a href="mailto:${personalInfo.email}" class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                ${personalInfo.email}
              </a>
              <a href="tel:${personalInfo.phone}" class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                ${personalInfo.phone}
              </a>
              <span class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${personalInfo.location}
              </span>
            </div>
            
            <div class="resume-contact-group">
              <a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Portfolio
              </a>
              <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
              <a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="resume-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <!-- Download and Back buttons -->
        <div class="resume-actions">
          <button id="download-pdf" class="resume-btn resume-btn-primary" aria-label="Download resume as PDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </button>
          <a href="/" class="resume-btn resume-btn-secondary" aria-label="Back to home page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            Back to Home
          </a>
        </div>
      </header>

      <!-- Resume Content -->
      <div class="resume-content">
        <!-- Professional Summary -->
        <section class="resume-section">
          <h2 class="resume-section-title">Professional Summary</h2>
          <p class="resume-summary">${summary}</p>
        </section>

        <!-- Work Experience -->
        <section class="resume-section">
          <h2 class="resume-section-title">Work Experience</h2>
          <div class="resume-experience">
            ${experience.map(exp => formatExperience(exp)).join('')}
          </div>
        </section>

        <!-- Education -->
        <section class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          <div class="resume-education">
            ${education.map(edu => formatEducation(edu)).join('')}
          </div>
        </section>

        <!-- Projects -->
        <section class="resume-section">
          <h2 class="resume-section-title">Featured Projects</h2>
          <div class="resume-projects">
            ${projects.map(project => formatProject(project)).join('')}
          </div>
        </section>

        <!-- Skills -->
        <section class="resume-section">
          <h2 class="resume-section-title">Technical Skills</h2>
          <div class="resume-skills">
            ${skills.map(skill => formatSkills(skill)).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
};

// Resume data structure
export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    live?: string;
  };
}

export interface Skill {
  category: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
}

export const RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "Gideon Nimoh",
    title: "Full Stack Web Developer",
    email: "gideon.nimoh@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "https://gideonnimoh.dev",
    linkedin: "https://linkedin.com/in/gideonnimoh",
    github: "https://github.com/gideonnimoh"
  },
  summary: "Passionate Full Stack Web Developer with 3+ years of experience building modern, responsive web applications. Specialized in JavaScript ecosystem with expertise in React, Node.js, and modern development practices. Proven track record of delivering high-quality solutions that improve user experience and business outcomes.",
  
  experience: [
    {
      company: "TechCorp Solutions",
      position: "Senior Frontend Developer",
      period: "Jan 2023 - Present",
      location: "San Francisco, CA",
      description: [
        "Led development of customer-facing web applications serving 50k+ daily users",
        "Improved application performance by 40% through code optimization and lazy loading",
        "Mentored junior developers and established coding standards for the team",
        "Collaborated with UX/UI designers to implement pixel-perfect responsive designs"
      ],
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"]
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      period: "Jun 2021 - Dec 2022",
      location: "Remote",
      description: [
        "Built and maintained full-stack web applications using modern JavaScript frameworks",
        "Developed RESTful APIs and integrated third-party services",
        "Implemented automated testing strategies improving code coverage to 85%",
        "Optimized database queries reducing load times by 60%"
      ],
      technologies: ["Vue.js", "Node.js", "Express.js", "MongoDB", "Docker"]
    },
    {
      company: "Digital Agency Pro",
      position: "Frontend Developer",
      period: "Sep 2020 - May 2021",
      location: "New York, NY",
      description: [
        "Created responsive websites for diverse clients across various industries",
        "Collaborated with design team to translate mockups into interactive experiences",
        "Implemented SEO best practices improving client site rankings by 30%",
        "Maintained and updated legacy codebases while modernizing development workflow"
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "SCSS", "WordPress"]
    }
  ],
  
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      period: "2016 - 2020",
      location: "Berkeley, CA",
      details: [
        "Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems",
        "GPA: 3.7/4.0",
        "Dean's List: Fall 2019, Spring 2020"
      ]
    }
  ],
  
  projects: [
    {
      name: "Recipe Discovery App",
      description: "Full-stack web application for discovering and saving recipes with advanced search functionality and user authentication.",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "JWT"],
      links: {
        github: "https://github.com/gideonnimoh/recipe-app",
        live: "https://recipe-discovery-app.netlify.app"
      }
    },
    {
      name: "Task Management Dashboard",
      description: "Real-time collaborative task management tool with drag-and-drop functionality and team collaboration features.",
      technologies: ["Vue.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
      links: {
        github: "https://github.com/gideonnimoh/task-manager"
      }
    },
    {
      name: "E-commerce Platform",
      description: "Modern e-commerce solution with payment integration, inventory management, and admin dashboard.",
      technologies: ["Next.js", "Stripe API", "Prisma", "Tailwind CSS"],
      links: {
        github: "https://github.com/gideonnimoh/ecommerce-platform",
        live: "https://modern-ecommerce.vercel.app"
      }
    }
  ],
  
  skills: [
    {
      category: "Frontend Technologies",
      items: ["JavaScript (ES6+)", "TypeScript", "React", "Vue.js", "Next.js", "HTML5", "CSS3", "SCSS/Sass", "Tailwind CSS"]
    },
    {
      category: "Backend Technologies", 
      items: ["Node.js", "Express.js", "Python", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST APIs"]
    },
    {
      category: "Tools & Technologies",
      items: ["Git", "Docker", "AWS", "Vercel", "Netlify", "Webpack", "Vite", "Jest", "Cypress"]
    },
    {
      category: "Design & UX",
      items: ["Figma", "Adobe XD", "Responsive Design", "Accessibility (WCAG)", "SEO Optimization"]
    }
  ]
};

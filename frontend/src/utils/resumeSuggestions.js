// Smart suggestions for skills and achievements based on job roles

const jobRoleSuggestions = {
  'Software Engineer': {
    skills: [
      'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker',
      'AWS', 'REST APIs', 'Agile/Scrum', 'Problem Solving', 'Data Structures', 'Algorithms'
    ],
    achievements: [
      'Developed scalable web applications serving 10K+ users',
      'Reduced application load time by 40% through optimization',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Led code reviews and mentored junior developers',
      'Built RESTful APIs handling 1M+ requests daily',
      'Improved code quality reducing bugs by 30%'
    ]
  },
  'Frontend Developer': {
    skills: [
      'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SASS/SCSS',
      'Responsive Design', 'Webpack', 'Redux', 'GraphQL', 'Jest', 'Testing'
    ],
    achievements: [
      'Built responsive web applications with 99% mobile compatibility',
      'Improved page load speed by 50% using code splitting',
      'Implemented component library used across 5+ projects',
      'Enhanced UX resulting in 25% increase in user engagement',
      'Reduced bundle size by 35% through optimization',
      'Created accessible UI components meeting WCAG 2.1 standards'
    ]
  },
  'Backend Developer': {
    skills: [
      'Node.js', 'Python', 'Java', 'Spring Boot', 'Express.js', 'MongoDB', 'PostgreSQL',
      'Redis', 'Microservices', 'Docker', 'Kubernetes', 'AWS', 'REST APIs', 'GraphQL'
    ],
    achievements: [
      'Designed and implemented microservices architecture',
      'Optimized database queries reducing response time by 45%',
      'Built API handling 5M+ requests per day',
      'Implemented caching strategy reducing server load by 50%',
      'Developed real-time features using WebSockets',
      'Ensured 99.9% system uptime through robust error handling'
    ]
  },
  'Full Stack Developer': {
    skills: [
      'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express.js', 'JavaScript', 'TypeScript',
      'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Git', 'Agile', 'Testing'
    ],
    achievements: [
      'Developed end-to-end web applications from scratch',
      'Built full-stack applications serving 50K+ users',
      'Implemented authentication and authorization systems',
      'Created responsive frontend with optimized backend APIs',
      'Reduced development time by 40% using reusable components',
      'Led full-stack projects from design to deployment'
    ]
  },
  'Data Scientist': {
    skills: [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'Pandas', 'NumPy', 'Data Visualization', 'Statistics', 'Jupyter', 'Scikit-learn'
    ],
    achievements: [
      'Built ML models with 90%+ accuracy',
      'Reduced prediction error by 35% through feature engineering',
      'Developed recommendation system increasing sales by 20%',
      'Created data pipelines processing 10M+ records daily',
      'Implemented predictive analytics saving company $500K annually',
      'Published research papers in top-tier conferences'
    ]
  },
  'DevOps Engineer': {
    skills: [
      'Docker', 'Kubernetes', 'AWS', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible',
      'Linux', 'Bash Scripting', 'Monitoring', 'Git', 'Cloud Architecture'
    ],
    achievements: [
      'Reduced deployment time from hours to minutes',
      'Implemented infrastructure as code reducing setup time by 70%',
      'Improved system reliability achieving 99.9% uptime',
      'Automated deployment pipeline reducing manual errors by 80%',
      'Scaled infrastructure to handle 10x traffic increase',
      'Reduced infrastructure costs by 40% through optimization'
    ]
  },
  'Product Manager': {
    skills: [
      'Product Strategy', 'Agile', 'Scrum', 'Roadmapping', 'Stakeholder Management',
      'Analytics', 'User Research', 'A/B Testing', 'JIRA', 'Product Metrics'
    ],
    achievements: [
      'Launched product features increasing user engagement by 40%',
      'Managed product roadmap for 10+ features',
      'Increased product revenue by 35% through strategic planning',
      'Led cross-functional teams of 15+ members',
      'Conducted user research impacting product decisions',
      'Improved product metrics by 50% through data-driven decisions'
    ]
  },
  'UI/UX Designer': {
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping',
      'Design Systems', 'User Testing', 'Interaction Design', 'Visual Design'
    ],
    achievements: [
      'Designed user interfaces for 20+ web and mobile applications',
      'Improved user satisfaction scores by 45%',
      'Created design system used across multiple products',
      'Reduced user task completion time by 30%',
      'Conducted user research leading to 25% increase in conversions',
      'Designed award-winning mobile app interface'
    ]
  },
  'Data Analyst': {
    skills: [
      'SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Data Visualization',
      'Pandas', 'Machine Learning', 'A/B Testing', 'Business Intelligence'
    ],
    achievements: [
      'Analyzed datasets with 1M+ records providing key insights',
      'Created dashboards used by 100+ stakeholders',
      'Identified trends leading to 20% cost reduction',
      'Built predictive models improving forecasting accuracy by 30%',
      'Automated reporting saving 20 hours per week',
      'Presented data-driven recommendations to C-level executives'
    ]
  },
  'QA Engineer': {
    skills: [
      'Manual Testing', 'Automation Testing', 'Selenium', 'Jest', 'Cypress', 'JIRA',
      'Test Planning', 'Bug Tracking', 'API Testing', 'Performance Testing'
    ],
    achievements: [
      'Reduced bug detection time by 50% through automation',
      'Improved test coverage from 60% to 90%',
      'Identified and reported 500+ critical bugs',
      'Created test automation framework used by entire team',
      'Reduced production bugs by 40%',
      'Led QA efforts for 10+ product releases'
    ]
  },
  'Mobile Developer': {
    skills: [
      'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Swift', 'Kotlin',
      'Firebase', 'REST APIs', 'Mobile UI/UX', 'App Store Publishing'
    ],
    achievements: [
      'Developed mobile apps with 100K+ downloads',
      'Improved app performance reducing crash rate by 60%',
      'Reduced app size by 40% through optimization',
      'Implemented offline functionality improving user experience',
      'Achieved 4.5+ star rating on app stores',
      'Developed cross-platform apps reducing development time by 50%'
    ]
  },
  'Business Analyst': {
    skills: [
      'Requirements Gathering', 'Process Mapping', 'Stakeholder Management', 'Agile',
      'SQL', 'Excel', 'Documentation', 'Business Process Modeling', 'Analytics'
    ],
    achievements: [
      'Gathered requirements for 20+ successful projects',
      'Improved business processes reducing costs by 25%',
      'Created detailed documentation for 15+ projects',
      'Facilitated workshops with 50+ stakeholders',
      'Identified process improvements saving 30 hours per week',
      'Led business analysis for projects worth $2M+'
    ]
  },
  'Cybersecurity Analyst': {
    skills: [
      'Network Security', 'Penetration Testing', 'Vulnerability Assessment', 'SIEM',
      'Firewall Management', 'Incident Response', 'Security Auditing', 'Encryption'
    ],
    achievements: [
      'Identified and mitigated 100+ security vulnerabilities',
      'Reduced security incidents by 50%',
      'Conducted security audits for 20+ systems',
      'Implemented security policies improving compliance',
      'Led incident response for critical security breaches',
      'Trained team on security best practices'
    ]
  },
  'Cloud Architect': {
    skills: [
      'AWS', 'Azure', 'GCP', 'Cloud Architecture', 'DevOps', 'Terraform', 'Docker',
      'Kubernetes', 'Microservices', 'Serverless', 'CI/CD'
    ],
    achievements: [
      'Designed cloud architecture for enterprise applications',
      'Migrated legacy systems to cloud reducing costs by 40%',
      'Architected solutions serving 1M+ users',
      'Implemented auto-scaling reducing infrastructure costs by 35%',
      'Designed disaster recovery solutions with 99.9% uptime',
      'Led cloud migration projects for 10+ applications'
    ]
  }
};

export const getSuggestionsForRole = (jobRole) => {
  if (!jobRole) return { skills: [], achievements: [] };
  
  const normalizedRole = jobRole.trim();
  
  // Exact match
  if (jobRoleSuggestions[normalizedRole]) {
    return jobRoleSuggestions[normalizedRole];
  }
  
  // Partial match
  for (const [role, suggestions] of Object.entries(jobRoleSuggestions)) {
    if (role.toLowerCase().includes(normalizedRole.toLowerCase()) ||
        normalizedRole.toLowerCase().includes(role.toLowerCase())) {
      return suggestions;
    }
  }
  
  // Default suggestions for unknown roles
  return {
    skills: [
      'Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Time Management',
      'Project Management', 'Analytical Skills', 'Critical Thinking', 'Adaptability'
    ],
    achievements: [
      'Achieved project goals ahead of schedule',
      'Improved team productivity by 25%',
      'Led successful project completion',
      'Implemented process improvements',
      'Received recognition for outstanding performance',
      'Mentored and trained team members'
    ]
  };
};

export const getAvailableJobRoles = () => {
  return Object.keys(jobRoleSuggestions).sort();
};

export default jobRoleSuggestions;


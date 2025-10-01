//! These are all test/mock data;

export const FILTERS = [
  {
    label: 'Legislation',
    name: 'Legislation',
    data: [
      { id: 1, name: "Law", is_approved: false, created_at: "2024-06-17T12:36:38.542104Z", updated_at: "2024-06-17T12:36:38.542146Z", identifier: "6483da7a-a981-47f9-8187-64d090aaab09" },
      { id: 2, name: "Regulation", is_approved: false, created_at: "2024-03-17T12:36:38.542104Z", updated_at: "2024-03-17T12:36:38.542146Z", identifier: "6483da7a-a981-47f9-8187-64d090aaab09" },
      { id: 0, name: "Directive", is_approved: false, created_at: "2024-06-17T12:36:38.542104Z", updated_at: "2024-06-17T12:36:38.542146Z", identifier: "6483da7a-a981-47f9-8187-64d090aaab09" },
      { id: 6, name: "Standard", is_approved: false, created_at: "2024-06-17T12:36:38.542104Z", updated_at: "2024-06-17T12:36:38.542146Z", identifier: "6483da7a-a981-47f9-8187-64d090aaab09" },
    ]
  },
];

export const LEGISLATIONS = [
  {
    id: 0,
    identifier: '',
    created_at: '',
    attention_point_list: [],
    updated_at: '',
    name_local: '',
    name_generic: '',
    abbreviation: '',
    effective_date: '',
    effective_until: '',
    link: '',
    additional_links: '',
    is_in_effect: true,
    responsible_authority: '',
    responsible_party: '',
    non_compliance_risk: '',
    background: '',
    summary: '',
    objective: '',
    scope: '',
    preparation_state: 'CREATED',
    status: 'IN EFFECT',
    review_cadence_months: 12,
    created_by: 1,
    pwc_contact: [],
    pwc_territory: '',
    // Filters
    filters: [],
    type: [],
    topic: [],
    job_role_list: [],
    issuing_jurisdiction: [],
    geographical_scope: [],
    product_service: [],
    registration_requirements: [],
    reporting_requirements: [],
    regulatory_requirements: [],
  },
];

export const JOB_ROLE = [
  {
    example: '',
    job_role: {
      identifier: '',
      name: '',
    },
    why: '',
    what: ''
  }
]

export const NAVIGATOR_JOB_ROLE = [
  {
    note: '',
    job_role_list: [{ identifier: '', name: '' }],
  }
]

export const NAVIGATOR_LEGISLATIONS = [
  {
    attention_points: NAVIGATOR_JOB_ROLE || [],
    legislation: LEGISLATIONS[0],
  }
];


export const LEGISLATION_DETAILS = {
  id: 1,
  title: 'Deforestation Regulation',
  description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy",
  filters: [
    {
      id: 1,
      label: 'Role specific details',
      description: 'These are the details that are specific to the role of the user viewing the legislation details',
      roles: [
        {
          label: 'Legal',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Compliance',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Sustainability',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Marketing & Communications',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Product Design & Development',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: 'Legislation details',
      description: 'These are the details that are specific to the role of the user viewing the legislation details',
      roles: [
        {
          label: 'Legal',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Compliance',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Sustainability',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Marketing & Communications',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Product Design & Development',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      label: 'Expert contacts',
      description: 'These are the details that are specific to the role of the user viewing the legislation details',
      roles: [
        {
          label: 'Legal',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Compliance',
          details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Sustainability',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Marketing & Communications',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        },
        {
          label: 'Product Design & Development',
           details: [
            {
              label: 'Why is this legislation relevant to Legal?',
              description: 'As a legal professional in your company, the EU Deforestation Regulation (EUDR) holds significant relevance. It mandates due diligence for companies importing or exporting specified commodities to demonstrate that your products are deforestation-free. Legal professionals play a crucial role in ensuring compliance, verifying supply chains, and advocating for sustainable practices.'
            },
            {
              label: 'What does Legal need to do?',
              description: 'Legal professionals need to ensure that the company has a robust due diligence system in place to comply with the EUDR. This includes verifying the company’s supply chain, ensuring that the necessary documentation is in place, and advocating for sustainable practices within the organization.'
            },
            {
              label: 'Risk of non-compliance',
              description: 'Non-compliance with the EUDR can result in significant financial penalties, reputational damage, and legal action. It is essential for legal professionals to understand the requirements of the regulation and work proactively to ensure compliance.'
            },
            {
              label: 'Example of Legal compliance',
              description: 'An example of legal compliance with the EUDR would be conducting thorough due diligence on the company’s supply chain, verifying the origin of specified commodities, and maintaining accurate records to demonstrate compliance.\n\nLegal professionals can also work with other departments within the organization to develop and implement policies and procedures that support compliance with the regulation.'
            }
          ]
        }
      ]
    }
  ],
  is_in_effect: true,
  scope: 'National',
  region: 'EU Regulation',
  status: 'Active',
  effective_date: '2021-09-01',
  url: 'https://www.google.com',
  compliance: 'Compliant',
  category: 'Environmental',
  jurisdiction: 'Federal',
  applicable_from: '2021-09-01',
  type: 'Regulation',
  created_by: 'John Doe',
  last_updated: '2021-09-01',
  legislation_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et turpis nec nunc scelerisque fermentum. Donec nec lacus vitae nisl ultricies blandit. Integer varius, nulla nec ultricies tincidunt, mauris leo tincidunt purus, nec lacinia sapien nunc in nunc. Nulla facilisi. In hac habitasse platea dictumst. Nulla facilisi. Praesent vel nunc nec purus tincidunt ultricies. Sed euismod, lorem id elementum semper, nunc nunc ultricies sapien, sit amet ultricies turpis nunc nec nunc. Sed at mauris nec nunc tincidunt aliquam'
};



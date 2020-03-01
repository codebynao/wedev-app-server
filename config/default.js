module.exports = {
  COMPANY_STATUS: {
    SAS: 'SAS',
    SASU: 'SASU',
    FREELANCE: 'freelance',
    EURL: 'EURL',
    SARL: 'SARL',
    OTHER: 'other'
  },
  PROFESSIONAL_STATUS: {
    DATA_ANALYST: 'data_analyst',
    DATA_ENGINEERING: 'data_engineering',
    DATA_SCIENCE: 'data_science',
    DEV_BACKEND: 'dev_backend',
    DEV_FULLSTACK: 'dev_fullstack',
    DEV_MOBILE: 'dev_mobile',
    DEVOPS_INFRA: 'devops_infra',
    ELECTRONICS: 'electronics',
    HARDWARE: 'hardware',
    ON_BOARD_SYSTEM: 'on_board_system',
    OTHER: 'other',
    PROJECT_PRODUCT_MANAGEMENT: 'project_product_management',
    QA: 'qa',
    RESEARCH_RD: 'research_rd',
    SECURITY: 'security',
    TELECOM: 'telecom_network'
  },
  LENGTH_SIRET: 14,
  MINIMUM_LENGTH_PASSWORD: 8,
  REGEX: {
    EMAIL: /^([-!#$%&'*+/=?^_`{}|~0-9a-zA-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9a-zA-Z]+)*|^\"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*\")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/,
    NUMBERS_ONLY: /^[0-9]+$/
  }
};

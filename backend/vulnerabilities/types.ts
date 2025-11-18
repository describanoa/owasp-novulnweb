/**
 * Tipos TypeScript para la API educativa de vulnerabilidades OWASP
 */

export type VulnerabilityOverview = {
  description: string;
  rank: number;
  incidenceRate: string;
  testCoverage: string;
  avgWeightedExploit: number;
  avgWeightedImpact: number;
  maxOccurrences: string;
}

export type AttackScenario = {
  title: string;
  description: string;
  vulnerableCode?: string;
  language?: string;
  exploitExample?: string;
}

export type CodeExample = {
  title: string;
  language: string;
  vulnerable: {
    code: string;
    explanation: string;
  };
  secure: {
    code: string;
    explanation: string;
  };
}

export type ImplementationInApp = {
  hasExample: boolean;
  location: string;
  testEndpoint?: string;
  description?: string;
}

export type Vulnerability = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  icon: string;
  owaspUrl: string;
  
  overview: VulnerabilityOverview;
  
  description: string[];
  commonVulnerabilities: string[];
  howToPrevent: string[];
  
  attackScenarios: AttackScenario[];
  codeExamples: CodeExample[];
  
  implementationInApp: ImplementationInApp;
}

export type VulnerabilityListItem = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  rank: number;
  incidenceRate: string;
  description: string;
  icon: string;
}

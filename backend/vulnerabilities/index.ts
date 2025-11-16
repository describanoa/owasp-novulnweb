import { A01_BrokenAccessControl } from './data/A01-broken-access-control.js';
import { A02_CryptographicFailures } from './data/A02-cryptographic-failures.js';
import { A03_Injection } from './data/A03-injection.js';
import { A04_InsecureDesign } from './data/A04-insecure-design.js';
import { A05_SecurityMisconfiguration } from './data/A05-security-misconfiguration.js';
import { A06_VulnerableComponents } from './data/A06-vulnerable-components.js';
import { A07_IdentificationFailures } from './data/A07-identification-failures.js';
import { A08_IntegrityFailures } from './data/A08-integrity-failures.js';
import { A09_LoggingFailures } from './data/A09-logging-failures.js';
import { A10_SSRF } from './data/A10-ssrf.js';
import type { Vulnerability } from './types.js';

export const vulnerabilities: Vulnerability[] = [
  A01_BrokenAccessControl,
  A02_CryptographicFailures,
  A03_Injection,
  A04_InsecureDesign,
  A05_SecurityMisconfiguration,
  A06_VulnerableComponents,
  A07_IdentificationFailures,
  A08_IntegrityFailures,
  A09_LoggingFailures,
  A10_SSRF,
];

export * from './types.js';

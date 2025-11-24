export interface Vulnerability {
    id: string;
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
    category: 'Web' | 'API' | 'Mobile' | 'Network' | 'Cloud' | 'LLM';
    owasp_reference: string;
    description: string;
    impact: string;
    recommendation: string;
    cvss_vector?: string;
}

export const vulnerabilityDatabase: Vulnerability[] = [
    // ===== OWASP Top 10 Web Application Security Risks 2021 =====
    {
        id: 'WEB-A01-2021',
        title: 'Broken Access Control',
        severity: 'Critical',
        category: 'Web',
        owasp_reference: 'A01:2021',
        description: 'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user\'s limits. Common access control vulnerabilities include bypassing access control checks by modifying the URL, internal application state, or the HTML page, or by using an attack tool modifying API requests.',
        impact: 'Attackers can access unauthorized functionality and/or data, such as accessing other users\' accounts, viewing sensitive files, modifying other users\' data, changing access rights, etc. This can lead to complete system compromise.',
        recommendation: 'Implement proper access control mechanisms with deny by default. Enforce record ownership rather than accepting that the user can create, read, update, or delete any record. Disable web server directory listing and ensure file metadata and backup files are not present within web roots. Log access control failures and alert admins when appropriate.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A02-2021',
        title: 'Cryptographic Failures',
        severity: 'High',
        category: 'Web',
        owasp_reference: 'A02:2021',
        description: 'The first thing is to determine the protection needs of data in transit and at rest. For example, passwords, credit card numbers, health records, personal information, and business secrets require extra protection, mainly if that data falls under privacy laws, e.g., EU\'s General Data Protection Regulation (GDPR), or regulations, e.g., financial data protection such as PCI Data Security Standard (PCI DSS).',
        impact: 'Failure to properly protect sensitive data can result in exposure of passwords, credit card numbers, health records, personal information, and business secrets. This can lead to identity theft, credit card fraud, or other crimes.',
        recommendation: 'Classify data processed, stored, or transmitted by an application. Identify which data is sensitive according to privacy laws, regulatory requirements, or business needs. Don\'t store sensitive data unnecessarily. Encrypt all sensitive data at rest and in transit. Use up-to-date and strong standard algorithms, protocols, and keys.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N'
    },
    {
        id: 'WEB-A03-2021',
        title: 'Injection',
        severity: 'Critical',
        category: 'Web',
        owasp_reference: 'A03:2021',
        description: 'An application is vulnerable to attack when user-supplied data is not validated, filtered, or sanitized by the application. Dynamic queries or non-parameterized calls without context-aware escaping are used directly in the interpreter. Hostile data is used within object-relational mapping (ORM) search parameters to extract additional, sensitive records.',
        impact: 'Injection can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, or denial of access. Injection can sometimes lead to complete host takeover.',
        recommendation: 'Use a safe API which avoids using the interpreter entirely, provides a parameterized interface, or migrates to Object Relational Mapping Tools (ORMs). Use positive server-side input validation. For any residual dynamic queries, escape special characters using the specific escape syntax for that interpreter.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A04-2021',
        title: 'Insecure Design',
        severity: 'High',
        category: 'Web',
        owasp_reference: 'A04:2021',
        description: 'Insecure design is a broad category representing different weaknesses, expressed as "missing or ineffective control design." Insecure design is not the source for all other Top 10 risk categories. There is a difference between insecure design and insecure implementation. We differentiate between design flaws and implementation defects for a reason, they have different root causes and remediation.',
        impact: 'Insecure design can lead to various security vulnerabilities that cannot be fixed by a perfect implementation as the required security controls were never created to defend against specific attacks.',
        recommendation: 'Establish and use a secure development lifecycle with AppSec professionals to help evaluate and design security and privacy-related controls. Establish and use a library of secure design patterns or paved road ready to use components. Use threat modeling for critical authentication, access control, business logic, and key flows.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A05-2021',
        title: 'Security Misconfiguration',
        severity: 'Medium',
        category: 'Web',
        owasp_reference: 'A05:2021',
        description: 'The application might be vulnerable if the application is missing appropriate security hardening across any part of the application stack or improperly configured permissions on cloud services. Unnecessary features are enabled or installed (e.g., unnecessary ports, services, pages, accounts, or privileges). Default accounts and their passwords are still enabled and unchanged.',
        impact: 'Such flaws frequently give attackers unauthorized access to some system data or functionality. Occasionally, such flaws result in a complete system compromise.',
        recommendation: 'A repeatable hardening process makes it fast and easy to deploy another environment that is appropriately locked down. Development, QA, and production environments should all be configured identically, with different credentials used in each environment. Automate this process to minimize the effort required to set up a new secure environment.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L'
    },
    {
        id: 'WEB-A06-2021',
        title: 'Vulnerable and Outdated Components',
        severity: 'High',
        category: 'Web',
        owasp_reference: 'A06:2021',
        description: 'You are likely vulnerable if you do not know the versions of all components you use (both client-side and server-side). This includes components you directly use as well as nested dependencies. If the software is vulnerable, unsupported, or out of date, this includes the OS, web/application server, database management system (DBMS), applications, APIs and all components, runtime environments, and libraries.',
        impact: 'While some known vulnerabilities lead to only minor impacts, some of the largest breaches to date have relied on exploiting known vulnerabilities in components.',
        recommendation: 'Remove unused dependencies, unnecessary features, components, files, and documentation. Continuously inventory the versions of both client-side and server-side components and their dependencies using tools like OWASP Dependency Check, retire.js, etc. Continuously monitor sources like Common Vulnerability and Exposures (CVE) and National Vulnerability Database (NVD) for vulnerabilities in the components.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A07-2021',
        title: 'Identification and Authentication Failures',
        severity: 'Critical',
        category: 'Web',
        owasp_reference: 'A07:2021',
        description: 'Confirmation of the user\'s identity, authentication, and session management is critical to protect against authentication-related attacks. There may be authentication weaknesses if the application permits automated attacks such as credential stuffing, permits brute force or other automated attacks, permits default, weak, or well-known passwords, uses weak or ineffective credential recovery and forgot-password processes.',
        impact: 'Attackers can compromise passwords, keys, or session tokens, or exploit other implementation flaws to assume other users\' identities temporarily or permanently.',
        recommendation: 'Implement multi-factor authentication to prevent automated credential stuffing, brute force, and stolen credential reuse attacks. Do not ship or deploy with any default credentials, particularly for admin users. Implement weak password checks. Limit or increasingly delay failed login attempts, but be careful not to create a denial of service scenario.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A08-2021',
        title: 'Software and Data Integrity Failures',
        severity: 'High',
        category: 'Web',
        owasp_reference: 'A08:2021',
        description: 'Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations. An example of this is where an application relies upon plugins, libraries, or modules from untrusted sources, repositories, and content delivery networks (CDNs). An insecure CI/CD pipeline can introduce the potential for unauthorized access, malicious code, or system compromise.',
        impact: 'Attackers can potentially upload their own updates to be distributed and run on all installations, or include malicious code in dependencies. This can result in widespread compromise.',
        recommendation: 'Use digital signatures or similar mechanisms to verify the software or data is from the expected source and has not been altered. Ensure libraries and dependencies are consuming trusted repositories. Use a software supply chain security tool to verify that components do not contain known vulnerabilities. Ensure there is a review process for code and configuration changes to minimize the chance that malicious code or configuration could be introduced.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'WEB-A09-2021',
        title: 'Security Logging and Monitoring Failures',
        severity: 'Medium',
        category: 'Web',
        owasp_reference: 'A09:2021',
        description: 'Returning to the OWASP Top 10 2021, this category is to help detect, escalate, and respond to active breaches. Without logging and monitoring, breaches cannot be detected. Insufficient logging, detection, monitoring, and active response occurs when auditable events are not logged, warnings and errors generate no, inadequate, or unclear log messages, or logs are only stored locally.',
        impact: 'Without logging and monitoring, breaches cannot be detected. Most successful attacks start with vulnerability probing. Allowing such probes to continue can raise the likelihood of successful exploit to nearly 100%.',
        recommendation: 'Ensure all login, access control, and server-side input validation failures can be logged with sufficient user context to identify suspicious or malicious accounts and held for enough time to allow delayed forensic analysis. Ensure that logs are generated in a format that log management solutions can easily consume. Establish or adopt an incident response and recovery plan.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L'
    },
    {
        id: 'WEB-A10-2021',
        title: 'Server-Side Request Forgery (SSRF)',
        severity: 'High',
        category: 'Web',
        owasp_reference: 'A10:2021',
        description: 'SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall, VPN, or another type of network access control list (ACL).',
        impact: 'Attackers can abuse functionality on the server to read or update internal resources. The attacker can supply or modify a URL which the code running on the server will read or submit data to, and by carefully selecting the URLs, the attacker may be able to read server configuration, connect to internal services, or perform post requests towards internal services.',
        recommendation: 'Sanitize and validate all client-supplied input data. Enforce the URL schema, port, and destination with a positive allow list. Do not send raw responses to clients. Disable HTTP redirections. Be aware of the URL consistency to avoid attacks such as DNS rebinding and "time of check, time of use" (TOCTOU) race conditions.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },

    // ===== OWASP Mobile Top 10 2024 =====
    {
        id: 'MOB-M01-2024',
        title: 'Improper Credential Usage',
        severity: 'Critical',
        category: 'Mobile',
        owasp_reference: 'M1:2024',
        description: 'This category covers the misuse, mishandling, or mismanagement of credentials within mobile applications. This includes hardcoding credentials in the app, storing credentials insecurely, transmitting credentials over insecure channels, or exposing credentials through logs or other means. Credentials can include passwords, API keys, tokens, encryption keys, and other sensitive authentication data.',
        impact: 'Improper credential usage can lead to unauthorized access to user accounts, backend systems, or sensitive data. Attackers can extract hardcoded credentials from the app binary, intercept credentials during transmission, or retrieve them from insecure storage locations.',
        recommendation: 'Never hardcode credentials in the application code. Use secure credential storage mechanisms provided by the platform (Keychain for iOS, Keystore for Android). Implement certificate pinning for network communications. Use OAuth 2.0 or similar modern authentication frameworks. Ensure credentials are transmitted only over secure channels (TLS 1.3+).',
        cvss_vector: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N'
    },
    {
        id: 'MOB-M02-2024',
        title: 'Inadequate Supply Chain Security',
        severity: 'High',
        category: 'Mobile',
        owasp_reference: 'M2:2024',
        description: 'Mobile applications often rely on third-party libraries, SDKs, and frameworks. Inadequate supply chain security occurs when these dependencies contain vulnerabilities, are outdated, or come from untrusted sources. This also includes the use of compromised development tools or build environments.',
        impact: 'Vulnerable third-party components can be exploited to compromise the application and its users. Attackers can leverage known vulnerabilities in outdated libraries or inject malicious code through compromised dependencies.',
        recommendation: 'Maintain an inventory of all third-party components and their versions. Regularly update dependencies to patch known vulnerabilities. Use Software Composition Analysis (SCA) tools to identify vulnerable components. Verify the integrity of third-party libraries. Only use components from trusted sources. Implement a secure software development lifecycle (SDLC).',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'MOB-M03-2024',
        title: 'Insecure Authentication/Authorization',
        severity: 'Critical',
        category: 'Mobile',
        owasp_reference: 'M3:2024',
        description: 'This category covers weaknesses in how mobile applications authenticate users and authorize access to resources. This includes weak authentication mechanisms, improper session management, client-side authorization checks, and failure to properly validate user permissions on the backend.',
        impact: 'Attackers can bypass authentication mechanisms, hijack user sessions, or access unauthorized functionality and data. This can lead to account takeover, privilege escalation, and unauthorized access to sensitive information.',
        recommendation: 'Implement strong authentication mechanisms (multi-factor authentication where appropriate). Perform all authentication and authorization checks on the server side. Use secure session management with proper timeout and invalidation. Implement proper role-based access control (RBAC). Never rely solely on client-side checks for security decisions.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'MOB-M04-2024',
        title: 'Insufficient Input/Output Validation',
        severity: 'High',
        category: 'Mobile',
        owasp_reference: 'M4:2024',
        description: 'Mobile applications must validate all input from untrusted sources and properly sanitize output. Insufficient validation can lead to various injection attacks, buffer overflows, and other vulnerabilities. This applies to data received from users, network responses, inter-process communication, and other sources.',
        impact: 'Lack of proper input/output validation can result in SQL injection, command injection, cross-site scripting (XSS), path traversal, and other injection attacks. This can lead to data breaches, unauthorized access, or application crashes.',
        recommendation: 'Implement comprehensive input validation on both client and server sides. Use parameterized queries to prevent SQL injection. Sanitize all output before rendering. Validate data types, formats, lengths, and ranges. Use allowlists rather than denylists for validation. Implement proper error handling that doesn\'t expose sensitive information.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'MOB-M05-2024',
        title: 'Insecure Communication',
        severity: 'High',
        category: 'Mobile',
        owasp_reference: 'M5:2024',
        description: 'This covers the failure to properly secure data in transit. Mobile applications often communicate with backend servers, third-party APIs, and other services. Insecure communication occurs when data is transmitted without encryption, uses weak encryption, or fails to properly validate server certificates.',
        impact: 'Attackers can intercept, read, or modify data transmitted between the mobile application and backend services. This can expose sensitive user data, session tokens, or other confidential information. Man-in-the-middle (MITM) attacks become possible.',
        recommendation: 'Use TLS 1.3 or TLS 1.2 for all network communications. Implement certificate pinning to prevent MITM attacks. Never transmit sensitive data over unencrypted channels. Validate server certificates properly. Avoid using self-signed certificates in production. Implement additional encryption for highly sensitive data.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N'
    },
    {
        id: 'MOB-M06-2024',
        title: 'Inadequate Privacy Controls',
        severity: 'Medium',
        category: 'Mobile',
        owasp_reference: 'M6:2024',
        description: 'Mobile applications often collect, process, and store personal user data. Inadequate privacy controls occur when applications fail to properly protect user privacy, collect excessive data, lack transparency about data usage, or fail to comply with privacy regulations like GDPR, CCPA, or other regional privacy laws.',
        impact: 'Privacy violations can result in regulatory fines, loss of user trust, and reputational damage. Users may be exposed to unwanted tracking, profiling, or data sharing without their knowledge or consent.',
        recommendation: 'Implement privacy by design principles. Collect only the minimum necessary data. Provide clear privacy policies and obtain proper user consent. Allow users to control their data (access, modify, delete). Implement data minimization and retention policies. Ensure compliance with applicable privacy regulations. Use anonymization or pseudonymization where appropriate.',
        cvss_vector: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'
    },
    {
        id: 'MOB-M07-2024',
        title: 'Insufficient Binary Protections',
        severity: 'Medium',
        category: 'Mobile',
        owasp_reference: 'M7:2024',
        description: 'Mobile application binaries can be reverse-engineered, decompiled, or modified by attackers. Insufficient binary protections occur when applications lack obfuscation, anti-tampering mechanisms, or runtime application self-protection (RASP). This makes it easier for attackers to understand the application logic, extract secrets, or create modified versions.',
        impact: 'Attackers can reverse-engineer the application to understand its logic, extract hardcoded secrets, identify vulnerabilities, or create malicious modified versions of the app. This can lead to intellectual property theft, credential exposure, or distribution of trojanized applications.',
        recommendation: 'Implement code obfuscation to make reverse engineering more difficult. Use anti-tampering and anti-debugging techniques. Implement runtime integrity checks. Remove debugging symbols from production builds. Consider using native code for sensitive operations. Implement certificate pinning and root/jailbreak detection where appropriate.',
        cvss_vector: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N'
    },
    {
        id: 'MOB-M08-2024',
        title: 'Security Misconfiguration',
        severity: 'Medium',
        category: 'Mobile',
        owasp_reference: 'M8:2024',
        description: 'Security misconfiguration in mobile applications includes improper platform security settings, insecure default configurations, incomplete or ad-hoc configurations, misconfigured HTTP headers, verbose error messages containing sensitive information, and not patching or upgrading systems, frameworks, and components.',
        impact: 'Misconfigurations can expose sensitive functionality, allow unauthorized access, or provide attackers with information useful for further attacks. This can range from information disclosure to complete system compromise.',
        recommendation: 'Implement a repeatable hardening process. Remove or disable unnecessary features, components, and frameworks. Review and update configurations as part of the patch management process. Implement proper error handling that doesn\'t expose sensitive information. Use security headers appropriately. Regularly review and audit security configurations.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N'
    },
    {
        id: 'MOB-M09-2024',
        title: 'Insecure Data Storage',
        severity: 'High',
        category: 'Mobile',
        owasp_reference: 'M9:2024',
        description: 'Mobile devices can be lost or stolen, making local data storage a significant security concern. Insecure data storage occurs when sensitive data is stored without proper encryption, in world-readable locations, in application logs, or in other insecure locations on the device.',
        impact: 'If a device is lost, stolen, or compromised, attackers can access sensitive data stored insecurely on the device. This can include user credentials, personal information, financial data, or other confidential information.',
        recommendation: 'Never store sensitive data unnecessarily. Use platform-provided secure storage mechanisms (Keychain/Keystore). Encrypt sensitive data before storing it locally. Avoid storing sensitive data in application logs, temp files, or caches. Implement proper file permissions. Consider using additional encryption for highly sensitive data. Implement remote wipe capabilities where appropriate.',
        cvss_vector: 'CVSS:3.1/AV:P/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N'
    },
    {
        id: 'MOB-M10-2024',
        title: 'Insufficient Cryptography',
        severity: 'High',
        category: 'Mobile',
        owasp_reference: 'M10:2024',
        description: 'This category covers the use of weak, broken, or improperly implemented cryptographic algorithms. This includes using deprecated algorithms, weak key sizes, improper key management, or custom cryptographic implementations. It also covers the failure to use cryptography where it should be employed.',
        impact: 'Weak cryptography can be broken by attackers, exposing sensitive data. This can lead to data breaches, unauthorized access, or compromise of secure communications.',
        recommendation: 'Use industry-standard, well-vetted cryptographic algorithms. Never implement custom cryptography. Use appropriate key sizes (AES-256, RSA-2048 or higher). Implement proper key management and rotation. Use secure random number generators. Avoid deprecated algorithms (MD5, SHA1, DES, RC4). Use authenticated encryption modes (GCM). Regularly review and update cryptographic implementations.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N'
    },

    // ===== OWASP API Security Top 10 2023 =====
    {
        id: 'API-01-2023',
        title: 'Broken Object Level Authorization',
        severity: 'Critical',
        category: 'API',
        owasp_reference: 'API1:2023',
        description: 'APIs tend to expose endpoints that handle object identifiers, creating a wide attack surface of Object Level Access Control issues. Object level authorization checks should be considered in every function that accesses a data source using an ID from the user. The vulnerability is often caused by the lack of proper authorization checks.',
        impact: 'Attackers can exploit API endpoints that are vulnerable to broken object level authorization by manipulating the ID of an object sent within the request. This may lead to unauthorized access to sensitive data.',
        recommendation: 'Implement a proper authorization mechanism that relies on user policies and hierarchy. Use the authorization mechanism to check if the logged-in user has access to perform the requested action on the record in every function that uses an input from the client to access a database. Prefer the use of random and unpredictable values as GUIDs for records\' IDs.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N'
    },
    {
        id: 'API-02-2023',
        title: 'Broken Authentication',
        severity: 'Critical',
        category: 'API',
        owasp_reference: 'API2:2023',
        description: 'Authentication mechanisms are often implemented incorrectly, allowing attackers to compromise authentication tokens or to exploit implementation flaws to assume other user\'s identities temporarily or permanently. Compromising a system\'s ability to identify the client/user, compromises API security overall.',
        impact: 'Attackers can gain control of other users\' accounts in the system, read their personal data, and perform sensitive actions on their behalf, like money transactions and sending personal messages.',
        recommendation: 'Check all possible ways to authenticate to all APIs. Implement multi-factor authentication. Implement anti-brute force mechanisms. Implement weak-password checks. Don\'t use API keys for user authentication. Use standard authentication, token generation, password storage, and multi-factor authentication. Ensure authentication endpoints are protected against credential stuffing.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'API-03-2023',
        title: 'Broken Object Property Level Authorization',
        severity: 'High',
        category: 'API',
        owasp_reference: 'API3:2023',
        description: 'This category combines API3:2019 Excessive Data Exposure and API6:2019 Mass Assignment. When allowing users to access an object using an API endpoint, it is important to validate that the user has access to the specific object properties they are trying to access. This includes both reading (excessive data exposure) and writing (mass assignment).',
        impact: 'Excessive Data Exposure: Attackers can access sensitive data that should not be exposed. Mass Assignment: Attackers can modify object properties they should not have access to, potentially leading to privilege escalation, data tampering, or bypassing security mechanisms.',
        recommendation: 'When exposing an object using an API endpoint, always make sure that the user should have access to the object\'s properties you expose. Avoid using generic methods such as to_json() and to_string(). Cherry-pick specific object properties you specifically want to return. If possible, avoid using functions that automatically bind a client\'s input into code variables or internal objects.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N'
    },
    {
        id: 'API-04-2023',
        title: 'Unrestricted Resource Consumption',
        severity: 'High',
        category: 'API',
        owasp_reference: 'API4:2023',
        description: 'Satisfying API requests requires resources such as network bandwidth, CPU, memory, and storage. Other resources such as emails/SMS/phone calls or biometrics validation are made available by service providers via API integrations, and paid for per request. Successful attacks can lead to Denial of Service or an increase in operational costs.',
        impact: 'Exploitation may lead to DoS due to resource starvation, but it can also lead to operational cost increases such as those for infrastructure due to higher CPU demand, increasing cloud storage needs, etc.',
        recommendation: 'Implement rate limiting. Limit payload sizes. Tailor the rate limiting to match what API methods, clients, or addresses need or should be allowed to get. Add proper server-side validation for query string and request body parameters, specifically the one that controls the number of records to be returned in the response. Define and enforce a maximum size limit on all incoming parameters and payloads.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
    },
    {
        id: 'API-05-2023',
        title: 'Broken Function Level Authorization',
        severity: 'Critical',
        category: 'API',
        owasp_reference: 'API5:2023',
        description: 'Complex access control policies with different hierarchies, groups, and roles, and an unclear separation between administrative and regular functions, tend to lead to authorization flaws. By exploiting these issues, attackers can gain access to other users\' resources and/or administrative functions.',
        impact: 'Attackers can exploit these flaws to access unauthorized functionality. Administrative functions are key targets for this type of attack and may lead to data disclosure, data loss, or data corruption. Ultimately, it may lead to service disruption.',
        recommendation: 'Your application should have a consistent and easy-to-analyze authorization module that is invoked from all your business functions. Frequently, such protection is provided by one or more components external to the application code. Deny all access by default. Review your API endpoints against function level authorization flaws, while keeping in mind the business logic of the application and groups hierarchy.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H'
    },
    {
        id: 'API-06-2023',
        title: 'Unrestricted Access to Sensitive Business Flows',
        severity: 'Medium',
        category: 'API',
        owasp_reference: 'API6:2023',
        description: 'APIs vulnerable to this risk expose a business flow - such as buying a ticket, or posting a comment - without compensating for how the functionality could harm the business if used excessively in an automated manner. This doesn\'t necessarily come from implementation bugs.',
        impact: 'The business impact of excessive access to sensitive business flows varies from business to business. Attackers may be able to buy all the inventory of a high-demand item at once and resell it for a higher price (scalping). They may abuse a referral program to generate revenue. They may scrape data for competitive intelligence.',
        recommendation: 'Identify the business flows that might harm the business if they are excessively used. Implement appropriate protections such as device fingerprinting, human detection (captcha), non-human patterns (analyze the user flow to detect non-human patterns). Implement rate limiting for sensitive business flows.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L'
    },
    {
        id: 'API-07-2023',
        title: 'Server Side Request Forgery',
        severity: 'High',
        category: 'API',
        owasp_reference: 'API7:2023',
        description: 'Server-Side Request Forgery (SSRF) flaws can occur when an API is fetching a remote resource without validating the user-supplied URI. This enables an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall or a VPN.',
        impact: 'Successful exploitation might lead to internal services enumeration (e.g. port scanning), information disclosure, bypassing firewalls or other security mechanisms, or even remote code execution.',
        recommendation: 'Isolate the resource fetching mechanism in your network. Whenever possible, use allow lists of remote origins users are expected to download resources from, URL schemas and ports, accepted media types for a given functionality. Disable HTTP redirections. Use a well-tested and maintained URL parser to avoid issues caused by URL parsing inconsistencies.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H'
    },
    {
        id: 'API-08-2023',
        title: 'Security Misconfiguration',
        severity: 'Medium',
        category: 'API',
        owasp_reference: 'API8:2023',
        description: 'APIs and the systems supporting them typically contain complex configurations, meant to make the APIs more customizable. Software engineers and DevOps teams can miss these configurations, or don\'t follow security best practices when it comes to configuration, opening the door for different types of attacks.',
        impact: 'Security misconfigurations can expose sensitive user data, and may lead to full server compromise.',
        recommendation: 'Establish repeatable hardening and patching processes. Automate the process of locating configuration flaws. Disable unnecessary features. Ensure API can only be accessed by the specified HTTP verbs. APIs expecting to be accessed from browser-based clients should implement a proper Cross-Origin Resource Sharing (CORS) policy.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L'
    },
    {
        id: 'API-09-2023',
        title: 'Improper Inventory Management',
        severity: 'Medium',
        category: 'API',
        owasp_reference: 'API9:2023',
        description: 'APIs tend to expose more endpoints than traditional web applications, making proper and updated documentation highly important. A proper inventory of hosts and deployed API versions also are important to mitigate issues such as deprecated API versions and exposed debug endpoints.',
        impact: 'Attackers may gain access to sensitive data, or even take over the server through old, unpatched API versions connected to the same database.',
        recommendation: 'Inventory all API hosts and document important aspects of each one of them, focusing on the API environment, who should have network access to the host, the API version, etc. Inventory integrated services and document important aspects such as their role in the system, what data is exchanged, and its sensitivity. Document all aspects of your API such as authentication, errors, redirects, rate limiting, CORS policy, and endpoints.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'
    },
    {
        id: 'API-10-2023',
        title: 'Unsafe Consumption of APIs',
        severity: 'High',
        category: 'API',
        owasp_reference: 'API10:2023',
        description: 'Developers tend to trust data received from third-party APIs more than user input. This is especially true for APIs offered by well-known companies. Because of that, developers tend to adopt weaker security standards, for instance, in regards to input validation and sanitization.',
        impact: 'The impact varies according to what the API does with the data received from third-party APIs. If the data is not properly validated and sanitized, it might lead to various types of injection attacks.',
        recommendation: 'When evaluating service providers, assess their API security posture. Ensure all API interactions happen over a secure communication channel (TLS). Always validate and properly sanitize data received from integrated APIs before using it. Maintain an allowlist of well-known locations integrated APIs may redirect yours to.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
    },

    // ===== OWASP LLM Top 10 2025 =====
    {
        id: 'LLM-01-2025',
        title: 'Prompt Injection',
        severity: 'Critical',
        category: 'LLM',
        owasp_reference: 'LLM01:2025',
        description: 'A Prompt Injection Vulnerability occurs when user prompts alter the LLM\'s behavior or output in unintended ways. These vulnerabilities can lead to unauthorized access, data breaches, and compromised decision-making. Direct prompt injections occur when a user directly manipulates the LLM prompt, while indirect prompt injections occur when external sources manipulate the LLM input.',
        impact: 'Prompt injection can lead to data exfiltration, social engineering, generation of harmful content, unauthorized actions, and manipulation of the LLM\'s intended behavior. In severe cases, it can result in complete bypass of safety guardrails and security controls.',
        recommendation: 'Implement strict input validation and sanitization. Use separate contexts for instructions and user input. Implement privilege controls and authorization for LLM actions. Apply human-in-the-loop controls for sensitive operations. Monitor and log LLM interactions for suspicious patterns. Use prompt engineering techniques to make the system more resilient to injection attacks.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N'
    },
    {
        id: 'LLM-02-2025',
        title: 'Sensitive Information Disclosure',
        severity: 'High',
        category: 'LLM',
        owasp_reference: 'LLM02:2025',
        description: 'Sensitive information can affect both the LLM and its application context. LLMs may inadvertently reveal confidential data, proprietary algorithms, or other sensitive information through their responses. This can occur through training data leakage, overfitting, or inadequate filtering of outputs.',
        impact: 'Disclosure of sensitive information can lead to privacy violations, exposure of proprietary information, security breaches, and regulatory compliance issues. This can result in legal liabilities, loss of competitive advantage, and damage to user trust.',
        recommendation: 'Implement data sanitization and scrubbing for training data. Use differential privacy techniques. Implement output filtering to detect and prevent sensitive information disclosure. Limit the LLM\'s access to sensitive data. Implement proper access controls and data classification. Regularly audit LLM outputs for potential information leakage.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N'
    },
    {
        id: 'LLM-03-2025',
        title: 'Supply Chain Vulnerabilities',
        severity: 'High',
        category: 'LLM',
        owasp_reference: 'LLM03:2025',
        description: 'LLM supply chains are susceptible to various vulnerabilities, which can affect the integrity of training data, ML models, and deployment platforms. These vulnerabilities can be exploited to introduce backdoors, biases, or other malicious modifications into the LLM system.',
        impact: 'Supply chain attacks can compromise the entire LLM system, leading to biased outputs, backdoors, data poisoning, or complete system compromise. This can affect all users of the LLM and be difficult to detect and remediate.',
        recommendation: 'Vet data sources and suppliers carefully. Use only reputable pre-trained models and datasets. Implement model and data provenance tracking. Use cryptographic signing for models and datasets. Regularly scan for vulnerabilities in dependencies. Implement supply chain security best practices. Maintain an inventory of all components in the LLM supply chain.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H'
    },
    {
        id: 'LLM-04-2025',
        title: 'Data and Model Poisoning',
        severity: 'Critical',
        category: 'LLM',
        owasp_reference: 'LLM04:2025',
        description: 'Data poisoning occurs when pre-training, fine-tuning, or embedding data is manipulated to introduce vulnerabilities, backdoors, or biases. This can compromise the model\'s security, effectiveness, and ethical behavior. Model poisoning extends this to the manipulation of the model itself.',
        impact: 'Poisoned models can produce biased, harmful, or incorrect outputs. Attackers can trigger backdoors to manipulate the model\'s behavior for specific inputs. This can lead to misinformation, discrimination, security breaches, and loss of user trust.',
        recommendation: 'Verify the supply chain of training data. Implement data validation and sanitization. Use anomaly detection to identify poisoned data. Implement robust model validation and testing. Use adversarial training to improve model resilience. Regularly retrain and validate models. Implement monitoring for unusual model behavior.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H'
    },
    {
        id: 'LLM-05-2025',
        title: 'Improper Output Handling',
        severity: 'High',
        category: 'LLM',
        owasp_reference: 'LLM05:2025',
        description: 'Improper Output Handling refers specifically to insufficient validation, sanitization, and handling of LLM outputs before they are passed to other components and systems. This can expose backend systems to attacks such as XSS, CSRF, SSRF, privilege escalation, and remote code execution.',
        impact: 'Improper output handling can lead to XSS and CSRF in web browsers, SSRF, privilege escalation, or remote code execution on backend systems. The LLM output, if not properly validated, can be used to exploit vulnerabilities in downstream systems.',
        recommendation: 'Treat LLM output as untrusted user input. Apply proper input validation and sanitization to LLM outputs before using them in downstream systems. Encode output appropriately for the context (HTML encoding, JavaScript encoding, etc.). Implement Content Security Policy (CSP) for web applications. Use parameterized queries for database operations. Implement least privilege principles for LLM system access.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H'
    },
    {
        id: 'LLM-06-2025',
        title: 'Excessive Agency',
        severity: 'High',
        category: 'LLM',
        owasp_reference: 'LLM06:2025',
        description: 'An LLM-based system is often granted a degree of agency to take actions based on its outputs. Excessive agency occurs when the LLM has too much autonomy, can access sensitive functions, or can make decisions without appropriate oversight. This can lead to unintended consequences or malicious exploitation.',
        impact: 'Excessive agency can result in unauthorized actions, data modification or deletion, privilege escalation, or execution of unintended operations. In severe cases, it can lead to significant business disruption or security breaches.',
        recommendation: 'Limit the LLM\'s permissions and capabilities to the minimum necessary. Implement human-in-the-loop controls for sensitive operations. Use explicit user confirmation for critical actions. Implement robust logging and monitoring of LLM actions. Apply the principle of least privilege. Implement rate limiting and anomaly detection for LLM-initiated actions.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H'
    },
    {
        id: 'LLM-07-2025',
        title: 'System Prompt Leakage',
        severity: 'Medium',
        category: 'LLM',
        owasp_reference: 'LLM07:2025',
        description: 'The system prompt leakage vulnerability in LLMs refers to the risk of exposing the underlying instructions, configurations, or sensitive information embedded in system prompts. These prompts guide the LLM\'s behavior and may contain proprietary information, security configurations, or operational details that should remain confidential.',
        impact: 'System prompt leakage can reveal proprietary information about how the LLM system works, expose security configurations, provide attackers with information to craft more effective attacks, or reveal sensitive business logic.',
        recommendation: 'Design system prompts to avoid including sensitive information. Implement output filtering to detect and prevent system prompt disclosure. Use separate contexts for system instructions and user interactions. Regularly test for prompt leakage vulnerabilities. Implement monitoring for attempts to extract system prompts.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'
    },
    {
        id: 'LLM-08-2025',
        title: 'Vector and Embedding Weaknesses',
        severity: 'Medium',
        category: 'LLM',
        owasp_reference: 'LLM08:2025',
        description: 'Vectors and embeddings vulnerabilities present significant security risks in systems utilizing LLMs and Retrieval-Augmented Generation (RAG). These vulnerabilities can be exploited to manipulate LLM behavior, extract sensitive information, or inject malicious content through the manipulation of vector databases and embedding processes.',
        impact: 'Exploitation can lead to retrieval of incorrect or manipulated information, injection of malicious content into the knowledge base, extraction of sensitive information through vector similarity searches, or poisoning of the embedding space to influence LLM outputs.',
        recommendation: 'Implement access controls for vector databases. Validate and sanitize data before embedding. Use encryption for stored vectors. Implement monitoring for unusual vector similarity patterns. Regularly audit and validate embedding integrity. Implement proper isolation between different data sources in vector databases.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:L/A:N'
    },
    {
        id: 'LLM-09-2025',
        title: 'Misinformation',
        severity: 'Medium',
        category: 'LLM',
        owasp_reference: 'LLM09:2025',
        description: 'Misinformation from LLMs poses a core vulnerability for applications relying on factual accuracy. LLMs can generate plausible but incorrect or misleading information (hallucinations), present outdated information as current, or fail to distinguish between fact and fiction. This is particularly critical in domains requiring high accuracy.',
        impact: 'Misinformation can lead to poor decision-making, spread of false information, reputational damage, legal liabilities, and erosion of user trust. In critical domains like healthcare, finance, or legal advice, it can have severe real-world consequences.',
        recommendation: 'Implement fact-checking mechanisms and source verification. Use retrieval-augmented generation (RAG) with verified sources. Clearly communicate the LLM\'s limitations to users. Implement confidence scoring for outputs. Use multiple models or approaches for critical information. Implement human review for high-stakes decisions. Regularly update and fine-tune models with accurate, current data.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N'
    },
    {
        id: 'LLM-10-2025',
        title: 'Unbounded Consumption',
        severity: 'High',
        category: 'LLM',
        owasp_reference: 'LLM10:2025',
        description: 'Unbounded consumption vulnerabilities occur when LLM applications fail to properly limit resource usage, leading to excessive consumption of computational resources, API calls, or costs. This can result from processing excessively long inputs, generating overly long outputs, or allowing unlimited API requests.',
        impact: 'Unbounded consumption can lead to denial of service, excessive costs, degraded service quality for other users, and resource exhaustion. Attackers can exploit this to cause financial damage or service disruption.',
        recommendation: 'Implement rate limiting for API requests. Set maximum limits for input and output lengths. Implement timeouts for LLM operations. Monitor and alert on unusual resource consumption patterns. Implement cost controls and budgets. Use caching to reduce redundant processing. Implement queue management and request prioritization.',
        cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
    }
];

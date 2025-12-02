# DOCX Template Instructions

## Creating the Master Template

To create a custom `master.docx` template:

1. **Create a new Word document** using Microsoft Word or LibreOffice

2. **Add Jinja2 placeholders** in the following format:
   - `{{ variable_name }}` for simple values
   - `{% for item in list %}...{% endfor %}` for loops
   - `{{ variable|filter }}` for filtered values

3. **Available Context Variables:**

   ### Report Info
   - `{{ report_title }}` - Title of the report
   - `{{ report_type }}` - Type of report
   - `{{ classification }}` - Confidentiality level
   - `{{ generated_at }}` - Generation timestamp
   - `{{ generated_by }}` - Author name
   - `{{ version }}` - Report version

   ### Client Info
   - `{{ client.name }}` - Client company name
   - `{{ client.email }}` - Client contact email
   - `{{ client.address }}` - Client address
   - `{{ client.industry }}` - Client industry

   ### Project Info
   - `{{ project.name }}` - Project name
   - `{{ project.project_type }}` - Assessment type
   - `{{ project.methodology }}` - Testing methodology
   - `{{ project.start_date }}` - Start date
   - `{{ project.end_date }}` - End date
   - `{{ project.scope }}` - List of scope items
   - `{{ project.compliance_frameworks }}` - List of frameworks

   ### Statistics
   - `{{ stats.total_findings }}` - Total finding count
   - `{{ stats.critical_count }}` - Critical findings
   - `{{ stats.high_count }}` - High findings
   - `{{ stats.medium_count }}` - Medium findings
   - `{{ stats.low_count }}` - Low findings
   - `{{ stats.info_count }}` - Info findings
   - `{{ stats.risk_score }}` - Overall risk score (0-100)
   - `{{ stats.risk_level }}` - Risk level text

   ### Findings Loop

   {% for finding in findings %}
   {{ finding.reference_id }}
   {{ finding.title }}
   {{ finding.severity }}
   {{ finding.cvss_score }}
   {{ finding.description_plain }}  <- Use _plain for Word
   {{ finding.remediation_plain }}
   {{ finding.affected_systems }}
   {{ finding.cve_id }}
   {{ finding.status }}
   {% endfor %}

   ### Findings by Severity
   {% for finding in findings_by_severity.critical %}...{% endfor %}
   {% for finding in findings_by_severity.high %}...{% endfor %}

4. **Save as master.docx** in this directory

## Fallback Behavior

If no master.docx template exists, the DOCXService will automatically generate a basic professional report using the fallback generator.

## Tips

- Use Word's built-in styles (Heading 1, Heading 2, etc.) for consistent formatting
- Tables with {% tr %} tags can be used for repeating rows
- Rich text fields have _html and _plain variants - use _plain for Word compatibility
- Test your template with sample data before deploying

"""
Rich Text Service for Report Generation

Converts Markdown content to sanitized HTML for PDF generation
and plain text for DOCX/summary fields.
"""
import markdown
import bleach
import re
from typing import Optional


class RichTextService:
    """Service for converting and sanitizing rich text content."""
    
    # Allowed HTML tags for PDF rendering
    ALLOWED_TAGS = [
        'p', 'b', 'i', 'strong', 'em', 
        'ul', 'ol', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'code', 'pre', 'br', 'hr',
        'blockquote', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div'
    ]
    
    # Allowed attributes for HTML tags
    ALLOWED_ATTRIBUTES = {
        '*': ['class', 'id'],
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'td': ['colspan', 'rowspan'],
        'th': ['colspan', 'rowspan'],
    }
    
    # Markdown extensions for enhanced parsing
    MARKDOWN_EXTENSIONS = [
        'extra',           # Tables, fenced code, footnotes, etc.
        'codehilite',      # Syntax highlighting for code blocks
        'tables',          # Table support
        'fenced_code',     # Fenced code blocks (```)
        'nl2br',           # Newlines to <br>
        'sane_lists',      # Better list handling
    ]

    @staticmethod
    def to_html(text: str, strip_unsafe: bool = True) -> str:
        """
        Converts Markdown to sanitized HTML for the PDF engine.
        
        Args:
            text: Markdown formatted text
            strip_unsafe: Whether to sanitize HTML (default: True)
            
        Returns:
            Sanitized HTML string
        """
        if not text:
            return ""
        
        # Convert Markdown to HTML
        html = markdown.markdown(
            text, 
            extensions=RichTextService.MARKDOWN_EXTENSIONS,
            extension_configs={
                'codehilite': {
                    'css_class': 'highlight',
                    'linenums': False,
                }
            }
        )
        
        if strip_unsafe:
            # Sanitize HTML to prevent XSS
            html = bleach.clean(
                html, 
                tags=RichTextService.ALLOWED_TAGS, 
                attributes=RichTextService.ALLOWED_ATTRIBUTES,
                strip=True
            )
        
        return html

    @staticmethod
    def to_plain(text: str) -> str:
        """
        Strips all formatting for summary fields in DOCX or plain text exports.
        
        Args:
            text: Markdown or HTML formatted text
            
        Returns:
            Plain text string with no formatting
        """
        if not text:
            return ""
        
        # First convert Markdown to HTML
        html = markdown.markdown(text)
        
        # Strip all HTML tags
        plain = bleach.clean(html, tags=[], strip=True)
        
        # Clean up extra whitespace
        plain = re.sub(r'\s+', ' ', plain).strip()
        
        return plain

    @staticmethod
    def sanitize_html(html: str) -> str:
        """
        Sanitizes existing HTML content (e.g., from rich text editor).
        
        Args:
            html: Raw HTML string
            
        Returns:
            Sanitized HTML string
        """
        if not html:
            return ""
        
        return bleach.clean(
            html,
            tags=RichTextService.ALLOWED_TAGS,
            attributes=RichTextService.ALLOWED_ATTRIBUTES,
            strip=True
        )

    @staticmethod
    def html_to_markdown(html: str) -> str:
        """
        Converts HTML back to Markdown (basic conversion).
        Useful for editing existing content.
        
        Args:
            html: HTML string
            
        Returns:
            Markdown formatted string
        """
        if not html:
            return ""
        
        # Basic HTML to Markdown conversion using regex
        text = html
        
        # Convert common HTML tags to Markdown
        replacements = [
            (r'<strong>(.*?)</strong>', r'**\1**'),
            (r'<b>(.*?)</b>', r'**\1**'),
            (r'<em>(.*?)</em>', r'*\1*'),
            (r'<i>(.*?)</i>', r'*\1*'),
            (r'<h1>(.*?)</h1>', r'# \1\n'),
            (r'<h2>(.*?)</h2>', r'## \1\n'),
            (r'<h3>(.*?)</h3>', r'### \1\n'),
            (r'<h4>(.*?)</h4>', r'#### \1\n'),
            (r'<code>(.*?)</code>', r'`\1`'),
            (r'<br\s*/?>', '\n'),
            (r'<hr\s*/?>', '\n---\n'),
            (r'<p>(.*?)</p>', r'\1\n\n'),
            (r'<li>(.*?)</li>', r'- \1\n'),
        ]
        
        for pattern, replacement in replacements:
            text = re.sub(pattern, replacement, text, flags=re.DOTALL | re.IGNORECASE)
        
        # Strip remaining HTML tags
        text = bleach.clean(text, tags=[], strip=True)
        
        # Clean up whitespace
        text = re.sub(r'\n{3,}', '\n\n', text).strip()
        
        return text

    @staticmethod
    def escape_for_pdf(text: str) -> str:
        """
        Escapes special characters for PDF generation engines like WeasyPrint.
        
        Args:
            text: Text to escape
            
        Returns:
            Escaped text safe for PDF rendering
        """
        if not text:
            return ""
        
        # Escape characters that might break PDF rendering
        escapes = [
            ('&', '&amp;'),
            ('<', '&lt;'),
            ('>', '&gt;'),
        ]
        
        for char, escape in escapes:
            text = text.replace(char, escape)
        
        return text

    @staticmethod
    def truncate(text: str, max_length: int = 200, suffix: str = '...') -> str:
        """
        Truncates text to a maximum length, preserving word boundaries.
        
        Args:
            text: Text to truncate
            max_length: Maximum length (default: 200)
            suffix: Suffix to append if truncated (default: '...')
            
        Returns:
            Truncated text
        """
        if not text or len(text) <= max_length:
            return text or ""
        
        # Find the last space before max_length
        truncated = text[:max_length].rsplit(' ', 1)[0]
        
        return truncated + suffix


# Singleton instance for easy import
rich_text_service = RichTextService()


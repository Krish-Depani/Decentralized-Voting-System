import markdown
import pdfkit
import os

# Read the markdown file
with open('Project Report 2025.md', 'r', encoding='utf-8') as f:
    markdown_text = f.read()

# Convert markdown to HTML
html = markdown.markdown(markdown_text, extensions=['tables', 'fenced_code'])

# Add some CSS for better formatting
html = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Decentralized Voting System Using Ethereum Blockchain</title>
    <style>
        body {{
            font-family: "Times New Roman", Times, serif;
            margin: 40px;
            line-height: 1.5;
            color: #333;
        }}
        h1, h2, h3, h4 {{
            color: #006400;
            font-weight: bold;
        }}
        h1 {{
            text-align: center;
            font-size: 24pt;
            margin-bottom: 5px;
        }}
        h2 {{
            font-size: 18pt;
            margin-top: 20px;
            margin-bottom: 10px;
        }}
        h3 {{
            font-size: 14pt;
            margin-top: 15px;
        }}
        p {{
            text-align: justify;
            margin-bottom: 10px;
        }}
        code {{
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
            font-size: 90%;
        }}
        pre {{
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }}
        ul, ol {{
            margin-bottom: 10px;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #f2f2f2;
        }}
        .author {{
            text-align: center;
            font-style: italic;
            margin-bottom: 30px;
        }}
        .page-break {{
            page-break-after: always;
        }}
    </style>
</head>
<body>
    {html}
</body>
</html>
'''

# Save the HTML file
with open('Project_Report_2025.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Convert HTML to PDF
# Specify the path to wkhtmltopdf
path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'

try:
    # Use the installed wkhtmltopdf with explicit path
    config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)
    pdfkit.from_file('Project_Report_2025.html', 'Project Report 2025.pdf', configuration=config)
    print("PDF created successfully!")
except Exception as e:
    print(f"Error creating PDF: {e}")
    print("\nPlease check if wkhtmltopdf is installed at the specified path:")
    print(f"  {path_wkhtmltopdf}")
    print("\nIf it's installed elsewhere, update the path in the script.")
    print("\nAlternatively, you can open the HTML file in a browser and print to PDF:")
    print("  Project_Report_2025.html")

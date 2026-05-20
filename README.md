# Milind Sahu — Personal Portfolio
## AXL — Axiom Labs

A minimal, technical personal portfolio + research identity website.

---

## 📁 FOLDER STRUCTURE

```
/
├── index.html                    ← Homepage (hero, about, research, projects preview, gallery)
├── projects.html                 ← Full projects page with filter
├── axiom-labs.html               ← AXL dedicated page
├── teaching.html                 ← Teaching & research page
├── research-internship.html       ← Research internship journal listing
├── research-entry.html           ← Research entry detail page template
├── style.css                     ← All styles
├── script.js                     ← All JavaScript
├── content/
│   └── research-internship/      ← Daily research journal entries (Markdown)
│       ├── 2026-05-20.md         ← Research entry (YYYY-MM-DD format)
│       ├── 2026-05-21.md
│       └── ...
└── assets/
    ├── images/
    │   ├── projects/   ← Put project screenshots here
    │   │   ├── nilm.jpg
    │   │   ├── tracewaste.jpg
    │   │   ├── ecofusion.jpg
    │   │   ├── hev.jpg
    │   │   └── ecocraft.jpg
    │   └── gallery/    ← Put your photos here
    │       ├── photo1.jpg
    │       ├── photo2.jpg
    │       └── ...
    └── logo/
        └── axl-favicon.svg
```

---

## 📖 RESEARCH INTERNSHIP JOURNAL

This site includes a daily research internship journal system that automatically lists and displays your research progress.

### Adding a new research internship entry

Create a new Markdown file inside:

```
/content/research-internship/
```

Use this naming format:

```
YYYY-MM-DD.md
```

**Example:**

```
2026-05-21.md
2026-05-22.md
```

### Markdown file format

Each `.md` file should include frontmatter at the top, followed by Markdown content:

```md
---
title: "Day 2: Paper Reading and Analysis"
date: "2026-05-21"
tags: ["research", "papers", "learning"]
summary: "Read papers related to my research topic and took detailed notes."
---

## What I worked on today

Describe your research activities here.

## Key learning

What did you learn today?

## Next steps

- Next item
- Next item
```

### Frontmatter fields

- **title** (required): Entry title
- **date** (required): Entry date in `YYYY-MM-DD` format
- **tags** (optional): Array of tags like `["tag1", "tag2"]`
- **summary** (optional): One-line summary of the entry

### Markdown content

After the frontmatter (`---`), write your research entry using standard Markdown:

- **Headings**: `## Section`, `### Subsection`
- **Paragraphs**: Plain text
- **Lists**: `- Item` or `1. Item`
- **Code**: `` `inline code` `` or ` ``` code block ``` `
- **Links**: `[text](url)`
- **Bold/Italic**: `**bold**`, `*italic*`
- **Blockquotes**: `> Quote`
- **Tables**: Standard Markdown tables

### How it works

1. Create a new `.md` file in `/content/research-internship/`
2. Add frontmatter and your research notes
3. Commit and push to GitHub
4. The site automatically shows your entry on the Research Internship page
5. Entries appear in reverse chronological order (newest first)

### View your entries

- **Listing page**: `/research-internship` - Shows all entries with titles, dates, summaries, and tags
- **Detail page**: `/research-entry.html?slug=2026-05-21` - Shows full Markdown-rendered entry

The listing page updates automatically when you add new files. No code changes needed.

---


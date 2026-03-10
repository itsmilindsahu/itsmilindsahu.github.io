# Milind Sahu — Personal Portfolio
## AXL — Axiom Labs

A minimal, technical personal portfolio + research identity website.

---

## 📁 FOLDER STRUCTURE

```
/
├── index.html          ← Homepage (hero, about, research, projects preview, gallery)
├── projects.html       ← Full projects page with filter
├── axiom-labs.html     ← AXL dedicated page
├── style.css           ← All styles
├── script.js           ← All JavaScript
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

## 🚀 DEPLOY TO GITHUB PAGES

### Step 1 — Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `itsmilindsahu.github.io`  ← exactly this name!
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload Files
**Option A — GitHub Web UI (easiest):**
1. Open your new repo on GitHub
2. Click **"uploading an existing file"**
3. Drag and drop ALL files and folders from this folder
4. Commit changes

**Option B — Git CLI:**
```bash
cd milind-portfolio
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/itsmilindsahu/itsmilindsahu.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to repo **Settings** → **Pages**
2. Source: **Deploy from branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**

### Step 4 — Visit Your Site
After ~2 minutes, your site will be live at:
**https://itsmilindsahu.github.io**

---

## 📸 ADDING PHOTOS

### Project Images
Save screenshots/photos as:
- `assets/images/projects/nilm.jpg`
- `assets/images/projects/tracewaste.jpg`
- `assets/images/projects/ecofusion.jpg`
- `assets/images/projects/hev.jpg`

**Recommended size:** 800×450px (16:9 ratio)

### Gallery Photos
Save your hackathon/event photos as:
- `assets/images/gallery/photo1.jpg`
- `assets/images/gallery/photo2.jpg`
- ... up to photo12.jpg

To add more gallery slots, copy one of the `<div class="gallery-item">` blocks in `index.html` and change the number.

**Recommended size:** Square, 600×600px minimum

---

## ✏️ CUSTOMIZATION

### Add a New Project (projects.html)
Copy this block and fill in your details:
```html
<article class="project-card fade-in" data-category="energy ml">
  <div class="project-img" style="background:#e8e8e4;min-height:190px;display:flex;align-items:center;justify-content:center;">
    <img src="assets/images/projects/YOURIMAGE.jpg" alt="Project Name"
      onerror="this.style.display='none';">
  </div>
  <div class="project-body">
    <div class="project-category">Category</div>
    <div class="project-title">Your Project Title</div>
    <p class="project-desc">Description of your project.</p>
    <div class="project-badge">🏆 Achievement</div>
    <div class="project-links">
      <a href="YOUR_GITHUB_LINK" target="_blank" class="project-link">GitHub</a>
    </div>
  </div>
</article>
```

**Filter categories** (data-category): `energy`, `ml`, `policy`, `systems`, `sustainability`

### Update Research Interests (index.html)
Find `<section id="research">` and edit the `.interest-item` blocks.

### Change Accent Color (style.css)
Line 14: `--accent: #1a56db;` ← change this hex code

### Add More Ticker Items (index.html)
Find `.ticker` and add:
```html
<span class="ticker-item"><strong>Your Achievement</strong> <span class="sep">·</span> Competition Name</span>
```

---

## 🔧 UPDATING LINKS

In all HTML files, find and replace:
- `https://github.com/itsmilindsahu` → your actual GitHub URL
- `https://linkedin.com/in/itsmilindsahu` → your actual LinkedIn URL
- `milind20251175@students.iisertirupati.ac.in` → your email

---

## 📱 MOBILE

The site is fully responsive. It works on phones, tablets, and desktop.
The custom cursor is disabled on touch devices automatically.

---

Built with HTML + CSS + Vanilla JS. No frameworks, no build step.
Just open `index.html` in a browser to preview locally.

# In-Website Page & PDF Viewer System

## Overview

This system allows your website to:
- ✅ Open research pages in a modal (no redirects)
- ✅ Display PDFs with a built-in viewer (zoom, navigate, download)
- ✅ Keep GitHub links working as-is
- ✅ Smooth animations and dark theme integration

---

## Files

1. **research-internship-updated.html** - Updated version with modal integration
2. **viewer.html** - Standalone viewer (optional reference)

---

## How It Works

### 1. **Page Links (Research Cards)**

**Original:**
```html
<a class="research-card green" href="research/gp-regression.html">
```

**Updated (with modal):**
```html
<div class="research-card green" data-page="research/gp-regression.html" data-title="Gaussian Process Regression">
```

**Key changes:**
- Changed `<a>` to `<div>` with `data-page` attribute
- Added `data-title` for modal header
- JavaScript intercepts clicks and opens in modal iframe
- No page redirects!

---

## 2. **PDF Viewer Integration**

### Option A: Using the Modal System (Recommended)

Add a button or link that triggers the PDF viewer:

```html
<button onclick="openPDFModal('path/to/your/paper.pdf', 'Research Paper')">
  View PDF →
</button>
```

Or create a clickable card:

```html
<div class="paper-card" onclick="openPDFModal('research/paper.pdf', 'My Paper')">
  <div class="paper-num">PAPER · 01</div>
  <h3>My Research Paper</h3>
  <div class="paper-desc">Click to view PDF</div>
  <div class="paper-arrow">View PDF →</div>
</div>
```

### Add PDF Functions to Your HTML

Insert this `<script>` block in your page (it's already in research-internship-updated.html):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Open PDF in modal
  function openPDFModal(pdfUrl, title = 'Document') {
    // [PDF viewer code here - see full implementation below]
  }
</script>
```

---

## Complete PDF Integration Example

Here's how to add PDF viewing to your pages:

### HTML Card:
```html
<div class="paper-card fade-in" onclick="openPDFModal('research/my-paper.pdf', 'My Research Paper')">
  <div class="paper-num">WP · 03 · PREPRINT</div>
  <h3>My Research Paper</h3>
  <div class="paper-sub">
    <span class="badge preprint">PDF · 12 pages</span> 
    Machine Learning
  </div>
  <div class="paper-desc">Click to view the full PDF with zoom and navigation.</div>
  <div class="paper-arrow">View PDF →</div>
</div>
```

### Features Included:

✅ **Page Navigation**
- Previous / Next buttons
- Jump to specific page
- Display current page / total pages

✅ **Zoom Controls**
- Zoom in (+)
- Zoom out (−)
- Adjustable scale

✅ **Download Button**
- Download PDF to device

✅ **Responsive**
- Works on mobile
- Touch-friendly controls
- Full-screen compatible

---

## Step-by-Step Implementation

### Step 1: Replace Your Current File

```bash
# Backup old file
cp research-internship.html research-internship.html.backup

# Use the new version
cp research-internship-updated.html research-internship.html
```

### Step 2: Update Internal Links

For each research page you want in-modal, convert from:
```html
<a href="research/page.html">Link</a>
```

To:
```html
<div data-page="research/page.html" data-title="Page Title">Link</div>
```

### Step 3: Add PDF Links

For PDFs, add clickable elements:
```html
<div onclick="openPDFModal('docs/paper.pdf', 'Paper Title')">
  Click to view PDF
</div>
```

### Step 4: Upload to GitHub

```bash
git add research-internship.html
git commit -m "feat: add in-website modal viewer for pages and PDFs"
git push
```

---

## API Reference

### For Pages:

```javascript
openPageModal(pagePath, title)
```

**Parameters:**
- `pagePath` (string): Path to HTML page (e.g., "research/gp-regression.html")
- `title` (string): Title shown in modal header

**Example:**
```javascript
openPageModal('research/gp-regression.html', 'Gaussian Process Regression')
```

### For PDFs:

```javascript
openPDFModal(pdfUrl, title)
```

**Parameters:**
- `pdfUrl` (string): URL to PDF file (e.g., "docs/paper.pdf")
- `title` (string): Title shown in modal header

**Example:**
```javascript
openPDFModal('research/wasserstein-diffusion.pdf', 'Wasserstein Diffusion Paper')
```

---

## Styling Customization

The modal uses CSS custom properties. To customize colors/fonts, edit the `:root` section:

```css
:root {
  --bg: #0a0a0a;           /* Background */
  --accent: #c8ff00;        /* Highlight color */
  --accent2: #ff6b35;       /* Secondary highlight */
  --text: #e8e8e8;          /* Text color */
  --text2: #888888;         /* Dim text */
  --border: #222222;        /* Border color */
  --mono: 'Space Mono', monospace;  /* Font */
}
```

---

## Modal Features

### Keyboard Shortcuts:
- **ESC** - Close modal
- **Enter** (in page input) - Go to page

### Buttons:
- **← Prev / Next →** - Navigate PDF pages
- **− Zoom / + Zoom** - Adjust zoom level
- **Download PDF ↓** - Save PDF to device
- **× Close** - Close modal

### Click to Close:
- Click the overlay (background) to close
- Click the × button to close

---

## Troubleshooting

### PDFs Not Loading?

**Issue:** "Failed to load PDF" message

**Solutions:**
1. Check PDF URL is correct
2. Ensure PDF is CORS-enabled
3. Try a different PDF host:
   - GitHub Raw: `https://raw.githubusercontent.com/user/repo/main/file.pdf`
   - CDN: `https://cdn.example.com/paper.pdf`
   - Direct: `https://example.com/paper.pdf`

### Pages Not Loading in Modal?

**Issue:** Blank modal or error

**Solutions:**
1. Ensure page path is correct relative to current file
2. Check if page has `X-Frame-Options` header blocking iframes
3. Verify page renders correctly when opened directly

### Modal Not Appearing?

**Issue:** Click does nothing

**Solutions:**
1. Check browser console for errors (F12)
2. Ensure JavaScript is enabled
3. Verify `data-page` attribute is set correctly
4. For PDFs, ensure `openPDFModal()` function is called with `onclick`

---

## Advanced: Custom PDF URLs

### From Google Drive:
```javascript
// Get shareable link, replace /view with /preview
openPDFModal('https://drive.google.com/file/d/FILE_ID/preview', 'Paper')
```

### From GitHub:
```javascript
openPDFModal(
  'https://raw.githubusercontent.com/user/repo/main/paper.pdf', 
  'Paper'
)
```

### From External Server:
```javascript
openPDFModal('https://arxiv.org/pdf/2101.00001.pdf', 'ArXiv Paper')
```

---

## Migration Checklist

- [ ] Backup original `research-internship.html`
- [ ] Replace with `research-internship-updated.html`
- [ ] Test all research card clicks
- [ ] Add PDF links (if needed)
- [ ] Test PDF viewer (zoom, navigation)
- [ ] Test on mobile (responsiveness)
- [ ] Test GitHub links still work
- [ ] Verify Escape key closes modal
- [ ] Check loading animations work
- [ ] Push to GitHub and verify live

---

## Example: Adding Your PDFs

### Current Setup:
```html
<div class="paper-card" data-page="research/hetgnn-fr.html">
  <h3>Fraud Ring Detection via HETGNN</h3>
  <div class="paper-arrow">Open full page →</div>
</div>
```

### With PDF Option:
```html
<div class="paper-card">
  <h3>Fraud Ring Detection via HETGNN</h3>
  <div style="display: flex; gap: 1rem; margin-top: 1rem;">
    <div style="flex: 1;" onclick="openPageModal('research/hetgnn-fr.html', 'HETGNN-FR')">
      <div class="paper-arrow">View Details →</div>
    </div>
    <div onclick="openPDFModal('research/hetgnn-fr.pdf', 'HETGNN-FR Paper')" style="color: var(--accent2); cursor: pointer;">
      📄 PDF
    </div>
  </div>
</div>
```

---

## Support

For questions or issues:
1. Check the browser console (F12) for error messages
2. Verify file paths are correct
3. Ensure all dependencies load (PDF.js CDN)
4. Test with a simple example first

---

## License

This viewer system uses:
- **PDF.js** - Mozilla's PDF rendering library (Apache 2.0)
- Your custom styling and functionality

Feel free to modify and customize!

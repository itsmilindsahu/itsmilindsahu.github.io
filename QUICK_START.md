# Quick Implementation Cheat Sheet

## Copy & Paste Code Snippets

---

## 1️⃣ Page Viewer Card (Research Projects)

```html
<!-- BEFORE: -->
<a class="research-card green" href="research/gp-regression.html">
  <!-- content -->
</a>

<!-- AFTER: -->
<div class="research-card green fade-in" data-page="research/gp-regression.html" data-title="Gaussian Process Regression">
  <!-- same content as before -->
</div>
```

**What changed:**
- `<a href=...>` → `<div data-page=...>`
- Added `data-title="Page Title"`
- Removed `fade-in` if not needed, but recommended for consistency

---

## 2️⃣ PDF Viewer Button (Standalone)

```html
<button onclick="openPDFModal('research/paper.pdf', 'My Paper')" 
        style="background: none; border: 1px solid var(--border2); 
               color: var(--text2); font-family: var(--mono); 
               font-size: 11px; padding: 0.5rem 0.75rem; cursor: pointer;">
  📄 View PDF →
</button>
```

---

## 3️⃣ PDF Card (Click to View)

```html
<div class="paper-card fade-in" 
     onclick="openPDFModal('research/my-paper.pdf', 'My Paper Title')">
  <div class="paper-num">WP · 01 · PREPRINT</div>
  <h3>My Paper Title</h3>
  <div class="paper-sub">
    <span class="badge preprint">Preprint</span> Machine Learning
  </div>
  <div class="paper-desc">Click to open PDF viewer with zoom and navigation</div>
  <div class="paper-arrow">View PDF →</div>
</div>
```

---

## 4️⃣ Add PDF Functions (Paste in `<script>` tag)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Open PDF modal
  function openPDFModal(pdfUrl, title = 'Document') {
    const modal = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = title;
    modalBody.innerHTML = '<div class="loading">Loading PDF...</div>';

    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = `
      <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; gap: 1rem;">
        <button onclick="prevPDFPage()" class="modal-btn">← Prev</button>
        <input type="number" id="pageInput" value="1" min="1" 
               style="background: var(--bg); border: 1px solid var(--border2); 
                      color: var(--text); width: 60px; text-align: center; padding: 0.4rem;">
        <span id="pageCount" style="color: var(--text2);">/ 1</span>
        <button onclick="nextPDFPage()" class="modal-btn">Next →</button>
        <div style="margin-left: auto; display: flex; gap: 0.5rem;">
          <button onclick="zoomOutPDF()" class="modal-btn">− Zoom</button>
          <button onclick="zoomInPDF()" class="modal-btn">+ Zoom</button>
          <button onclick="downloadPDF('${pdfUrl}')" class="modal-btn">Download</button>
        </div>
      </div>
      <div id="pdfViewer" style="flex: 1; overflow-y: auto; display: flex; justify-content: center; padding: 1rem;"></div>
    `;

    modalBody.innerHTML = '';
    modalBody.appendChild(pdfContainer);
    modal.classList.add('active');

    // Load PDF
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
      window.pdfDoc = pdf;
      window.currentPage = 1;
      window.scale = 1.5;
      document.getElementById('pageCount').textContent = '/ ' + pdf.numPages;
      renderPDFPage(1);
    });
  }

  function renderPDFPage(pageNum) {
    const viewer = document.getElementById('pdfViewer');
    viewer.innerHTML = '<div class="loading">Rendering...</div>';
    
    window.pdfDoc.getPage(pageNum).then(page => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: window.scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        viewer.innerHTML = '';
        viewer.appendChild(canvas);
      });
    });
  }

  function nextPDFPage() {
    if (window.currentPage < window.pdfDoc.numPages) {
      window.currentPage++;
      document.getElementById('pageInput').value = window.currentPage;
      renderPDFPage(window.currentPage);
    }
  }

  function prevPDFPage() {
    if (window.currentPage > 1) {
      window.currentPage--;
      document.getElementById('pageInput').value = window.currentPage;
      renderPDFPage(window.currentPage);
    }
  }

  function zoomInPDF() {
    window.scale += 0.2;
    renderPDFPage(window.currentPage);
  }

  function zoomOutPDF() {
    if (window.scale > 0.5) {
      window.scale -= 0.2;
      renderPDFPage(window.currentPage);
    }
  }

  function downloadPDF(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    a.click();
  }
</script>
```

---

## 5️⃣ Modal HTML (Paste in `<body>`)

```html
<!-- Modal Overlay -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-content">
    <div class="modal-header">
      <span class="modal-title" id="modalTitle">Loading...</span>
      <div class="modal-controls">
        <button class="modal-btn" id="externalBtn" style="display: none;">Open External ↗</button>
        <button class="close-btn" id="closeBtn">×</button>
      </div>
    </div>
    <div class="modal-body" id="modalBody">
      <div class="loading">Loading content...</div>
    </div>
  </div>
</div>

<script>
  // Close on button click
  document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('active');
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('modalOverlay').classList.remove('active');
    }
  });

  // Open page in modal
  function openPageModal(pagePath, title) {
    const modal = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = '<div class="loading">Loading page...</div>';
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;background:var(--bg)';
    iframe.src = pagePath;
    
    iframe.onload = () => {
      modalBody.innerHTML = '';
      modalBody.appendChild(iframe);
    };
    
    modal.classList.add('active');
  }

  // Auto-wire data-page cards
  document.querySelectorAll('[data-page]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      openPageModal(
        el.getAttribute('data-page'), 
        el.getAttribute('data-title') || 'Page'
      );
    });
  });
</script>
```

---

## 6️⃣ Required CSS (Modal Styling)

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-overlay.active {
  display: flex;
}

.modal-content {
  background: var(--bg2);
  border: 1px solid var(--border);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg3);
}

.modal-title {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  flex: 1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text2);
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--accent);
}

.modal-btn {
  background: none;
  border: 1px solid var(--border2);
  color: var(--text2);
  font-family: var(--mono);
  font-size: 11px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 2px;
}

.modal-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(200, 255, 0, 0.06);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text2);
  font-size: 12px;
}
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Add Modal HTML
Copy section **5️⃣** and paste before `</body>`

### Step 2: Add CSS
Copy section **6️⃣** and paste in `<style>` tag

### Step 3: Add PDF Functions
Copy section **4️⃣** and paste in `<script>` tag

### Step 4: Convert Cards
For each card you want in-modal:
- Change `<a href="...">` to `<div data-page="..." data-title="...">`

### Step 5: Add PDF Links
For PDFs, use:
```html
<div onclick="openPDFModal('path/to/file.pdf', 'Title')">Click for PDF</div>
```

---

## Common Patterns

### Pattern 1: Link to GitHub (Still Opens External)
```html
<a href="https://github.com/user/repo" target="_blank">GitHub ↗</a>
```

### Pattern 2: Link to External Site (Still Opens External)
```html
<a href="https://example.com" target="_blank">External ↗</a>
```

### Pattern 3: Link to Internal Page (Modal)
```html
<div data-page="research/page.html" data-title="Page Title">
  View page
</div>
```

### Pattern 4: Link to PDF (Modal Viewer)
```html
<div onclick="openPDFModal('research/paper.pdf', 'Paper')">
  View PDF
</div>
```

---

## Testing Checklist

```
[ ] Page cards open in modal (click one)
[ ] ESC key closes modal
[ ] Modal close button (×) works
[ ] Clicking overlay closes modal
[ ] GitHub links still open in new tab
[ ] PDFs load and display
[ ] PDF zoom works
[ ] PDF page navigation works
[ ] Works on mobile (responsive)
[ ] No console errors (F12)
```

---

## Troubleshooting

### "Element not found" error?
- Make sure modal HTML is in the page
- Check element IDs match (modalOverlay, modalBody, modalTitle, closeBtn)

### PDFs won't load?
- Check PDF URL is publicly accessible
- Test URL in browser directly first
- Use RAW GitHub URLs: `https://raw.githubusercontent.com/.../file.pdf`

### Modal not showing?
- Clear browser cache (Ctrl+Shift+Delete)
- Check `modalOverlay.classList.add('active')` is called
- Verify CSS `.modal-overlay.active` has `display: flex`

### Styling looks off?
- Make sure CSS variables are defined (--bg, --text, etc.)
- Check modal CSS is after your main CSS
- Test with the full INTEGRATION_GUIDE.md CSS included

---

## Next Steps

1. ✅ Implement sections 1-6 above
2. ✅ Test with one research page
3. ✅ Test with one PDF
4. ✅ Apply to all cards
5. ✅ Deploy to GitHub
6. ✅ Share with others!

---

**Questions?** Check INTEGRATION_GUIDE.md for detailed explanations!

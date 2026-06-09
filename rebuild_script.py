import re

with open('script.js', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('dog_system.js', 'r', encoding='utf-8') as f:
    dog = f.read()

# Strip out any existing dog system block from orig first
# The dog system starts with a comment line containing "PIXEL DOG SYSTEM"
dog_start_idx = orig.find('// ===========================================\n// PIXEL DOG SYSTEM')
if dog_start_idx == -1:
    # try generic
    dog_start_idx = orig.find('// PIXEL DOG SYSTEM')

if dog_start_idx != -1:
    orig = orig[:dog_start_idx].rstrip() + '\n'

# Find cursor block: from start until HAMBURGER section
hamburger_pos = orig.find('// HAMBURGER')
if hamburger_pos == -1:
    raise Exception('HAMBURGER not found')

# Find the section separator before HAMBURGER
sep_before_hamburger = orig.rfind('\n// ', 0, hamburger_pos)
if sep_before_hamburger == -1:
    raise Exception('separator not found')

# The cursor block is everything from 0 to sep_before_hamburger
cursor_block_end = sep_before_hamburger


new_cursor = (
    '// ===================================================\n'
    '// ENHANCED CURSOR\n'
    '// ===================================================\n'
    '(function() {\n'
    "  var cursor = document.querySelector('.cursor');\n"
    "  var ring   = document.querySelector('.cursor-ring');\n"
    '  if (!cursor || !ring) return;\n'
    "  var isTouchOnly = window.matchMedia('(hover:none) and (pointer:coarse)').matches;\n"
    '  if (isTouchOnly) {\n'
    "    cursor.style.display = 'none';\n"
    "    ring.style.display   = 'none';\n"
    "    document.body.style.cursor = 'auto';\n"
    '    return;\n'
    '  }\n'
    '  var mx = 0, my = 0, rx = 0, ry = 0, trailTimer = null;\n'
    "  document.addEventListener('mousemove', function(e) {\n"
    '    mx = e.clientX; my = e.clientY;\n'
    "    cursor.style.left = mx + 'px';\n"
    "    cursor.style.top  = my + 'px';\n"
    '    clearTimeout(trailTimer);\n'
    '    trailTimer = setTimeout(function() {\n'
    "      var t = document.createElement('div');\n"
    "      t.className = 'cursor-trail';\n"
    "      t.style.left = mx + 'px';\n"
    "      t.style.top  = my + 'px';\n"
    '      document.body.appendChild(t);\n'
    "      setTimeout(function() { try { t.remove(); } catch(ee) {} }, 500);\n"
    '    }, 30);\n'
    '  });\n'
    '  (function animRing() {\n'
    '    rx += (mx - rx) * 0.1;\n'
    '    ry += (my - ry) * 0.1;\n'
    "    ring.style.left = rx + 'px';\n"
    "    ring.style.top  = ry + 'px';\n"
    '    requestAnimationFrame(animRing);\n'
    '  })();\n'
    '  var sel = "a, button, [role=\\"button\\"], .filter-btn, .project-card, .gallery-item, .cert-dark-item, .dog-pick-btn, .dog-pet-btn";\n'
    "  document.addEventListener('mouseover', function(e) {\n"
    "    if (e.target.closest(sel)) { cursor.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); }\n"
    '  });\n'
    "  document.addEventListener('mouseout', function(e) {\n"
    "    if (e.target.closest(sel)) { cursor.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); }\n"
    '  });\n'
    "  document.addEventListener('mousedown', function() { cursor.classList.add('cursor-click'); });\n"
    "  document.addEventListener('mouseup',   function() { cursor.classList.remove('cursor-click'); });\n"
    '})();\n'
)

result = new_cursor + orig[cursor_block_end:].rstrip() + '\n\n' + dog

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(result)

print('SUCCESS. Total size:', len(result))
print('Has cursor-hover:', 'cursor-hover' in result)
print('Has DOG_DEFS:', 'DOG_DEFS' in result)
print('Has buildDogOverlay:', 'buildDogOverlay' in result)
print('Has HAMBURGER:', 'HAMBURGER' in result)

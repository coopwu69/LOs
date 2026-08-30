# -*- coding: utf-8 -*-
"""Generate the final single-file HTML web app."""
import os, json

BASE = os.getcwd()
with open(os.path.join(BASE, '_appdata.json'), encoding='utf-8') as f:
    DATA = json.load(f)

# Clean up faculty names further
NAME_FIXES = {
    'สำนักวิชานิติศาสตร์1หลักสูตร': 'สำนักวิชานิติศาสตร์',
    'นานาชาติ1หลักสูตร': 'สำนักวิชานานาชาติ',
    'สำนักวิชากการจัดการ': 'สำนักวิชาการจัดการ',
    'สำนักรัฐศาสตร์ฯ': 'สำนักวิชารัฐศาสตร์',
    'สำนักสาธารณสุขศาสตร์': 'สำนักวิชาสาธารณสุขศาสตร์',
    'สำนักวิชาสถาปัตยกรรมศาสตร์ฯ': 'สำนักวิชาสถาปัตยกรรมศาสตร์',
    'สำนักวิชาเทคโนโลยีการเกษตรฯ': 'สำนักวิชาเทคโนโลยีการเกษตร',
}
for d in DATA:
    d['faculty'] = NAME_FIXES.get(d['faculty'], d['faculty'])

# Clean curriculum names
CUR_FIXES = {
    'หลักสูตร (วิทย์กีฬา)': 'หลักสูตรวิทยาศาสตร์การกีฬาและการออกกำลังกาย',
    'หลักสูตรการจัดการการท่องเที': 'หลักสูตรการจัดการการท่องเที่ยวและการโรงแรม',
    'หลักสูตร รปศ': 'หลักสูตรรัฐประศาสนศาสตร์',
    'สหกิจศึกษา-ปิโตรเคมีฯ': 'หลักสูตรปิโตรเคมีและวัสดุศาสตร์',
    'สหกิจศึกษา-วิศวกรรมเคมีฯ': 'หลักสูตรวิศวกรรมเคมี',
    'สหกิจศึกษา-วิศวกรรมเครื่องกลฯ': 'หลักสูตรวิศวกรรมเครื่องกล',
    'สหกิจศึกษา-หลักสูตรวิศวกรรมไฟฟ้า-พ.ศ. 2567': 'หลักสูตรวิศวกรรมไฟฟ้า (พ.ศ. 2567)',
    'สหกิจศึกษา หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ พ.ศ. 2567': 'หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ (พ.ศ. 2567)',
    'สหกิจศึกษา หลักสูตรนิเทศศาสตร์': 'หลักสูตรนิเทศศาสตร์',
    'สหกิจศึกษา หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์ พ.ศ. 2567': 'หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์ (พ.ศ. 2567)',
    'สหกิจศึกษาหลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ (IIT)': 'หลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ (IIT)',
    'PLO ของ MTA หรือ IMAG': 'หลักสูตรเทคโนโลยีและนวัตกรรมสื่อ (MTA/IMAG)',
    'สหกิจศึกษา อนามัยสิ่งแวดล้อม': 'หลักสูตรอนามัยสิ่งแวดล้อม',
    'สหกิจศึกษา-ออกแบบภายใน': 'หลักสูตรออกแบบภายใน',
    'สหกิจศึกษา หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์': 'หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์',
    'สหกิจศึกษา(หลักสูตรบัญชีบัณฑิต-ปรับปรุง-2567)': 'หลักสูตรบัญชีบัณฑิต (ปรับปรุง พ.ศ. 2567)',
    'สหกิจศึกษา หลักสูตรบริหารธุรกิจบัณฑิต หลักสูตรนานาชาติ (หลักสูตรปรับปรุง พ.ศ. 2565)': 'หลักสูตรบริหารธุรกิจบัณฑิต นานาชาติ (ปรับปรุง พ.ศ. 2565)',
    'PLOs หลักสูตรวิทยาศาสตรบัณฑิต-สาขาวิทยาศาสต': 'หลักสูตรวิทยาศาสตรบัณฑิต เกษตรศาสตร์และนวัตกรรม',
    'เกษตรศาสตร์และนวัตกรร': 'หัวข้อประเมินตาม PLOs เกษตรศาสตร์และนวัตกรรม',
    'หลักสูตรวิทยาศาสตร์ทางทะเล': 'หลักสูตรวิทยาศาสตร์ทางทะเล',
    'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์': 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์',
    'หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา ปรับปรุงปีการศึกษา 2567': 'หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา (ปรับปรุง พ.ศ. 2567)',
    'หลักสูตรนิติศาสตรบัณฑิต หลักสูตรปรับปรุง พ.ศ. 2567': 'หลักสูตรนิติศาสตรบัณฑิต (ปรับปรุง พ.ศ. 2567)',
    'หลักสูตรเศรษฐศาสตรบัณฑิต': 'หลักสูตรเศรษฐศาสตรบัณฑิต',
    'หลักสูตรรัฐศาสตร์ IR 2567': 'หลักสูตรรัฐศาสตร์ (ความสัมพันธ์ระหว่างประเทศ) 2567',
    'หลักสูตรการเมืองการปกครอง': 'หลักสูตรการเมืองการปกครอง',
    'หลักสูตรศิลปะการประกอบอาชีพ': 'หลักสูตรศิลปะการประกอบอาชีพ',
    'หลักสูตรการจัดการโลจิสติกส์': 'หลักสูตรการจัดการโลจิสติกส์',
    'หลักสูตรดิจิทัลคอนเทนต์และสื่อ': 'หลักสูตรดิจิทัลคอนเทนต์และสื่อ',
    'หลักสูตรภาษาอังกฤษ': 'หลักสูตรภาษาอังกฤษ',
    'หลักสูตรภาษาไทยเพื่อการสื่อสาร': 'หลักสูตรภาษาไทยเพื่อการสื่อสาร',
    'หลักสูตรภาษาจีน': 'หลักสูตรภาษาจีน',
}
for d in DATA:
    for c in d['curricula']:
        c['name'] = CUR_FIXES.get(c['name'], c['name'])

data_json = json.dumps(DATA, ensure_ascii=False)

HTML = '''<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>แบบประเมิน LOs รายวิชาสหกิจศึกษา</title>
<style>
:root{
  --primary:#1e40af; --primary-light:#3b82f6; --primary-dark:#1e3a8a;
  --bg:#f8fafc; --surface:#ffffff; --surface-2:#f1f5f9;
  --text:#0f172a; --text-secondary:#475569; --text-muted:#94a3b8;
  --border:#e2e8f0; --border-strong:#cbd5e1;
  --success:#16a34a; --warning:#d97706; --error:#dc2626;
  --radius:12px; --radius-sm:8px;
  --shadow-sm:0 1px 2px rgba(15,23,42,.06);
  --shadow:0 4px 12px rgba(15,23,42,.08);
  --shadow-lg:0 12px 32px rgba(15,23,42,.12);
}
*{box-sizing:border-box;margin:0;padding:0}
body{
  font-family:"Sarabun","Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:var(--bg);color:var(--text);line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
/* Header */
.app-header{
  background:linear-gradient(135deg,var(--primary-dark),var(--primary));
  color:#fff;padding:28px 24px;box-shadow:var(--shadow);
  position:sticky;top:0;z-index:100;
}
.app-header h1{font-size:1.5rem;font-weight:700;letter-spacing:-.01em}
.app-header .subtitle{font-size:.9rem;opacity:.85;margin-top:4px}
.breadcrumb{
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  margin-top:14px;font-size:.85rem;
}
.breadcrumb button{
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
  color:#fff;padding:4px 12px;border-radius:20px;cursor:pointer;
  font-size:.8rem;transition:background .15s;
}
.breadcrumb button:hover{background:rgba(255,255,255,.28)}
.breadcrumb .sep{opacity:.5}
.breadcrumb .current{font-weight:600}

/* Layout */
.container{max-width:1200px;margin:0 auto;padding:32px 24px}

/* Level 1: Faculty grid */
.page-title{font-size:1.35rem;font-weight:700;margin-bottom:6px;color:var(--text)}
.page-desc{color:var(--text-secondary);font-size:.95rem;margin-bottom:24px}
.grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:16px;
}
.card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:22px;cursor:pointer;transition:all .2s;box-shadow:var(--shadow-sm);
  display:flex;flex-direction:column;gap:10px;text-align:left;
  font-family:inherit;color:inherit;
}
.card:hover{border-color:var(--primary-light);box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.card:focus-visible{outline:3px solid var(--primary-light);outline-offset:2px}
.card .card-icon{
  width:44px;height:44px;border-radius:10px;
  background:linear-gradient(135deg,#dbeafe,#bfdbfe);
  display:flex;align-items:center;justify-content:center;
  font-size:1.4rem;color:var(--primary);
}
.card .card-title{font-size:1.05rem;font-weight:600;color:var(--text);line-height:1.4}
.card .card-meta{font-size:.82rem;color:var(--text-muted);display:flex;gap:10px;flex-wrap:wrap}
.card .badge{
  display:inline-flex;align-items:center;gap:4px;
  background:var(--surface-2);color:var(--text-secondary);
  padding:3px 10px;border-radius:20px;font-size:.78rem;font-weight:500;
}

/* Level 3: Evaluation form */
.eval-header{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:24px;margin-bottom:20px;box-shadow:var(--shadow-sm);
}
.eval-header h2{font-size:1.3rem;font-weight:700;color:var(--primary-dark);margin-bottom:6px}
.eval-header .source{font-size:.82rem;color:var(--text-muted);word-break:break-all}
.eval-body{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius);padding:32px;box-shadow:var(--shadow-sm);
  line-height:1.75;
}
.eval-body h2.section-title{
  font-size:1.15rem;font-weight:700;color:var(--primary-dark);
  border-bottom:2px solid var(--primary-light);padding-bottom:8px;
  margin:28px 0 14px;
}
.eval-body h2.section-title:first-child{margin-top:0}
.eval-body h3.domain-title{
  font-size:1.02rem;font-weight:600;color:var(--primary);
  background:var(--surface-2);padding:8px 14px;border-radius:var(--radius-sm);
  margin:22px 0 12px;border-left:4px solid var(--primary);
}
.eval-body h4.table-marker{
  font-size:.9rem;font-weight:600;color:var(--text-secondary);
  margin:18px 0 8px;font-style:italic;
}
.eval-body p{margin:8px 0;color:var(--text)}
.eval-body .lo-item{
  margin:10px 0;padding:10px 14px;background:var(--surface-2);
  border-radius:var(--radius-sm);border-left:3px solid var(--primary-light);
}
.eval-body .lo-code{
  display:inline-block;font-weight:700;color:var(--primary);
  background:#fff;padding:2px 8px;border-radius:6px;font-size:.85rem;
  margin-right:6px;border:1px solid var(--border);
}
.eval-body .lo-desc{color:var(--text)}
.eval-body .eval-item{
  font-weight:600;color:var(--text);margin:14px 0 6px;
  padding-top:10px;border-top:1px dashed var(--border);
}
.eval-body .rubric-level{
  margin:6px 0 6px 16px;padding:8px 12px;
  background:#fff;border:1px solid var(--border);border-radius:6px;
  font-size:.92rem;color:var(--text-secondary);
}
.eval-body .rubric-table-wrap{
  overflow-x:auto;margin:14px 0;border:1px solid var(--border);border-radius:var(--radius-sm);
}
.eval-body table.rubric-table{
  border-collapse:collapse;width:100%;font-size:.88rem;
}
.eval-body table.rubric-table th,.eval-body table.rubric-table td{
  border:1px solid var(--border);padding:8px 10px;text-align:left;vertical-align:top;
}
.eval-body table.rubric-table tr:nth-child(even){background:var(--surface-2)}
.eval-body table.xlsx-table{font-size:.82rem}

/* Search */
.search-bar{margin-bottom:20px}
.search-bar input{
  width:100%;padding:12px 16px;border:1px solid var(--border-strong);
  border-radius:var(--radius);font-size:.95rem;font-family:inherit;
  background:var(--surface);transition:border-color .15s;
}
.search-bar input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.15)}

/* Empty / loading */
.empty-state{text-align:center;padding:60px 20px;color:var(--text-muted)}
.empty-state .icon{font-size:3rem;margin-bottom:12px}

/* Back button */
.back-btn{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--surface);border:1px solid var(--border-strong);
  color:var(--text-secondary);padding:8px 16px;border-radius:var(--radius-sm);
  cursor:pointer;font-size:.9rem;font-family:inherit;margin-bottom:16px;
  transition:all .15s;
}
.back-btn:hover{border-color:var(--primary);color:var(--primary)}

/* Print */
.print-btn{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--primary);border:none;color:#fff;
  padding:8px 16px;border-radius:var(--radius-sm);cursor:pointer;
  font-size:.9rem;font-family:inherit;margin-bottom:16px;margin-left:10px;
}
.print-btn:hover{background:var(--primary-dark)}

@media print{
  .app-header,.back-btn,.print-btn,.breadcrumb{display:none}
  .container{padding:0;max-width:none}
  .eval-body,.eval-header{box-shadow:none;border:1px solid #ccc}
}
@media (max-width:640px){
  .container{padding:20px 14px}
  .grid{grid-template-columns:1fr}
  .eval-body{padding:18px}
}
</style>
</head>
<body>
<header class="app-header">
  <h1>แบบประเมิน LOs รายวิชาสหกิจศึกษา</h1>
  <div class="subtitle">รวบรวมแบบประเมินผลการปฏิบัติสหกิจศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง แยกตามสำนักวิชาและหลักสูตร</div>
  <nav class="breadcrumb" id="breadcrumb" aria-label="การนำทาง"></nav>
</header>
<main class="container" id="app"></main>

<script>
const DATA = __DATA__;
let state = {fac:null, cur:null, q:''};

const app = document.getElementById('app');
const bc = document.getElementById('breadcrumb');

function render(){
  if(state.cur !== null){
    renderEval();
  } else if(state.fac !== null){
    renderCurricula();
  } else {
    renderFaculties();
  }
  renderBreadcrumb();
  window.scrollTo(0,0);
}

function renderBreadcrumb(){
  bc.innerHTML = '';
  const add = (label, idx) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = () => { if(idx===0){state.fac=null;state.cur=null} else if(idx===1){state.cur=null} state.q=''; render(); };
    bc.appendChild(b);
  };
  add('สำนักวิชาทั้งหมด', 0);
  if(state.fac !== null){
    const sep = document.createElement('span'); sep.className='sep'; sep.textContent='›'; bc.appendChild(sep);
    if(state.cur === null){
      const cur = document.createElement('span'); cur.className='current'; cur.textContent = DATA[state.fac].faculty; bc.appendChild(cur);
    } else {
      add(DATA[state.fac].faculty, 1);
      const sep2 = document.createElement('span'); sep2.className='sep'; sep2.textContent='›'; bc.appendChild(sep2);
      const cur = document.createElement('span'); cur.className='current'; cur.textContent = DATA[state.fac].curricula[state.cur].name; bc.appendChild(cur);
    }
  }
}

function renderFaculties(){
  let html = '<div class="page-title">เลือกสำนักวิชา</div>';
  html += '<div class="page-desc">คลิกที่สำนักวิชาเพื่อดูหลักสูตรที่มีแบบประเมิน</div>';
  html += '<div class="search-bar"><input type="search" id="searchInput" placeholder="ค้นหาสำนักวิชาหรือหลักสูตร..." aria-label="ค้นหา"></div>';
  html += '<div class="grid" id="facGrid"></div>';
  app.innerHTML = html;
  const grid = document.getElementById('facGrid');
  const q = state.q.toLowerCase();
  DATA.forEach((d, i) => {
    if(q && !d.faculty.toLowerCase().includes(q) && !d.curricula.some(c=>c.name.toLowerCase().includes(q))) return;
    const card = document.createElement('button');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-icon">🎓</div>
      <div class="card-title">${esc(d.faculty)}</div>
      <div class="card-meta"><span class="badge">${d.curricula.length} หลักสูตร</span></div>
    `;
    card.onclick = () => { state.fac = i; state.q=''; render(); };
    grid.appendChild(card);
  });
  const si = document.getElementById('searchInput');
  si.value = state.q;
  si.addEventListener('input', e => { state.q = e.target.value; renderFaculties(); document.getElementById('searchInput').focus(); });
  if(q && grid.children.length === 0){
    grid.innerHTML = '<div class="empty-state"><div class="icon">🔍</div>ไม่พบผลลัพธ์สำหรับ "'+esc(state.q)+'"</div>';
  }
}

function renderCurricula(){
  const fac = DATA[state.fac];
  let html = `<button class="back-btn" id="backBtn">← กลับสู่สำนักวิชาทั้งหมด</button>`;
  html += `<div class="page-title">${esc(fac.faculty)}</div>`;
  html += `<div class="page-desc">เลือกหลักสูตรเพื่อดูแบบประเมินฉบับเต็ม (${fac.curricula.length} หลักสูตร)</div>`;
  html += `<div class="grid" id="curGrid"></div>`;
  app.innerHTML = html;
  document.getElementById('backBtn').onclick = () => { state.fac=null; render(); };
  const grid = document.getElementById('curGrid');
  fac.curricula.forEach((c, i) => {
    const card = document.createElement('button');
    card.className = 'card';
    const icon = c.ext === 'pdf' ? '📄' : c.ext === 'xlsx' ? '📊' : '📝';
    card.innerHTML = `
      <div class="card-icon">${icon}</div>
      <div class="card-title">${esc(c.name)}</div>
      <div class="card-meta"><span class="badge">.${c.ext}</span></div>
    `;
    card.onclick = () => { state.cur = i; render(); };
    grid.appendChild(card);
  });
}

function renderEval(){
  const fac = DATA[state.fac];
  const c = fac.curricula[state.cur];
  let html = `<button class="back-btn" id="backBtn">← กลับสู่${esc(fac.faculty)}</button>`;
  html += `<button class="print-btn" id="printBtn">🖨 พิมพ์ / บันทึก PDF</button>`;
  html += `<div class="eval-header"><h2>${esc(c.name)}</h2>`;
  html += `<div class="source">สำนักวิชา: ${esc(fac.faculty)} · แหล่งไฟล์: ${esc(c.file)}</div></div>`;
  html += `<div class="eval-body">${c.html}</div>`;
  app.innerHTML = html;
  document.getElementById('backBtn').onclick = () => { state.cur=null; render(); };
  document.getElementById('printBtn').onclick = () => window.print();
}

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

render();
</script>
</body>
</html>'''
HTML = HTML.replace('__DATA__', data_json.replace('</script>', '<\\/script>'))

out_path = os.path.join(BASE, 'index.html')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(HTML)
print(f"Written: {out_path}  [{os.path.getsize(out_path)/1024:.1f} KB]")

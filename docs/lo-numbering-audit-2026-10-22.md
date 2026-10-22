# ตรวจเลขข้อ LO ทุกหลักสูตร — 22 ตุลาคม 2569

ข้อมูลเว็บไซต์ตรวจเมื่อ UTC: 2026-10-22T07:55:23.541214+00:00
แหล่งข้อมูล: https://los-wu.vercel.app/ อ่านข้อมูลแบบประเมินผ่าน HTTP GET เท่านั้น

## นโยบายแสดงเลขข้อหลังผลตรวจ

ผู้ใช้ยืนยันให้แสดง LO1, LO2, LO3… ต่อเนื่องโดยอัตโนมัติทุกหลักสูตร ตามลำดับหมวดและคำถามจริง รวมหน้าพิมพ์และ Word หน้าแก้ไขไม่มีช่องแก้รหัสเลขข้อ การเพิ่ม/ลบข้อจะคำนวณเลขใหม่ โดยเก็บ question ID และรหัสต้นฉบับในฐานข้อมูลไว้สำหรับการอ้างอิงเดิม การบันทึกไม่รับการแก้รหัสต้นฉบับจาก payload และกำหนด sequence ให้อัตโนมัติ ตารางผลตรวจด้านล่างเป็นรหัสต้นฉบับก่อนปรับการแสดงผล ไม่ใช่เลขที่จะแสดงหลัง deploy

## ผลตรวจ
- ตรวจ 35 หลักสูตร: 29 หลักสูตรมีรหัสข้อเรียงต่อเนื่อง, 2 หลักสูตรใช้เลขข้ามตามต้นฉบับ, LOG ไม่มีรหัส LO ในข้อมูล 10 ข้อ, และอีก 3 หลักสูตรยังไม่มีคำถาม
- IIT แสดง LO3, LO4, LO5, LO7, LO8, LO9 ตรงกับส่วน LO รายวิชาสหกิจศึกษาในเอกสารต้นฉบับ ไม่พบ LO1, LO2 หรือ LO6 ในส่วนนั้น แม้ส่วน PLO ระดับหลักสูตรมี PLO1–PLO9
- ENVH แสดง CLO2, CLO3, CLO4, CLO7, CLO8, CLO9, CLO10, CLO12, CLO15 ตรงกับชุด CLO แรกในต้นฉบับ ซึ่งมีหลายชุดหลักสูตรอยู่ในไฟล์เดียวกัน จึงไม่ควรรวมทุกเลขจากทั้งไฟล์มาใช้เป็นรายการที่ขาด
- IMAG มี CLO1–CLO11 ครบแล้ว รวม CLO9 ที่เพิ่มในระบบจริง
- ไม่พบคำถามที่ไม่มีหมวดรองรับในข้อมูลที่เว็บไซต์ส่งมา
- ไม่เปลี่ยนรหัสข้อเอง: ต้องยืนยันกับเจ้าของหลักสูตรก่อนว่าจะคงรหัสตามต้นฉบับหรือจัดเลขแสดงผลใหม่

## หลักฐานต้นฉบับ
- `docs/source/03_it_3.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษาหลักสูตรเทคโนโลยีสารสนเ.md` ส่วน “ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา” เริ่ม LO3 และหมวดความรู้เป็นเครื่องหมาย -
- `docs/source/07_public_health_ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา_อนามัยสิ่งแวดล้อม.md` ส่วน “Course Learning Outcome: CLO” ชุดแรก ใช้เลข 2,3,4,7,8,9,10,12,15

## ทุกหลักสูตร
| หลักสูตร | จำนวนข้อ | ลำดับรหัสตามหมวดที่แสดง | หมายเหตุ |
|---|---:|---|---|
| [ACC — บัญชี](https://los-wu.vercel.app/accfin/acc/company/th) | 6 | LO1, LO2, LO3, LO4, LO5, LO6 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [DFB — หลักสูตรการจัดการธุรกิจและการเงินยุคดิจิทัล](https://los-wu.vercel.app/accfin/dfb/company/th) | 0 | — | ยังไม่มีคำถาม |
| [ECON — เศรษฐศาสตร์](https://los-wu.vercel.app/accfin/econ/company/th) | 9 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [ANSCI — เกษตรศาสตร์และนวัตกรรม](https://los-wu.vercel.app/agri/ansci/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [FSI — วิทยาศาสตร์อาหารและนวัตกรรม](https://los-wu.vercel.app/agri/fsi/company/th) | 13 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11, LO12, LO13 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [ARCH — สถาปัตยกรรมศาสตร์](https://los-wu.vercel.app/arch/arch/company/th) | 0 | — | ยังไม่มีคำถาม |
| [INTD — การออกแบบภายใน](https://los-wu.vercel.app/arch/intd/company/th) | 6 | LO1, LO2, LO3, LO4, LO5, LO6 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [CHI — ภาษาจีน](https://los-wu.vercel.app/arts/chi/company/th) | 4 | LO1, LO2, LO3, LO4 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [ENG — ภาษาอังกฤษ](https://los-wu.vercel.app/arts/eng/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [THAI — ภาษาไทย](https://los-wu.vercel.app/arts/thai/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [CEAI — วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์](https://los-wu.vercel.app/eng/ceai/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [CHEP — วิศวกรรมเคมีและเคมีเภสัชกรรม](https://los-wu.vercel.app/eng/chep/company/th) | 8 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [CIVIL — วิศวกรรมโยธา](https://los-wu.vercel.app/eng/civil/company/th) | 11 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [EE — วิศวกรรมไฟฟ้า](https://los-wu.vercel.app/eng/ee/company/th) | 12 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11, LO12 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [MECH — วิศวกรรมเครื่องกล](https://los-wu.vercel.app/eng/mech/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [PEP — ปิโตรเคมีและพอลิเมอร์](https://los-wu.vercel.app/eng/pep/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [INTL — International Program (WUIC)](https://los-wu.vercel.app/ic/intl/company/en) | 6 | LO1, LO2, LO3, LO4, LO5, LO6 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [DCA — นิเทศศาสตร์ดิจิทัล](https://los-wu.vercel.app/it/dca/company/th) | 7 | LO1, LO2, LO3, LO4, LO5, LO6, LO7 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [DCM — ดิจิทัลคอนเทนต์และสื่อ](https://los-wu.vercel.app/it/dcm/company/th) | 9 | PLO1, PLO2, PLO3, PLO4, PLO5, PLO6, PLO7, PLO8, PLO9 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [DTM — เทคโนโลยีดิจิทัลทางการแพทย์](https://los-wu.vercel.app/it/dtm/company/th) | 4 | LO1, LO2, LO3, LO4 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [IIT — เทคโนโลยีสารสนเทศอัจฉริยะ](https://los-wu.vercel.app/it/iit/company/th) | 6 | LO3, LO4, LO5, LO7, LO8, LO9 | เลขข้ามตามต้นฉบับ; ไม่ใช่หลักฐานว่าระบบทำข้อมูลหาย |
| [IMAG — อินเทอร์แอคทีฟมัลติมีเดียแอนิเมชันและเกม](https://los-wu.vercel.app/it/imag/company/th) | 11 | CLO1, CLO2, CLO3, CLO4, CLO5, CLO6, CLO7, CLO8, CLO9, CLO10, CLO11 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [LAW — นิติศาสตร์](https://los-wu.vercel.app/law/law/company/th) | 6 | LO1, LO2, LO3, LO4, LO5, LO6 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [SSE — วิทยาศาสตร์การกีฬาและการออกกำลังกาย](https://los-wu.vercel.app/med/sse/company/th) | 8 | 1, 2, 3, 4, 5, 6, 7, 8 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [CUL — ศิลปะการประกอบอาหารอย่างมืออาชีพ](https://los-wu.vercel.app/mgt/cul/company/th) | 9 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [LOG — บริหารธุรกิจ (โลจิสติกส์)](https://los-wu.vercel.app/mgt/log/company/th) | 10 | (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส), (ไม่มีรหัส) | ไม่มีรหัส LO ในข้อมูล ต้องอาศัยลำดับข้อที่ UI แสดง |
| [MKT — บริหารธุรกิจ (การตลาดดิจิทัลและการสร้างแบรนด์)](https://los-wu.vercel.app/mgt/mkt/company/th) | 5 | LO1, LO2, LO3, LO4, LO5 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [THM — การจัดการท่องเที่ยวและการบริการโรงแรม](https://los-wu.vercel.app/mgt/thm/company/th) | 12 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11, LO12 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [IR — รัฐศาสตร์ (ความสัมพันธ์ระหว่างประเทศ)](https://los-wu.vercel.app/polsci/ir/company/th) | 16 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11, LO12, LO13, LO14, LO15, LO16 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [PA — รัฐประศาสนศาสตร์](https://los-wu.vercel.app/polsci/pa/company/th) | 11 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [POL — รัฐศาสตร์ (การเมืองการปกครอง)](https://los-wu.vercel.app/polsci/pol/company/th) | 6 | LO1, LO2, LO3, LO4, LO5, LO6 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [ENVH — อนามัยสิ่งแวดล้อม](https://los-wu.vercel.app/public-health/envh/company/th) | 9 | CLO2, CLO3, CLO4, CLO7, CLO8, CLO9, CLO10, CLO12, CLO15 | เลขข้ามตามต้นฉบับ; ไม่ใช่หลักฐานว่าระบบทำข้อมูลหาย |
| [OHS — อาชีวอนามัยและความปลอดภัย](https://los-wu.vercel.app/public-health/ohs/company/th) | 0 | — | ยังไม่มีคำถาม |
| [MARSCI — วิทยาศาสตร์ทางทะเล](https://los-wu.vercel.app/sci/marsci/company/th) | 12 | PLO1, PLO2, PLO3, PLO4, PLO5, PLO6, PLO7, PLO8, PLO9, PLO10, PLO11, PLO12 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |
| [SCI — วิทยาศาสตร์](https://los-wu.vercel.app/sci/sci/company/th) | 11 | LO1, LO2, LO3, LO4, LO5, LO6, LO7, LO8, LO9, LO10, LO11 | เลขต่อเนื่องในช่วงรหัสที่มีอยู่ |

## ข้อจำกัด
ตรวจเลขของชุดคำถามที่เว็บไซต์ส่งให้แสดง ไม่ใช่การตรวจทุกแถวในฐานข้อมูล การไม่มีเลขข้ามไม่พิสูจน์ว่าจำนวนข้อครบตามต้นฉบับ เช่นอาจขาดข้อท้ายสุด การเปรียบเทียบต้นฉบับในรอบนี้เจาะกรณีที่พบเลขข้าม ยังไม่ใช่การตรวจเทียบเนื้อหาทุกประโยคของทุกหลักสูตร

## FSI และงานค้าง
- FSI LO10 คะแนน 1 ตัดข้อความหัวหมวดที่ติดท้ายออกและตรวจข้อมูลบนเว็บไซต์แล้ว เมื่อ 22 ตุลาคม 2569 เปลี่ยนเฉพาะข้อความรายการนี้
- migration `029_fsi_english_rubrics.sql` และ JSON เตรียมคำแปลอังกฤษ 52 ระดับ พร้อมตรวจข้อมูลก่อนอัปเดตและเก็บ snapshot ผู้ตรวจ แต่ยังไม่ได้รันบนฐานข้อมูล เพราะสภาพแวดล้อมนี้ไม่มีการเชื่อมฐานข้อมูล
- การ push Git ไม่ได้รัน migration หรือยืนยันว่า deployment สำเร็จ

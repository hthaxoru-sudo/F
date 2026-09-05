import express from "express";
import session from "express-session";
import multer from "multer";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "data");
const UPLOADS = path.join(__dirname, "uploads");
for (const d of [DATA, UPLOADS]) fs.mkdirSync(d,{recursive:true});

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: process.env.SESSION_SECRET || "CHANGE_THIS_SESSION_SECRET",
  resave:false, saveUninitialized:false,
  cookie:{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:8*60*60*1000}
}));
app.use(express.static(__dirname));

const read=(f,def=[])=>{try{return JSON.parse(fs.readFileSync(path.join(DATA,f),"utf8"))}catch{return def}};
const write=(f,v)=>fs.writeFileSync(path.join(DATA,f),JSON.stringify(v,null,2),"utf8");
const uid=()=>crypto.randomUUID();

function seedUsers(){
 const f=path.join(DATA,"users.json");
 if(!fs.existsSync(f)){
  write("users.json",[
   {id:uid(),username:process.env.ADMIN_USERNAME||"admin_beehouse",passwordHash:bcrypt.hashSync(process.env.ADMIN_PASSWORD||"SuperAdminPassword123!",12),role:"super_admin",name:"ผู้ดูแลระบบสูงสุด (Super Admin)",avatar:"👑",enabled:true},
   {id:uid(),username:process.env.STAFF_USERNAME||"staff_bee",passwordHash:bcrypt.hashSync(process.env.STAFF_PASSWORD||"StaffPassword123!",12),role:"staff",name:"ทีมงานดูแลเว็บ",avatar:"🐝",enabled:true}
  ]);
 }
}
seedUsers();

const upload=multer({storage:multer.diskStorage({
 destination:(_req,_file,cb)=>cb(null,UPLOADS),
 filename:(_req,file,cb)=>cb(null,Date.now()+"-"+crypto.randomBytes(5).toString("hex")+path.extname(file.originalname))
}),limits:{fileSize:5*1024*1024},fileFilter:(_req,file,cb)=>cb(null,/^(image|video)\//.test(file.mimetype))});
app.use("/uploads",express.static(UPLOADS));

function auth(req,res,next){if(!req.session.user)return res.status(401).json({error:"กรุณาเข้าสู่ระบบ"});next()}
function admin(req,res,next){if(!req.session.user||req.session.user.role!=="super_admin")return res.status(403).json({error:"ไม่มีสิทธิ์"});next()}
function log(req,action,status="สำเร็จ"){
 const a=read("logs.json",[]); a.unshift({id:uid(),time:new Date().toISOString(),user:req.session.user?.name||"Public",action,status}); write("logs.json",a.slice(0,1000));
}

app.post("/api/auth/login",(req,res)=>{
 const {username,password}=req.body||{}; const u=read("users.json",[]).find(x=>x.username===username&&x.enabled!==false);
 if(!u||!bcrypt.compareSync(password||"",u.passwordHash)) return res.status(401).json({error:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"});
 req.session.user={id:u.id,username:u.username,role:u.role,name:u.name,avatar:u.avatar}; log(req,"เข้าสู่ระบบหลังบ้าน"); res.json({user:req.session.user});
});
app.post("/api/auth/logout",(req,res)=>{req.session.destroy(()=>res.json({ok:true}))});
app.get("/api/auth/me",(req,res)=>res.json({user:req.session.user||null}));

app.get("/api/site",(req,res)=>res.json(read("site.json",{})));
app.get("/api/applications",(req,res)=>{
 const counts={}; for(const x of read("applications.json",[])){if(x.status!=="fail")counts[x.job]=(counts[x.job]||0)+1}
 res.json(Object.entries(counts).map(([job,count])=>({job,count})));
});
app.get("/api/status",(req,res)=>{
 const {xbox,discordId}=req.query; const a=read("applications.json",[]).find(x=>(x.xbox||"").toLowerCase()===(xbox||"").toLowerCase()&&x.discordId===discordId);
 if(!a)return res.status(404).json({error:"ไม่พบข้อมูลการสมัคร"});
 const {ocName,icName,job,status,score,maxScore=100,interviewer,interviewDate,remark,scoreBreakdown}=a;
 res.json({ocName,icName,job,status,score:score??0,maxScore,interviewer:interviewer||"-",interviewDate:interviewDate||"-",remark:remark||"",scoreBreakdown:scoreBreakdown||{}});
});
app.post("/api/applications", (req,res)=>{
 const site=read("site.json",{}); if(site.features?.applicationsOpen===false)return res.status(403).json({error:"ขณะนี้ปิดรับสมัคร"});
 const body=req.body||{}; const required=["ocFullname","ocNickname","ocAge","discord","discordId","xbox","interviewTime","icFullname","icNickname","icAge","icHistory","icPersonality","icPrologue","job"];
 if(required.some(k=>!String(body[k]??"").trim()))return res.status(400).json({error:"กรุณากรอกข้อมูลให้ครบถ้วน"});
 const apps=read("applications.json",[]);
 if(apps.some(a=>(a.xbox||"").toLowerCase()===body.xbox.toLowerCase()))return res.status(409).json({error:"Xbox Gamertag นี้มีใบสมัครอยู่แล้ว"});
 const jobs=site.jobs||[]; const j=jobs.find(x=>x.name===body.job); if(!j||j.enabled===false)return res.status(400).json({error:"สายอาชีพนี้ไม่เปิดรับสมัคร"});
 const count=apps.filter(a=>a.job===body.job&&a.status!=="fail").length; if(count>=Number(j.max))return res.status(400).json({error:"โควต้าสายอาชีพนี้เต็มแล้ว"});
 const item={id:uid(),...body,status:"pending",score:0,maxScore:100,remark:"",createdAt:new Date().toISOString(),interviewer:"-",interviewDate:"-",scoreBreakdown:{}};
 apps.unshift(item); write("applications.json",apps); log({session:{user:{name:"Public"}}},"มีการส่งใบสมัครใหม่: "+body.xbox); res.json({ok:true,id:item.id});
});
app.post("/api/contact",(req,res)=>{const c=read("contacts.json",[]); c.unshift({id:uid(),...req.body,status:"open",createdAt:new Date().toISOString()});write("contacts.json",c);res.json({ok:true})});

app.use("/api/admin",admin);
app.get("/api/admin/all",(req,res)=>res.json({site:read("site.json",{}),applications:read("applications.json",[]),contacts:read("contacts.json",[]),logs:read("logs.json",[]),users:read("users.json",[])}));
app.put("/api/admin/site",(req,res)=>{const old=read("site.json",{}); const next={...old,...req.body}; write("site.json",next); log(req,"แก้ไขการตั้งค่าเว็บไซต์");res.json(next)});
app.put("/api/admin/collection/:name",(req,res)=>{
 const allowed=["partners","products","portfolio","news","jobs","tabs","stats"]; if(!allowed.includes(req.params.name))return res.status(400).json({error:"collection ไม่ถูกต้อง"});
 const site=read("site.json",{}); site[req.params.name]=Array.isArray(req.body)?req.body:(req.body.items||[]); write("site.json",site); log(req,"แก้ไขข้อมูล "+req.params.name);res.json(site[req.params.name]);
});
app.put("/api/admin/applications/:id",(req,res)=>{
 const a=read("applications.json",[]); const i=a.findIndex(x=>x.id===req.params.id); if(i<0)return res.status(404).json({error:"ไม่พบใบสมัคร"});
 a[i]={...a[i],...req.body,updatedAt:new Date().toISOString()}; write("applications.json",a); log(req,"ประเมินผลใบสมัคร "+(a[i].xbox||req.params.id));res.json(a[i]);
});
app.delete("/api/admin/applications/:id",(req,res)=>{let a=read("applications.json",[]);const old=a.find(x=>x.id===req.params.id);a=a.filter(x=>x.id!==req.params.id);write("applications.json",a);log(req,"ลบใบสมัคร "+(old?.xbox||req.params.id));res.json({ok:true})});
app.get("/api/admin/contacts",(req,res)=>res.json(read("contacts.json",[])));
app.put("/api/admin/contacts/:id",(req,res)=>{const c=read("contacts.json",[]);const i=c.findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:"ไม่พบรายการ"});c[i]={...c[i],...req.body};write("contacts.json",c);log(req,"อัปเดต Contact Inbox");res.json(c[i])});
app.post("/api/admin/upload",upload.single("file"),(req,res)=>{if(!req.file)return res.status(400).json({error:"ไม่พบไฟล์"});log(req,"อัปโหลดไฟล์ "+req.file.originalname);res.json({url:"/uploads/"+req.file.filename,filename:req.file.originalname})});

app.listen(PORT,()=>console.log(`BeeHouse Dynamic Panel running: http://localhost:${PORT}`));

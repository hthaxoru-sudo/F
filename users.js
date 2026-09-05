// BeeHouse built-in accounts. Additional accounts are created from Admin > บัญชีผู้ใช้
const USER_ROLES={SUPER_ADMIN:'super_admin',INTERVIEWER:'interviewer',STAFF:'staff',USER:'user'};
const USERS_DATABASE=[
 {id:'admin-beehouse',username:'admin_beehouse',password:'SuperAdminPassword123!',role:USER_ROLES.SUPER_ADMIN,name:'ผู้ดูแลระบบสูงสุด (Super Admin)',avatar:'🛡️',enabled:true},
 {id:'staff-bee',username:'staff_bee',password:'StaffPassword123!',role:USER_ROLES.STAFF,name:'ทีมงานดูแลเว็บ',avatar:'👤',enabled:true}
];
window.USER_ROLES=USER_ROLES;window.USERS_DATABASE=USERS_DATABASE;

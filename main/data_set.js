/*
 * name: budiono;
 * date: sep-04, 15:17, mon-2023; new; 69;
 * edit: sep-06, 20:55, wed-2023; 
 * edit: sep-11, 15:39, mon-2023; 
 * edit: sep-12, 22:17, tue-2023;
 * edit: sep-14, 17:10, thu-2023;
 * edit: sep-16, 21:25, sat-2023;
 * edit: sep-20, 11:03, wed-2023;
 * edit: sep-27, 15:26, wed-2023;
 * edit: sep-28, 17:57, thu-2023; 
 */

'use strict';

//====SETTING KONEKSI KE DATABASE SERVER/LOKAL========//
const config_local={
  url:'http://localhost:8080/',
  image:'http://localhost/image/',
}
const config_server={
  //url:'http://34.101.166.144/',
  //url:'http://35.225.28.242/', // google cloud 
  url:'https://datablok.id/', // google cloud 
  image:'https://rangkaidata.com/image/',
}
/* GANTI DISINI UNTUK KONEKSI KE SERVER ATAU KE LOKAL */
const config=config_server;
// const config=config_local;
//====================================================//
const document_title="Rangkai Data";
const LIMIT=10;
const array_posting_methods=[
  "Real Time Posting",
  "Batch Posting"
]
const array_accounting_methods=[
  "Cash Basis",
  "Accrual"
]
const array_expired_mode=[
  "15 Minute",
  "1 Hour",
  "8 Hour",
  "24 Hour",
  "Never Expired"
];
const array_account_class=[
   "Asset"
  ,"Liability"
  ,"Equity"
  ,"Income"
  ,"Cost of Sales"
  ,"Expense"
  ,"Other Income"
  ,"Other Expense"
]
const array_cost_type=[
   "Labor"
  ,"Materials"
  ,"Equipment"
  ,"Subcontractors"
  ,"Other"
]
const array_location_type=[
  "0-stock",
  "1-manufacture",
  "2-non-stock"
]
const array_network_status=[
  "Waiting",
  "Join",
  "Leave"
]
const array_cost_method=[
   "FIFO"
  ,"LIFO"
  ,"Average"
]
const default_item_class=[
  "Stock",// 0
  "Non-stock item",// 1
  "Description only",// 2
  "Service",// 3
  "Labor",// 4
  "Assembly",// 5
  "Activity item",// 6
  "Charge item"// 7
]
const default_terms=[
  "C.O.D", // #0
  "Prepaid", // #1
  "Due in number of days",// #2
  "Due on day of month", // #3
  "Due at end of month", // #4
]
const array_pay_frequency=[
  "Weekly",
  "Bi-weekly",
  "Semi-monthly",
  "Monthly",
  "Annualy"
];
const array_field_type=[
  "Addition",
  "Deduction"
];
const array_formula=[
  "0-None",
  "1-FIT",
  "2-FICA EE",
  "3-MEDICARE",
  "4-SIT",
  "5-401K EE",
  "6-FICA ER",
  "7-FUTA ER",
  "8-SUI ER",
  "9-401K ER"
]
const array_employee_class=[
   "Employee"
  ,"Sales Rep"
]
const array_employee_filling_status=[
   "Single"
  ,"Married"
  ,"Head/Household"
  ,"Not Required"
  ,"Married/Jointly"
  ,"Married/Separately"
  ,"Qualifying Widow(er)"
  ,"Married/2 Incomes"
  ,"Special A"
  ,"Special B"
  ,"Special C"
  ,"Special D"
  ,"Special E"
  ,"Special F"
  ,"Special G"
  ,"Special H"
]
const array_employee_pay_method=[
  "Salary",
  "Hourly-Hours per Pay Period",
  "Hourly-Time Ticket Hours"
]

const array_user_level=[
  "User",
  "Email",
  "Mirror",
];

const data_fields=[
  // master id
  ['record_id','Record ID'],
  ['process_id','Process ID'],
  ['modul_id','Modul ID'],
  ['user_name','User Name'],
  ['retype_passcode','Retype Passcode'],
  ['user_fullname','User Full Name'],
  ['user_password','Password'],
  ['confirm_password','Comfirm Password'],
  ['login_id','Login ID'],
  ['home_id','Home ID'],
  ['company_id','Company ID'],
  ['end_date','End Date'],
  ['start_date','Start Date'],
  ['account_id','Account ID'],
  ['item_tax_id','Tax ID'],
  ['location_id','Location ID'],
  ['to_location_id','To Location ID'],
  ['phase_id','Phase ID'],
  ['cost_id','Cost ID'],
  ['ship_id','Ship VIA'],
  ['pay_method_id','Pay Method ID'],
  ['invite_id','Invite ID'],
  
  ['item_id','Item ID'],
  ['sub_item_id','Sub Item ID'],
  ['job_id','Job ID'],
  ['sales_tax_id','Sales Tax ID'],
  ['employee_id','Employee ID'],
  ['vendor_id','Vendor ID'],
  ['customer_id','Customer ID'],
  ['sales_rep_id','Sales Rep ID'],
  ['note_id','Note ID'],
  ['email_address','Email Address'],
  
  ['sales_account_id','Sales Account ID'],
  ['inventory_account_id','Inventory Account ID'],
  ['cogs_account_id','COGS Account ID'],
  ['income_account_id','Income Account ID'],
  ['gl_account_id','GL Account ID'],
  ['discount_account_id','Discount Account ID'],
  ['ap_account_id','AP Account ID'],
  ['ar_account_id','AR Account ID'],
  ['cash_account_id','Cash Account ID'],
  ['freight_account_id','Freight Account ID'],
  ['liability_account_id','Liability Account ID'],
  ['expense_account_id','Expense Account ID'],
  
  ['date','Date'],

  // modul
  ['customer_defaults','Customer Defaults'],
  ['item_defaults','Item Defaults'],
  ['vendor_defaults','Vendor Defaults'],
  ['employee_defaults','Employee Defaults'],
  ['prices','Item Prices'],
  ['boms','Bill of Materials'],
  ['journal_entry','Journal Entry'],
  ['builds','Build Assemblies'],
  ['unbuilds','Unbuild Assemblies'],
  ['moves','Movement'],
  
  // begin
  ['balance_no','Balance No'],
  ['account_begins','Account Beginning'],
  ['vendor_begins','Vendor Beginning'],
  ['customer_begins','Customer Beginning'],
  ['job_begins','Job Beginning'],
  ['item_begins','Item Beginning'],
  ['employee_begins','Employee Beginning'],
  ['field_name','Field Name'],
  
  // transaction number
  ['journal_no','Journal No'],
  ['build_no','Build No'],
  ['unbuild_no','Unbuild No'],
  ['move_no','Move No'],
  ['adjustment_no','Adjustment No'],
  ['invoice_no','Invoice No'],
  
  // balances
  ['reference_no','Reference No'],
];

var objPop;
var nBebas={
  gimana:false,
  indek:-1
}
var content={};
var recent_count=0;
var bingkai_posisi=[{
  indek:0,
  dead:0,
  name:''
}];
var Drag={};
var Resize={};
var global={
  login_blok:null,
  tabPasif:0,
  klik:true,
}
var layar={
  lebar:0,
  tinggi:0,
}
var ui={
  zindek:0,
  global_url:'',
  menu_bar_show:false,
  modal:false,
  warna:{
    form:'#F5F5F5',
    toolbar:'#F5F5F5',
  },
  titlebar:{
    tinggi:1.7,
    warna:"#d0d3d4",
  },
  unit:'rem',
};
var datanya=[
  {
    "id":"home",
    "name":"&#9776",
    "submenu":[],
    "status":"1",
    "display":"inline-block"
  },
  {
    "id":"window",
    "name":"Recent",
    "submenu":[],
    "status":"1",
    "display":"none"
  }
];
var Menu=[];
var bingkai=[{
  parent:0,
  nama:'',
  modul:'',
  server:{
    url:config.url,
    image:config.image,
  },
  login:{
    id:null,
    name:'Your Name',
    full_name:'Your Full Name',
  },
  company:{
    id:'',
    name:'',
  },
  invite:{
    id:null,
    name:null,
  },
  menu:{
    id:null,
    name:null,
    type:null,
    data:[],
  },
  group:{
    id:'net',
  },
  closed:1,
  status:1,
  letak:{
    tengah:1,
    atas:3.50,
    kiri:3.50,
  },
  ukuran:{
    lebar:60,
    tinggi:35,
  },
  bisa:{
    hilang:1,
    tutup:1,
    kecil:1,
    besar:1,
    sedang:1,
    tambah:1,
    gerak:1,
    ubah:1,
  },
  modal:0,
  child_free:true,
  path:'',
  folder:'',
  statusbar:{
    ada:1,
    tinggi:3.00,
  },
  titlebar:{
    ada:1,
    tinggi:1.50,
    warna:""
  },
  toolbar:{
    ada:1,
    tinggi:1.90,
    warna:'#F5F5F5',
    button:{
      atas:0.1,
      kiri:0.25,
      tinggi:1.50,
    }
  },
  warna:'#F5F5F5',
  unit:"rem",
  baru:false,
  home:{
    id:'',
    name:'',
  }
}];
var antrian=[];
var message={};
var db={};
var db1={};
var db3={};
var iii={}
var objPop={};

// eof: 218;


/*
 * name: budiono
 * date: sep 03, 08:50, sun-2023; new; 117;
 * edit: sep-04, 11:48, mon-2023; add; 272;
 * edit: sep-05, 09:54, tue-2023; add; 351;
 * edit: sep-06, 20:56, wed-2023; 
 * edit: sep-11, 12:13, mon-2023; add items;
 * edit: sep-14, 16:37, thu-2023; 
 * edit: sep-17, 08:23, sun-2023; xHTML;
 * edit: sep-25, 12:13, mon-2023; start report;
 * edit: sep-27, 13:27, wed-2023; begin account;vendor;
 * edit: oct-12, 09:12, thu-2023; journal_entry
 * edit: oct-16, 21:52, mon-2023; job_balances;
 */ 

'use strict';

Menu.url="menu";

Menu.lokal=function(){
  Menu.invite=[];
  
  const tree=[
//    {parent:'root',id:'home',name:'Home',type:1},
    {parent:'root',id:'register',name:'Register',type:2},
    {parent:'root',id:'login',name:'Login',type:2},
    {parent:'root',id:'forgot',name:'Forgot Password','type':2},
  ];
  
  Menu.ready(tree);
}

Menu.ready=function(tree){
  var arr={
    id:bingkai[0].invite.id,
    data:tree,
  }

  Menu.invite.push(arr);
  
  for (var x in tree){
    if (tree[x].parent=='root'){
      arr={
        'id':tree[x].id,
        'name':tree[x].name,
        'type':tree[x].type,
      };
      datanya[0].submenu.push(arr);
    }
  }
  
  ui.setMenuBar();
  ui.recentlyApp();
  ui.changeMenuBarTitle(xHTML(bingkai[0].login.full_name) );
  
  var group_id;
  if(bingkai[0].group.id==bingkai[0].login.name){
    group_id='root';
  }else{
    group_id=bingkai[0].group.id;
  }
  
  bingkai[0].folder=bingkai[0].login.name
    +'@'+group_id+': '

  document.getElementById('window').style.visibility='visible';
}

Menu.klik=function(nomer){
  const tiket=antrian[nomer];
  console.log('menu.klik: '+tiket.menu.id);
  Menu.type(tiket);
  switch(tiket.menu.type){
    case 0:
    case 1:
      Menu.showFolder(tiket);// bentuk folder
      break;
    case 2:
    case 3:
      Menu.showForm(tiket);// bentuk form
      break;
    default:
      console.log('Menu.modulKlik: '+tiket.menu.type);
  }
}

Menu.type=function(tiket){// ambil tipe
  Menu.access(tiket);
  for(var x=0;x<tiket.menu.data.length;x++){
    if (tiket.menu.data[x].id==tiket.menu.id){
      //tiket.menu.name=tiket.menu.data[x].name
      tiket.menu.type=tiket.menu.data[x].type
      // alert('ada');
    }
  }
}

Menu.access=function(tiket){// ambil access menu
  console.log(Menu.invite.length);
  for(var i=0;i<Menu.invite.length;i++){
    if(Menu.invite[i].id==tiket.invite.id){
      tiket.menu.data=Menu.invite[i].data;
    }
  }
  if(tiket.menu.data==undefined){
    tiket.menu.data=[];
  }
}

Menu.showForm=function(tiket){  
  Menu.active.id=tiket.menu.id;
  Menu.active.name=tiket.menu.name;
  
  switch(tiket.menu.id){
    // non-login
    case 'register':Register.show(tiket);break;
    case 'login':Login.show(tiket);break;
    case 'logout':Logout.show(tiket);break;
    case 'forgot':Forgot.show(tiket);break;
    // new
    case 'home':Home.show(tiket);break;
    // company
    case 'company':Company.show(tiket);break;
    case 'manage_users':Users.show(tiket);break;
    case 'company_information':CompanyProfile.show(tiket);break;
    // apps
    case 'notes':Notes.show(tiket);break;
    // network
    case 'network':Network.show(tiket);break;
    // setting
    case 'blok':Blockchain.show(tiket);break;
    case 'default':Default.show(tiket);break;
    case 'user_profile':UserProfile.show(tiket);break;
    // admin
    case 'user_levels':UserLevels.show(tiket);break;
    case 'send_emails':SendEmails.show(tiket);break;
    // folder/jobs
    case 'cost_codes':Costs.show(tiket);break;
    case 'phases':Phases.show(tiket);break;
    case 'jobs':Jobs.show(tiket);break;
    case 'job_begins':JobBegins.show(tiket);break;
    case 'job_balances':JobBalances.show(tiket);break;
    // folder/ledgers
    case 'accounts':Accounts.show(tiket);break;
    case 'period':Periods.show(tiket);break;
    case 'account_begins':AccountBegins.show(tiket);break;
    case 'account_balances':AccountBalances.show(tiket);break;
    case 'journal_entry':JournalEntry.show(tiket);break;
    // folder/inventory
    case 'locations':Locations.show(tiket);break;
    case 'item_taxes':ItemTaxes.show(tiket);break;
    case 'ship_methods':ShipVia.show(tiket);break;
    case 'item_defaults':ItemDefaults.show(tiket);break;
    case 'items':Items.show(tiket);break;
    case 'prices':Prices.show(tiket);break;
    case 'boms':Boms.show(tiket);break;
    case 'item_begins':ItemBegins.show(tiket);break;
    case 'item_balances':ItemBalances.show(tiket);break;
    case 'builds':Builds.show(tiket);break;
    case 'unbuilds':Unbuilds.show(tiket);break;
    case 'moves':Moves.show(tiket);break;
    case 'adjustments':Adjustments.show(tiket);break;
    // folder/sales
    case 'pay_methods':PayMethods.show(tiket);break;
    case 'sales_taxes':SalesTax.show(tiket);break;
    case 'customer_defaults':CustomerDefaults.show(tiket);break;
    case 'customers':Customers.show(tiket);break;
    case 'customer_begins':CustomerBegins.show(tiket);break;
    case 'customer_balances':CustomerBalances.show(tiket);break;
    // folder/purchases
    case 'vendor_defaults':VendorDefaults.show(tiket);break;
    case 'vendors':Vendors.show(tiket);break;
    case 'vendor_begins':VendorBegins.show(tiket);break;
    case 'vendor_balances':VendorBalances.show(tiket);break;
    // folder/payroll
    case 'employee_defaults':EmployeeDefaults.show(tiket);break;
    case 'employees':Employees.show(tiket);break;
    case 'payroll_period':PayrollPeriods.show(tiket);break;
    case 'employee_begins':EmployeeBegins.show(tiket);break;
    // folder/report/ledger
    case 'rpt_chart_01':RptChart01.show(tiket);break;
    
    default:alert('Form "'+tiket.menu.id+'" undefined in'
      +' [menus.js]');
  }
}

Menu.active={
  id:null,
  name:null,
}

// add: sep-04, 11:49, 

Menu.server=function(){
  Menu.invite=[];
  bingkai[0].modul='menu';
  
  db.query(0,Menu.url+'/read',{
    'login_id':bingkai[0].login.id
  },(paket)=>{
    if(paket.err.id==0){
      Menu.ready(paket.data);
      const tiket=JSON.parse(JSON.stringify(bingkai[0]));// destruct arr
      tiket.parent=0;
      tiket.menu.id='home';
      tiket.menu.name='Home';
      tiket.folder=bingkai[0].folder;
      antrian.push(tiket);
      Menu.klik(antrian.length-1);
      document.getElementById('menu_bar_title').style.display="inline";
    }
  })
}

Menu.more=function(indek){
  const x=JSON.parse(JSON.stringify(bingkai[indek]));
  x.baru=true;
  More.show(x);
}

Menu.ikon2=function(a){
  switch(a){
    case 0:
    return '&#127974;'; // home
    break;

    case 1:
    return '&#128193;'; // folder
    break;
    
    case 2:
    return '&#128221;';// paper with pencil
    break;
    
    case 3:
    return '&#128195;';// paper roll
    break;
  }
}

Menu.showFolder=function(tiket){
  tiket.bisa.tambah=0;
  var baru=exist(tiket);
  if(baru==-1){
    const tampil=new BingkaiUtama(tiket);
    const indek=tampil.show();
    Menu.dataFolder(indek);
  }else{
    show(baru);
  }
}

Menu.dataFolder=function(indek){
  var html='';
  var jml=0;
  const paket=bingkai[indek].menu.data;

  for (var x in paket){
    if (paket[x].parent==bingkai[indek].menu.id){
      // obstraction of justice;
      const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
      tiket.home.id='';
      tiket.menu.id=paket[x].id;
      tiket.menu.name=paket[x].name;
      tiket.menu.folder=paket[x].folder;
      tiket.parent=indek;
      antrian.push(tiket);

      html+='<div style="width:6.5rem;'
        +'height:6.5rem;'
        +'word-wrap:inherit;'
        +'text-overflow:ellipsis;'
        +'overflow:hidden;'
        +'margin:0.1rem;'
        +'float:left;'
        +'border:0px;'
        +'border-radius:5%;'
        +'white-space:normal;text-align:center;'
        +'"'
        +'id="'+paket[x].id+'"'
        +' onclick="Menu.klik(\''+(antrian.length-1)+'\');"'
        +' onMouseOver="this.style.backgroundColor=\'lightgrey\'" '
        +' onMouseOut="this.style.backgroundColor=\'white\'">'
        
        +'<div style="font-size:2.1rem;">'+Menu.ikon2(paket[x].type)+'</div>'
        +paket[x].name
      +'</div>'      
      jml++;
    }
  }
  if(jml==0){
    html='<div align="center">'
      +'<h1>Folder is Empty</h1>'
      +'<p>Menu ID: <b>['+bingkai[indek].menu.id+']</b></p>'
      +'</div>';
  }
  content.html(indek,html);
    
  toolbar.hide(indek);
  toolbar.more(indek,()=>{
    const x=JSON.parse(JSON.stringify(bingkai[indek]));
    x.baru=true;
    More.show(x);
  });

  statusbar.html(indek,jml+" items.");
}

Menu.ikon3=function(menu_name){
  switch (menu_name){
    case "Exit":
      return "&#128164; ";
      break;

    default:
      return "&#127974; "+menu_name;
  }
}

Menu.klikAppDrawer=function(nomer){
  const tiket=antrian[nomer];
  console.log('menu.klik: '+tiket.menu.id);
  Menu.type(tiket);
  Menu.showAppDrawer(tiket);// bentuk app drawer
  
}

Menu.showAppDrawer=function(tiket){
  tiket.bisa.tambah=0;
  var baru=exist(tiket);
  if(baru==-1){
    const tampil=new BingkaiUtama(tiket);
    const indek=tampil.show();
    Menu.dataAppDrawer(indek);
  }else{
    show(baru);
  }
}

Menu.dataAppDrawer=function(indek){
  var html='';
  var jml=0;
  const paket=bingkai[indek].menu.data;

  for (var x in paket){
    if (paket[x].type==2 || paket[x].type==3){
      const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
      // tiket.baru=true;
      tiket.home.id='';
      tiket.menu.id=paket[x].id;
      tiket.menu.name=paket[x].name;
      tiket.menu.folder=paket[x].folder;
      tiket.parent=indek;
      antrian.push(tiket);

      html+='<div style="width:6.5rem;'
        +'height:6.5rem;'
        +'word-wrap:inherit;'
        +'text-overflow:ellipsis;'
        +'overflow:hidden;'
        +'margin:0.1rem;'
        +'float:left;'
        +'border:0px;'
        +'border-radius:5%;'
        +'white-space:normal;text-align:center;'
        +'"'
        +'id="'+paket[x].id+'"'
        +' onclick="Menu.klik(\''+(antrian.length-1)+'\');"'
        +' onMouseOver="this.style.backgroundColor=\'lightgrey\'"'
        +' onMouseOut="this.style.backgroundColor=\'white\'">'
        +'<div style="font-size:2.1rem;">'
          +Menu.ikon2(paket[x].type)
        +'</div>'
        +''+paket[x].name+''
      +'</div>'      
      jml++;
    }
  }
  if(jml==0){
    html='<div align="center">'
      +'<h1>Folder is Empty</h1>'
      +'<p>Menu ID: <b>['+bingkai[indek].menu.id+']</b></p>'
      +'</div>';
  }
  content.html(indek,html);
    
  toolbar.hide(indek);
  toolbar.more(indek,()=>{
    const x=JSON.parse(JSON.stringify(bingkai[indek]));
    x.baru=true;
    More.show(x);
  });

  statusbar.html(indek,jml+" items.");
}
// eof:117;272;351;

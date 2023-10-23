/*
 * auth: budiono;
 * date: sep-05, 09:52, tue-2023; new;522;
 * edit: sep-10, 21:52, tue-2023; 
 */

'use strict';

var Users={
  title:"Manage Users",
  url:"invite",
  menu:[]
}

Users.show=(tiket)=>{
  tiket.modul=Users.url;
  tiket.menu.name=Users.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Users.formPaging(indek);
    Users.readMenu(indek);
  }else{
    show(baru);
  }
}

Users.readMenu=(indek)=>{
  Users.menu=[];
  var isi={};
  var m=Menu.invite[0].data;
  
  for(var i=0;i<m.length;i++){
    if(m[i].access>0){
      isi={
        'sort':m[i].sort,
        'parent':m[i].parent,
        'id':m[i].id,
        'name':m[i].name,
        'access':m[i].access,
        'selected':m[i].selected
      }
      Users.menu.push(isi);
    }
  }
  Users.menu.sort(function(a, b){return a.sort - b.sort});
}

Users.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Users.formCreate(indek));
  toolbar.search(indek,()=>Users.formSearch(indek));
  toolbar.refresh(indek,()=>Users.formPaging(indek));
  toolbar.download(indek,()=>Users.formExport(indek));
  toolbar.upload(indek,()=>Users.formImport(indek));
  toolbar.more(indek,()=>{
    Menu.more(indek);
  });
  db3.readPaging(indek,()=>{
    Users.readShow(indek);
  });
}

Users.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  var html='<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button"'
        +' id="btn_first"'
        +' onclick="Users.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Users.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].url+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>';  
        } else {
          html+= '<button type="button"'
          +' onclick="Users.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].url+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="Users.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">User Name</th>'
    +'<th>Response</th>'
    +'<th>Company Name</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td>'+paket.data[x].info.user_name+'</td>';
      
      if (paket.data[x].invite_resp){
      }
      
      html+='<td align="center"><b>'
        +array_network_status[paket.data[x].status]+'</b></td>'
        +'<td align="left">'+xHTML(paket.data[x].company_name)+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>';

        if(paket.data[x].status==2){// leave
          html+='<td align="center">x</td>'
        }else{
          html+='<td align="center">'
          +'<button type="button" '
          +' id="btn_key" '
          +' onclick="Users.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].invite_id+'\');">Access</button>'
          +'</td>'
        }

        html+='<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Users.formDelete(\''+indek+'\''
          +',\''+paket.data[x].invite_id+'\');"></button>'
          +'</td>'
        +'</tr>';
    }
  }
  
  if (metode==MODE_READ){
    html+='</table><br>'
    +'<ul><li><b>Status Response:</b></li>'
    +'<li>1) <b>Waiting</b> menunggu konfirmasi dari user.</li>'
    +'<li>2) <b>JOIN</b>. user sudah gabung ke network.</li>'
    +'<li>3) <b>LEAVE</b>. user sudah keluar dari network.</li>'
    +'</ul>';
  }
  html+='</div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Users.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'

    +'<ul>'
    +'<li><label>Company ID:</label>'
      +'<input type="text" '
      +' id="company_name_'+indek+'" disabled '
      //+' value="'+bingkai[indek].company.name+'">'
      +' value="'+bingkai[indek].company.id+'">'
      +'</li>'

    +'<li><label>Invite ID</label>'
      +'<input type="text" id="invite_id_'+indek+'"></li>'
    
    +'<li><label>User Name</label>'
      +'<input type="text" id="user_name_'+indek+'"></li>'
      
    +'<li><label>Login Timeout</label>'
      +'<select id="exp_mode_'+indek+'">';
        for(var i=0;i<array_expired_mode.length;i++){
          html+='<option>'+array_expired_mode[i]+'</option>';
        }
      html+='</select>'
    +'</li>'
    
    +'<li><label>Date Expired</label>'
      +'<input type="date" id="date_expired_'+indek+'"></li>'
    
      
    +'<li><label>Invite Note:</label>'
      +'<input type="text" id="invite_note_'+indek+'"></li>'
    +'</ul>'

    +'<p><i>&#10020 Daftarkan user name baru di halaman Login: '
     +'Menu/Register akun baru.</i></p>'

    +'<details open>'
    +'<summary>User Access</summary>'
      +'<div id="user_access_'+indek+'"></div>'
    +'</details>'
    +'<br>';

  content.html(indek,html);  
  const ids=new Date().getTime();
  document.getElementById('invite_id_'+indek).value=String(ids);
  document.getElementById('date_expired_'+indek).value=tglSekarang();
  
  if(metode==MODE_CREATE){
    document.getElementById("user_name_"+indek).focus();
    document.getElementById('user_name_'+indek).disabled=false;
  }else{
    document.getElementById('invite_id_'+indek).disabled=true;
    document.getElementById('user_name_'+indek).disabled=true;
  }
}

Users.formCreate=(indek)=>{
  Users.formEntry(indek,MODE_CREATE);
  Users.access(indek,Users.menu);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Users.formPaging(indek);});
  toolbar.save(indek,()=>{Users.createExecute(indek);});
}

Users.createExecute=(indek)=>{
  var elem = document.getElementsByName("menuAccess_"+indek);
  var names = [];
  var str='';
  var abc='';
  
  for (let i = 0; i < elem.length; ++i) {
    str=elem[i].value;
    abc=str.split(":");
    // bila 0, tidak perlu disimpan
    if (parseInt(abc[1])!=0){
      names.push(elem[i].value);
    }
  }

  db1.createOne(indek,{
    "company_id":bingkai[indek].company.id,
    "invite_id":getEV('invite_id_'+indek),
    "user_name":getEV('user_name_'+indek),
    "exp_mode":getEI('exp_mode_'+indek),
    "date_expired":getEV('date_expired_'+indek),
    "menu_access":names,
    "invite_note":getEV('invite_note_'+indek)
  });
}

Users.access=(indek, menuList)=>{
  console.log(menuList);

  var html='<table border=1>'
    +'<th>GROUP</th>'
    +'<th>MENU</th>'
    +'<th>ACCESS</th>';

  for (var x in menuList) {
    html+='<tr>'
      +'<td>'+menuList[x].parent+'</td>'
      +'<td><input type="text" name="menuName_'+indek+'"'
        +' value="'+menuList[x].id+'" hidden>'+menuList[x].name
        +'</td>';
    
    if (menuList[x].id=='folder'){
      html+= "<td><input type='hidden'"
        +" name='menuAccess_"+indek+"' value='folder:1'>"
        +"</td>";
    }else if(menuList[x].id=='company'){
      //html+= "<td><input type='hidden' name='menuAccess_"+indek+"' value='company:1'></td>";
    }else{
      html+= "<td align='center'>"
        +" <select name='menuAccess_"+indek+"'>";
      
      if (menuList[x].access==0){
        html+=terPilih(menuList[x].id, 
          menuList[x].access, 
          menuList[x].selected);
        
      }else if (menuList[x].access==1){
        html+=terPilih(menuList[x].id, "0", menuList[x].selected)
          +terPilih(menuList[x].id, "1", menuList[x].selected);
        
      }else if (menuList[x].access==2){
        html+=terPilih(menuList[x].id, "0", menuList[x].selected)
          +terPilih(menuList[x].id, "1", menuList[x].selected)
          +terPilih(menuList[x].id, "2", menuList[x].selected);
        
      }else if (menuList[x].access==3){
        html+= terPilih(menuList[x].id,"0", menuList[x].selected)
          +terPilih(menuList[x].id,"1", menuList[x].selected)
          +terPilih(menuList[x].id,"2", menuList[x].selected)
          +terPilih(menuList[x].id,"3", menuList[x].selected);

      }else if (menuList[x].access==4){          
        html+=terPilih(menuList[x].id,"0", menuList[x].selected)
          +terPilih(menuList[x].id,"1", menuList[x].selected)
          +terPilih(menuList[x].id,"2", menuList[x].selected)
          +terPilih(menuList[x].id,"3", menuList[x].selected)
          +terPilih(menuList[x].id,"4", menuList[x].selected);
      
      }else if (menuList[x].access==5){
        html+=terPilih(menuList[x].id,"0", menuList[x].selected)
          +terPilih(menuList[x].id,"1", menuList[x].selected)
          +terPilih(menuList[x].id,"2", menuList[x].selected)
          +terPilih(menuList[x].id,"3", menuList[x].selected)
          +terPilih(menuList[x].id,"4", menuList[x].selected)
          +terPilih(menuList[x].id,"5", menuList[x].selected);
      }
      html+= '</select></td>';
    }
    html+='</tr>';
  }
  html+='</table>';
  document.getElementById("user_access_"+indek).innerHTML=html;
}

function terPilih(menuNama,menuAccess,menuSelected){
  var str = "<option value='ok' selected>budi</option>";
  var strMenu;
  switch(menuAccess){
    case 0: 
      // no access = tidak bisa apa-apa.
      strMenu = "No Access"; 
      break;      
    case "1": 
      // can read = hanya bisa baca
      strMenu = "Can Read";
      break;
    case "2": 
      // can create= bisa baca, & bisa tulis
      strMenu = "Can Create";
      break;
    case "3": 
      // can edit= bisa baca, bisa tulis, bisa update, & bisa delete
      strMenu = "Can Edit";
      break;
    case "4": 
      // can export= bisa baca, bisa tulis, bisa update, 
      // bisa delete, & bisa export
      strMenu = "Can Export";
      break;
    case "5":
      strMenu = "CAN Lock";
      break;
    default:
      strMenu = "No Access";
    
  }
  if (menuAccess==menuSelected){
    str = "<option value='" + menuNama +":"+ menuAccess +"' selected>"
      + strMenu +"</option>"; 
  }else {
    str = "<option value='" + menuNama +":"+ menuAccess +"'>"
      + strMenu +"</option>";  
  }
  return str;
}

Users.readOne=(indek,eop)=>{
  db1.readOne(indek,{
    "company_id":bingkai[indek].company.id,
    "invite_id":bingkai[indek].invite_x
  },(paket)=>{
    if (paket.err.id==0) {
      bingkai[indek].paket=paket;
      const d=paket.data;
      setEV('invite_id_'+indek,d.invite_id);
      setEV('user_name_'+indek,d.user_name);
      setEI('exp_mode_'+indek,d.exp_mode);
      setEV('date_expired_'+indek,d.date_expired);
      setEV('invite_note_'+indek,d.invite_note);
      
      Users.access(indek,bingkai[indek].paket.data.menu_access);
      statusbar.ready(indek);
      message.none(indek);
      return eop();
    }
  });
}

Users.formUpdate=(indek,invite_id)=>{
  bingkai[indek].invite_x=invite_id;
  toolbar.none(indek);
  toolbar.hide(indek);  
  Users.formEntry(indek,MODE_UPDATE);
  Users.readOne(indek,()=>{
    toolbar.back(indek,()=>{Users.formLast(indek);});
    toolbar.save(indek,()=>{Users.updateExecute(indek);})
  });
}

Users.updateExecute=(indek)=>{  
  var elem = document.getElementsByName("menuAccess_"+indek);
  var names = [];
  var str='';
  var abc='';
  
  for (let i = 0; i < elem.length; ++i) {
    str=elem[i].value;
    abc=str.split(":");
    // bila 0, tidak perlu disimpan
    if (parseInt(abc[1])!=0){
      names.push(elem[i].value);
    }
  }

  db1.updateOne(indek,{
    "company_id":bingkai[indek].company.id,
    "invite_id":bingkai[indek].invite_x,
    "exp_mode":getEI('exp_mode_'+indek),
    "date_expired":getEV('date_expired_'+indek),
    "menu_access":names,
    "invite_note":getEV('invite_note_'+indek)
  });
}

Users.formDelete=(indek,invite_id)=>{
  bingkai[indek].invite_x=invite_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Users.formEntry(indek,MODE_DELETE);
  Users.readOne(indek,()=>{
    toolbar.back(indek,()=>{Users.formLast(indek);});
    toolbar.delet(indek,()=>{Users.deleteExecute(indek);});
  });
}

Users.deleteExecute=(indek)=>{
  db1.deleteOne(indek,{
    "company_id":bingkai[indek].company.id,
    "invite_id":bingkai[indek].invite_x
  });
}

Users.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Users.formSearch(indek);});
  db3.search(indek,()=>{
    Users.readShow(indek);
  });
}

Users.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Users.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Users.formPaging(indek);});
}

Users.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Users.formResult(indek)
}

Users.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Users.formPaging(indek):
  Users.formResult(indek);
}

Users.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Users.formPaging(indek));
  Users.exportExecute(indek);
}

Users.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'manage_users.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Users.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Users.formPaging(indek);});
  iii.uploadJSON(indek);
}

Users.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "company_id":bingkai[indek].company.id,
      "invite_id":d[i][1],
      "user_name":d[i][2],
      "exp_mode":d[i][3],
      "date_expired":d[i][4],
      "menu_access":d[i][5],
      "invite_note":d[i][6]
    }
    db1.query(indek, Users.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
// eof: 522;

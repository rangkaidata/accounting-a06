/*
 * auth: budiono
 * date: sep-04, 14:37, mon-2023; new;
 * edit: sep-05, 10:34, tue-2023; add;
 * edit: sep-19, 21:56, tue-2023;
 * edit: sep-20, 17:37, wed-2023; 
 */ 
 
'use strict';

var Network={
  title:'Network',
  url:'network'
}

Network.show=(tiket)=>{
  tiket.modul=Network.url;
  tiket.menu.name=Network.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Network.formPaging(indek);
  }else{
    show(baru);
  }  
}

Network.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{Network.formPaging(indek)});
  toolbar.more(indek,()=>Menu.more(indek));
  
  db1.readPaging(indek,()=>{
    Network.readShow(indek);
  });
}

Network.readShow=(indek)=>{
  const paket=bingkai[indek].paket;
  
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>'

  html+='<table border=1>'
    +'<th colspan="2">Invite Date</th>'
    +'<th>User Request</th>'
    +'<th>Company Name</th>'
    +'<th>Your Response</th>'
    +'<th colspan="2">Action</th>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'
          +tglInt(paket.data[x].info.date_created)+'</td>'
        +'<td align="left">'+paket.data[x].info.admin_name+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].company_name)+'</td>'
        +'<td align="center"><strong>'
          +array_network_status[paket.data[x].status]
          +'</strong></td>';

      if (paket.data[x].status==0){// wait 0
        html+='<td align="center">'
        +' <button type="button" '
        +' id="btn_yes" '
        +' onclick="Network.joinFolder(\''+indek+'\''
        +',\''+paket.data[x].invite_id+'\''
        +',\''+paket.data[x].company_id+'\''
        +');">'
        +'Join</button>'
        +'</td>';        
      }else if(paket.data[x].status==1){// join
        html+='<td align="center">'
          +' <button type="button" '
          +' id="btn_open" '
          +' onclick="Network.openFolder(\''+indek+'\''
          +',\''+paket.data[x].invite_id+'\''
          +',\''+paket.data[x].company_id+'\''
          +');">'
          +' </button>'
          +'</td>';
      }else{
        html+='<td align="center">-</td>';
      }
      if(paket.data[x].status==2){
        html+='<td align="center">-</td>';
      }else{
        html+='<td><button type="button" '
            +' id="btn_detail" '
            +' onclick="Network.formView(\''+indek+'\''
            +',\''+paket.data[x].invite_id+'\''
            +',\''+paket.data[x].company_id+'\''
            +');">'
            +'</button>'
            +'</td>';
      }
      +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Network.formView=(indek,invite_id,company_id)=>{  
  toolbar.none(indek);
  toolbar.hide(indek);
  Network.form02(indek);
  Network.readOne(indek,invite_id,company_id,()=>{
    toolbar.back(indek,()=>Network.formLast(indek));
    toolbar.delet(indek,()=>Network.leaveFolder(indek,invite_id,company_id));
  });
}

Network.form02=(indek)=>{
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    
    +'<ul>'
    +'<li><label>Company</label>: '
      +'<span id="company_name_'+indek+'"></span></li>'
    +'<li><label>Invite ID</label>: '
      +'<span id="invite_id_'+indek+'"></span></li>'
    +'<li><label>User Name</label>: '
      +'<span id="user_name_'+indek+'"></span></li>'
    +'<li><label>Login Expired</label>: '
      +'<span id="login_expired_'+indek+'"></span></li>'
    +'<li><label>Date Expired</label>: '
      +'<span id="date_expired_'+indek+'"></span></li>'
    +'<li><label>Note</label>: '
      +'<span id="invite_note_'+indek+'"></span></li>'
    +'</ul>'
    
    +'<details open>'
    +'<summary>Access</summary>'
    +'<div id="user_access_'+indek+'"></div>'
    +'</details>'

  content.html(indek,html);
}

Network.readOne=(indek,invite_id,company_id,eop)=>{  
  db1.readOne(indek,{
    'invite_id':invite_id,
    'company_id':company_id
  },
  (paket)=>{
    const d=paket.data;
    setEH('company_name_'+indek, xHTML(d.company_name) );
    setEH('invite_id_'+indek, paket.data.invite_id);
    setEH('user_name_'+indek, paket.data.user_name);
    setEH('login_expired_'+indek, paket.data.login_expired);
    setEH('date_expired_'+indek, paket.data.date_expired);
    setEH('invite_note_'+indek, 
      '<b><i>'+xHTML(paket.data.invite_note)+'</i></b>');
    
    var html='<table>'
    +'<th>GROUP</th>'
    +'<th>MENU</th>'
    +'<th>YOUR ACCESS</th>';

    for(var i=0;i<paket.data.menu.length;i++){
      html+='<tr>'
      +'<td>'+(paket.data.menu[i].parent).toUpperCase()+'</td>'
      +'<td>'+paket.data.menu[i].name+'</td>'
      +'<td align="center">'+akses(paket.data.menu[i].access)+'</td>'
      +'</tr>';
    }
    html+='</table>'
    
    +'<p><strong>Leave this network: </strong>'
    +'<button type="button" '
    +' id="btn_no" '
    +' onclick="Network.leaveFolder(\''+indek+'\''
    +',\''+invite_id+'\''
    +',\''+company_id+'\''
    +');">'
    +'Leave</button>'
    +'</p>'
    
    +'<p>'
    +' <button type="button" '
    +' id="btn_drawer" '
    +' onclick="Network.openAppDrawer(\''+indek+'\''
    +',\''+invite_id+'\''
    +',\''+company_id+'\''
    +');">'
    +' </button></p>';
          
    document.getElementById('user_access_'+indek).innerHTML=html;
    
    if(paket.err.id!=0) message.infoPaket(indek,paket);
    message.none(indek);
    return eop();
  });
}

Network.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Network.formPaging(indek):
  Network.formResult(indek);
}

Network.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Network.formSearch(indek));
  db.search(indek,()=>{
    Network.readShow(indek);
  });
}

Network.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Network.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Network.formPaging(indek));
}

Network.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Network.formResult(indek);
}

Network.openAppDrawer=function(indek,invite_id,company_id){
  db1.query(indek,'access/read',{
    "invite_id":invite_id,
    "company_id":company_id,
  },(paket)=>{
    if(paket.err.id==0 && paket.count>0){

      const listMenu={
        'id':invite_id,
        'data':paket.data.menu
      }
      Menu.invite.push(listMenu);
      
      const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
      tiket.baru=true;
      tiket.home.id='';
      tiket.invite.id=invite_id;
      tiket.company.id=paket.data.company_id;
      tiket.company.name=paket.data.company_name;
      tiket.menu.id='folder';
      tiket.menu.name=paket.data.company_name;
      tiket.menu.type=4;// appDrawer
      tiket.folder=paket.data.user_name+'@'+paket.data.admin_name+': ';
      tiket.parent=indek;
      antrian.push(tiket);
      
      Menu.klikAppDrawer(antrian.length-1);
    }else{
      message.infoPaket(indek,paket);
    }
  });
}

Network.joinFolder=(indek, invite_id, company_id)=>{ 
  db1.query(indek,'network/create',{
    "invite_id":invite_id,
    "company_id":company_id,
  },(paket)=>{
    if(paket.err.id==0) {
      Network.formPaging(indek);
    }else{
      message.infoPaket(indek,paket);
    }
  });
}

Network.leaveFolder=(indek, invite_id, company_id)=>{
  db1.query(indek,'network/delete',{
    "invite_id":invite_id,
    "company_id":company_id,
  },(paket)=>{
    if(paket.err.id==0) {
      Network.formPaging(indek);
    }else{
      message.infoPaket(indek,paket);
    }
  });
}

Network.openFolder=function(indek,invite_id,company_id){
  db1.query(indek,'access/read',{
    "invite_id":invite_id,
    "company_id":company_id,
  },(paket)=>{
    if(paket.err.id==0 && paket.count>0){

      const listMenu={
        'id':invite_id,
        'data':paket.data.menu
      }
      Menu.invite.push(listMenu);
      
      const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
      tiket.home.id='';
      tiket.invite.id=invite_id;
      tiket.company.id=paket.data.company_id;
      tiket.company.name=paket.data.company_name;
      tiket.menu.id='folder';
      tiket.menu.name=xHTML(paket.data.company_name);
      tiket.menu.type=2;
      tiket.folder=paket.data.user_name+'@'+paket.data.admin_name+': ';
      tiket.parent=indek;
      antrian.push(tiket);
      
      Menu.klik(antrian.length-1);
    }else{
      message.infoPaket(indek,paket);
    }
  });
}
// eof: 318

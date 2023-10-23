/*
 * name: budiono
 * date: aug-31, 07:19, thu 2023; new;71;
 * edit: sep-04, 11:44, mon-2023; add;108;
 */  
 
'use strict';

var Login={
  url:'login',
  title:"Login"
}

Login.show=(tiket)=>{
  tiket.modul=Login.url;
  tiket.menu.name=Login.title;

  tiket.letak.atas=0;
  tiket.ukuran.lebar=35;
  tiket.ukuran.tinggi=20;

  tiket.bisa.tambah=0;
  tiket.toolbar.ada=0;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Login.formCreate(indek);
  }else{
    show(baru);
  }  
}

Login.formCreate=(indek)=>{
  Login.form_01(indek);
}

Login.form_01=(indek)=>{
  const html='<div class="div-center">'
    +'<div id="msg_'+indek+'"'
    +' style="margin-bottom:1rem;line-height:1.5rem;"></div>'
    
    +'<form autocomplete="off" align="center">'
    +'<ul>'
    +'<li>&#128100; <label>User Name</label>&nbsp;'
      +'<input type="text" id="user_name_'+indek+'">'
      
    +'<li>&#128273; <label>Password</label>&nbsp;'
      +'<input type="password" id="user_password_'+indek+'">'
      
    +'<li><button type="button"'
      +' id="button_create_'+indek+'"'
      +'  onclick="Login.createData(\''+indek+'\')">'
      +'&#128275; Log In</button>'
      +'</li>'
    
    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  document.getElementById('user_name_'+indek).focus();
}

Login.createData=(indek)=>{
  document.getElementById('button_create_'+indek).disabled=true;
  message.wait(indek);
  
  db.query(indek,Login.url+'/create',{
    "user_name":document.getElementById('user_name_'+indek).value,
    "user_password":document.getElementById('user_password_'+indek).value
  },(paket)=>{
    if (paket.err.id==-7){
      document.getElementById('button_create_'+indek).disabled=false;
      return message.text(indek,paket.err.msg);
    }
    
    if (paket.err.id==0) {
      sessionStorage.setItem("login_id", paket.data.blok);
      sessionStorage.setItem("modul",'home');
      location.reload();
    } else {
      document.getElementById('button_create_'+indek).disabled=false;
    }
    db.infoPaket(indek,paket);
  });
}

Login.read_one=function(indek,dataku,callback){
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/read_one',
    dataku,
    callback,
  );
}

Login.remove=function(indek,dataku,callback){
  message.wait(indek);
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/delete',
    dataku,
    callback,
  );
}

//EOF: 70;108;

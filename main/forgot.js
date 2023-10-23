/*
 * auth: budiono
 * date: aug-31, 09:14, thu-2023; new;60
 */ 
 
'use strict';

var Forgot={
  modul_name:'Forgot Password',
  url:null
}

Forgot.show=(tiket)=>{
  tiket.bisa.tambah=0;
  tiket.ukuran.lebar=40;
  tiket.ukuran.tinggi=20;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Forgot.formCreate(indek);
  }else{
    show(baru);
  }  
}

Forgot.formCreate=(indek)=>{
  toolbar.hide(indek);
  
  Forgot.form(indek);
}

Forgot.form=(indek)=>{
  const html='<div class="div-center">'
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;line-height:1.5rem;"></div>'
    +'<form autocomplete="off" align="center">'
    +'<ul>'

    +'<li>&#128273; <label>Email Address</label>&nbsp;'
      +'<input type="text" id="email_address_'+indek+'">'
      
    +'<li><button type="button"'
      +' id="button_create_'+indek+'"'
      +'  onclick="Forgot.createData(\''+indek+'\')">&#128275; Send'
      +'</button>'
      +'</li>'
    
    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  document.getElementById('email_address_'+indek).focus();
}

Forgot.createData=(indek)=>{
  let obj={
    'email_address':getEV('email_address_'+indek)
  }
  db.query(indek,"reset_password/create",obj,(paket)=>{ 
    message.infoPaket(indek,paket);
    if (paket.err.id===0){
      document.getElementById('button_create_'+indek).disabled=true;
      //message.text(indek,"");
    }
  })
}

//eof: 60;

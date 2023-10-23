/*
 * auth: budiono;
 * date: sep-04, 12:32, mon-2023; new;170;
 * edit: sep-17, 08:26, sun-2023; xHTML;Home.refresh;
*/

'use strict';

var More={};

More.show=(tiket)=>{
  tiket.modul='home';
  tiket.ukuran.lebar=35;
  tiket.ukuran.tinggi=17;
  tiket.bisa.tutup=0;
  tiket.bisa.kecil=0;
  tiket.bisa.besar=0;
  tiket.bisa.ubah=0;
  tiket.statusbar.ada=0;
  tiket.bisa.tutup=1;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiSpesial(tiket);
    const indek=newReg.show();
    More.formUpdate(indek);
  }else{
    show(baru);
  }  
}

More.formUpdate=(indek)=>{
  toolbar.none(indek);  
  More.form01(indek)
  More.findID(indek)
}

More.form01=(indek)=>{
  var kode="xyz";
  var ada=0;
  var html='<div'
    +' style="padding-left:2.5rem;'
    +' padding-right:2.5rem;'
    +' padding-top:1rem;">'
    
    +'<div id="msg_'+indek+'" style="padding:0.5rem;"></div>'
    
    +'<form autocomplete="off">'
    +'<ul>'
    +'<li>Menu ID: <i'
    +' id="menu_id_'+indek+'"></i></li>'
    +'<li>Menu Name: '+xHTML(bingkai[indek].menu.name)+'</li>'
    +'<li><label>'
    +'<input type="checkbox"'
    +' id="add_to_home_'+indek+'" >Add to Home'

    +'</label></li>'
    +'</ul>'
    
    +'<input type="button"'
    +' onclick="More.CLOSE(\''+indek+'\')" value="Close">'
    +'</form>'
    +'</div>';
  content.html(indek,html); 
}

More.findID=(indek)=>{
  if(bingkai[indek].home.id==''){
    // alert('more-a')
    More.search(indek,{
      "login_id":bingkai[indek].login.id,
      "company_id":bingkai[indek].company.id,
      "menu_id":bingkai[indek].menu.id,
      "invite_id":bingkai[indek].invite.id,
    },(paket)=>{
      bingkai[indek].paket=paket;
      More.setData(indek);
    });
  }else{
    // alert('more-b')
    const obj={
      "login_id":bingkai[indek].login.id,
      "home_id":bingkai[indek].home.id,
    }
    xhr.api(
      bingkai[indek].server.url+
      bingkai[indek].modul+'/read_one',
      obj,
      (paket)=>{

        bingkai[indek].paket=paket;
        More.setData(indek);
    });
  }
}

More.search=function(indek,dataku,callback){
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/search',
    dataku,
    callback,
  );
}

More.setData=(indek)=>{
  const paket=bingkai[indek].paket;
  if(paket.err.id==0 && paket.count>0){
    bingkai[indek].home.id=paket.data.home_id;
    document.getElementById('menu_id_'+indek).innerHTML=paket.data.home_id;
    document.getElementById('add_to_home_'+indek).checked=true;
  }else{
    bingkai[indek].home.id='';
    document.getElementById('menu_id_'+indek).innerHTML='...'
    document.getElementById('add_to_home_'+indek).checked=false;
  }  
}

More.CLOSE=(indek)=>{
  const nilai=document.getElementById('add_to_home_'+indek).checked;
  console.log(bingkai[indek].home.id);
  Home.refresh=true; 

  if(nilai==true){
    if(bingkai[indek].home.id==''){
      More.createExecute(indek);
    }else{
      ui.CLOSE_POP(indek);// ini
    }
  }
  if(nilai==false){
    if(bingkai[indek].home.id!=''){
      More.deleteExecute(indek);
    }else{
      ui.CLOSE_POP(indek);// ini
    }
  }
}

More.createExecute=(indek)=>{
  const obj={
    "login_id":bingkai[indek].login.id,
    "company_id":bingkai[indek].company.id,
    "company_name":bingkai[indek].company.name,
    "invite_id":bingkai[indek].invite.id,
    "menu_id":bingkai[indek].menu.id,
    "menu_name":bingkai[indek].menu.name,
  }
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/create',
    obj,
    (paket)=>{
      if(paket.err.id==0){
        ui.CLOSE_POP(indek);// ini
      }else{
        message.infoPaket(indek,paket);
        //ui.CLOSE(indek);
      }
  });
}

More.deleteExecute=(indek)=>{
  const obj={
    "login_id":bingkai[indek].login.id,
    "home_id":bingkai[indek].home.id,
  }
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/delete',
    obj,
    (paket)=>{
      if(paket.err.id==0){
        ui.CLOSE_POP(indek); //ini
      }else{
        message.infoPaket(indek,paket);
        //ui.CLOSE(indek);
      }
  });
}
// 170;

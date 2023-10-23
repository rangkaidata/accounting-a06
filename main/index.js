/*
 * auth: budiono
 * date: aug-31, 06:53, thu-2023; new; 195;
 * edit: sep-04, 21:40, mon-2023; add; 201;
 */ 

'use strict';

function main(){  
  var paket={
    err:-1
  };
  // sessionStorage.removeItem('login_id');
  
  bingkai[0].login.id=sessionStorage.getItem('login_id')
  console.log(bingkai[0].login.id);
  
  if (bingkai[0].login.id==null){
    belumLogin(0);
  }else{
    sudahLogin(0);
  }
}

function sudahLogin(indek){
  bingkai[0].modul='login'
  Login.read_one(indek,{
    'login_id':bingkai[indek].login.id
  },(paket)=>{
    if(paket.err.id==0){

      bingkai[0].login.name=paket.data.user.name
      bingkai[0].login.full_name=paket.data.user.fullname
      bingkai[0].group.id=paket.data.group.id

      Menu.server();
      //document.getElementById('menu_bar_r').innerHTML=tglSekarangUpdate();
    }else{
      belumLogin(0);
    }
  });
}

function belumLogin(paket){
  if (paket.err===24){
    // login expired
  }
  else{
    bingkai[0].login.id=null;
    sessionStorage.removeItem('login_id');
  }
  Menu.lokal();
  var tiket=JSON.parse(JSON.stringify(bingkai[0]));
  // Login.show(tiket);
  LandingPage();
}

function updateJam(){
  if(document.getElementById('menu_bar_r'))
  document.getElementById('menu_bar_r').innerHTML=tglSekarangUpdate();
}
// eof: 195;201;

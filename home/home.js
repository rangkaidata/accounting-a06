/*
 * auth: budiono
 * date; sep-04, 11:55, mon-2023; new;154;
 * edit: sep-17, 08:14, sun-2023; xHTML;
 */

'use strict';

var Home={
  refresh:false,
  alive:false,
  xyz:-1
}

Home.show=(tiket)=>{
  tiket.modul='home';
  tiket.bisa.tambah=0;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Home.formView(indek);
    Home.xyz=indek;
  }else{
    show(baru);
    Home.formView(baru);
    Home.xyz=baru;
  }
  Home.alive=true;
}

Home.formView=(indek)=>{
  Home.refresh=false;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>Home.formFolder(indek));
  Home.formFolder(indek);
}

Home.formFolder=(indek)=>{
  //var html='<h1><big>&#8962</big> Home</h1>';
  var html='<h2 color="#DCDCDC"><big>&#127968</big> Home</h2><hr color="#E8E8E8">';
  var tiket={};
  var nmFolder='';
  db.read(indek,(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      var d=paket.data;
      for (var x in d){        
        if(d[x].company_name==''){
          nmFolder=d[x].menu_name;
        }else{
          nmFolder=(xHTML(d[x].company_name)).slice(0,8)+'/ '
            +paket.data[x].menu_name;
        }
        
        html+='<div id="msg_'+indek+'" style="margin-bottom:1rem;">'
          +'</div>'
          +'<div style="width:6.5rem;'
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
          +'id="'+paket.data[x].home_id+'"'
          //+'onclick="Home.klik(\''+(antrian.length-1)+'\');"'
          +'onclick="Home.klik(\''+indek+'\''
          +',\''+paket.data[x].home_id+'\');"'
          +' onMouseOver="this.style.backgroundColor=\'lightgrey\'" '
          +' onMouseOut="this.style.backgroundColor=\'white\'">'

          +'<div style="font-size:2.1rem;">'
            +Menu.ikon2(paket.data[x].menu_type)
            +'</div>'
          +''+nmFolder+''
        +'</div>'
      }
      if(paket.data.count==0){
        html+='<div align="center">'
          +'<h1>Folder is Empty</h1>'
          +'</div>';
      }
      content.html(indek,html);
      statusbar.message(indek,paket);
    }else{
      html+='<div align="center">'
      +'<h1>Folder is Empty</h1>'
      +'</div>';
      content.html(indek,html);
      statusbar.message(indek,paket);
      //content.infoError(indek,paket);
    }
  });  
}

Home.klik=(indek,home_id)=>{
  db1.readOne(indek,{
    "home_id":home_id
  },(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      bingkai[indek].paket=paket;
      bingkai[indek].paket2={
        data:{
          admin_name:'root',
          company_id:paket.data.company_id,
          company_name:'',
        }
      }
      if(paket.data.invite_id!=''){
        db1.query(indek,'join/read',{
          "invite_id":paket.data.invite_id,
          "company_id":paket.data.company_id,
        },(paket2)=>{
          if(paket2.count>0){
            bingkai[indek].paket2=paket2;
            const listMenu={
              'id':paket.data.invite_id,
              'data':paket2.data.menu
            }
            Menu.invite.push(listMenu);// tambah menu
            Home.preview(indek,home_id);
          }else{
            Home.page404(indek,home_id,paket.data.menu_id);
          }
        });
      }else{
        Home.preview(indek,home_id);
      }
    }else{
      Home.page404(indek,home_id,'');
    }
    message.none(indek);
  });
}

Home.preview=(indek,home_id)=>{
  const paket=bingkai[indek].paket;
  const paket2=bingkai[indek].paket2;
  const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
  tiket.baru=false;
  tiket.home.id=home_id;
  tiket.invite.id=paket.data.invite_id;
  tiket.menu.id=paket.data.menu_id;
  tiket.company.id=paket2.data.company_id;
  tiket.company.name=paket2.data.company_name;
  tiket.menu.name=paket.data.company_name;
  if(paket.data.invite_id!=''){
    tiket.folder=paket.data.user_name
      +'@'+paket2.data.admin_name
      +': /Home';
  }
  if(tiket.company.id!=''){
    tiket.folder+='/'+xHTML(paket.data.company_name);
  }
  // if(tiket.menu.name=='') tiket.menu.name=paket.data.menu_name;
  tiket.menu.name=paket.data.menu_name;

  antrian.push(tiket);
  Menu.klik(antrian.length-1);
}

Home.page404=(indek,home_id,menu_id)=>{
  const tiket404=JSON.parse(JSON.stringify(bingkai[indek]));
  tiket404.baru=true;
  tiket404.home.id=home_id;
  tiket404.menu.id=menu_id;
  Page404.show(tiket404);  
}
// eof: 154;

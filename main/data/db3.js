/*
 * name: budiono
 * date: sep-04, 16:25, mon-2023; new; 186;
 * edit: sep-14, 16:39, thu-2023; 
 */

'use struct';

// param 1 "login_id":bingkai[indek].login.id,
// param 2 "invite_id":bingkai[indek].invite.id,
// param 3 "company_id":bingkai[indek].company.id,

db3.readPaging=function(indek,abc){
  bingkai[indek].metode=MODE_READ;
  toolbar.wait(indek,BEGIN);
  content.wait(indek);
  bingkai[indek].text_search="";

  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/read_paging',
    {
      "login_id":bingkai[indek].login.id,
      "company_id":bingkai[indek].company.id,
      "invite_id":bingkai[indek].invite.id,
      "page":bingkai[indek].page,
      "limit":LIMIT
    },(paket)=>{
      bingkai[indek].paket=paket;
      statusbar.message(indek,paket);
      toolbar.wait(indek,END);
      return abc();
  });
}

db3.createOne=function(indek,dataku,hasil){
  toolbar.wait(indek,BEGIN);
  message.wait(indek);
  
  dataku.login_id=bingkai[indek].login.id; //1
  dataku.company_id=bingkai[indek].company.id; //2
  dataku.invite_id=bingkai[indek].invite.id; //3

  xhr.api(db.endPoint(indek,'create'),dataku,
    (paket)=>{
      content.infoPaket(indek,paket);
      toolbar.wait(indek,END);
      if (paket.err.id===0){
        toolbar.save.none(indek);
        toolbar.neuu.display(indek);
      }
      if(hasil!=undefined){
        return hasil(paket);
      }
    }
  );
}

db3.readOne=function(indek,dataku,abc){
  bingkai[indek].metode=MODE_READ;
  toolbar.wait(indek,BEGIN);
  message.wait(indek);
  
  dataku.login_id=bingkai[indek].login.id; //1
  dataku.company_id=bingkai[indek].company.id; //2
  dataku.invite_id=bingkai[indek].invite.id; //3

  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/read_one',
    dataku,(paket)=>{
      bingkai[indek].paket=paket;
      statusbar.message(indek,paket);
      toolbar.wait(indek,END);
      // message.none(indek);
      if(paket.err.id==0){
        return abc(paket);
      }else{
        message.infoPaket(indek,paket);
      }
  });
}

db3.updateOne=function(indek,dataku){
  toolbar.wait(indek,BEGIN);
  message.wait(indek);
  
  dataku.login_id=bingkai[indek].login.id;
  dataku.company_id=bingkai[indek].company.id; //2
  dataku.invite_id=bingkai[indek].invite.id; //3

  xhr.api(
    db.endPoint(indek,'update'),dataku,(paket)=>{
      content.infoPaket(indek,paket);
      toolbar.wait(indek,END);
      if (paket.err.id===0){
        toolbar.save.disabled(indek);
      }
  });
}

db3.deleteOne=function(indek,dataku,hasil){
  toolbar.wait(indek,BEGIN);
  message.wait(indek);
  
  dataku.login_id=bingkai[indek].login.id;
  dataku.company_id=bingkai[indek].company.id;
  dataku.invite_id=bingkai[indek].invite.id;

  xhr.api(
    db.endPoint(indek,'delete'),dataku,(paket)=>{
      content.infoPaket(indek,paket);
      toolbar.wait(indek,END);
      if (paket.err.id===0){
        toolbar.delet.disabled(indek);
      }
      if(hasil!=undefined){
        return hasil(paket);
      }
  });
}

db3.search=function(indek,abc){
  bingkai[indek].metode=MODE_RESULT;
  toolbar.wait(indek,BEGIN);
  content.wait(indek);
  
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/search',
    {
      "login_id":bingkai[indek].login.id,
      "company_id":bingkai[indek].company.id,
      "invite_id":bingkai[indek].invite.id,
      "search":bingkai[indek].text_search
    },(paket)=>{
      bingkai[indek].paket=paket;
      toolbar.wait(indek,END);
      statusbar.message(indek,paket);
      
      if(paket.err.id==0){
        return abc(paket);
      }else{
        content.infoError(indek,paket);
      }
  });
}

db3.query=function(indek,endpoint,dataku,callback){
  dataku.login_id=bingkai[indek].login.id;
  dataku.company_id=bingkai[indek].company.id;
  dataku.invite_id=bingkai[indek].invite.id;
  xhr.api(
    bingkai[indek].server.url+endpoint,
    dataku,
    callback,
  );
}

db3.readExport=function(indek,dataku,abc){
  var html='<div id="msg_'+indek+'"></div>'
    +'<h1>Please wait...</h1>'
    +'Mohon tunggu hingga tombol download tampil dilayar.'
  content.html(indek,html);
  
  bingkai[indek].metode=MODE_READ;
  toolbar.wait(indek,BEGIN);
  message.wait(indek);

  dataku.login_id=bingkai[indek].login.id;
  dataku.company_id=bingkai[indek].company.id;
  dataku.invite_id=bingkai[indek].invite.id;

  xhr.api(
    bingkai[indek].server.url+bingkai[indek].modul+'/export',
    dataku,(paket)=>{
      bingkai[indek].paket=paket;
      statusbar.message(indek,paket);
      toolbar.wait(indek,END);
      message.none(indek);
      if(paket.err.id==0){
        return abc(paket);
      }else{
        message.infoPaket(indek,paket);
      }
  });
}

db3.readLook=function(indek,abc){
  bingkai[indek].metode=MODE_READ;
  toolbar.wait(indek,BEGIN);
  content.wait(indek);
  bingkai[indek].text_search="";
  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/read_paging',
    {
      "login_id":bingkai[indek].login.id,
      "invite_id":bingkai[indek].invite.id,
      "company_id":bingkai[indek].company.id,
      "page":bingkai[indek].page,
      "limit":LIMIT,
      "inactive":1// active only
    },(paket)=>{
      bingkai[indek].paket=paket;
      statusbar.message(indek,paket);
      toolbar.wait(indek,END);
      return abc();
  });
}

db3.readPaging2=function(indek,prm,abc){
  bingkai[indek].metode=MODE_READ;
  toolbar.wait(indek,BEGIN);
  content.wait(indek);
  bingkai[indek].text_search="";
  
  prm.login_id=bingkai[indek].login.id;
  prm.company_id=bingkai[indek].company.id;
  prm.invite_id=bingkai[indek].invite.id;
  prm.page=bingkai[indek].page;
  prm.limit=LIMIT;

  xhr.api(
    bingkai[indek].server.url+
    bingkai[indek].modul+'/read_paging',prm,(paket)=>{
      bingkai[indek].paket=paket;
      statusbar.message(indek,paket);
      toolbar.wait(indek,END);
      return abc();
  });
}

// eof: 186;233;

/*
 * name: budiono
 * date: sep-04, 15:28, mon-2023; new;
 */

'use strict';

var UserProfile={
  url:'user',
  title:"User Profile"
}

UserProfile.show=(tiket)=>{
  tiket.modul=UserProfile.url;
  tiket.menu.name=UserProfile.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    UserProfile.formView(indek);
  }else{
    show(baru);
  }  
}

UserProfile.formView=(indek)=>{
  UserProfile.form01(indek);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  toolbar.edit(indek,()=>UserProfile.formUpdate(indek));
  UserProfile.readOne(indek,()=>{
    toolbar.download(indek,()=>UserProfile.formExport(indek));    
  });
  
}

UserProfile.form01=(indek)=>{
  bingkai[indek].metode="View"
  var html='<div style="margin:1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin:0.5rem;"></div>'
    +'<div>'
    +'<form autocomplete="off">'      
    +'<div'
      +' style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);padding-bottom:20px;">'
      +'<div>'
        +'<ul>'
        +'<li><label>ID</label>: '
          +'<i id="id_'+indek+'"></i></li>'
          
        +'<li><label>User Name</label>: '
          +'<i id="name_'+indek+'"></i></li>'
          
        +'<li><label>Full Name</label>: '
          +'<i id="fullname_'+indek+'"></i></li>'
          
        +'<li><label>Email Address</label>: '
          +'<i id="email_address_'+indek+'"></i></li>'
          
        +'<li><label>Mobile Number</label>: '
          +'<i id="mobile_number_'+indek+'"></i></li>'
          
        +'<li><label>Quota</label>: '
          +'<i id="size_'+indek+'"></i></li>'
          
        +'<li><label>Used</label>: '
          +'<i id="used_'+indek+'"></i></li>'
        +'<li>'
        +'</ul>'
      +'</div>'
      +'<div>'
        +'<p><img id="folder_image_'+indek+'" '
        +' width="200" height="200"/ '
        +' src='+bingkai[indek].server.image+"/uploads/no_image.jpg"+'>'
        +'</p>'
        +'<input type="text" '
        +' id="name_image_'+indek+'"'
        +' value="no_image.jpg" '
        +' disabled class="b-text" hidden>' 
        +'</li>'
        +'</ul>'
      +'</div>'
    +'</div>'
    +'</form>'
    +'<div>'
    +'</div>'
  content.html(indek,html);
  statusbar.ready(indek);
}

UserProfile.readOne=(indek,eop)=>{
  db1.readOne(indek,{},(paket)=>{
    if(paket.err.id==0){
      const v=paket.data;
      document.getElementById('id_'+indek).innerHTML=blokID(v.user_id);
      setEH('name_'+indek,xHTML(v.user_name) );
      setEH('fullname_'+indek, xHTML(v.user_fullname) );
      setEH('email_address_'+indek, xHTML(v.email_address) );
      setEH('mobile_number_'+indek, xHTML(v.mobile_number) );
      
      setEH('size_'+indek, v.quota_size);
      setEH('used_'+indek, v.quota_used);      
      
      document.getElementById("folder_image_"+indek).src=bingkai[indek].server.image+"uploads/"+v.user_photo;
      document.getElementById("name_image_"+indek).value=v.user_photo;
    }
    statusbar.message(indek,paket);
    message.none(indek);
    return eop();
  });
}

UserProfile.formUpdate=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{UserProfile.formView(indek);});
  UserProfile.form02(indek);
  UserProfile.readOne02(indek,()=>{
    toolbar.save(indek,()=>UserProfile.updateExecute(indek));
  });
}

UserProfile.form02=(indek)=>{
  var html='<div style="padding:0.5rem;">'
    +'<div id="msg_'+indek+'" style="padding:0.5rem;"></div>'
    +'<form autocomplete="off" style="padding:1rem;">'
    +'<div'
      +' style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);padding-bottom:20px;"'
      +'>'

      +'<div>'
        +'<ul>'
        +'<li><label>Name</label>: <label><strong id="name_'+indek+'"></strong></label></li>'
        +'<li><label>Full Name</label>: <input type="text" id="fullname_'+indek+'" ></li>'
        +'<li><label>Email Address</label>: <input type="text" id="email_address_'+indek+'" ></li>'
        +'<li><label>Mobile Number</label>: <input type="text" id="mobile_number_'+indek+'" ></li>'
        +'<li><label>Old Password</label>: <input type="password" id="old_password_'+indek+'"></li>'
        +'<li><label>New Password</label>: <input type="password" id="new_password_'+indek+'"></li>'
        +'<li><label>Retype Password</label>: <input type="password" id="retype_password_'+indek+'"></li>'
        +'</ul>'
      +'</div>'
    
      +'<div>'
        +'<input type="file" name="fileToUpload" id="fileToUpload_'+indek+'" accept="image/*" onchange="loadFile(event,'+indek+')">'
        +'<br><button type="button" onclick="noImage('+indek+')">No image</button>' 
        +'<p><img id="folder_image_'+indek+'" width="150" height="150"/ src='+bingkai[0].server.image+"/uploads/no_image.jpg"+'></p>'
        +'<input type="text" id="name_image_'+indek+'" value="no_image.jpg" disabled class="b-text" hidden>' 
      +'</div>'
    +'</div>'
    +'</form>'
    +'</div>';
    //+'<p><label><i>&#10020 PENTING!!<br>&emsp; Bila Anda seringkali ganti (reset) password. Sebaiknya alamat email <br>&emsp; dilengkapi dengan benar,'
    //+' untuk mengirim balik verifikasi kode reset.</i></label></p>';
  content.html(indek,html);
  statusbar.ready(indek);

  document.getElementById("fullname_"+indek).focus();
}

UserProfile.readOne02=(indek,eop)=>{
  db1.readOne(indek,{},(paket)=>{
    if(paket.err.id==0){
      const v=paket.data;
      document.getElementById('name_'+indek).innerHTML=v.user_name;
      setEV('fullname_'+indek, v.user_fullname);
      setEV('email_address_'+indek, v.email_address);
      setEV('mobile_number_'+indek, v.mobile_number);
      
      document.getElementById("folder_image_"+indek).src
        =bingkai[indek].server.image+"uploads/"+v.user_photo;
      setEV("name_image_"+indek, v.user_photo);
            
      statusbar.ready(indek);
    }
    message.none(indek);
    return eop();
  });
}

UserProfile.updateExecute=(indek)=>{
  db1.updateOne_with_image(indek,{
    "old_password":getEV("old_password_"+indek),
    "new_password":getEV("new_password_"+indek),
    "retype_password":getEV("retype_password_"+indek),
    "user_fullname":getEV("fullname_"+indek),
    "email_address":getEV("email_address_"+indek),
    "mobile_number":getEV("mobile_number_"+indek),
    "user_photo":getEV("fileToUpload_"+indek),
    "name_image":getEV("name_image_"+indek)
  });
}

UserProfile.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>UserProfile.formView(indek));
  UserProfile.exportExecute(indek);
}

UserProfile.exportExecute=(indek)=>{
  db1.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'user_profile.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}
// eof:202;

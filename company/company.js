/*
 * name: budiono
 * date: sep-04, 12:10, mon-2023; new;388;
 * edit: sep-17, 07:41, sun-2023; xHTML
 */ 
 
'use strict';

var Company={
  'title':'Company',
  'url':'company'
}

Company.show=(tiket)=>{
  tiket.modul=Company.url;
  tiket.menu.name=Company.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Company.formPaging(indek);
  }else{
    show(baru);
  }  
}

Company.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Company.formCreate(indek));
  toolbar.search(indek,()=>Company.formSearch(indek));
  toolbar.refresh(indek,()=>Company.formPaging(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db1.readPaging(indek,()=>{
    Company.readShow(indek);
  });
}

Company.readShow=(indek)=>{
  const paket=bingkai[indek].paket;
  const metode=bingkai[indek].metode;

  var html ='<div style="padding:0.5em;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<p>Total: '+paket.count+' rows</p>'

  html+='<table>'
    +'<th style="display:none">Blok</th>'
    +'<th colspan="2">Logo</th>'
    +'<th>Company Name</th>'
    +'<th>Address</th>'
    +'<th>Start Date</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=3>Action</th>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td><img style="height:60px;width:60px;" '
          +' src='+bingkai[indek].server.image+'uploads/'
          +paket.data[x].company_logo+'></td>'
        +'<td>'+xHTML(paket.data[x].company_name)+'</td>'
        +'<td>'+xHTML(paket.data[x].company_address.street_1)+'</td>'
        +'<td align="center">'
          +tglIna2(paket.data[x].company_sdate)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Company.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].company_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Company.formDelete(\''+indek+'\''
          +',\''+paket.data[x].company_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_open" '
          +' onclick="Company.openFolder(\''+indek+'\''
          +',\''+paket.data[x].company_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  
  content.html(indek,html);
  if(paket.err.id!=0)content.infoPaket(indek,paket);
}

Company.formCreate=(indek)=>{
  Company.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Company.formPaging(indek));
  toolbar.save(indek,()=>Company.createExecute(indek));
}

Company.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<div>'
      +'<form autocomplete="off">'
      +'<div style="display:grid;'
      +'grid-template-columns: repeat(2,1fr);">'
      +'<div>'
        +'<ul>'
        
        +'<li><label>Company ID:</label>'
          +'<input type="text"'
          +' id="company_id_'+indek+'"'
          +' size="15"></li>'
          
        +'<li><label>Company Name:</label>'
          +'<input type="text"'
          +' id="name_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>Address:</label>'
          +'<input type="text"'
          +' id="street_1_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>&nbsp;</label>'
          +'<input type="text" '
          +' id="street_2_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>City:</label>'
          +'<input type="text"'
          +' id="city_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>State:</label>'
          +'<input type="text"'
          +' id="state_'+indek+'"'
          +' size="10"></li>'
          
        +'<li><label>Zip Code:</label>'
          +'<input type="text" '
          +' id="zip_'+indek+'"'
          +' size="10"></li>'
          
        +'<li><label>Country:</label>'
          +'<input type="text" '
          +' id="country_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>Phone:</label>'
          +'<input type="text" '
          +' id="phone_'+indek+'"'
          +' size="12"></li>'
          
        +'<li><label>Mobile:</label>'
          +'<input type="text" '
          +' id="mobile_'+indek+'"'
          +' size="12"></li>'
          
        +'<li><label>Fax:</label>'
          +'<input type="text" '
          +' id="fax_'+indek+'"'
          +' size="12"></li>'
          
        +'<li><label>Website:</label>'
          +'<input type="text" '
          +' id="website_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>Email:</label>'
          +'<input type="text" '
          +' id="email_'+indek+'"'
          +' size="20"></li>'
          
        +'<li><label>Start Date:</label>'
          +'<input type="date" '
          +' id="sdate_'+indek+'"></li>'

        +'</ul>'
      +'</div>'
      
      +'<div>'
        +'<input type="file" '
          +' name="fileToUpload" '
          +' id="fileToUpload_'+indek+'" accept="image/*" '
          +' onchange="loadFile(event,'+indek+')">'
        +'<p>'
          +'<img id="folder_image_'+indek+'" '
          +' width="150" height="150"/ '
          +' src='+bingkai[indek].server.image+"uploads/no_image.jpg"+'>'
          +'</p>'
        +'<p>'
        +'<input type="text" id="name_image_'+indek+'" '
          +' value="no_image.jpg" disabled '
          +' class="b-text" hidden>' 
        +'<button type="button" '
          +' onclick="noImage('+indek+')">No image</button>'
        +'</p>'
      +'</div>'

      
      //+'<div><p>ketiga</p></div>'
      //+'<div><p>keempat</p></div>'
      //+'<div><p>kelima</p></div>'
      

      +'</div>'
      +'</form>'
    +'</div>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  document.getElementById('sdate_'+indek).value=tglSekarang();
  document.getElementById('company_id_'+indek).focus();
  if(metode!=MODE_CREATE){
    document.getElementById('company_id_'+indek).disabled=true;
    document.getElementById('sdate_'+indek).disabled=true;
  }

  // autofill
  const ids=new Date().getTime();
  document.getElementById('company_id_'+indek).value=String(ids);
}

Company.createExecute=(indek)=>{
  db1.createOne_with_image(indek,{
    "company_id":getEV("company_id_"+indek),
    "company_name":getEV("name_"+indek),
    "company_address":{
      "name":getEV("name_"+indek),
      "street_1":getEV("street_1_"+indek),
      "street_2":getEV("street_2_"+indek),
      "city":getEV("city_"+indek),
      "state":getEV("state_"+indek),
      "zip":getEV("zip_"+indek),
      "country":getEV("country_"+indek)
    },
    "company_phone":getEV("phone_"+indek),
    "company_mobile":getEV("mobile_"+indek),
    "company_fax":getEV("fax_"+indek),
    "company_website":getEV("website_"+indek),
    "company_email":getEV("email_"+indek),
    "company_sdate":getEV("sdate_"+indek),
    "company_logo":getEV("fileToUpload_"+indek)
  })
}

Company.readOne=(indek,eop)=>{
  db1.readOne(indek,{
    "company_id":bingkai[indek].company_id
  },(paket)=>{
    var d=paket.data;
    var a=d.company_address;
    setEV("company_id_"+indek, d.company_id);
    setEV("name_"+indek, d.company_name);
    setEV("street_1_"+indek, a.street_1);
    setEV("street_2_"+indek, a.street_2);
    setEV("city_"+indek, a.city);
    setEV("state_"+indek, a.state);
    setEV("zip_"+indek, a.zip);
    setEV("country_"+indek, a.country);
    setEV("phone_"+indek, d.company_phone);
    setEV("mobile_"+indek, d.company_mobile);
    setEV("fax_"+indek, d.company_fax);
    setEV("website_"+indek, d.company_website);
    setEV("email_"+indek, d.company_email);
    setEV("sdate_"+indek, d.company_sdate);
    setEV("name_image_"+indek, d.company_logo);
    
    document.getElementById("folder_image_"+indek).src
      =bingkai[0].server.image+"uploads/"+d.company_logo;

    statusbar.ready(indek);
    message.none(indek);
    return eop();
  });
}

Company.formUpdate=(indek,company_id)=>{
  bingkai[indek].company_id=company_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Company.formEntry(indek,MODE_UPDATE);
  Company.readOne(indek,()=>{
    toolbar.back(indek,()=>Company.formLast(indek));
    toolbar.save(indek,()=>Company.updateExecute(indek));
  });
}

Company.updateExecute=(indek)=>{
  db1.updateOne_with_image(indek,{
    "company_id":bingkai[indek].company_id,
    "company_name":getEV("name_"+indek),
    "company_address":{
      "name":getEV("name_"+indek),
      "street_1":getEV("street_1_"+indek),
      "street_2":getEV("street_2_"+indek),
      "city":getEV("city_"+indek),
      "state":getEV("state_"+indek),
      "zip":getEV("zip_"+indek),
      "country":getEV("country_"+indek)
    },
    "company_phone":getEV("phone_"+indek),
    "company_mobile":getEV("mobile_"+indek),
    "company_fax":getEV("fax_"+indek),
    "company_website":getEV("website_"+indek),
    "company_email":getEV("email_"+indek),
    "company_logo":getEV("fileToUpload_"+indek),
    "name_image":getEV("name_image_"+indek)
  });
}

Company.formDelete=(indek,company_id)=>{
  bingkai[indek].company_id=company_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Company.formEntry(indek,MODE_DELETE);
  Company.readOne(indek,()=>{
    toolbar.back(indek,()=>Company.formLast(indek));
    toolbar.delet(indek,()=>Company.deleteExecute(indek));
  });
}

Company.deleteExecute=(indek)=>{
  db1.deleteOne(indek,{
    "company_id":bingkai[indek].company_id
  });
}

Company.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Company.formPaging(indek):
  Company.formResult(indek);
}

Company.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Company.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Company.formPaging(indek));
}

Company.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Company.formResult(indek);
}

Company.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Company.formSearch(indek));
  db1.search(indek,()=>{
    Company.readShow(indek);
  });
}

Company.openFolder=(indek, company_id)=>{
  db1.readOne(indek,{
    "company_id":company_id
  },(paket)=>{
    const tiket=JSON.parse(JSON.stringify(bingkai[indek]));
    const d=paket.data;
    tiket.parent=indek;
    tiket.menu.id='folder'
    tiket.menu.name=xHTML(d.company_name);// filter;
    tiket.nama=d.company_name;
    tiket.company.id=d.company_id;
    tiket.company.name=d.company_name;
    tiket.invite.id=null;
    tiket.home.id='';
    
    antrian.push(tiket);
    
    Menu.klik(antrian.length-1);
    message.none(indek);
  });
}
// eof: 388;

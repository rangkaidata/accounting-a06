/*
 * name: budiono
 * date: sep-11, 15:51, mon-2023; new;
 * edit: sep-16, 15:46, sat-2023; mod create+remove;
 */ 

'use strict';

var Vendors={
  url:'vendors',
  title:'Vendors'
};

Vendors.show=(karcis)=>{
  karcis.modul=Vendors.url;
  karcis.menu.name=Vendors.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    Vendors.formPaging(indek);
  }else{
    show(baru);
  }
}

Vendors.formPaging=(indek)=>{
  ui.destroy_child(indek);// tutup sub-form;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Vendors.formCreate(indek));
  toolbar.search(indek,()=>Vendors.formSearch(indek));
  toolbar.refresh(indek,()=>Vendors.formPaging(indek));
  toolbar.download(indek,()=>Vendors.formExport(indek));
  toolbar.upload(indek,()=>Vendors.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,(paket)=>{
    Vendors.readShow(indek);
    Vendors.getDefault(indek);
  });
}

Vendors.getDefault=(indek)=>{
  VendorDefaults.getDefault(indek);
}

Vendors.readShow=function(indek){
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;

  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button"'
        +' id="btn_first"'
        +' onclick="Vendors.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Vendors.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled >'
          +paket.paging.pages[x].page +'</button>'; 
        } else {
          html+= '<button type="button"'
          +' onclick="Vendors.gotoPage(\''+indek+'\','
          +'\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="Vendors.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Vendor ID</th>'
    +'<th>Name</th>'
    +'<th>Phone</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    paket.data.sort(function(a, b){return a.nomer - b.nomer});// sort by nomer
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].vendor_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].vendor_name)+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].vendor_phone)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_change"'
          +' onclick="Vendors.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].vendor_id+'\');">'
          +'</button>'
          +'</td>'
        +'<td  align="center">'
          +'<button type="button"'
          +' id="btn_delete"'
          +' onclick="Vendors.formDelete(\''+indek+'\''
          +',\''+paket.data[x].vendor_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Vendors.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Vendors.formPaging(indek);
}

Vendors.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    +'<li><label>Vendor ID <i style="color:red;">&nbsp;*</i>:</label>'
      +'<input type="text"'
      +' id="vendor_id_'+indek+'" maxlength="50">'
      +'</li>'
      
    +'<li><label>Name:</label>'
      +'<input type="text"'
      +' id="name_'+indek+'"'
      +'  maxlength="250"'
      +' size="30">'
      +'</li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label>'
      +'<input type="checkbox"'
      +' id="inactive_'+indek+'">Inactive</label></li>'
    +'</ul>'
    
    +'<details open>'
    +'<summary>General</summary>'
    +'<div style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);'
      +'padding-bottom:20px;">'
    +'<div>'
      +'<ul>'
      
      +'<li><label>Contact:</label>'
        +'<input type="text"'
        +' id="contact_'+indek+'"'
        +' size="10">'
        +'</li>'

      +'<li><label>Account#:</label>'
        +'<input type="text"'
        +' id="account_'+indek+'"'
        +' size="10">'
        +'</li>'
        
      +'<li><label>Address:</label>'
        +'<input type="text"'
        +' id="street_1_'+indek+'"'
        +' size="25">'
        +'</li>'
        
      +'<li><label>&nbsp;</label>'
        +'<input type="text"'
        +' id="street_2_'+indek+'"'
        +' size="25">'
        +'</li>'
        
      +'<li><label>City:</label>'
        +'<input type="text"'
        +' id="city_'+indek+'"'
        +' size="20">'
        +'</li>'
        
      +'<li><label>State:</label>'
        +'<input type="text"'
        +' id="state_'+indek+'"'
        +' size="10">'
        +'</li>'
        
      +'<li><label>ZIP:</label>'
        +'<input type="text"'
        +' id="zip_'+indek+'"'
        +' size="10">'
        +'</li>'
        
      +'<li><label>Country:</label>'
        +'<input type="text"'
        +' id="country_'+indek+'"'
        +' size="20">'
        +'</li>'
      +'</ul>'
    +'</div>'
    
    +'<div>'  
      +'<ul>'
      +'<li><label>Vendor Type:</label>'
        +'<input type="text"'
        +' id="type_'+indek+'"'
        +' size="5">'
        +'</li>'
        
      +'<li><label>Phone:</label>'
        +'<input type="text"'
        +' id="phone_'+indek+'"'
        +' size="12">'
        +'</li>'
        
      +'<li><label>Mobile:</label>'
        +'<input type="text"'
        +' id="mobile_'+indek+'"'
        +' size="12">'
        +'</li>'
        
      +'<li><label>Fax:</label>'
        +'<input type="text"'
        +' id="fax_'+indek+'"'
        +' size="12">'
        +'</li>'
        
      +'<li><label>Web Site:</label>'
        +'<input type="text"'
        +' id="website_'+indek+'"'
        +' size="20">'
        +'</li>'

      +'<li><label>E-mail:</label>'
        +'<input type="text"'
        +' id="email_'+indek+'"'
        +' size="20">'
        +'</li>'
        
      +'</li>'
      +'</ul>'
    +'</div>'

    +'</details>'
    
    +'<details open>'
    +'<summary>Purchase Defauts</summary>'
      +'<ul>'
      +'<li><label>G/L Account <i style="color:red;">&nbsp;*</i>:</label>'
        +'<input type="text" '
        +' id="gl_account_id_'+indek+'" '
        +' onfocus="this.select()" '
        +' onchange="Vendors.getAccount(\''+indek+'\''
        +',\'gl_account_id_'+indek+'\')"'
        +' size="9">'
        
        +'<button type="button" '
        +' class="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'gl_account_id_'+indek+'\');"></button>'
        
        +'<input type="text"'
        +' id="gl_account_name_'+indek+'"'
        +' disabled>'
      +'</li>'

      +'<li><label>Tax ID #:</label>'
        +'<input type="text"'
        +' id="tax_'+indek+'"'
        +' size="9">'
        +'</li>'
      
      +'<li><label>Ship Via:</label>'
        +'<input type="text"'
        +' id="ship_id_'+indek+'"'
        +' size="9">'
        
        +'<button type="button"'
        +' class="btn_find"'
        +' onclick="ShipVia.lookUp(\''+indek+'\''
        +',\'ship_id_'+indek+'\');">'
        +'</button>'
        +'</li>'
      
      +'<li><label>Term:</label>'
        +'<input type="text"'
        +' id="displayed_'+indek+'"'
        +' onfocus="this.select()"'
        +' disabled size="15">'
        
        +'<button type="button"'
          +' class="btn_find" '
          +' onclick="Vendors.showTerms(\''+indek+'\',1);">'
          +'</button>'
        +'</li>'
        
      +'<li><label>Credit limit:</label>'
        +'<input type="text"'
        +' id="credit_limit_'+indek+'"'
        +' size="9">'
        +'</li>'
    
      +'</ul>'
    +'</details>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);

  if (metode===MODE_CREATE){
    document.getElementById('vendor_id_'+indek).focus();
  }else{
    document.getElementById('vendor_id_'+indek).disabled=true;
    document.getElementById('name_'+indek).focus();
  }
}

Vendors.formCreate=(indek)=>{
  Vendors.formEntry(indek,MODE_CREATE);
  Vendors.setDefault(indek);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Vendors.formPaging(indek));
  toolbar.save(indek,()=>Vendors.createExecute(indek));
}

Vendors.setDefault=(indek)=>{
  const d=bingkai[indek].data_default;
  setEV('gl_account_id_'+indek, d.gl_account_id);
  setEV('gl_account_name_'+indek, d.gl_account_name);
  setEV('displayed_'+indek, d.discount_terms.displayed);
  bingkai[indek].discount_terms=d.discount_terms;
}

Vendors.createExecute=(indek)=>{
  db3.createOne(indek,{
    "vendor_id":getEV("vendor_id_"+indek),
    "vendor_name":getEV("name_"+indek),
    "vendor_inactive":getEC("inactive_"+indek),
    'vendor_contact':getEV("contact_"+indek),
    'vendor_account':getEV("account_"+indek),
    'vendor_address':{
      'name':getEV("name_"+indek),
      'street_1':getEV("street_1_"+indek),
      'street_2':getEV("street_2_"+indek),
      'city':getEV("city_"+indek),
      'state':getEV("state_"+indek),
      'zip':getEV("zip_"+indek),
      'country':getEV("country_"+indek)
    },
    'vendor_type':getEV("type_"+indek),
    'vendor_phone':getEV("phone_"+indek),
    'vendor_mobile':getEV("mobile_"+indek),
    'vendor_fax':getEV("fax_"+indek),
    'vendor_email':getEV("email_"+indek),
    'vendor_website':getEV("website_"+indek),
    "gl_account_id":getEV("gl_account_id_"+indek),
    'vendor_tax':getEV("tax_"+indek),
    'ship_id':getEV("ship_id_"+indek),
    'discount_terms':bingkai[indek].discount_terms,
    'credit_limit':getEV("credit_limit_"+indek),
    'custom_field':{
      "free_column":"free-value"
    }
  });
}

Vendors.readOne=function(indek,callback){
  db3.readOne(indek,{
    "vendor_id":bingkai[indek].vendor_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const v=paket.data;

      setEV('vendor_id_'+indek, v.vendor_id);
      setEV('name_'+indek, v.vendor_name);
      setEC('inactive_'+indek, v.vendor_inactive);

      setEV('contact_'+indek, v.vendor_contact);
      setEV('account_'+indek, v.vendor_account);
      
      setEV('street_1_'+indek, v.vendor_address.street_1);
      setEV('street_2_'+indek, v.vendor_address.street_2);
      setEV('city_'+indek, v.vendor_address.city);
      setEV('state_'+indek, v.vendor_address.state);
      setEV('zip_'+indek, v.vendor_address.zip);
      setEV('country_'+indek, v.vendor_address.country);
      
      setEV('type_'+indek, v.vendor_type);
      setEV('phone_'+indek, v.vendor_phone);
      
      setEV('mobile_'+indek, v.vendor_mobile);
      setEV('fax_'+indek, v.vendor_fax);
      setEV('email_'+indek, v.vendor_email);
      setEV('website_'+indek, v.vendor_website);
      
      setEV("gl_account_id_"+indek, v.gl_account_id);
      setEV("gl_account_name_"+indek, v.gl_account_name);
      
      setEV("tax_"+indek, v.vendor_tax);
      setEV("ship_id_"+indek, v.ship_id);
      
      setEV("displayed_"+indek, v.discount_terms.displayed);
      setEV("credit_limit_"+indek, v.credit_limit);
      
      bingkai[indek].discount_terms=v.discount_terms;
    }
    message.none(indek);
    return callback();
  });
}

Vendors.formUpdate=(indek,vendor_id)=>{
  bingkai[indek].vendor_id=vendor_id;
  Vendors.formEntry(indek,MODE_UPDATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  Vendors.readOne(indek,()=>{
    toolbar.back(indek,()=>Vendors.formLast(indek));
    toolbar.save(indek,()=>Vendors.updateExecute(indek));
  });
}


Vendors.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "vendor_id":bingkai[indek].vendor_id,
    "vendor_name":getEV("name_"+indek),
    "vendor_inactive":getEC("inactive_"+indek),
    'vendor_contact':getEV("contact_"+indek),
    'vendor_account':getEV("account_"+indek),
    'vendor_address':{
      'name':getEV("name_"+indek),
      'street_1':getEV("street_1_"+indek),
      'street_2':getEV("street_2_"+indek),
      'city':getEV("city_"+indek),
      'state':getEV("state_"+indek),
      'zip':getEV("zip_"+indek),
      'country':getEV("country_"+indek)
    },
    'vendor_type':getEV("type_"+indek),
    'vendor_phone':getEV("phone_"+indek),
    'vendor_mobile':getEV("mobile_"+indek),
    'vendor_fax':getEV("fax_"+indek),
    'vendor_email':getEV("email_"+indek),
    'vendor_website':getEV("website_"+indek),
    "gl_account_id":getEV("gl_account_id_"+indek),
    'vendor_tax':getEV("tax_"+indek),
    'ship_id':getEV("ship_id_"+indek),
    'discount_terms':bingkai[indek].discount_terms,
    'credit_limit':getEV("credit_limit_"+indek),
    'custom_field':{
      "free_one":"free-text-1",
      "free_two":"free-text-2",
    }
  });
}

Vendors.formDelete=(indek,vendor_id)=>{
  bingkai[indek].vendor_id=vendor_id;
  Vendors.formEntry(indek,MODE_DELETE);
  toolbar.none(indek);
  toolbar.hide(indek);
  Vendors.readOne(indek,()=>{
    toolbar.back(indek,()=>{Vendors.formLast(indek);});
    toolbar.delet(indek,()=>{Vendors.deleteExecute(indek);});
  });
}

Vendors.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "vendor_id":bingkai[indek].vendor_id
  });
}

Vendors.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Vendors.formPaging(indek):
  Vendors.formResult(indek);
}

Vendors.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Vendors.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Vendors.formPaging(indek);});
}

Vendors.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Vendors.formResult(indek);
}

Vendors.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Vendors.formSearch(indek);});
  db3.search(indek,()=>{
    Vendors.readShow(indek);
  });
}

Vendors.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Vendors.formPaging(indek));
  Vendors.exportExecute(indek);
}

Vendors.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'vendors.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Vendors.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Vendors.formPaging(indek);});
  iii.uploadJSON(indek);
}

Vendors.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "vendor_id":d[i][1],
      "vendor_name":d[i][2],
      "vendor_inactive":d[i][3],
      "gl_account_id":d[i][4],
      'vendor_contact':d[i][5],
      'vendor_account':d[i][6],
      'vendor_address':d[i][7],
      'vendor_type':d[i][8],
      'vendor_phone':d[i][9],
      'vendor_mobile':d[i][10],
      'vendor_fax':d[i][11],
      'vendor_email':d[i][12],
      'vendor_website':d[i][13],
      'vendor_tax':d[i][14],
      'ship_id':d[i][15],
      'discount_terms':d[i][16],
      'credit_limit':d[i][17],
      'custom_field':d[i][18]
    }
    db3.query(indek,Vendors.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Vendors.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new VendorLook(indek);
  objPop.show();
}

Vendors.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  Vendors.getAccount(indek,id_kolom,nama_kolom);
}

Vendors.getAccount=(indek,id_kolom,alias)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.count!=0){
      setEV('gl_account_name_'+indek, paket.data.account_name);
    }else{
      setEV('gl_account_name_'+indek, "???");
    }
  });  
}

Vendors.showTerms=(indek,baris)=>{
  bingkai[indek].baris=baris;
  //if(bingkai[indek].discount_terms==undefined){
    //DiscountTerms.getColumn(indek);
  //}else{
  bingkai[indek].discount_terms.date='';
  bingkai[indek].discount_terms.amount=0;
  DiscountTerms.show(indek);
}

Vendors.setTerms=(indek)=>{
  setEV('displayed_'+indek, bingkai[indek].discount_terms.displayed);
}

Vendors.setShip=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, data.ship_id);
}

Vendors.getOne=(indek,vendor_id,callBack)=>{
  db3.query(indek,Vendors.url+'/read_one',{
    "vendor_id":vendor_id
  },(paket)=>{
    return callBack(paket);
  });
}

// eof:


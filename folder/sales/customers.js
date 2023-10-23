/*
 * name: budiono;
 * date: sep-12, 12:28, tue-2023;
 * edit: sep-16, 17:37, sat-2023; 
 */ 

'use strict';

var Customers={
  url:'customers',
  title:'Customers'
}

Customers.show=(karcis)=>{
  karcis.modul=Customers.url;
  karcis.menu.name=Customers.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    const newCus=new BingkaiUtama(karcis);
    const indek=newCus.show();
    Customers.formPaging(indek);
  }else{
    show(baru);
  }
}

Customers.formPaging=(indek)=>{
  ui.destroy_child(indek);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Customers.formCreate(indek));
  toolbar.search(indek,()=>Customers.formSearch(indek));
  toolbar.refresh(indek,()=>Customers.formPaging(indek));
  toolbar.download(indek,()=>Customers.formExport(indek));
  toolbar.upload(indek,()=>Customers.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,(paket)=>{
    Customers.readShow(indek);
  });
  Customers.getDefault(indek);
}

Customers.getDefault=(indek)=>{
  CustomerDefaults.getDefault(indek);
}

Customers.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" '
        +' id="btn_first" onclick="Customers.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Customers.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';
        } else {
          html+= '<button type="button" '
          +' onclick="Customers.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="Customers.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Customer ID</th>'
    +'<th>Name</th>'
    +'<th>Phone</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].customer_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].customer_name)+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].customer_phone)+'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        
        +'<td align="center"><button type="button" id="btn_change" '
          +' onclick="Customers.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].customer_id+'\');"></button></td>'
          
        +'<td align="center"><button type="button" id="btn_delete" '
          +' onclick="Customers.formDelete(\''+indek+'\''
          +',\''+paket.data[x].customer_id+'\');"></button></td>'

        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Customers.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Customers.formPaging(indek);
}

Customers.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
      +content.title(indek)
      +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
      +'<form autocomplete="off">'
      
        +'<div style="display:grid;'
          +'grid-template-columns:repeat(2,1fr);">'
        +'<div>'
          +'<ul>'
          +'<li><label>Customer ID'
            +'<i style="color:red;">*</i>:</label>'
            +'<input type="text" id="customer_id_'+indek+'">'
            +'</li>'
          
          +'<li><label>Name:</label>'
            +'<input type="text" id="customer_name_'+indek+'"'
            +' onfocus="this.select()" size="30"></li>'
          +'</ul>'
        +'</div>'
        +'<div>'
            +'<label><input type="checkbox" '
            +'id="customer_inactive_'+indek+'">Inactive</label>'
            //+'</li>'
          //+'</ul>'
        +'</div>'
        +'</div>'
          
        //+'<li><label>&nbsp;</label>'
//          +'<label><input type="checkbox" '
//          +'id="customer_inactive_'+indek+'">Inactive</label></li>'

        +'</ul>'

        +'<details open>'
        +'<summary>General</summary>'
        +'<ul>'
          +'<li><label>Contact:</label>'
            +'<input type="text" '
            +' id="customer_contact_'+indek+'"'
            +' size="15"'
            +' onfocus="this.select()"></li>'
        +'</ul>'
        
        +'<div style="display:grid;'
          +'grid-template-columns:repeat(2,1fr);">'
        +'<div>'
          +'<ul>'
          +'<li><label>&nbsp;</label>'
            +'<span id="customer_combo_'+indek+'"></span>'
            +'<button id="btn_add" type="button"'
              +' onclick="Customers.addAddress(\''+indek+'\')">'
              +'</button>'

            +'<input type="text" '
              +' id="address_no_'+indek+'" '
              +' value="0" disabled'
              +' size="5"'
              +' style="text-align:center;">'

            +'<button id="btn_remove" type="button"'
              +' onclick="Customers.removeAddress(\''+indek+'\')">'
              +'</button>'
            +'</li>'
            
          +'<li id="li_sembunyi_'+indek+'" '
            +' style="visibility:hidden;"><label>Ship Name:</label>'
            +'<input type="text"'
            +' id="customer_ship_name_'+indek+'" '
            +' onfocus="this.select()" '
            +' onchange="Customers.setAddress(\''+indek+'\')"></li>'
            
          +'<li><label>Address:</label>'
            +'<input type="text" id="customer_street_1_'+indek+'" '
            +' onfocus="this.select()" '
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="25"></li>'
            
          +'<li><label>&nbsp;</label>'
            +'<input type="text"'
            +' id="customer_street_2_'+indek+'" '
            +' onfocus="this.select()" '
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="25">'
            +'</li>'
            
          +'<li><label>City:</label>'
            +'<input type="text"'
            +' id="customer_city_'+indek+'" '
            +' onfocus="this.select()"'
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="20">'
            +'</li>'
            
          +'<li><label>State:</label>'
            +'<input type="text"'
            +' id="customer_state_'+indek+'"'
            +' onfocus="this.select()"'
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="10">'
            +'</li>'
            
          +'<li><label>Zip:</label>'
            +'<input type="text"'
            +' id="customer_zip_'+indek+'" '
            +' onfocus="this.select()"'
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="10">'
            +'</li>'
            
          +'<li><label>Country:</label>'
            +'<input type="text"'
            +' id="customer_country_'+indek+'" '
            +' onfocus="this.select()"'
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="20">'
            +'</li>'
            
          +'<li><label>Sales Tax:</label>'
            +'<input type="text"'
            +' id="sales_tax_id_'+indek+'" '
            +' onfocus="this.select()"'
            +' onchange="Customers.setAddress(\''+indek+'\')"'
            +' size="10">'
            
            +'<button type="button"'
            +' class="btn_find" '
            +' onclick="SalesTax.lookUp(\''+indek+'\''
            +',\'sales_tax_id_'+indek+'\');">'
            +'</button>'
            
          +'</li>'
          +'</ul>'
        +'</div>'
        +'<div>'
          +'<ul>'
          +'<li><label>Type:</label>'
            +'<input type="text"'
            +' id="customer_type_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="10">'
            +'</li>'
            
          +'<li><label>Phone:</label>'
            +'<input type="text"'
            +' id="customer_phone_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="12">'
            +'</li>'
            
          +'<li><label>Mobile:</label>'
            +'<input type="text"'
            +' id="customer_mobile_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="12">'
            +'</li>'
            
          +'<li><label>Fax:</label>'
            +'<input type="text"'
            +' id="customer_fax_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="12">'
            +'</li>'

          +'<li><label>Web</label>'
            +'<input type="text"'
            +' id="customer_web_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="20">'
            +'</li>'

          +'<li><label>Email:</label>'
            +'<input type="text"'
            +' id="customer_email_'+indek+'" '
            +' onfocus="this.select()"'
            +' size="20">'
            +'</li>'
            
          +'</ul>'
        +'</div>'
        +'<div>'
        +'</details>'
        
        +'<details open>'
        +'<summary>Defaults</summary>'
        
        +'<div style="display:grid;'
          +'grid-template-columns:repeat(2,1fr);">'
        +'<div>'
        +'<ul>'
        +'<li><label>Sales Rep:</label>'
          +'<input type="text"'
          +' id="sales_rep_id_'+indek+'" '  
          +' onfocus="this.select()"'
          +' onchange="Customers.getSalesRep(\''+indek+'\''
          +',\'sales_rep_id_'+indek+'\');"'
          +' size="15" >'
          
          +'<button type="button"'
          +' class="btn_find" '
          +' onclick="Employees.lookUpSalesRep(\''+indek+'\''
          +',\'sales_rep_id_'+indek+'\');">'
          +'</button>'
          +'</li>'
          
        +'<li><label>&nbsp;</label>'
          +'<input type="text"'
          +' id="sales_rep_name_'+indek+'"'
          +' disabled>'
          +'</li>'

        +'<li><label>GL Sales Acct'
          +'<i style="color:red;">*</i>:</label>'
          +'<input type="text" id="gl_account_id_'+indek+'" '
          +' onfocus="this.select()"'
          +' onchange="Customers.getAccount(\''+indek+'\''
          +',\'gl_account_id_'+indek+'\')"'
          +' size="8">'
          
          +'<button type="button" class="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'gl_account_id_'+indek+'\');">'
          +'</button>'
          +'</li>'
        
        +'<li><label>&nbsp;</label>'
          +'<input type="text" '
          +' id="gl_account_name_'+indek+'" disabled>'
          +'</li>'
          
        +'<li><label>Open PO#:</label>'
          +'<input type="text" id="customer_po_'+indek+'" '
          +' onfocus="this.select()"'
          +' size="9"></li>'
        +'</ul>'
        +'</div>'
        
        +'<div>'
        +'<ul>'
        +'<li><label>Ship via:</label>'
          +'<input type="text" id="ship_id_'+indek+'" '
          +' onfocus="this.select()"'
          +' size="9">'

          +'<button type="button" class="btn_find" '
          +' onclick="ShipVia.lookUp(\''+indek+'\''
          +',\'ship_id_'+indek+'\');">'
          +'</button></li>'
        
        +'<li><label>Resale#:</label>'
          +'<input type="text"'
          +' id="customer_resale_'+indek+'" '
          +' onfocus="this.select()"'
          +' size="5"></li>'
          
        +'<li>'
          +'<label>Term:</label>'
          +'<input type="text"'
          +' id="terms_displayed_'+indek+'" '
          +' onfocus="this.select()" disabled'
          +' size="15">'
          
          +'<button type="button" class="btn_find" '
          +' onclick="DiscountTerms.show(\''+indek+'\',1);">'
          +'</button>'
          +'</li>'
          
        +'<li>'
          +'<label>Credit limit:</label>'
          +'<input type="text"'
          +' style="text-align:center;"'
          +' id="credit_limit_'+indek+'" '
          +' onfocus="this.select()"'
          +' size="5">'
          +'</li>'
          
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</details>'
      +'</form>'
    +'</div><br><br>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  bingkai[indek].address_collect=[];
  Customers.setKoleksi(indek) ;
  
  if(metode==MODE_CREATE){
    document.getElementById('customer_id_'+indek).focus();  
  }else{
    document.getElementById('customer_id_'+indek).disabled=true;
  }
}

Customers.setKoleksi=(indek)=>{
  var abc=[];
  var isi={};
  var html='';
  // var jumlah=10; // setting jumlah array
  var c=bingkai[indek].address_collect;
  var jumlah=c.length;
  
  if(jumlah<2) jumlah=2;
  setEV('address_no_'+indek,jumlah+' rows');
  
  html='<select class="combo" id="address_collect_'+indek+'" '
    +' onchange="Customers.pilih(this,\''+indek+'\');">';
  for(var i=0;i<jumlah;i++){
    if(i==0){
      html+='<option class="combo" id="opt_'+indek+'_'+i+'" '
      +' value="Bill to Address">Bill to Address-'+(i+1)+'</option>';
    }else{
      html+='<option class="combo" id="opt_'+indek+'_'+i+'" '
      +' value="Ship to Address '+i+'">Ship to Address-'+(i+1)+'</option>';
    }
  }
  html+='</select>'
  document.getElementById('customer_combo_'+indek).innerHTML=html;
  
  // set koleksi kosong --- set pertama kosongkan array 
  for(i=0;i<jumlah;i++){
    isi={};
    isi.row_id=i;
    isi.by='';
    isi.name='';
    isi.street_1='';
    isi.street_2='';
    isi.city='';
    isi.state='';
    isi.zip='';
    isi.country='';
    isi.sales_tax_id='';
    abc.push(isi);
  }
  
  // set kolesi dengan data --- bila ada data, 
  // masukkan data. bila tidak maka array tetap KOSONG;
  var data_address=bingkai[indek].address_collect;
  jumlah= data_address.length;
  for(i=0;i<jumlah;i++){
    abc[i].row_id=data_address[i].row_id;
    abc[i].by=data_address[i].by;
    
    abc[i].name=data_address[i].name;
    abc[i].street_1=data_address[i].street_1;
    abc[i].street_2=data_address[i].street_2;
    abc[i].city=data_address[i].city;
    abc[i].state=data_address[i].state;
    abc[i].zip=data_address[i].zip;
    abc[i].country=data_address[i].country;
    abc[i].sales_tax_id=data_address[i].sales_tax_id;
    
    if(i==0){
      setEV('customer_ship_name_'+indek, data_address[i].name);
      setEV('customer_street_1_'+indek, data_address[i].street_1);
      setEV('customer_street_2_'+indek, data_address[i].street_2);
      setEV('customer_city_'+indek, data_address[i].city);
      setEV('customer_state_'+indek, data_address[i].state);
      setEV('customer_zip_'+indek, data_address[i].zip);
      setEV('customer_country_'+indek, data_address[i].country);
      setEV('sales_tax_id_'+indek, data_address[i].sales_tax_id);
    }
  }

  // simpan kembali --- simpan kembali 
  // perubahan data ke memori array lokal.
  bingkai[indek].address_collect=abc;
}

Customers.pilih=(ini,indek)=>{
  var data=bingkai[indek].address_collect;
  var isi={};
  var ada=false;
  var nomer=ini.selectedIndex;

  if(nomer>0){
   document.getElementById("li_sembunyi_"+indek).style.visibility
   ="visible";
  }else{
   document.getElementById("li_sembunyi_"+indek).style.visibility
   ="hidden";  
  }
  console.log('aaa');
  // tampilkan data --- tampilkan data sesuai nomer pilihan.
  setEV('customer_ship_name_'+indek, data[nomer].name);
  setEV('customer_street_1_'+indek, data[nomer].street_1);
  setEV('customer_street_2_'+indek, data[nomer].street_2);
  setEV('customer_city_'+indek, data[nomer].city);
  setEV('customer_state_'+indek, data[nomer].state);
  setEV('customer_zip_'+indek, data[nomer].zip);
  setEV('customer_country_'+indek, data[nomer].country);
  setEV('sales_tax_id_'+indek, data[nomer].sales_tax_id);
  document.getElementById('customer_street_1_'+indek).focus();
}

Customers.setAddress=function(indek){
  var data=[];
  var nomer
  =document.getElementById('address_collect_'+indek).selectedIndex;

  data=bingkai[indek].address_collect;

  data[nomer].by=getEV('address_collect_'+indek);
  data[nomer].name=getEV('customer_ship_name_'+indek);
  data[nomer].street_1=getEV('customer_street_1_'+indek);
  data[nomer].street_2=getEV('customer_street_2_'+indek);
  data[nomer].city=getEV('customer_city_'+indek);
  data[nomer].state=getEV('customer_state_'+indek);
  data[nomer].zip=getEV('customer_zip_'+indek);
  data[nomer].country=getEV('customer_country_'+indek);
  data[nomer].sales_tax_id=getEV('sales_tax_id_'+indek);

  // simpan kembali --- perubahan yang ada di komponen 
  // HTML ke memori array lokal.
  bingkai[indek].address_collect=data;
}

Customers.formCreate=(indek)=>{
  Customers.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Customers.formPaging(indek);});
  toolbar.save(indek,()=>{Customers.createExecute(indek);});
  Customers.setDefault(indek);
}

Customers.setDefault=(indek)=>{
  const d=bingkai[indek].data_default;

  setEV('gl_account_id_'+indek, d.gl_account_id);
  setEV('gl_account_name_'+indek, d.gl_account_name);
  setEV('terms_displayed_'+indek, d.discount_terms.displayed);
  setEV('credit_limit_'+indek, d.credit_limit);
  bingkai[indek].discount_terms=d.discount_terms;
}

Customers.createExecute=(indek)=>{
  db3.createOne(indek,{
    "customer_id":getEV("customer_id_"+indek),
    "customer_name":getEV("customer_name_"+indek),
    "customer_inactive":getEC("customer_inactive_"+indek),
    "customer_contact":getEV("customer_contact_"+indek),
    "customer_address":bingkai[indek].address_collect,
    "customer_type":getEV("customer_type_"+indek),
    "customer_phone":getEV("customer_phone_"+indek),
    "customer_mobile":getEV("customer_mobile_"+indek),
    "customer_fax":getEV("customer_fax_"+indek),
    "customer_email":getEV("customer_email_"+indek),
    "customer_web":getEV("customer_web_"+indek),
    "sales_rep_id":getEV("sales_rep_id_"+indek),
    "gl_account_id":getEV("gl_account_id_"+indek),
    "customer_po":getEV("customer_po_"+indek),
    "ship_id":getEV("ship_id_"+indek),
    "customer_resale":getEV("customer_resale_"+indek),
    "discount_terms":bingkai[indek].discount_terms,
    "credit_limit":getEV("credit_limit_"+indek),
    'finance_charges':0,
    "custom_field":{
      "new_field":"new-value"
    }
  });
}

Customers.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "customer_id":bingkai[indek].customer_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const a=paket.data.customer_address[0];
      const d=paket.data;
      
      setEV('customer_id_'+indek, d.customer_id);
      setEV('customer_name_'+indek, d.customer_name);
      setEC('customer_inactive_'+indek, d.customer_inactive);
      setEV('gl_account_id_'+indek, d.gl_account_id);
      setEV('gl_account_name_'+indek, d.gl_account_name);
      
      setEV('customer_contact_'+indek,d.customer_contact);
      
      setEV('customer_street_1_'+indek, a.street_1);
      setEV('customer_street_2_'+indek, a.street_2);
      setEV('customer_city_'+indek, a.city);
      setEV('customer_state_'+indek, a.state);
      setEV('customer_zip_'+indek, a.zip);
      setEV('customer_country_'+indek, a.country);
      setEV('sales_tax_id_'+indek, a.sales_tax_id);
      
      setEV('customer_type_'+indek, d.customer_type);
      setEV('customer_phone_'+indek, d.customer_phone);
      setEV('customer_mobile_'+indek, d.customer_mobile);
      setEV('customer_fax_'+indek, d.customer_fax);
      
      setEV('customer_email_'+indek, d.customer_email);
      setEV('customer_web_'+indek, d.customer_web);
      
      setEV('sales_rep_id_'+indek, d.sales_rep_id);
      setEV('sales_rep_name_'+indek, d.sales_rep_name);
      setEV('customer_po_'+indek, d.customer_po);
      setEV('ship_id_'+indek, d.ship_id);
      setEV('customer_resale_'+indek, d.customer_resale);
      setEV('terms_displayed_'+indek, d.discount_terms.displayed);
      setEV('credit_limit_'+indek, d.credit_limit);


      bingkai[indek].address_collect=d.customer_address;
      bingkai[indek].discount_terms=d.discount_terms;

      Customers.setKoleksi(indek);

      const ac=document.getElementById('address_collect_'+indek);
      Customers.pilih(ac,indek);
    }
    document.getElementById('customer_name_'+indek).focus();
    message.none(indek);
    return eop();
  });
}

Customers.formUpdate=(indek,customer_id)=>{
  bingkai[indek].customer_id=customer_id;

  toolbar.none(indek);
  toolbar.hide(indek);
  Customers.form(indek,MODE_UPDATE);
  Customers.readOne(indek,()=>{
    toolbar.back(indek,()=>{Customers.formLast(indek);});
    toolbar.save(indek,()=>{Customers.updateExecute(indek);});
  });
}

Customers.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "customer_id":bingkai[indek].customer_id,
    "customer_name":getEV("customer_name_"+indek),
    "customer_inactive":getEC("customer_inactive_"+indek),

    "customer_contact":getEV("customer_contact_"+indek),
    "customer_address":bingkai[indek].address_collect,
    "customer_type":getEV("customer_type_"+indek),
    "customer_phone":getEV("customer_phone_"+indek),
    "customer_mobile":getEV("customer_mobile_"+indek),
    "customer_fax":getEV("customer_fax_"+indek),
    "customer_email":getEV("customer_email_"+indek),
    "customer_web":getEV("customer_web_"+indek),
    "sales_rep_id":getEV("sales_rep_id_"+indek),
    "gl_account_id":getEV("gl_account_id_"+indek),
    "customer_po":getEV("customer_po_"+indek),
    "ship_id":getEV("ship_id_"+indek),
    "customer_resale":getEV("customer_resale_"+indek),
    "discount_terms":bingkai[indek].discount_terms,
    "credit_limit":getEV("credit_limit_"+indek),
    "finance_charges":0,
    "custom_field":{
      "edit_field":"edit free value"
    }
  });
}

Customers.formDelete=(indek,customer_id)=>{
  bingkai[indek].customer_id=customer_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Customers.form(indek,MODE_DELETE);
  Customers.readOne(indek,()=>{
    toolbar.back(indek,()=>{Customers.formLast(indek);});
    toolbar.delet(indek,()=>{Customers.deleteExecute(indek);});
  });
}

Customers.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "customer_id":bingkai[indek].customer_id
  });
}

Customers.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Customers.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Customers.formPaging(indek);});
}

Customers.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Customers.formResult(indek);
}

Customers.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Customers.formSearch(indek);});
  db3.search(indek,(paket)=>{
    Customers.readShow(indek);
  });
}

Customers.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Customers.formPaging(indek):
  Customers.formResult(indek);
}

Customers.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  Customers.getAccount(indek,id_kolom,nama_kolom);
}

Customers.getAccount=(indek,id_kolom,alias)=>{
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

Customers.setTerms=(indek)=>{
  setEV('terms_displayed_'+indek, bingkai[indek].discount_terms.displayed);
}

Customers.setShip=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, data.ship_id);
}

Customers.setSalesTax=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, data.sales_tax_id);

  const nomer=document.getElementById('address_collect_'+indek)
  bingkai[indek].address_collect[nomer.selectedIndex].sales_tax_id
  =data.sales_tax_id;
}

Customers.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Customers.formPaging(indek));
  Customers.exportExecute(indek);
}

Customers.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'customers.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Customers.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,function(){Customers.formPaging(indek);});
  iii.uploadJSON(indek);
}

Customers.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "customer_id":d[i][1],
      "customer_name":d[i][2],
      "customer_inactive":d[i][3],
      "customer_contact":d[i][4],
      "customer_address":d[i][5],
      "customer_type":d[i][6],
      "customer_phone":d[i][7],
      "customer_mobile":d[i][8],
      "customer_fax":d[i][9],
      "customer_email":d[i][10],
      "customer_web":d[i][11],
      "sales_rep_id":d[i][12],
      "gl_account_id":d[i][13],
      "customer_po":d[i][14],
      "ship_id":d[i][15],
      "customer_resale":d[i][16],
      "discount_terms":d[i][17],
      "credit_limit":d[i][18],
      "finance_charges":d[i][19],
      "custom_field":d[i][20]
    }    
    db3.query(indek,Customers.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Customers.setSalesRep=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.employee_id);
  Customers.getSalesRep(indek,id_kolom,nama_kolom);
}

Customers.getSalesRep=(indek,id_kolom,alias)=>{
  Employees.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.count!=0){
      setEV('sales_rep_name_'+indek, paket.data.employee_name);
    }else{
      setEV('sales_rep_name_'+indek, "???");
    }
  });
}

Customers.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new CustomerLook(indek);
  objPop.show();
}

Customers.getOne=(indek,customer_id,callBack)=>{
  db3.query(indek,Customers.url+'/read_one',{
    "customer_id":customer_id
  },(paket)=>{
    return callBack(paket);
  });
}

Customers.addAddress=(indek)=>{
  const i=bingkai[indek].address_collect; 
  bingkai[indek].address_collect.push({
    row_id:i.length,
    by:'',
    name:'',
    street_1:'',
    street_2:'',
    city:'',
    state:'',
    zip:'',
    country:'',
    sales_tax_id:''
  });
  Customers.setKoleksi(indek);
  setEI('address_collect_'+indek,i.length-1);// goto last
  Customers.pilih(document.getElementById('address_collect_'+indek),indek);
}

Customers.removeAddress=(indek)=>{
  var nomer=getEI('address_collect_'+indek);
  var pnjng=(bingkai[indek].address_collect).length;

  if(nomer<2) nomer=(pnjng-1);
  if(nomer>1){
    var oldBasket=bingkai[indek].address_collect;
    var newBasket=[];
    for(var i=0;i<oldBasket.length;i++){
      if (i!=(nomer))newBasket.push(oldBasket[i]);
    }
    bingkai[indek].address_collect=newBasket;
    Customers.setKoleksi(indek);
  }
}
// eof:888;

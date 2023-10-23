/*
 * name: budiono
 * date: 
 * edit: jan 19, 16:23, wed 2022
 * edit: mar 03, 10:37, thu 2022
 * edit: mar 31, 12:50, thu 2022
 * edit: aug-04, 18:14, thu 2022;
 * edit: aug-08, 20:16, mon 2022; default_discount_terms; 
 * edit: feb-01, 10:39, wed 2023; postgress;
 * edit: jun-01, 10:27, thu-2023; csql;
 * edit: jun-30, 21:33, fri-2023; standarize#1;
 * edit: sep-27, 15:08, wed-2023; mod create+remove;
 * edit: sep-30, 17:30, sat-2023; xHTML;
 * edit: oct-04, 17:59, wed-2023; 
 */ 

'use strict';

var VendorBegins={
  url:'vendor_begins',
  title:'Vendor Beginning Balances'
}

VendorBegins.show=(karcis)=>{
  karcis.modul=VendorBegins.url;
  karcis.menu.name=VendorBegins.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    var newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    VendorBegins.formPaging(indek);
  }else{
    show(baru);
  }
}

VendorBegins.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>VendorBegins.formSearch(indek));
  toolbar.neuu(indek,()=>VendorBegins.formCreate(indek));
  toolbar.refresh(indek,()=>VendorBegins.formPaging(indek));
  toolbar.download(indek,()=>{VendorBegins.formExport(indek);});
  toolbar.upload(indek,()=>{VendorBegins.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    VendorBegins.readShow(indek);
  });
  VendorBegins.getDefault(indek);
}

VendorBegins.getDefault=(indek)=>{
  VendorDefaults.getDefault(indek);
}

VendorBegins.readShow=function(indek){
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
        +' onclick="VendorBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="VendorBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled >'+paket.paging.pages[x].page
          +'</button>';
        } else {
          html+= '<button type="button"'
          +' onclick="VendorBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +'>'+paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="VendorBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Vendor ID</th>'
    +'<th>Name</th>'
    +'<th>Amount</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';
  
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td>'+paket.data[x].vendor_id+'</td>'
        +'<td>'+xHTML(paket.data[x].vendor_name)+'</td>'
        +'<td align="right">'+paket.data[x].begin_amount+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_change"'
          +' onclick="VendorBegins.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].vendor_id+'\');">'
          +'</button>'
          +'</td>'
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_delete"'
          +' onclick="VendorBegins.formDelete(\''+indek+'\''
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

VendorBegins.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  VendorBegins.formPaging(indek);
}

VendorBegins.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Vendor ID</label>&nbsp;'
      +'<input type="text" size="12"'
      +' id="vendor_id_'+indek+'"'
      +' onchange="VendorBegins.getVendor(\''+indek+'\')">'

      +'<button type="button" '
        +' id="vendor_btn_'+indek+'" class="btn_find"'
        +' onclick="Vendors.lookUp(\''+indek+'\''
        +',\'vendor_id_'+indek+'\',-1)"></button>'
      
      +'</li>'
      
    +'<li><label>Name</label>&nbsp;'
      +'<input type="text"'
      +' id="vendor_name_'+indek+'"'
      +' disabled>'
      +'</li>'
    +'</ul>'
    
    +'<details open>'
      +'<summary>Vendor Beginning Details</summary>'
      +'<div id="begin_detail_'+indek+'"'
      +' style="width:100%;overflow:auto;"></div>'
      +'</details>'
      
    +'<ul>'
    +'<li><label>Total Amount</label>:&nbsp;'
      +'<input type="text"'
      +' id="begin_amount_'+indek+'"'
      +' size="5" '
      +' style="text-align:right;" disabled>'
      +'</li>'
    +'</ul>'
    
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode!=MODE_CREATE){
    document.getElementById('vendor_id_'+indek).disabled=true;
    document.getElementById('vendor_btn_'+indek).disabled=true;
  }else{
    document.getElementById('vendor_id_'+indek).focus();
  }
}

VendorBegins.formCreate=(indek)=>{
  bingkai[indek].item_id='';
  VendorBegins.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>VendorBegins.formPaging(indek));
  toolbar.save(indek,()=>VendorBegins.createExecute(indek));
  VendorBegins.setDefault(indek);
}

VendorBegins.setDefault=(indek)=>{
  VendorBegins.setRows(indek,[] );
}

VendorBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "vendor_id":getEV('vendor_id_'+indek),
    "begin_detail":bingkai[indek].begin_detail
  });
}

VendorBegins.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "vendor_id":bingkai[indek].vendor_id
  },(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data;
      setEV('vendor_id_'+indek,d.vendor_id);
      setEV('vendor_name_'+indek,d.vendor_name);
      VendorBegins.setRows(indek,d.begin_detail);
    }else{
      VendorBegins.setRows(indek,[]);    
    }
    message.none(indek);
    return callback();
  });
}

VendorBegins.formUpdate=function(indek,vendor_id){
  bingkai[indek].vendor_id=vendor_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  VendorBegins.formEntry(indek,MODE_UPDATE);
  VendorBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{VendorBegins.formLast(indek);});
    toolbar.save(indek,()=>{VendorBegins.updateExecute(indek);});
  });
}

VendorBegins.updateExecute=function(indek){
  db3.updateOne(indek,{
    "vendor_id":bingkai[indek].vendor_id,
    "begin_detail":bingkai[indek].begin_detail
  });
}

VendorBegins.formDelete=function(indek,vendor_id){
  bingkai[indek].vendor_id=vendor_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  VendorBegins.formEntry(indek,MODE_DELETE);
  VendorBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{VendorBegins.formLast(indek);});
    toolbar.delet(indek,()=>{VendorBegins.deleteExecute(indek);});
  });
}

VendorBegins.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "vendor_id":bingkai[indek].vendor_id
  });
}

VendorBegins.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>VendorBegins.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{VendorBegins.formPaging(indek);});
}

VendorBegins.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  VendorBegins.formResult(indek);
}

VendorBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{VendorBegins.formSearch(indek);});
  db3.search(indek,()=>{
    VendorBegins.readShow(indek);
  });
}

VendorBegins.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  VendorBegins.formPaging(indek):
  VendorBegins.formResult(indek);
}

VendorBegins.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>VendorBegins.formPaging(indek));
  VendorBegins.exportExecute(indek);
}

VendorBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'vendor_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

VendorBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{VendorBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

VendorBegins.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "vendor_id":d[i][1],
      "begin_detail":d[i][2]
    }
    db3.query(indek,VendorBegins.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

VendorBegins.setRows=function(indek,isi){  
  if(isi===undefined)isi=[];
  if(isi===null)isi=[];
  var panjang=isi.length;
  var html=VendorBegins.tableHead(indek);
  var begin_amount=0;

  bingkai[indek].begin_detail=isi;

  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td>'+(i+1)+'</td>'
      +'<td style="margin:0;padding:0">'
        +'<input type="text"'
        +' id="invoice_no_'+i+'_'+indek+'"'
        +' value="'+isi[i].invoice_no+'"'
        +' onfocus="this.select()"'
        +' onchange="VendorBegins.setCell(\''+indek+'\''
        +',\'invoice_no_'+i+'_'+indek+'\')"'
        +' size="10">'
        +'</td>'
        
      +'<td style="padding:0;margin:0;">'
        +'<input type="text"'
          +' id="date_fake_'+i+'_'+indek+'"'
          +' onfocus="VendorBegins.showTgl('+i+','+indek+');"'
          +' value="'+tglWest(isi[i].date)+'"'
          +' size="7">'
          +'<br>'
          
        +'<input type="date"'
          +' id="date_'+i+'_'+indek+'"'
          +' onblur="VendorBegins.hideTgl(this.value,'+i+','+indek+');"'
          +' value="'+isi[i].date+'"'
          +' size="10"'
          +' style="display:none;">'
          +'</td>'
        
      +'<td style="padding:0;margin:0;">'
        +'<input type="text"'
        +' id="po_no_'+i+'_'+indek+'"'
        +' value="'+isi[i].po_no+'"'
        +' onfocus="this.select()"'
        +' onchange="VendorBegins.setCell(\''+indek+'\''
        +',\'po_no_'+i+'_'+indek+'\')"'
        +' size="10">'
        +'</td>'

      +'<td  align="right" style="padding:0;margin:0;">'
        +'<input type="text"'
        +' id="amount_'+i+'_'+indek+'"'
        +' value="'+isi[i].amount+'"'
        +' onfocus="this.select()"'
        +' onchange="VendorBegins.setCell(\''+indek+'\''
        +',\'amount_'+i+'_'+indek+'\')"'
        +' style="text-align:right"'
        +' size="5">'
        +'</td>'
        
      +'<td style="padding:0;margin:0;">'
        +'<input type="text"'
        +' id="displayed_terms_'+i+'_'+indek+'"'
        +' value="'+isi[i].displayed_terms+'"'
        +' onfocus="this.select()"'
        +' onchange="VendorBegins.setCell(\''+indek+'\''
        +',\'displayed_terms_'+i+'_'+indek+'\')"'
        +' size="15">'
      +'</td>'
      
      +'<td>'
        +'<button type="button"'
        +' id="btn_find" '
        +' onclick="VendorBegins.showTerms(\''+indek+'\',\''+i+'\');">'
        +'</button>'
      +'</td>'
      
      +'<td style="padding:0;margin:0;">'
        +'<input type="text"'
        +' id="ap_account_id_'+i+'_'+indek+'"'
        +' value="'+isi[i].ap_account_id+'"'
        +' size="7"'
        +' onchange="VendorBegins.setCell(\''+indek+'\''
        +',\'ap_account_id_'+i+'_'+indek+'\')"'
        +' style="text-align:center;"'
        +' onfocus="this.select()" >'
        +'</td>'
        
      +'<td>'
        +'<button type="button"'
        +' id="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'ap_account_id_'+i+'_'+indek+'\');">'
        +'</button>'
      +'</td>'
      
      +'<td align="center">'
        +'<button type="button"'
        +' id="btn_add"'
        +' onclick="VendorBegins.addRow(\''+indek+'\','+i+')" >'
        +'</button>'
        
        +'<button type="button"'
        +' id="btn_remove"'
        +' onclick="VendorBegins.removeRow(\''+indek+'\','+i+')" >'
        +'</button>'
      +'</td>'
    +'</tr>';
    begin_amount+=Number(isi[i].amount);
  }

  html+=VendorBegins.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('begin_detail_'+indek).innerHTML=html;
  document.getElementById('begin_amount_'+indek).value=begin_amount;
  if(panjang==0)VendorBegins.addRow(indek,0);
}

VendorBegins.tableHead=(indek)=>{
  return '<table id="myTable_'+indek+'" border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="2">Invoice#</th>'
    +'<th>Date</th>'
    +'<th>PO#</th>'
    +'<th>Amount</th>'
    +'<th colspan="2">Displayed Terms</th>'
    +'<th colspan="2">A/P Account</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
    +'</thead>';
}

VendorBegins.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td>#</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

VendorBegins.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  var discount_terms=bingkai[indek].data_default.discount_terms;

  oldBasket=bingkai[indek].begin_detail;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)newRow(newBasket);
  }
  if(oldBasket.length==0)newRow(newBasket);
  VendorBegins.setRows(indek,newBasket);
  
  function newRow(newBasket2){
    var myItem={};
    myItem.nomer=newBasket2.length+1;
    myItem.invoice_no='';
    myItem.date='';
    myItem.po_no='';
    myItem.amount=0;
    myItem.ap_account_id=bingkai[indek].data_default.ap_account_id;
    myItem.displayed_terms=discount_terms.displayed;
    //default-terms
    myItem.discount_terms=discount_terms
    
    newBasket2.push(myItem);
  }
}

VendorBegins.showTgl=(kolom,indek)=>{
  var abc=bingkai[indek].begin_detail[kolom].date
  if(abc==undefined || abc==''){
    var tgl=new Date();
    abc=tgl.getFullYear()
      +'-'+String("00"+(tgl.getMonth()+1)).slice(-2)
      +'-'+String("00"+tgl.getDate()).slice(-2);
  }
  document.getElementById('date_fake_'+kolom+'_'+indek).style.display="none";
  document.getElementById('date_'+kolom+'_'+indek).value=abc;
  document.getElementById('date_'+kolom+'_'+indek).style.display="inline";
  document.getElementById('date_'+kolom+'_'+indek).style.width="231px";
  document.getElementById('date_'+kolom+'_'+indek).focus();
}

VendorBegins.hideTgl=(abc,baris,indek)=>{
  document.getElementById('date_fake_'+baris+'_'+indek).value=tglWest(abc);
  document.getElementById('date_fake_'+baris+'_'+indek).style.display="inline";
  document.getElementById('date_'+baris+'_'+indek).style.display="none";
  bingkai[indek].begin_detail[baris].date
    =document.getElementById('date_'+baris+'_'+indek).value;
  
  VendorBegins.setCell(indek,'date_fake_'+baris+'_'+indek);
}

VendorBegins.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].begin_detail;
  var baru=[];
  var isiEdit={};
  var sum_amount=0;

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('invoice_no_'+i+'_'+indek)){
      isiEdit.invoice_no=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('date_'+i+'_'+indek)){
      isiEdit.date=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('po_no_'+i+'_'+indek)){
      isiEdit.po_no=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('displayed_terms_'+i+'_'+indek)){
      isiEdit.displayed_terms=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('amount_'+i+'_'+indek)){
      isiEdit.amount=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('ap_account_id_'+i+'_'+indek)){
      isiEdit.ap_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
    sum_amount+=parseFloat(baru[i].amount);
  }  

  document.getElementById('begin_amount_'+indek).value=sum_amount;
  
  bingkai[indek].begin_detail=isi;
}

VendorBegins.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].begin_detail;
  var newBasket=[];
  
  VendorBegins.setRows(indek,oldBasket);

  for(var i=0;i<oldBasket.length;i++){
    if (i!=(number))newBasket.push(oldBasket[i])
  }
  VendorBegins.setRows(indek,newBasket);
}

VendorBegins.showTerms=(indek,baris)=>{
  bingkai[indek].baris=baris;
  
  //if(bingkai[indek].data_terms==undefined){
    //DiscountTerms.getColumn(indek);
  //}else{
    const isi=bingkai[indek].begin_detail[baris].discount_terms;
    const amount=Number(document.getElementById('amount_'+baris+'_'+indek).value);
    const tgl=document.getElementById('date_'+baris+'_'+indek).value;

    bingkai[indek].begin_detail[baris].discount_terms.date=tgl;
    bingkai[indek].begin_detail[baris].discount_terms.amount=amount;
    bingkai[indek].discount_terms=bingkai[indek].begin_detail[baris].discount_terms;
  //}

  DiscountTerms.show(indek);
}

VendorBegins.setTerms=(indek)=>{
  const baris=bingkai[indek].baris;
  document.getElementById('displayed_terms_'+baris+'_'+indek).value
    =bingkai[indek].discount_terms.displayed;
    
  VendorBegins.setCell(indek,"displayed_terms_"+baris+'_'+indek);
  bingkai[indek].begin_detail[baris].discount_terms
    =bingkai[indek].discount_terms;
}

VendorBegins.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  document.getElementById(id_kolom).value=data.account_id;
  VendorBegins.setCell(indek,id_kolom);
}

VendorBegins.setVendor=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;

  setEV(id_kolom, data.vendor_id);
  VendorBegins.getVendor(indek);
}

VendorBegins.getVendor=(indek)=>{
  Vendors.getOne(indek,
    document.getElementById('vendor_id_'+indek).value,
  (paket)=>{
    setEV('vendor_name_'+indek, paket.data.vendor_name);
  });
}
// EOF!: 

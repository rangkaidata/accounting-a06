/*
 * name: budiono
 * date: sep-28, 17:12, thu-2023; new;
 * edit: sep-30, 17:27, sat-2023; xHTML;
 */
  
'use strict';

var CustomerBegins={
  url:'customer_begins',
  title:'Customer Beginning Balances'
}

CustomerBegins.show=(karcis)=>{
  karcis.modul=CustomerBegins.url;
  karcis.menu.name=CustomerBegins.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    var newCus=new BingkaiUtama(karcis);
    const indek=newCus.show();
    CustomerBegins.formPaging(indek);
  }else{
    show(baru);
  }
}

CustomerBegins.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>CustomerBegins.formSearch(indek));
  toolbar.neuu(indek,()=>CustomerBegins.formCreate(indek));
  toolbar.refresh(indek,()=>CustomerBegins.formPaging(indek));
  toolbar.download(indek,()=>{CustomerBegins.formExport(indek);});
  toolbar.upload(indek,()=>{CustomerBegins.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    CustomerBegins.readShow(indek);
  });
  CustomerBegins.getDefault(indek);
}

CustomerBegins.getDefault=(indek)=>{
  CustomerDefaults.getDefault(indek);
}

CustomerBegins.readShow=(indek)=>{
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
        +' onclick="CustomerBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="CustomerBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled>'
          +paket.paging.pages[x].page
          +'</button>';  
        } else {
          html+= '<button type="button"'
          +' onclick="CustomerBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="CustomerBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Customer ID</th>'
    +'<th>Name</th>'
    +'<th>Amount</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan="2">Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].customer_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].customer_name)+'</td>'
        +'<td align="right">'+paket.data[x].begin_amount+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button"'
            +' id="btn_change"'
            +' onclick="CustomerBegins.formUpdate(\''+indek+'\''
            +',\''+paket.data[x].customer_id+'\');">'
            +'</button>'
        +'</td>'
        +'<td align="center">'
          +'<button type="button"'
            +' id="btn_delete"'
            +' onclick="CustomerBegins.formDelete(\''+indek+'\''
            +',\''+paket.data[x].customer_id+'\');">'
            +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

CustomerBegins.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  CustomerBegins.formPaging(indek);
}

CustomerBegins.formCreate=(indek)=>{
  CustomerBegins.setDefault(indek);

  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>CustomerBegins.formPaging(indek));
  toolbar.save(indek,()=>CustomerBegins.createExecute(indek));
  
  CustomerBegins.formEntry(indek,MODE_CREATE);
  CustomerBegins.setRows(indek,[] );
}

CustomerBegins.setDefault=(indek)=>{
  const d=bingkai[indek].data_default;
  bingkai[indek].discount_terms=d.discount_terms;
}

CustomerBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "customer_id":getEV('customer_id_'+indek),
    "begin_detail":bingkai[indek].begin_detail
  });
}

CustomerBegins.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "customer_id":bingkai[indek].customer_id
  },(paket)=>{
    if (paket.err.id==0){
      const d=paket.data;
      setEV('customer_id_'+indek,d.customer_id);
      setEV('customer_name_'+indek,d.customer_name);
      CustomerBegins.setRows(indek,d.begin_detail);
    }else{
      CustomerBegins.setRows(indek,[]);
    }
    message.none(indek);
    return eop();
  });
}

CustomerBegins.formUpdate=(indek,customer_id)=>{
  bingkai[indek].customer_id=customer_id;
  CustomerBegins.formEntry(indek,MODE_UPDATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  CustomerBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{CustomerBegins.formLast(indek);});
    toolbar.save(indek,()=>{CustomerBegins.updateExecute(indek);});
  });
}

CustomerBegins.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "customer_id":bingkai[indek].customer_id,
    "begin_detail":bingkai[indek].begin_detail
  });
}

CustomerBegins.formDelete=(indek,cust_id)=>{
  bingkai[indek].customer_id=cust_id;
  CustomerBegins.formEntry(indek,MODE_DELETE);
  toolbar.none(indek);
  toolbar.hide(indek);
  CustomerBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{CustomerBegins.formLast(indek);});
    toolbar.delet(indek,()=>{CustomerBegins.deleteExecute(indek);});
  });
}

CustomerBegins.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "customer_id":bingkai[indek].customer_id
  });
}

CustomerBegins.formLast=function(indek){
  if(bingkai[indek].text_search==''){
    CustomerBegins.formPaging(indek);
  }else{
    CustomerBegins.formResult(indek);
  }
}

CustomerBegins.formSearch=function(indek){
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>CustomerBegins.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{CustomerBegins.formPaging(indek);});
}

CustomerBegins.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  CustomerBegins.formResult(indek);
}

CustomerBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{CustomerBegins.formSearch(indek);});
  db3.search(indek,()=>{
    CustomerBegins.readShow(indek);
  });
}

CustomerBegins.formEntry=function(indek,metode){
  bingkai[indek].metode=metode
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Customer ID</label>&nbsp;'
      +'<input type="text" '
      +' id="customer_id_'+indek+'"'
      +' onchange="CustomerBegins.getCustomer(\''+indek+'\')">'
      
      +'<button type="button" '
        +' id="customer_btn_'+indek+'" class="btn_find"'
        +' onclick="Customers.lookUp(\''+indek+'\''
        +',\'customer_id_'+indek+'\',-1)">'
        +'</button>'
      +'</li>'
      
    +'<li><label>Name</label>&nbsp;'
      +'<input type="text" '
      +' id="customer_name_'+indek+'"'
      +' size="30"'
      +' disabled>'
      +' </li>'
    +'</ul>'
    
    +'<details open>'
      +'<summary>Customer Beginning Details</summary>'
      +'<div id="begin_detail_'+indek+'"'
      +' style="width:100%;overflow:auto;"></div>'
      +'</details>'
    
    +'<ul>'
    +'<li><label>Total Amount</label>&nbsp;'
      +'<input type="text"'
      +' id="begin_amount_'+indek+'"'
      +' size="5" disabled'
      +' style="text-align:right;">'
      +'</li>'
    +'</ul>'

    +'</form>'
    +'</div>';

  content.html(indek,html);  
  CustomerBegins.setRows(indek,[]);
  
  if(metode==MODE_CREATE){
    document.getElementById('customer_id_'+indek).focus();
  }else{
    document.getElementById('customer_id_'+indek).disabled=true;
    document.getElementById('customer_btn_'+indek).disabled=true;
  }
}

CustomerBegins.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];
  if(isi===null)isi=[];

  var panjang=isi.length;
  var html=CustomerBegins.tableHead(indek);
  var begin_amount=0;
    
  bingkai[indek].begin_detail=isi;
    
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    +'<td style="margin:0;padding:0">'
      +'<input type="text"'
      +' id="invoice_no_'+i+'_'+indek+'"'
      +' value="'+isi[i].invoice_no+'"'
      +' onfocus="this.select()"'
      +' onchange="CustomerBegins.setCell(\''+indek+'\''
      +',\'invoice_no_'+i+'_'+indek+'\')" '
      +' size="10">'
    +'</td>'
            
    +'<td style="padding:0;margin:0;">'
      +'<input type="text"'
      +' id="date_fake_'+i+'_'+indek+'" '
      +' onfocus="CustomerBegins.showTgl('+i+','+indek+');"'
      +' value="'+tglWest(isi[i].date)+'"'
      +' size="8">'
      +'<br>'

      +'<input type="date"'
      +' id="date_'+i+'_'+indek+'"'
      +' onchange="CustomerBegins.date_change('+indek+',\''+i+'_'+indek+'\')"'
      +' onblur="CustomerBegins.hideTgl(this.value,'+i+','+indek+');"'
      +' value="'+isi[i].date+'"'
      +' style="display:none;"'
      +' size="10">'
    +'</td>'
            
    +'<td style="padding:0;margin:0;">'
      +'<input type="text"'
      +' id="customer_po_'+i+'_'+indek+'"'
      +' value="'+isi[i].customer_po+'"'
      +' onchange="CustomerBegins.setCell(\''+indek+'\''
      +',\'customer_po_'+i+'_'+indek+'\')"'
      +' onfocus="this.select()"'
      +' size="7">'
    +'</td>'

    +'<td align="right" style="padding:0;margin:0;">'
      +'<input type="text"'
      +' id="amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' style="text-align:right"'
      +' onchange="CustomerBegins.setCell(\''+indek+'\''
      +',\'amount_'+i+'_'+indek+'\')"'
      +' onfocus="this.select()"'
      +' size="5">'
    +'</td>'

    +'<td style="padding:0;margin:0;">'
      +'<input type="text"'
      +' id="displayed_terms_'+i+'_'+indek+'"'
      +' value="'+isi[i].displayed_terms+'"'
      +' onchange="CustomerBegins.setCell(\''+indek+'\''
      +',\'displayed_terms_'+i+'_'+indek+'\')"'
      +' onfocus="this.select()"'
      +' size="15">'
    +'</td>'
    
    +'<td>'
      +'<button type="button"'
      +' id="btn_find" '
      +' onclick="CustomerBegins.showTerms(\''+indek+'\',\''+i+'\');">'
      +'</button>'
    +'</td>'
          
    +'<td style="padding:0;margin:0;">'
      +'<input type="text"'
      +' id="ar_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].ar_account_id+'"'
      +' onchange="CustomerBegins.setCell(\''+indek+'\''
      +',\'ar_account_id_'+i+'_'+indek+'\')"'
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
    +'</td>'
    
    +'<td>'
      +'<button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'ar_account_id_'+i+'_'+indek+'\',\'abc\');">'
      +'</button>'
    +'</td>'
          
    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="CustomerBegins.addRow(\''+indek+'\','+i+')" >'
      +'</button>'

      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="CustomerBegins.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
    begin_amount+=Number(isi[i].amount);
  }
  html+=CustomerBegins.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('begin_detail_'+indek).innerHTML=html;
  document.getElementById('begin_amount_'+indek).value=begin_amount;
  if(panjang==0) CustomerBegins.addRow(indek,0);
}

CustomerBegins.tableHead=(indek)=>{
  return '<table border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="2">Invoice#</th>'
    +'<th>Date</th>'
    +'<th>PO#</th>'
    +'<th>Amount</th>'
    +'<th colspan="2">Displayed Terms</th>'
    +'<th colspan="2">A/R Account</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
    +'</thead>';
}

CustomerBegins.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td>#</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

CustomerBegins.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];

  oldBasket=bingkai[indek].begin_detail;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }

  if(oldBasket.length==0)newRow(newBasket);
  CustomerBegins.setRows(indek,newBasket);
  
  function newRow(newBas){
    var def=bingkai[indek].data_default;
    var myItem={};
    myItem.nomer=newBas.length+1;
    myItem.invoice_no="";
    myItem.date='';
    myItem.customer_po='';
    myItem.amount=0;
    myItem.ar_account_id=def.ar_account_id;
    myItem.displayed_terms=def.discount_terms.displayed;
    myItem.discount_terms=def.discount_terms;
    newBas.push(myItem);
  }
}

CustomerBegins.removeRow=(indek,number)=>{
  var isi=bingkai[indek].begin_detail;
  var newBasket=[];
  var amount=0;  
  CustomerBegins.setRows(indek,isi);
  for(var i=0;i<isi.length;i++){
    if (i!=(number))newBasket.push(isi[i]);
  }
  CustomerBegins.setRows(indek,newBasket);
}

CustomerBegins.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].begin_detail;
  var baru = [];
  var isiEdit = {};
  var sum_amount=0;
  
  for (var i=0;i<isi.length; i++){
    isiEdit={};
    isiEdit=isi[i];
    
    if(id_kolom==('invoice_no_'+i+'_'+indek)){
      isiEdit.invoice_no=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else if(id_kolom==('date_'+i+'_'+indek)){
      isiEdit.date=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else if(id_kolom==('customer_po_'+i+'_'+indek)){
      isiEdit.customer_po=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else if(id_kolom==('displayed_terms_'+i+'_'+indek)){
      isiEdit.displayed_terms=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else if(id_kolom==('amount_'+i+'_'+indek)){
      isiEdit.amount=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else if(id_kolom==('ar_account_id_'+i+'_'+indek)){
      isiEdit.ar_account_id=getEV(id_kolom);
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
    sum_amount+=Number(isi[i].amount);
  }
  bingkai[indek].begin_detail=isi;
  document.getElementById('begin_amount_'+indek).value=sum_amount;
}

CustomerBegins.showTgl=(kolom,indek)=>{
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

CustomerBegins.hideTgl=(abc,baris,indek)=>{
  setEV('date_fake_'+baris+'_'+indek, tglWest(abc));
  document.getElementById('date_fake_'+baris+'_'+indek).style.display="inline";
  document.getElementById('date_'+baris+'_'+indek).style.display="none";
  bingkai[indek].begin_detail[baris].date
    =document.getElementById('date_'+baris+'_'+indek).value;
  
  CustomerBegins.setCell(indek,'date_fake_'+baris+'_'+indek);
}

CustomerBegins.date_change=(indek,id)=>{
  setEV("date_fake_"+id, tglWest(getEV("date_"+id)));
  CustomerBegins.setCell(indek,"date_"+id);
}

CustomerBegins.setCustomer=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;

  setEV(id_kolom, data.customer_id);
  CustomerBegins.getCustomer(indek);
}

CustomerBegins.getCustomer=(indek)=>{
  message.none(indek);
  Customers.getOne(indek,
    getEV('customer_id_'+indek),
  (paket)=>{
    setEV('customer_name_'+indek, paket.data.customer_name);
  });
}

CustomerBegins.showTerms=(indek,baris)=>{
  bingkai[indek].baris=baris;
  
  if(bingkai[indek].discount_terms==undefined){
    alert('????');
    DiscountTerms.getColumn(indek);
  }else{
    const isi=bingkai[indek].begin_detail[baris].discount_terms;
    const amount=Number(document.getElementById('amount_'+baris+'_'+indek).value);
    const tgl=document.getElementById('date_'+baris+'_'+indek).value;

    bingkai[indek].begin_detail[baris].discount_terms.date=tgl;
    bingkai[indek].begin_detail[baris].discount_terms.amount=amount;
    bingkai[indek].discount_terms=bingkai[indek].begin_detail[baris].discount_terms;
  }
  DiscountTerms.show(indek);
}

CustomerBegins.setTerms=(indek)=>{
  const baris=bingkai[indek].baris;
  const data_terms=bingkai[indek].discount_terms;

  setEV('displayed_terms_'+baris+'_'+indek
    ,bingkai[indek].discount_terms.displayed);
  
  CustomerBegins.setCell(indek,"displayed_terms_"+baris+'_'+indek);
  
  bingkai[indek].begin_detail[baris].discount_terms=data_terms;
}

CustomerBegins.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  if(nama_kolom=="abc"){
    setEV(id_kolom,data.account_id);
    CustomerBegins.setCell(indek,id_kolom);
  }
}

CustomerBegins.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>CustomerBegins.formPaging(indek));
  CustomerBegins.exportExecute(indek);
}

CustomerBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'customer_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

CustomerBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{CustomerBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

CustomerBegins.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "customer_id":d[i][1],
      "begin_detail":d[i][2]
    }
    db3.query(indek,CustomerBegins.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
//EOF:692;662;

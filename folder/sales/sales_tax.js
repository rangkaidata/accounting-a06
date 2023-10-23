/*
 * name: budiono
 * edit: sep-13, 11:33, wed-2023; new;503;
 * edit: sep-19, 12:20, tue-2023; 
 */ 
 
'use strict';

var SalesTax={
  url:'sales_taxes',
  title:'Sales Taxes'
};

SalesTax.show=(karcis)=>{
  karcis.modul=SalesTax.url;
  karcis.menu.name=SalesTax.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newItm=new BingkaiUtama(karcis);
    const indek=newItm.show();
    SalesTax.formPaging(indek);
  }else{
    show(baru);
  }
}

SalesTax.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{SalesTax.formCreate(indek);});
  toolbar.search(indek,()=>{SalesTax.formSearch(indek);});
  toolbar.refresh(indek,()=>{SalesTax.formPaging(indek);});
  toolbar.download(indek,()=>SalesTax.formExport(indek));
  toolbar.upload(indek,()=>SalesTax.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));  
  db3.readPaging(indek,()=>{
    SalesTax.readShow(indek);
  });
}

SalesTax.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="SalesTax.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="SalesTax.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="SalesTax.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="SalesTax.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Sales Tax </th>'
    +'<th>Description</th>'
    +'<th>Rate</th>'
    
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].sales_tax_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].sales_tax_name)+'</td>'
        +'<td align="right">'+paket.data[x].sales_tax_rate+'%</td>'

        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'

        +'<td align="center">'
          +'<button type="button" id="btn_change" '
          +' onclick="SalesTax.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].sales_tax_id+'\');"></button>'
        +'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_delete" '
          +' onclick="SalesTax.formDelete(\''+indek+'\''
          +',\''+paket.data[x].sales_tax_id+'\');"></button>'
        +'</td>'
      +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);  
}

SalesTax.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  SalesTax.formPaging(indek);
}

SalesTax.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    +'<li><label>Tax ID<i style="color:red">*</i></label>: '
      +'<input type="text" size="7"'
      +' id="sales_tax_id_'+indek+'" >'
    +'</li>'

    +'<li><label>Description</label>: '
      +'<input type="text" id="sales_tax_name_'+indek+'">'
    +'</li>'

    +'<li><label>&nbsp;</label>: '
      +'<label><input type="checkbox" '
      +' id="sales_tax_inactive_'+indek+'">Inactive</label>'
    +'</li>'

    +'<li><label>&nbsp;</label>: '
      +'<label><input type="checkbox" '
      +' id="sales_tax_freight_'+indek+'">Freight</label>'
    +'</li>'
    +'</ul>'

    +'<details open>'
      +'<summary>Sales Tax Details</summary>'
      +'<div id="sales_tax_detail_'+indek+'"></div>'
    +'</details>'

    +'<ul>'
      +'<li><label>Total Rate</label>: '
        +'<input type="text" '
        +' id="sales_tax_total_'+indek+'"'
        +' disabled'
        +' style="text-align:center;"'
        +' size="9">'
        +'</li>'
    +'</ul>'
    
    +'</form>'
    +'</div>';
    
  content.html(indek,html);
  statusbar.ready(indek);
  
  bingkai[indek].sales_tax_detail=[]
  
  SalesTax.setRows(indek,[]);
  
  if(metode==MODE_CREATE){
    document.getElementById('sales_tax_id_'+indek).focus();
  }else{
    document.getElementById('sales_tax_id_'+indek).disabled=true;
    document.getElementById('sales_tax_name_'+indek).focus();
  }
}

SalesTax.formCreate=(indek)=>{
  SalesTax.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{SalesTax.formPaging(indek);});
  toolbar.save(indek,()=>{SalesTax.createExecute(indek);});
}

SalesTax.createExecute=(indek)=>{
  db3.createOne(indek,{
    "sales_tax_id":getEV("sales_tax_id_"+indek),
    "sales_tax_name":getEV("sales_tax_name_"+indek),
    "sales_tax_inactive":getEC("sales_tax_inactive_"+indek),
    "sales_tax_freight":getEC("sales_tax_freight_"+indek),
    "sales_tax_detail":bingkai[indek].sales_tax_detail
  });
}

SalesTax.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "sales_tax_id":bingkai[indek].sales_tax_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d=paket.data;
      setEV('sales_tax_id_'+indek, d.sales_tax_id);
      setEV('sales_tax_name_'+indek, d.sales_tax_name);
      setEC('sales_tax_inactive_'+indek, d.sales_tax_inactive);
      setEC('sales_tax_freight_'+indek, d.sales_tax_freight);
      setEV('sales_tax_total_'+indek, d.sales_tax_total);
      SalesTax.setRows(indek,d.sales_tax_detail);
    }
    message.none(indek);
    return callback();
  });
}

SalesTax.formDelete=(indek,sales_tax_id)=>{
  bingkai[indek].sales_tax_id=sales_tax_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  SalesTax.form(indek,MODE_DELETE);
  SalesTax.readOne(indek,()=>{
    toolbar.back(indek,()=>{SalesTax.formLast(indek);});
    toolbar.delet(indek,()=>{SalesTax.deleteExecute(indek);});
  });
}

SalesTax.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "sales_tax_id":bingkai[indek].sales_tax_id
  });
}

SalesTax.formUpdate=function(indek,sales_tax_id){
  bingkai[indek].sales_tax_id=sales_tax_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  SalesTax.form(indek,MODE_UPDATE);
  SalesTax.readOne(indek,()=>{
    toolbar.back(indek,()=>{SalesTax.formLast(indek);});
    toolbar.save(indek,()=>{SalesTax.updateExecute(indek);});
  });
}

SalesTax.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "sales_tax_id":bingkai[indek].sales_tax_id,
    "sales_tax_name":getEV("sales_tax_name_"+indek),
    "sales_tax_inactive":getEC("sales_tax_inactive_"+indek),
    "sales_tax_freight":getEC("sales_tax_freight_"+indek),
    "sales_tax_detail":bingkai[indek].sales_tax_detail
  });
}

SalesTax.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>SalesTax.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{SalesTax.formPaging(indek);});
}

SalesTax.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  SalesTax.formResult(indek);
}

SalesTax.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{SalesTax.formSearch(indek);});
  db3.search(indek,(paket)=>{
    SalesTax.readShow(indek);
  });
}

SalesTax.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  SalesTax.formPaging(indek):
  SalesTax.formResult(indek);
}

SalesTax.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];
    
  var panjang=isi.length;
  var html=SalesTax.tableHead(indek);
  var sum_rate=0;

  bingkai[indek].sales_tax_detail=isi;
    
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    +'<td style="margin:0;padding:0">'
      +'<input type="text" id="description_'+i+'_'+indek+'" '
      +' value="'+isi[i].description+'"'
      +' onchange="SalesTax.setCell(\''+indek+'\''
      +',\'description_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"></td>'

    +'<td align="center" style="padding:0;margin:0;">'
    +'<input type="text" id="rate_'+i+'_'+indek+'" '
      +' value="'+isi[i].rate+'"'
      +' style="text-align:center"'
      +' onchange="SalesTax.setCell(\''+indek+'\''
      +',\'rate_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" '
      +'  size="3"></td>'

    +'<td align="center" style="padding:0;margin:0;" >'
      +'<input type="text" id="gl_account_id_'+i+'_'+indek+'" '
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="SalesTax.setCell(\''+indek+'\''
      +',\'gl_account_id_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" '
      +' style="text-align:center"'
      +' size="8"></td>'
      
      +'<td>'
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'gl_account_id_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'

    +'<td align="center">'
      +'<button type="button" id="btn_add" '
      +' onclick="SalesTax.addRow(\''+indek+'\','+i+')" ></button>'
      
      +'<button type="button" id="btn_remove" '
      +' onclick="SalesTax.removeRow(\''+indek+'\','+i+')" ></button>'
    +'</td>'
    +'</tr>';
    
    sum_rate+=Number(isi[i].rate);

  }
  html+=SalesTax.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('sales_tax_detail_'+indek).innerHTML=html;
  if(panjang==0)SalesTax.addRow(indek,[]);
  
  setEV('sales_tax_total_'+indek, sum_rate);
}

SalesTax.tableHead=(indek)=>{
  return '<table border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="2">Description</th>'
    +'<th>Rate %</th>'
    +'<th colspan="2">G/L Account<i style="color:red">*</i></th>'
    +'<th>Add/Remove</th>'
    +'</tr>'
    +'</thead>';
}

SalesTax.tableFoot=(indek)=>{
  return '<tr>'
  +'<td>&nbsp;</td>'
  +'</tr>'
  +'</tfoot>'
  +'</table>';
}

SalesTax.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];

  oldBasket=bingkai[indek].sales_tax_detail;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)SalesTax.newRow(newBasket);
  }
  if(oldBasket.length==0)SalesTax.newRow(newBasket);
  SalesTax.setRows(indek,newBasket);
}

SalesTax.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.description="";
  myItem.rate=0;
  myItem.gl_account_id='';
  newBasket.push(myItem);
}

SalesTax.removeRow=(indek,number)=>{
  var isi=bingkai[indek].sales_tax_detail;
  var newBasket=[];
  var amount=0;  
  SalesTax.setRows(indek,isi);
  for(var i=0;i<isi.length;i++){
    if (i!=(number))newBasket.push(isi[i]);
  }
  SalesTax.setRows(indek,newBasket);
}

SalesTax.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].sales_tax_detail;
  var baru=[];
  var isiEdit={};
  var sum_rate=0;

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('description_'+i+'_'+indek)){
      isiEdit.description=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('rate_'+i+'_'+indek)){
      isiEdit.rate=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }else{
      baru.push(isi[i]);
    }
    sum_rate+=parseFloat(baru[i].rate);
  }  
  setEV('sales_tax_total_'+indek, sum_rate);
  bingkai[indek].sales_tax_detail=isi;
}

SalesTax.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  SalesTax.setCell(indek,id_kolom);  
}

SalesTax.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new SalesTaxLook(indek);
  objPop.show();
}
 
SalesTax.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>SalesTax.formPaging(indek));
  SalesTax.exportExecute(indek);
}

SalesTax.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'sales_tax.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

SalesTax.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{SalesTax.formPaging(indek);});
  iii.uploadJSON(indek);
}

SalesTax.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "sales_tax_id":d[i][1],
      "sales_tax_name":d[i][2],
      "sales_tax_inactive":d[i][3],
      "sales_tax_freight":d[i][4],
      "sales_tax_detail":d[i][5]
    }
    db3.query(indek,SalesTax.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

SalesTax.getOne=(indek,sales_tax_id,callBack)=>{
  db3.query(indek,SalesTax.url+'/read_one',{
    "sales_tax_id":sales_tax_id
  },(paket)=>{
    return callBack(paket);
  });
}

// eof: 503;

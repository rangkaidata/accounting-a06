/*
 * auth: budiono
 * date: oct-12, 09:08, thu-2023; new;
 * edit: oct-19, 22:04, thu-2023; xHTML;
 */ 

'use strict';

var JournalEntry={
  url:'journal_entry',
  title:'Journal Entry'
}

JournalEntry.show=(tiket)=>{
  tiket.modul=JournalEntry.url;
  tiket.menu.name=JournalEntry.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const form=new BingkaiUtama(tiket);
    const indek=form.show();
    JournalEntry.formPaging(indek);
  }else{
    show(baru);
  }
}

JournalEntry.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{JournalEntry.formCreate(indek);});
  toolbar.search(indek,()=>{JournalEntry.formSearch(indek);});
  toolbar.refresh(indek,()=>{JournalEntry.formPaging(indek);});
  toolbar.download(indek,()=>{JournalEntry.formExport(indek);});
  toolbar.upload(indek,()=>{JournalEntry.formImport(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});
  db3.readPaging(indek,()=>{
    JournalEntry.readShow(indek);
  });
}

JournalEntry.readShow=(indek)=>{
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
        +' id="btn_first" '
        +' onclick="JournalEntry.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="JournalEntry.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="JournalEntry.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" onclick="JournalEntry.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Date</th>'
    +'<th>Ref.</th>'
    +'<th>Amount</th>'
    +'<th>Description</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan="2">Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'
          +tglWest(paket.data[x].journal_date)
          +'</td>'
        +'<td align="left">'+paket.data[x].journal_no+'</td>'
        +'<td align="right">'
          +formatSerebuan(paket.data[x].journal_amount)
          +'</td>'
          
        +'<td align="left">'+xHTML(str10(paket.data[x].journal_note))+'</td>'
      
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
        +'</td>'
        
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_change" '
          +' onclick="JournalEntry.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].journal_no+'\');">'
          +'</button>'
          +'</td>'
          
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="JournalEntry.formDelete(\''+indek+'\''
          +',\''+paket.data[x].journal_no+'\');"></button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

JournalEntry.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  JournalEntry.formPaging(indek);
}

JournalEntry.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul style="display:inline-block;">'

    +'<li><label>Date</label>'
      +'<input type="date" id="journal_date_'+indek+'"></li>'
      
    +'<li><label>Journal #<i class="required">(*)</i></label>'
      +'<input type="text" id="journal_no_'+indek+'"></li>'
      
    +'<li><label>&nbsp;</label>'
    +'<textarea id="journal_note_'+indek+'"'
      +' cols=50 rows=5 '
      +' style="resize:none;"'
      +' spellcheck=false placeholder="Note or memo...">'
      +'</textarea></li>'
    
    +'</ul>'
    +'<details open>'
      +'<summary>Journal details</summary>'
      +'<div id="page_detail_'+indek+'" '
      +' style="overflow-y:auto;">'
      +'</div>'
    +'</details>'
    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);

  document.getElementById('journal_no_'+indek).focus();
  document.getElementById('journal_date_'+indek).value=tglSekarang();
}

JournalEntry.formCreate=(indek)=>{
  bingkai[indek].journal_no='';
  bingkai[indek].journal_detail=[];
  JournalEntry.formEntry(indek,MODE_CREATE);
  JournalEntry.addRow(indek,0);

  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JournalEntry.formPaging(indek);});
  toolbar.save(indek,()=>{JournalEntry.createExecute(indek);});
}

JournalEntry.createExecute=(indek)=>{
  db3.createOne(indek,{
    "journal_no":getEV("journal_no_"+indek),
    "journal_date":getEV("journal_date_"+indek),
    "journal_note":getEV("journal_note_"+indek),
    "journal_detail":bingkai[indek].journal_detail
  });
}

JournalEntry.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "journal_no":bingkai[indek].journal_no
  },(paket)=>{
    if(paket.err.id==0 || paket.count>0) {
      const d=paket.data;
      setEV("journal_date_"+indek, d.journal_date);
      setEV("journal_no_"+indek, d.journal_no);
      setEV("journal_note_"+indek, d.journal_note);
      JournalEntry.setRows(indek, d.journal_detail);
    }
    message.none(indek);
    return callback();
  });
}

JournalEntry.formUpdate=(indek,journal_no)=>{
  bingkai[indek].journal_no=journal_no;
  toolbar.none(indek);
  toolbar.hide(indek);
  JournalEntry.formEntry(indek,MODE_UPDATE);
  JournalEntry.readOne(indek,()=>{
    toolbar.back(indek,()=>{JournalEntry.formLast(indek);});
    toolbar.save(indek,()=>{JournalEntry.updateExecute(indek);})
  });
}

JournalEntry.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "edit_journal_no":bingkai[indek].journal_no,
    "journal_no":getEV("journal_no_"+indek),
    "journal_date":getEV("journal_date_"+indek),
    "journal_note":getEV("journal_note_"+indek),
    "journal_detail":bingkai[indek].journal_detail
  }); 
}

JournalEntry.formDelete=(indek,journal_no)=>{
  bingkai[indek].journal_no=journal_no;
  toolbar.none(indek);
  toolbar.hide(indek);
  JournalEntry.formEntry(indek,MODE_DELETE);
  JournalEntry.readOne(indek,()=>{
    toolbar.back(indek,()=>{JournalEntry.formLast(indek);});
    toolbar.delet(indek,()=>{JournalEntry.deleteExecute(indek);});
  });
}

JournalEntry.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "journal_no":bingkai[indek].journal_no
  });
}

JournalEntry.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  JournalEntry.formPaging(indek):
  JournalEntry.formResult(indek);
}

JournalEntry.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>JournalEntry.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JournalEntry.formPaging(indek);});
}

JournalEntry.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  JournalEntry.formResult(indek);
}

JournalEntry.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JournalEntry.formSearch(indek);});
  db3.search(indek,(paket)=>{
    bingkai[indek].paket=paket;
    bingkai[indek].metode=MODE_RESULT;
    JournalEntry.readShow(indek);
  });
}

JournalEntry.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JournalEntry.formPaging(indek);});
  JournalEntry.exportExecute(indek);
}

JournalEntry.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'journal_entry.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

JournalEntry.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JournalEntry.formPaging(indek);});
  iii.uploadJSON(indek);
}

JournalEntry.importExecute=function(indek){
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<d.length;i++){
    o={
      "journal_no":d[i][1],
      "journal_date":d[i][2],
      "journal_note":d[i][3],
      "journal_detail":d[i][4],
    }
    db3.query(indek,JournalEntry.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

JournalEntry.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  oldBasket=bingkai[indek].journal_detail;
  
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)JournalEntry.newRow(newBasket);
  }
  if(oldBasket.length==0)JournalEntry.newRow(newBasket);
  JournalEntry.setRows(indek,newBasket);
}

JournalEntry.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.account_id='';
  myItem.description='';
  myItem.debit=0;
  myItem.credit=0;
  myItem.job_phase_cost='';
  newBasket.push(myItem);
}

JournalEntry.setRows=(indek,isi)=>{
  if(isi==undefined)isi=[];
  bingkai[indek].journal_detail=isi;
  
  var panjang=isi.length;
  var html=JournalEntry.TabelHead(indek);
  var sum_debit=0;
  var sum_credit=0;
  var is_balance=0;
  
  for (let i=0;i<panjang;i++){
    html+='<tr>'
      +'<td style="margin:0;padding:1;width:0;">'+(i+1)+'</td>'
      
      +'<td style="margin:0;padding:1;width:0;">'
        +'<input type="text" id="account_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].account_id+'" '
        +' onchange="JournalEntry.setCell(\''+indek+'\''
        +',\'account_id_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" '
        +' size="8">'
        +'</td>'
        
      +'<td style="margin:0;padding:1;width:0;">'
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'account_id_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'
      
      +'<td style="padding:1;margin:0;width:0;">'
        +'<input type="text" id="description_'+i+'_'+indek+'" '
        +' value="'+isi[i].description+'"'
        +' onchange="JournalEntry.setCell(\''+indek+'\''
        +',\'description_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"'
        +' size="30" >'
        +'</td>'
      
      +'<td style="padding:1;margin:0;width:0;">'
        +'<input type="text" '
        +' id="debit_'+i+'_'+indek+'" '
        +' value="'+isi[i].debit+'" '
        +' size="6" style="text-align:right" '
        +' onchange="JournalEntry.setCell(\''+indek+'\''
        +',\'debit_'+i+'_'+indek+'\')"  '
        +' onfocus="this.select()" >'
        +'</td>'
      
      +'<td style="padding:1;margin:0;width:0;">'
        +'<input type="text"'
        +' id="credit_'+i+'_'+indek+'"'
        +' value="'+isi[i].credit+'"'
        +' size="6" style="text-align:right" '
        +' onchange="JournalEntry.setCell(\''+indek+'\''
        +',\'credit_'+i+'_'+indek+'\')"'
        +' onfocus="this.select()" >'
        +'</td>'
      
      +'<td style="padding:1;margin:0;width:0;">'
        +'<input type="text"'
        +' id="job_phase_cost_'+i+'_'+indek+'"'
        +' value="'+isi[i].job_phase_cost+'" size="3"'
        +' onchange="JournalEntry.setCell(\''+indek+'\''
        +',\'job_phase_cost_'+i+'_'+indek+'\')"'
        +' onfocus="this.select()">'
        +'</td>'
        
      +'<td  style="padding:1;margin:0;width:0;">'
        +'<button type="button" '
        +' id="btn_find"'
        +' onclick="Jobs.lookUp(\''+indek+'\''
        +',\'job_phase_cost_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'

      +'<td  style="padding:1;margin:0;width:0;">'
      +'<button type="button"'
        +' id="btn_add"'
        +' onclick="JournalEntry.addRow(\''+indek+'\','+i+')" >'
        +'</button>'
      +'<button type="button"'
        +' id="btn_remove"'
        +' onclick="JournalEntry.removeRow(\''+indek+'\','+i+')" >'
        +'</button>'
      +'</td>'
      +'</tr>';
    sum_debit+=parseFloat(isi[i].debit);
    sum_credit+=parseFloat(isi[i].credit);
  }
  html+=JournalEntry.TabelFoot(indek);
  var budi = JSON.stringify(isi);

  document.getElementById('page_detail_'+indek).innerHTML=html;
  bingkai[indek].sum_debit=sum_debit;
  bingkai[indek].sum_credit=sum_credit;
  JournalEntry.calculate(indek);
}

JournalEntry.calculate=(indek)=>{
  document.getElementById('sum_debit_'+indek).innerHTML
    =bingkai[indek].sum_debit;
  document.getElementById('sum_credit_'+indek).innerHTML
    =bingkai[indek].sum_credit;
  document.getElementById('is_balance_'+indek).innerHTML
  =Number(bingkai[indek].sum_debit)-Number(bingkai[indek].sum_credit);
}

JournalEntry.TabelHead=(indek)=>{
  return '<table border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="3">Account ID</th>'
    +'<th>Decription</th>'
    +'<th>Debit</th>'
    +'<th>Credit</th>'
    +'<th colspan="2">Job</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
    +'</thead>';
}

JournalEntry.TabelFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=4 style="text-align:right;">Totals:</td>'
    +'<td style="text-align:right;font-weight:bolder;" '
      +' id="sum_debit_'+indek+'">0.00</td>'
    +'<td style="text-align:right;font-weight:bolder;" '
      +' id="sum_credit_'+indek+'">0.00</td>'
    +'<td colspan=3>&nbsp;</td>'
    +'</tr>'
    +'<tr>'
    +'<td colspan=4 style="text-align:right;">Out of Balance:</td>'
    +'<td style="text-align:right;font-weight:bolder;" '
      +' id="is_balance_'+indek+'">0.00</td>'
    +'<td colspan=4>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

JournalEntry.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].journal_detail;
  var baru = [];
  var isiEdit = {};
  
  var sum_debit=0;
  var sum_credit=0;

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('account_id_'+i+'_'+indek)){
      isiEdit.account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      JournalEntry.getAccount(indek,i);
      
    }else if(id_kolom==('description_'+i+'_'+indek)){
      isiEdit.description=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('debit_'+i+'_'+indek)){
      isiEdit.debit=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('credit_'+i+'_'+indek)){
      isiEdit.credit=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('job_phase_cost_'+i+'_'+indek)){
      isiEdit.job_phase_cost=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else{
      baru.push(isi[i]);
    }
    sum_debit+=parseFloat(baru[i].debit);
    sum_credit+=parseFloat(baru[i].credit);

  }
  bingkai[indek].journal_detail=isi;
  bingkai[indek].sum_debit=sum_debit;
  bingkai[indek].sum_credit=sum_credit;
  JournalEntry.calculate(indek);
}

JournalEntry.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].journal_detail;
  var newBasket=[];
  
  JournalEntry.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=number)newBasket.push(oldBasket[i])
  }
  JournalEntry.setRows(indek,newBasket);
}

JournalEntry.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  document.getElementById(id_kolom).value=data.account_id;
  JournalEntry.setCell(indek,id_kolom);  
}

JournalEntry.getAccount=(indek,baris)=>{
  Accounts.getOne(indek,
    document.getElementById('account_id_'+baris+'_'+indek).value,
  (paket)=>{
    setEV('account_id_'+baris+'_'+indek, paket.data.account_id);
    setEV('description_'+baris+'_'+indek, paket.data.account_name);
    JournalEntry.setCell(indek,'description_'+baris+'_'+indek);
  });
}

JournalEntry.setJob=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data);
  JournalEntry.setCell(indek,id_kolom);
}

/*EOF*/

/*
 * name: budiono
 * date: oct-02, 16:45, mon-2023; new;
 * edit: oct-04, 17:58, wed-2023; 
 * edit: oct-15, 20:01, sun-2023; 
*/

'use strict';

var VendorBalances={
  url:'vendor_balances',
  title:'Vendor Balances'
}

VendorBalances.show=(karcis)=>{
  karcis.modul=VendorBalances.url;
  karcis.menu.name=VendorBalances.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    var newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    VendorBalances.formPaging(indek);
  }else{
    show(baru);
  }
}

VendorBalances.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>VendorBalances.formSearch(indek));
  toolbar.refresh(indek,()=>VendorBalances.formPaging(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    VendorBalances.readShow(indek);
  });
}

VendorBalances.readShow=(indek)=>{
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
        +' onclick="VendorBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="VendorBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled >'+paket.paging.pages[x].page
          +'</button>';
        } else {
          html+= '<button type="button"'
          +' onclick="VendorBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +'>'+paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="VendorBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Vendor ID</th>'
    +'<th>Name</th>'
    +'<th>Amount Due</th>'
    +'<th>Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    var d=paket.data;
    for (var x in d) {
      html+='<tr>'
        +'<td align="center">'+d[x].row_id+'</td>'
        +'<td>'+d[x].vendor_id+'</td>'
        +'<td>'+xHTML(d[x].vendor_name)+'</td>'
        +'<td align="right">'+d[x].amount+'</td>'

        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="VendorBalances.formDetail(\''+indek+'\''
          +',\''+d[x].vendor_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

VendorBalances.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  VendorBalances.formPaging(indek);
}

VendorBalances.formDetail=(indek,vendor_id)=>{
  bingkai[indek].vendor_id=vendor_id;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{VendorBalances.readOne(indek);});
  toolbar.back(indek,()=>VendorBalances.formLast(indek));
  VendorBalances.readOne(indek);
}

VendorBalances.readOne=(indek)=>{
  var html='';
  db3.readOne(indek,{
    "vendor_id":bingkai[indek].vendor_id,
  },(ironman)=>{
    var html;
    if (ironman.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<ul>'
          +'<li><label>Vendor ID</label>: '+ironman.data.vendor_id+'</li>'
          +'<li><label>Name</label>: '+xHTML(ironman.data.vendor_name)+'</li>'
        +'</ul>'
        +'<table>'
        +'<tr>'
          +'<th colspan="2">Date</th>'
          +'<th>Invoice<br>Number</th>'
          +'<th>Invoice<br>Amount</th>'
          +'<th>Amount<br>Paid</th>'
          +'<th>Amount<br>Due</th>'
          +'<th>Status</th>'
        +'</tr>';

      var list1=ironman.data.by_modul;
      var receive_amount=0;
      var amount_paid=0;
      var amount_due=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="center">'+tglWest(list1[x].receive_date)+'</td>'
        +'<td align="left">'+list1[x].receive_no+'</td>'
        +'<td align="right">'+list1[x].receive_amount+'</td>'
        +'<td align="right">'+list1[x].amount_paid+'</td>'
        +'<td align="right">'+list1[x].amount_due+'</td>' 
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="VendorBalances.formDetailC(\''+indek+'\''
          +',\''+list1[x].receive_no+'\')">'
          +'</button>'
          +'</td>'
        +'</tr>'
        receive_amount+=Number(list1[x].receive_amount);
        amount_paid+=Number(list1[x].amount_paid);
        amount_due+=Number(list1[x].amount_due);
      }
      
      html+='<tr>'
        +'<td colspan="3" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+receive_amount+'</b></td>'
        +'<td align="right"><b>'+amount_paid+'</b></td>'
        +'<td align="right"><b>'+amount_due+'</b></td>'
        +'<td colspan="2">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';
      
      content.html(indek,html);
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

VendorBalances.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  VendorBalances.formPaging(indek):
  VendorBalances.formResult(indek);
}

VendorBalances.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>VendorBalances.formSearch(indek));
  db3.search(indek,(paket)=>{
    VendorBalances.readShow(indek);
  });
}

VendorBalances.formDetailC=(indek,receive_no)=>{
  bingkai[indek].receive_no=receive_no;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{VendorBalances.read(indek);});
  toolbar.back(indek,()=>VendorBalances.formLast(indek));
  VendorBalances.read(indek);
}

VendorBalances.read=(indek)=>{
  var html='';
  db3.query(indek,VendorBalances.url+'/read',{
    "vendor_id":bingkai[indek].vendor_id,
    "receive_no":bingkai[indek].receive_no,
  },(ironman)=>{
    var html;
    if (ironman.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br />'
        +'<div'
          +' style="display:grid;'
          +'grid-template-columns:repeat(2,1fr);padding-bottom:20px;">'
        +'<div>'
          +'<ul>'
            +'<li><label>Vendor ID</label>: '+ironman.data.vendor_id+'</li>'
            +'<li><label>Name</label>: '+xHTML(ironman.data.vendor_name)+'</li>'
          +'</ul>'
        +'</div>'
        
        +'<div>'
          +'<ul>'
            +'<li><label>Invoice No.</label>: '+ironman.data.receive_no+'</li>'
            +'<li><label>Date.</label>: '+tglWest(ironman.data.receive_date)+'</li>'
            +'<li><label>Amount</label>: '+ironman.data.receive_amount+'</li>'
            +'<li><label>Amount Due</label>: '+ironman.data.amount_due+'</li>'
          +'</ul>'
        +'</div>'
        +'</div>'

        +'<table>'
        +'<tr>'
          +'<th colspan="2">Payment No.</th>'
          +'<th>Payment Date</th>'
          +'<th>Amount Paid</th>'
          +'<th>Amount Due</th>'
          +'<th>Modul ID</th>'
          +'<th>Action</th>'
        +'</tr>';

      var list1=ironman.data.by_modul;
      var receive_amount=0;
      var amount_paid=0;
      var amount_due=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="center">'+list1[x].payment_no+'</td>'
        +'<td align="center">'+tglWest(list1[x].payment_date)+'</td>'
        +'<td align="right">'+list1[x].amount_paid+'</td>' 
        +'<td align="right">'+list1[x].amount_due+'</td>' 
        +'<td align="right">'+list1[x].modul_id+'</td>' 
        +'<td align="center">'
          +'<input type="button" value="Delete"'
          +' onclick="VendorBalances.removeExecute(\''+indek+'\''
          +',\''+list1[x].modul_id+'\''
          +',\''+list1[x].blok_id+'\''
          +')">'
          +'</td>'
        +'</tr>'
        receive_amount+=Number(list1[x].receive_amount);
        amount_paid+=Number(list1[x].amount_paid);
        amount_due+=Number(list1[x].amount_due);
      }
      
      html+='<tr>'
        +'<td colspan="4" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+ironman.data.amount_due+'</b></td>'
        +'<td colspan="2">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';

      content.html(indek,html);
    }else{
      content.infoPaket(indek,ironman);
    }
  });
}

VendorBalances.removeExecute=(indek,modul_id,blok_id)=>{
  db3.deleteOne(indek,{
    "modul_id":modul_id,
    "blok_id":blok_id
  });
}

VendorBalances.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>VendorBalances.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>VendorBalances.formPaging(indek));
}

VendorBalances.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  VendorBalances.formResult(indek);
}

// eof;

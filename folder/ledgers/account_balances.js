/*
 * name: budiono
 * date: oct-02, 16:25, mon-2023; new
 * edit: oct-04, 12:26, wed-2023; xHTML;
 * edit: oct-06, 17:37, fri-2023; neraca saldo;
 * edit: oct-14, 08:08, sat-2023; 
 * edit: oct-19, 22:02, thu-2023; xHTML;
*/

'use strict';

var AccountBalances={
  url:'account_balances',
  title:'Account Balances'
}

AccountBalances.show=(tiket)=>{
  tiket.modul=AccountBalances.url;
  tiket.menu.name=AccountBalances.title;
  tiket.bisa.tambah=0;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    AccountBalances.formPaging(indek);
  }else{
    show(baru);
  }  
}

AccountBalances.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>AccountBalances.formSearch(indek));
  toolbar.refresh(indek,()=>AccountBalances.formPaging(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    AccountBalances.readShow(indek);
  });
}

AccountBalances.readShow=(indek)=>{
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
        +' id="btn_first" '
        +' onclick="AccountBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      
      for (var x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="AccountBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>'; 
        }else{
          html+= '<button type="button" '
          +' onclick="AccountBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" '
        +' onclick="AccountBalances.gotoPage(\''+indek+'\''
        +' ,\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
  +'<th colspan="2">Account ID</th>'
  +'<th>Account Name</th>'
  +'<th>Account Class</th>'
  //+'<th>Assets,<br>Expenses,<br>Cost of Sales</th>'
  //+'<th>Liabilities,<br>Equity,<br>Income</th>'
  +'<th>Debit</th>'
  +'<th>Credit</th>'
  +'<th>Action</th>';
  
  
  if (paket.err.id===0){
    var d=paket.data;
    var sum_d=0;
    var sum_c=0;
    
    for (x in d){
      html+='<tr>'
      +'<td align="center">'+d[x].row+'</td>'
      +'<td align="left">'+d[x].account_id+'</td>'
      +'<td align="left">'+xHTML(d[x].account_name)+'</td>'
      +'<td align="center">'
        +array_account_class[d[x].account_class]+'</td>'
      +'<td align="center">'
        +formatSerebuan(d[x].debit)+'</td>'
      +'<td align="center">'
        +formatSerebuan(d[x].credit)+'</td>'

      +'<td align="center">'
        +'<button type="button" '
        +' id="btn_detail" '
        +' onclick="AccountBalances.formView(\''+indek+'\''
        +' ,\''+d[x].account_id+'\');">'
        +'</button>'
        +'</td>'
      +'</tr>';
      sum_d+=d[x].debit;
      sum_c+=d[x].credit;
    }
  }
  // sum
  html+='<tr>'
    +'<td colspan="3">&nbsp;</td>'
    +'<td align="left"><strong>Balance</strong></td>'
    +'<td align="center"><strong>'+formatSerebuan(sum_d)+'</strong></td>'
    +'<td align="center"><strong>'+formatSerebuan(sum_c)+'</strong></td>'
    +'<td>&nbsp;</td>'
    +'</tr>'
    +'</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

AccountBalances.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  AccountBalances.formPaging(indek):
  AccountBalances.formResult(indek);
}

AccountBalances.formSearch=function(indek,txt){
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>AccountBalances.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{AccountBalances.formPaging(indek);});
}

AccountBalances.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  AccountBalances.formResult(indek);
}

AccountBalances.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{AccountBalances.formSearch(indek);});
  db3.search(indek,(paket)=>{
    bingkai[indek].paket=paket;
    bingkai[indek].metode=MODE_RESULT;
    AccountBalances.readShow(indek);
  });
}

AccountBalances.formView=(indek,account_id)=>{
  bingkai[indek].account_id=account_id;

  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{AccountBalances.readOne(indek);});
  toolbar.back(indek,()=>AccountBalances.formLast(indek));
  AccountBalances.readOne(indek);
}

AccountBalances.readOne=(indek)=>{
  var html='';
  db3.readOne(indek,{
    "account_id":bingkai[indek].account_id
  },(batman)=>{
    if(batman.err.id==0){
      const d=batman.data;
      bingkai[indek].metode=MODE_VIEW;
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br />'
        +'<ul>'
          +'<li><label>Account ID</label>: '+d.account_id+'</li>'
          +'<li><label>Description</label>: '+xHTML(d.account_name)+'</li>'
          +'<li><label>Account Class</label>: '
            +array_account_class[d.account_class]+'</li>'
        +'</ul>'
        +'<table>'
        +'<tr>'
          +'<th colspan="2">Date</th>'
          +'<th>Reference</th>'
          +'<th>Debit</th>'
          +'<th>Credit</th>'
          +'<th>Remain</th>'
          +'<th>Description</th>'
          +'<th colspan="2">Status</th>'
        +'</tr>';
        
      var list1=d.by_modul;
      var remain_debit=0;
      var remain_credit=0;
      var remain_total=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="center">'+tglWest(list1[x].balance_date)+'</td>'
        +'<td align="left">'+list1[x].balance_no+'</td>'

        +'<td align="right">'+formatSerebuan(list1[x].debit_amount)+'</td>'
        +'<td align="right">'+formatSerebuan(list1[x].credit_amount)+'</td>'
        +'<td align="right">'+formatSerebuan(list1[x].balance_amount)+'</td>'
        +'<td align="left">'+xHTML(list1[x].note)+'</td>'
        +'<td align="left">'+list1[x].modul_id+'</td>'

        +'<td align="center">'
        +'<input type="button" value="Verify"'
          +' id="verify_'+x+'_'+indek+'"'
          +' onclick="AccountBalances.accountVerify(\''+indek+'\''
          +',\''+list1[x].modul_id+'\''
          +',\''+list1[x].blok_id+'\''
          +')">'
          +'</td>'
        +'</tr>'
        remain_debit+=Number(list1[x].debit_amount);
        remain_credit+=Number(list1[x].credit_amount);
        remain_total=remain_debit-remain_credit;
      }
      
      html+='<tr>'
        +'<td colspan="3" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+formatSerebuan(remain_debit)+'</b></td>'
        +'<td align="right"><b>'+formatSerebuan(remain_credit)+'</b></td>'
        +'<td align="right"><b>'+formatSerebuan(remain_total)+'</b></td>'
        // +'<td>&nbsp;</td>'
        +'</tr>'
        +'</table></div>';
      
      content.html(indek,html);
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

AccountBalances.accountVerify=(indek,modul_id,blok_id)=>{
  db3.deleteOne(indek,{
    "modul_id":modul_id,
    "blok_id":blok_id
  });
  // document.getElementById('verify_'+baris+'_'+indek).disabled=true;
}

/*EOF*/

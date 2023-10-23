/*
 * name: budiono;
 * date: oct-16, 21:39, mon-2023; new;
 */

'use strict';

var JobBalances={
  url:'job_balances',
  title:'Job Balances'
}

JobBalances.show=(karcis)=>{
  karcis.modul=JobBalances.url;
  karcis.menu.name=JobBalances.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    var newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    JobBalances.formPaging(indek);
  }else{
    show(baru);
  }
}

JobBalances.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>JobBalances.formSearch(indek));
  toolbar.refresh(indek,()=>JobBalances.formPaging(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    JobBalances.readShow(indek);
  });
}

JobBalances.readShow=(indek)=>{
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
        +' onclick="JobBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="JobBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled >'+paket.paging.pages[x].page
          +'</button>';
        } else {
          html+= '<button type="button"'
          +' onclick="JobBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +'>'+paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="JobBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Job ID</th>'
    +'<th>Name</th>'
    +'<th>Estimated</th>'
    +'<th>Actual</th>'
    +'<th>Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    var d=paket.data;
    for (var x in d) {
      html+='<tr>'
        +'<td align="center">'+d[x].row_id+'</td>'
        +'<td>'+d[x].job_id+'</td>'
        +'<td>'+xHTML(d[x].job_name)+'</td>'
        +'<td align="right">'+d[x].estimated+'</td>'
        +'<td align="right">'+d[x].actual+'</td>'

        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="JobBalances.formDetail(\''+indek+'\''
          +',\''+d[x].job_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

JobBalances.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  JobBalances.formPaging(indek);
}

JobBalances.formDetail=(indek,job_id)=>{
  bingkai[indek].job_id=job_id;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{JobBalances.readOne(indek);});
  toolbar.back(indek,()=>JobBalances.formLast(indek));
  JobBalances.readOne(indek);
}

JobBalances.readOne=(indek)=>{
  var html='';
  db3.readOne(indek,{
    "job_id":bingkai[indek].job_id,
  },(ironman)=>{
    var html;
    if (ironman.err.id===0){
      var d=ironman.data;
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<div style="display:blok;">'
        +'<div>'
          +'<ul>'
            +'<li><label>Job ID</label>: '+d.job_id+'</li>'
            +'<li><label>Name</label>: '+xHTML(d.job_name)+'</li>'
          +'</ul>'
        +'</div>'

        +'<table>'
        +'<tr>'
          +'<th>Phase ID</th>'
          +'<th>Cost ID</th>'

          +'<th>Est.<br>Units</th>'
          +'<th>Act.<br>Units</th>'
          +'<th>Diff.<br>Units</th>'
          
          +'<th>Est.<br>Expenses</th>'
          +'<th>Act.<br>Expenses</th>'
          +'<th>Diff.<br>Expenses</th>'
          
          +'<th>Est.<br>Revenues</th>'
          +'<th>Act.<br>Revenues</th>'
          +'<th>Diff.<br>Revenues</th>'
          
          +'<th>Diff. Total</th>'

          +'<th>Status</th>'
        +'</tr>';

      var list1=d.by_modul;
      var diff_expenses=0;
      var diff_revenues=0;
      var diff_=0;
      
      for (var x in list1) {
        diff_expenses+=list1[x].diff_expenses;
        diff_revenues+=list1[x].diff_revenues;
        diff_=Number(diff_revenues)-Number(diff_expenses)
        
        html+='<tr>'
        +'<td align="center">'+list1[x].phase_id+'</td>'
        +'<td align="center">'+list1[x].cost_id+'</td>'

        +'<td align="right">'+list1[x].est_units+'</td>'
        +'<td align="right">'+list1[x].act_units+'</td>'
        +'<td align="right">'+list1[x].diff_units+'</td>'
        
        +'<td align="right">'+list1[x].est_expenses+'</td>'
        +'<td align="right">'+list1[x].act_expenses+'</td>'
        +'<td align="right">'+list1[x].diff_expenses+'</td>'
        
        +'<td align="right">'+list1[x].est_revenues+'</td>'
        +'<td align="right">'+list1[x].act_revenues+'</td>'
        +'<td align="right">'+list1[x].diff_revenues+'</td>'
        
        +'<td align="right">'+diff_+'</td>'

        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="JobBalances.verify(\''+indek+'\''
          +',\''+list1[x].phase_id+'\''
          +',\''+list1[x].cost_id+'\')"'
          +'</button>'
          +'</td>'
        +'</tr>'
      }
      
      html+='<tr>'
        +'<td colspan="5" align="right"><b>Balance:</b></td>'
        +'<td colspan="3" align="right"><big>'+formatSerebuan(diff_expenses)+'</big></td>'
        +'<td colspan="3" align="right"><big>'+formatSerebuan(diff_revenues)+'</big></td>'
        +'<td align="right"><big>'+formatSerebuan(diff_)+'</big></td>'
        +'<td>#</td>'
        +'</tr>'
        +'</table></div>';
      
      content.html(indek,html);
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

JobBalances.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  JobBalances.formPaging(indek):
  JobBalances.formResult(indek);
}

JobBalances.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBalances.formSearch(indek));
  db3.search(indek,(paket)=>{
    JobBalances.readShow(indek);
  });
}

JobBalances.verify=(indek,phase_id,cost_id)=>{
  bingkai[indek].phase_id=phase_id;
  bingkai[indek].cost_id=cost_id;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{JobBalances.read(indek);});
  toolbar.back(indek,()=>JobBalances.formLast(indek));
  JobBalances.read(indek);
}

JobBalances.read=(indek)=>{
  var html='';
  db3.query(indek,JobBalances.url+'/read',{
    "job_id":bingkai[indek].job_id,
    "phase_id":bingkai[indek].phase_id,
    "cost_id":bingkai[indek].cost_id
  },(ironman)=>{
    var html;
    var d=ironman.data;
    if (ironman.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br />'
        +'<div'
          +' style="display:grid;'
          +'grid-template-columns:repeat(3,1fr);padding-bottom:20px;">'
          +'<div>'
            +'<ul>'
              +'<li><label style="width:3rem;">Job ID'
              +'</label>: '+d.job_id+'</li>'
              +'<li><label style="width:3rem;">Name'
              +'</label>: '+xHTML(d.job_name)+'</li>'
            +'</ul>'
          +'</div>'
          +'<div>'
            +'<ul>'
              +'<li><label style="width:5rem;">Phase ID'
              +'</label>: '+d.phase_id+'</li>'
              +'<li><label style="width:5rem;">Name'
              +'</label>: '+xHTML(d.phase_name)+'</li>'
            +'</ul>'
          +'</div>'
          +'<div>'
            +'<ul>'
              +'<li><label style="width:4rem;">Cost ID'
              +'</label>: '+d.cost_id+'</li>'
              +'<li><label style="width:4rem;">Name'
              +'</label>: '+xHTML(d.cost_name)+'</li>'
            +'</ul>'
          +'</div>'
        +'</div>'

        +'<table>'
        +'<tr>'
          +'<th>Est. Units</th>'
          +'<th>Est. Expenses</th>'
          +'<th>Est. Revenues</th>'
          +'<th>Act. Units</th>'
          +'<th>Act. Expenses</th>'
          +'<th>Act. Revenues</th>'
          
          +'<th>Modul ID</th>'
          +'<th>Action</th>'
        +'</tr>';

      var list1=d.by_modul;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="right">'+list1[x].est_units+'</td>'
        +'<td align="right">'+list1[x].est_expenses+'</td>'
        +'<td align="right">'+list1[x].est_revenues+'</td>'
        +'<td align="right">'+list1[x].act_units+'</td>'
        +'<td align="right">'+list1[x].act_expenses+'</td>'
        +'<td align="right">'+list1[x].act_revenues+'</td>'
        +'<td align="right">'+list1[x].modul_id+'</td>'
        +'<td align="center">'
          +'<input type="button" value="Verify"'
          +' onclick="VendorBalances.removeExecute(\''+indek+'\''
          +',\''+list1[x].modul_id+'\''
          +',\''+list1[x].blok_id+'\''
          +')">'
          +'</td>'
        +'</tr>'
      }
      
      html+='<tr>'
        +'<td colspan="8">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';

      content.html(indek,html);
    }else{
      content.infoPaket(indek,ironman);
    }
  });
}

JobBalances.removeExecute=(indek,modul_id,blok_id)=>{
  db3.deleteOne(indek,{
    "modul_id":modul_id,
    "blok_id":blok_id
  });
}

JobBalances.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>JobBalances.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBalances.formPaging(indek));
}

JobBalances.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  JobBalances.formResult(indek);
}

// eof:

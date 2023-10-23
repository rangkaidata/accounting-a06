/*
 * name: budiono
 * edit: sep-04, 20:01, mon-2023; new;251;
 */ 
 
'use strict';

var Periods={
  url:'period',
  title:'Accounting Period'
}

Periods.show=(karcis)=>{
  karcis.modul=Periods.url;
  karcis.menu.name=Periods.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newPeriods=new BingkaiUtama(karcis);
    const indek=newPeriods.show();
    Periods.formPaging(indek);
  }else{
    show(baru);
  }
}

Periods.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Periods.formCreate(indek);});
  toolbar.refresh(indek,()=>{Periods.formPaging(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Periods.readShow(indek);
  });
}

Periods.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html =''
    +'<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
  
  html+='<table border=1>'
    +'<th colspan="2">Period</th>'
    +'<th>Start Date</th>'
    +'<th>End Date</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th>Action</th>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="Periods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Periods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';    
        } else {
          html+= '<button type="button" '
          +' onclick="Periods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';   
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="Periods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
    
  var tipe='';
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="center">'+paket.data[x].period_id+'</td>'
        +'<td align="center">'
          +tglWest(paket.data[x].start_date)+'</td>'
        +'<td align="center">'
          +tglWest(paket.data[x].end_date)+'</td>'
      
        +'<td align="center">'
          +paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_delete" '
          +' onclick="Periods.formDelete(\''+indek+'\''
          +',\''+paket.data[x].period_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  
  html+='</table>'
    //+'<p><i>&#10020 Closing date berfungsi untuk mengunci semua '
    //+'akses transaksi berdasarkan tanggal.</i></p>'
    +'</div>';

  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Periods.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Periods.formPaging(indek);
}

Periods.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding: 0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'

    +'<ul>'
    +'<li><label>Period ID</label>: '
      +'<input type="text" id="period_id_'+indek+'" disabled>'
      +'</li>'

    +'<li><label>Start Date</label>: '
      +'<input type="date" id="start_date_'+indek+'" disabled hidden>'
      +'<input type="text" id="start_date2_'+indek+'" '
        +'disabled size="9">'
      +'</li>'

    +'<li><label>End Date</label>: '
      +'<input type="date" id="end_date_'+indek+'" '
        +' onblur="Periods.ngumpet('+indek+')">'
      +'<input type="text" id="end_date2_'+indek+'" size="9" '
        +' onfocus="Periods.muncul('+indek+')">'
      +'</li>'

    +'<li><label>Text</label>: '
      +'<input type="text" id="period_note_'+indek+'"></li>'

    +'</ul>'
    +'</form>'
    +'</div>';
    /*
    +'<p><i>&#10020 Closing date berfungsi untuk mengunci semua akses '
    +'transaksi berdasarkan tanggal.</i></p>';*/
  
  content.html(indek,html);
  document.getElementById('period_note_'+indek).focus()
  document.getElementById('end_date_'+indek).style.display="none";
}

Periods.muncul=(indek)=>{
  document.getElementById('end_date2_'+indek).style.display="none";
  document.getElementById('end_date_'+indek).style.display="inline";
  document.getElementById('end_date_'+indek).focus();
}

Periods.ngumpet=(indek)=>{
  document.getElementById('end_date_'+indek).style.display="none";
  document.getElementById('end_date2_'+indek).style.display="inline";
  document.getElementById('end_date2_'+indek).value=
  tglWest(document.getElementById('end_date_'+indek).value);
}

Periods.formCreate=(indek)=>{
  Periods.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  Periods.startDate(indek,()=>{
    toolbar.back(indek,()=>{Periods.formPaging(indek);});
    toolbar.save(indek,()=>{Periods.createExecute(indek);});
  });
}

Periods.createExecute=(indek)=>{
  /*const kode=tglWest(getEV("start_date_"+indek))+' to '
    +tglWest(getEV("end_date_"+indek));// 
  const kode2=getEV("end_date_"+indek);

  setEV("period_id_"+indek, kode2);*/
  db3.createOne(indek,{
    "period_id":getEV("period_id_"+indek),
    "end_date":getEV("end_date_"+indek),
    "period_note":getEV("period_note_"+indek)
  });
}

Periods.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "period_id":bingkai[indek].period_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d=paket.data;
      setEV('period_id_'+indek, d.period_id);
      setEV('start_date_'+indek, tglWest(d.start_date));
      setEV('start_date2_'+indek, tglWest(d.start_date));
      
      setEV('end_date_'+indek, d.end_date);
      setEV('end_date2_'+indek, tglWest(d.end_date));
      
      setEV('period_note_'+indek, d.period_note);
    }
    message.none(indek);
    return eop();
  });
}

Periods.startDate=(indek,eop)=>{
  message.wait(indek);
  db3.query(indek,'period/read_start',{},(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data;
      setEV('start_date_'+indek, d.start_date);
      setEV('start_date2_'+indek, tglWest(d.start_date));
      
      setEV('end_date_'+indek, d.start_date);
      setEV('end_date2_'+indek, tglWest(d.start_date));
      setEV('period_id_'+indek, "Period "+d.start_date);
    }else{
      setEV('start_date_'+indek, tglSekarang());
      setEV('period_id_'+indek, "Period ");
    }
    message.none(indek);
    return eop();
  });
}

Periods.formDelete=(indek,period_id)=>{
  bingkai[indek].period_id=period_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Periods.formEntry(indek,MODE_DELETE);
  Periods.readOne(indek,()=>{
    toolbar.back(indek,()=>{Periods.formPaging(indek);});
    toolbar.delet(indek,()=>{Periods.deleteExecute(indek);});
  });
}

Periods.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "period_id":bingkai[indek].period_id
  });
}
//eof: 251;

/*
 * name: budiono
 * date: sep-14, 16:34, thu-2023; new;
 */ 

'use strict';

var PayrollPeriods={
  url:'payroll_periods',
  title:'Payroll Periods'
}

PayrollPeriods.show=(karcis)=>{
  karcis.modul=PayrollPeriods.url;
  karcis.menu.name=PayrollPeriods.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newPeriods=new BingkaiUtama(karcis);
    const indek=newPeriods.show();
    EmployeeDefaults.getDefault(indek,()=>{
      bingkai[indek].pay_frequency=bingkai[indek].data_default.pay_frequency
      PayrollPeriods.formPaging(indek);
    });
  }else{
    show(baru);
  }
}

PayrollPeriods.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{PayrollPeriods.formCreate(indek);});
  toolbar.refresh(indek,()=>{PayrollPeriods.formPaging(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  const obj={
    "pay_frequency":bingkai[indek].pay_frequency
  }
  db3.readPaging2(indek,obj,(a)=>{
    PayrollPeriods.readShow(indek);
  });
}

PayrollPeriods.changePayFrequency=(indek)=>{
  bingkai[indek].pay_frequency=getEI('pay_frequency_'+indek);
  PayrollPeriods.formPaging(indek);
}

PayrollPeriods.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html =''
    +'<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>'
    
    +'<p><label>Frequency:</label>'
      +'<select id="pay_frequency_'+indek+'"'
      +' onchange="PayrollPeriods.changePayFrequency(\''+indek+'\')">'
      +getDataPayFrequency(indek)
      +'</select></p>'

  
  html+='<table border=1>'
    +'<th colspan="3">Period</th>'
    +'<th>Start Date</th>'
    +'<th>End Date</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th>Action</th>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="PayrollPeriods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="PayrollPeriods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';    
        } else {
          html+= '<button type="button" '
          +' onclick="PayrollPeriods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';   
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="PayrollPeriods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
    
  var tipe='';
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="center">'+array_pay_frequency[paket.data[x].pay_frequency]+'</td>'
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
          +' onclick="PayrollPeriods.formDelete(\''+indek+'\''
          +',\''+paket.data[x].pay_frequency+'\''
          +',\''+paket.data[x].period_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  
  html+='</table>'
//    +'<p><i>&#10020 Closing date berfungsi untuk mengunci semua '
//    +'akses transaksi berdasarkan tanggal.</i></p>'
    +'</div>';

  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
  
  setEI('pay_frequency_'+indek,bingkai[indek].pay_frequency);
}

PayrollPeriods.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  PayrollPeriods.formPaging(indek);
}

PayrollPeriods.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding: 0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'

    +'<ul>'
    +'<li><label>Period ID:</label>'
      +'<input type="text" '
      +'id="period_id_'+indek+'" disabled>'
      +'</li>'
      
    +'<li><label>Frequency:</label>'
      +'<select id="pay_frequency_'+indek+'"'
      +' onchange="PayrollPeriods.startDate(\''+indek+'\')">'
      +getDataPayFrequency(indek)
      +'</select></li>'

    +'<li><label>Start Date:</label>'
      +'<input type="date" id="start_date_'+indek+'" disabled hidden>'
      +'<input type="text" id="start_date2_'+indek+'" '
        +'disabled size="9">'
      +'</li>'

    +'<li><label>End Date:</label>'
      +'<input type="date" id="end_date_'+indek+'" '
        +' onblur="PayrollPeriods.ngumpet('+indek+')">'
      +'<input type="text" id="end_date2_'+indek+'" size="9" '
        +' onfocus="PayrollPeriods.muncul('+indek+')">'
      +'</li>'

    +'<li><label>Text:</label>'
      +'<input type="text" id="period_note_'+indek+'"></li>'

    +'</ul>'
    +'</form>';
    //+'<p><i>&#10020 Closing date berfungsi untuk mengunci semua akses '
    //+'transaksi berdasarkan tanggal.</i></p>';
  
  content.html(indek,html);
  document.getElementById('period_note_'+indek).focus()
  document.getElementById('end_date_'+indek).style.display="none";

}

PayrollPeriods.muncul=(indek)=>{
  document.getElementById('end_date2_'+indek).style.display="none";
  document.getElementById('end_date_'+indek).style.display="inline";
  document.getElementById('end_date_'+indek).focus();
}

PayrollPeriods.ngumpet=(indek)=>{
  document.getElementById('end_date_'+indek).style.display="none";
  document.getElementById('end_date2_'+indek).style.display="inline";
  setEV('end_date2_'+indek, tglWest(getEV('end_date_'+indek)) );
}

PayrollPeriods.formCreate=(indek)=>{
  PayrollPeriods.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{PayrollPeriods.formPaging(indek);});
  toolbar.save(indek,()=>{PayrollPeriods.createExecute(indek);});
  PayrollPeriods.setDefault(indek);
  PayrollPeriods.startDate(indek);
}

PayrollPeriods.setDefault=(indek)=>{
  setEV('pay_frequency_'+indek, bingkai[indek].pay_frequency);
}

PayrollPeriods.createExecute=(indek)=>{
  const kode=tglWest(getEV("start_date_"+indek))+' to '
    +tglWest(getEV("end_date_"+indek));// 
  const kode2=getEV("end_date_"+indek);

  setEV("period_id_"+indek, kode2);
  db3.createOne(indek,{
    "pay_frequency":getEI("pay_frequency_"+indek),
    "period_id":getEV("period_id_"+indek),
    "end_date":getEV("end_date_"+indek),
    "period_note":getEV("period_note_"+indek)
  });
  
  bingkai[indek].pay_frequency=getEI('pay_frequency_'+indek);
}

PayrollPeriods.startDate=(indek)=>{
  db3.query(indek,'payroll_periods/read_start',{
    'pay_frequency':getEV('pay_frequency_'+indek)
  },(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data;
      setEV('start_date_'+indek, d.start_date);
      setEV('start_date2_'+indek, tglWest(d.start_date));
      
      setEV('end_date_'+indek, d.start_date);
      setEV('end_date2_'+indek, tglWest(d.start_date));
    }else{
      setEV('start_date_'+indek, tglSekarang());
      message.infoPaket(indek,paket);
    }
  });
}

PayrollPeriods.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "pay_frequency":bingkai[indek].pay_frequency,
    "period_id":bingkai[indek].period_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d=paket.data;
      setEV('pay_frequency_'+indek, d.pay_frequency);
      setEV('period_id_'+indek, d.period_id);
      setEV('start_date_'+indek, tglWest(d.start_date));
      setEV('start_date2_'+indek, tglWest(d.start_date));
      
      setEV('end_date_'+indek, d.end_date);
      setEV('end_date2_'+indek, tglWest(d.end_date));
      
      setEV('period_note_'+indek, d.period_note);
    }
    message.none(indek);
    return callback();
  });
}

PayrollPeriods.formDelete=(indek,pay_frequency,period_id)=>{
  bingkai[indek].pay_frequency=pay_frequency;
  bingkai[indek].period_id=period_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  PayrollPeriods.formEntry(indek,MODE_DELETE);
  PayrollPeriods.readOne(indek,()=>{
    toolbar.back(indek,()=>{PayrollPeriods.formPaging(indek);});
    toolbar.delet(indek,()=>{PayrollPeriods.deleteExecute(indek);});
  });
}

PayrollPeriods.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "pay_frequency":bingkai[indek].pay_frequency,
    "period_id":bingkai[indek].period_id
  });
}

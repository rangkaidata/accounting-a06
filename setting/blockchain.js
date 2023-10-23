/*
 * auth: budiono
 * date: sep-04, 14:40, mon-2023; new;256;
 */

'use strict';

var Blockchain={}

Blockchain.show=(tiket)=>{
  tiket.modul='blocks';
  tiket.menu.name="Blockchain";

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Blockchain.formPaging(indek);
  }else{
    show(baru);
  }  
}

Blockchain.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>Blockchain.formSearch(indek));
  toolbar.refresh(indek,()=>Blockchain.formPaging(indek));
  toolbar.download(indek,()=>Blockchain.formExport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db1.readPaging(indek,()=>{
    Blockchain.readShow(indek);
  });
}

Blockchain.readShow=(indek)=>{
  const paket=bingkai[indek].paket;
  const metode=bingkai[indek].metode;

  var html;

  html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total : '+paket.count +' record.</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" '
        +' id="btn_first" '
        +' onclick="Blockchain.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (var x in paket.paging.pages) {
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Blockchain.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page+'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="Blockchain.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" '
        +' onclick="Blockchain.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1 width=100%>'
    +'<caption>&nbsp;</caption>'
    +'<tr>'
    +'<th style="display:none">Blok</th>'
    +'<th colspan="2">Hash</th>'
    +'<th>Modul</th>'
    +'<th>Metode</th>'
    +'<th>Index</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th>Detail</th>'
    +'</tr>';
  
  if (paket.err.id===0){
    for (x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td style="display:none">'+paket.data[x].blok+'</td>'
        +'<td align="center">'+blokID(paket.data[x].blok)+'</td>'
        +'<td align="center">'+paket.data[x].modul+'</td>'
        +'<td align="center">'+paket.data[x].metode+'</td>'
        +'<td align="center">'
          +Blockchain.display_err(paket.data[x].sukses)+'</td>'
      
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_created)+'</td>'
        +'<td><button type="button" '
          +' id="btn_detail" '
          +' onclick="Blockchain.readOne(\''+indek+'\''
          +',\''+paket.data[x].blok+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Blockchain.display_err=(txt)=>{
  if (txt==null){
    txt='<div '
    +' style="border-radius:10px;'
    +'background-color:yellow;color:red">err'
    +'</div>';
  }
  return txt;
}

Blockchain.gotoPage=(indek,ini)=>{
  bingkai[indek].page=ini;
  Blockchain.formPaging(indek);
}

Blockchain.readOne=(indek,block)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Blockchain.formLast(indek));

  db1.readOne(indek,{"block":block},(batman)=>{
    var html;
    
    if (batman.err.id===0){
      bingkai[indek].metode="View";
      bingkai[indek].md5=batman.data;
      
      const txt='<pre>'
        +JSON.stringify(JSON.parse(xHTML(batman.data.json)),undefined,2)
        +'</pre>';
        
      html='<div style="padding:0.5rem;"><ul>'
        +content.title(indek)
        +'<input type="button" value="MD5 sum"'
          +' onclick="Blockchain.md5CekSum(\''+indek+'\')">'
        +'<li><label>Hash</label>: '+blokID(batman.data.blok)+'</li>'
        +'<li><label>Date</label>: '+batman.data.date+'</li>'
        
        +'<li><label>Module</label>: '+batman.data.modul+'</li>'
        +'<li><label>Method</label>: '+batman.data.metode+'</li>'
        +'<li><label>User</label>: '+batman.data.user_name+'</li>'
        +'<li><label>Admin</label>: '+batman.data.admin_name+'</li>'
        +'<li><label>Timestamp</label>: '
          +batman.data.time_stamp+'</li>'
        +'<li><label>Previous Hash</label>: '
          +blokID(batman.data.previous_blok)+'</li>'
        +'<li><label>Randomize</label>: '+batman.data.randomize+'</li>'
        
        +'<li><label>Index</label>: '+batman.data.indeks+'</li>'
        +'<li><label>Status</label>: '
          +Blockchain.idxStatus(batman.data.indeks)+'</li>'
        
        +'<li><label>Data</label>:<br><i>'+txt+'</i></li>' 
        +'</ul>'
      html+='</div>';
      content.html(indek,html);
    }
  });
}

Blockchain.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Blockchain.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Blockchain.formPaging(indek));
}

Blockchain.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Blockchain.formResult(indek);
}

Blockchain.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Blockchain.formSearch(indek));
  db1.search(indek,()=>{
    Blockchain.readShow(indek);
  });
}

Blockchain.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Blockchain.formPaging(indek):
  Blockchain.formResult(indek);
}

Blockchain.idxStatus=(idx)=>{
  console.log(idx);
  if(idx==null){
    return '<strong style="color:red;">Error!</strong>';
  }else{
    return '<strong style="color:blue;">Success!</strong>';
  }
}

Blockchain.md5CekSum=(indek)=>{
  var md5_valid='';
  const data_mentah=bingkai[indek].md5;

  const hash=(data_mentah.modul
    +data_mentah.metode
    +data_mentah.user_name
    +data_mentah.admin_name
    +data_mentah.time_stamp
    +data_mentah.json
    +data_mentah.previous_blok);
    
  if(blokID(data_mentah.blok)==md5(hash)){
    md5_valid='--VALID--';
  }else{
    md5_valid='--NOT VALID--';
  }
  
  alert("Column Key:\n[Modul+Method+UserName+AdminName+Timestamp+RawData+PreviousHash]"
    +"\n\nData Blockchain:\n["+hash+']'
    +'\n\nHash MD5:\n['+md5(hash)+']'
    +'\n\nStatus:\n['+md5_valid+']');
}

Blockchain.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Blockchain.formPaging(indek));
  Blockchain.exportExecute(indek);
}

Blockchain.exportExecute=(indek)=>{
  db1.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'blockchains.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}
//eof: 256;

/*
 * auth: budiono
 * edit: sep-04, 20:40, mon-2023; new;247;
 * edit: sep-05, 10:33, tue-2023; add;260;
 * edit: sep-11, 15:38, mon-2023; 
 * edit: sep-12, 13:11, tue-2023;
 * edit: sep-13, 14:52, wed-2023; 
 * edit: sep-27, 13:48, wed-2023;
 * edit: oct-12, 10:08, thu-2023; str10;
 */

'use strict';

function pxRem(px) {// convert Pixel ToRem
  px=String(px).replace("px","");
  return Number(px) / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function exist(tiket){
  var adaBerapa=0;
  var baru=-1;
  
  for(var x=1;x<bingkai.length;x++){
    //console.log('a: '+bingkai[x].menu.id+'/'+tiket.menu.id);
    if(bingkai[x].menu.id==tiket.menu.id){
      //console.log('b: '+bingkai[x].company.id+'/'+tiket.company.id);
      if(bingkai[x].company.id==tiket.company.id){
        //console.log('c: '+bingkai[x].closed+'/'+0)
        if(bingkai[x].closed==0){
          if(tiket.baru==true){
            adaBerapa++;
            bingkai[x].berapa=adaBerapa;
          }
          if(tiket.baru==false){
            baru=x;
            return x;
          }
        }
      }
    }
  }
  return -1;
}

function hitungKembar(tiket){// bingkai_double
  var total=0;
  for(var x=0;x<bingkai.length;x++){
    if(bingkai[x].menu.id==tiket.menu.id){
      if(bingkai[x].closed==0){
        total++;
      }
    }
  }
  if(total==0){return ''}
  return '-['+total+']';  
}

function remPx(rem){
  return (rem * parseFloat(getComputedStyle(document.documentElement).fontSize))+'px';
}

function naikKeAtas(){
  var abc=event.srcElement;
  var idku;
  var obj_id;
  if(abc.tagName=="INPUT"){
    return;// segala jenis input tidak sebabkan keatas
  }
  while(abc) {
    idku=abc.id;
    if(idku.substring(0,4)=='frm_'){
      obj_id=getID(abc);
      ui.zindek++;
      document.getElementById('frm_'+obj_id).style.zIndex=ui.zindek;
      return;
    }
    abc=abc.parentElement;
    if(abc==null) return;
  }  
}

function getID(obj){
  const a=obj.getAttribute('id');
  const b=a.split("_");
  return (b[b.length-1]);
}

function hapus_px(px){
  return String(px).replace("px","");
}

function tglSekarangUpdate(){
  var n99=new Date();
  var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"
    , "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
  var hari99 = ["Minggu","Senin", "Selasa", "Rabu"
    , "Kamis", "Jumat", "Sabtu"];
  return hari99[n99.getDay()]
    +', '+bulan[parseInt(n99.getMonth())]
    +' '+n99.getDate()+' '+ n99.getHours()
    +':'+('0'+n99.getMinutes()).slice(-2);
}

function tglWest(tgl){
  if(tgl==undefined) return '';
  if(tgl=='')return '';
  var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"
    , "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
  return bulan[parseInt(tgl.substr(5,2))-1]+'-'+tgl.substr(8,2)
    +', '+tgl.substr(2,2) ;
}

function remPxn(rem){
  return (rem * parseFloat(
    getComputedStyle(document.documentElement).fontSize)
  );
}

function show(indek){
  global.klik=false;
  if(bingkai[indek].closed==1){
    alert('This menu is dead');
  }
  else{
    ui.zindek++;
    ui.disabledAllTab();
    document.getElementById('app_recent_'+indek).disabled=true;
    ui.gantiJudul(indek);
    ui.bingkai_aktif(indek);
    
    if(bingkai[indek].status==3){
      document.getElementById('frm_'+indek).style.left='0px';  
    }else{
      document.getElementById('frm_'+indek).style.left=ui.rm(bingkai[indek].letak.kiri)+'px';  
    }
    document.getElementById('frm_'+indek).style.display='inline';
    document.getElementById("frm_"+indek).style.zIndex=ui.zindek;
  }
}

function setEV(id,val){
  console.log(id+': '+val);
  document.getElementById(id).value=val;
}

function getEV(id){
  console.log(id);
  return document.getElementById(id).value;
}

function setEC(id,val){
  document.getElementById(id).checked=parseInt(val);
}

function getEC(id){
  return document.getElementById(id).checked;
}

function setEI(id,val){
  document.getElementById(id).selectedIndex=parseInt(val);
}

function getEI(id){
  return document.getElementById(id).selectedIndex;
}

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

function tglSekarang(){
  const n=new Date();
  const tglskrng=n.getFullYear()
    +"-"+("0"+parseInt(n.getMonth()+1)).slice(-2)
    +"-"+("0"+n.getDate()).slice(-2);
  return tglskrng;
}

function tglIna2(tgl){
  if(tgl=='')return '';
  var bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"
    , "Jul", "Agu", "Sep", "Okt", "Nop", "Des"];
  return tgl.substr(8,2)+'-'+bulan[parseInt(tgl.substr(5,2))-1]
    +'-'+tgl.substr(2,2) ;
}

function tglInt(tgl_int){
  if (tgl_int==undefined){
    return '';
  }
  tgl_int=Number(tgl_int);

  const dt=new Date(tgl_int);
  return dt.getDate()
    +'/'+(parseInt(dt.getMonth())+1)
    +'/'+dt.getFullYear()
    +' '+('0'+dt.getHours()).slice(-2)
    +':'+('0'+dt.getMinutes()).slice(-2)
    +':'+('0'+dt.getSeconds()).slice(-2);
}

function blokID(blok){
  if(blok==undefined || blok==''){
    return '';
  }

  var blokend = blok;
  var blokend3 = blokend.split("-");
  return blokend3[2];
}

function downloadJSON(indek, paket, filename) {
  var html='<div style="padding:0 1rem 0 1rem;">'
    +'<h1>'+MODE_EXPORT+'</h1>'
    +'Silakan klik tombol berikut untuk mengunduh file.<br>'
    +'<p><a href="" id="export_'+indek+'">Download</a></p>'
    +'</div>';
  content.html(indek,html);
      
  // Create a blob
  var blob = new Blob([paket], { type:'application/json;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  document.getElementById('export_'+indek).href=url;
  
  const a=document.getElementById('export_'+indek)
  a.setAttribute('download', filename);
}

function progressBar(indek,oNomer,jml,oMsg){
  if (oNomer===jml){// end of progress
    document.getElementById("msgImport_"+indek).innerHTML
    =oMsg+'<h4>End Proccess.</h4>';
    document.getElementById('btn_import_all_'+indek).disabled=false;
    toolbar.wait(indek,END);
    statusbar.ready(indek);
  }
  else{// still on progress
    document.getElementById("msgImport_"+indek).innerHTML
    =oMsg+'<h4>Please wait ... ['+oNomer+'/'+jml+']</h4>';
    statusbar.html(indek,(oNomer+'/'+jml));
  }  
}

function tHTML(str){
  if (typeof(str) == "string") {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
  }
  return str;
}

function xHTML(str){
  if (typeof(str) == "string") {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
  }
  return str;
}

function akses(i){
  let st="No Access";
  switch(Number(i)){
    case 0:st="No Access";break;
    case 1:st="Can Read";break;
    case 2:st="Can Create";break;
    case 3:st="Can Edit";break;
    case 4:st="Can Export";break;
  }
  return st;
}

function nmKolom(str){
  for(var i=0;i<data_fields.length;i++){
    if(data_fields[i][0]==str){
      return data_fields[i][1];
    }
  }
  return str+'?';
}

function getDataAccountClass(indek){
  var isi='';
  for(var i=0;i<array_account_class.length;i++){
    isi+="<option value="+i+">"+array_account_class[i]+'</option>'
  }
  return isi;
}

function getDataCostType(indek){
  var isi='';
  for(var i=0;i<array_cost_type.length;i++){
    isi+="<option value="+i+">"+array_cost_type[i]+'</option>'
  }
  return isi;
}

function getDataLocationType(indek){
  var isi='';
  for(var i=0;i<array_location_type.length;i++){
    isi+="<option value="+i+">"+array_location_type[i]+'</option>'
  }
  return isi;
}

function getCostMethod(indek){
  var isi='';
  for(var i=0;i<array_cost_method.length;i++){
    isi+="<option value="+i+">"+array_cost_method[i]+'</option>'
  }
  return isi;
}

function getItemClass(indek){
  var isi='';
  for(var i=0;i<default_item_class.length;i++){
    isi+="<option value="+i+">"+default_item_class[i]+'</option>'
  }
  return isi;
}

function getDataTermsType(indek){
  var isi='';
  for(var i=0;i<default_terms.length;i++){
    isi+="<option value="+i+">"+default_terms[i]+'</option>'
  }
  return isi;
}

function getDataPayFrequency(indek,pilih){
  var isi='';
  for(var i=0;i<array_pay_frequency.length;i++){
    if(pilih==i){
      isi+='<option value="+i+" selected="selected">'
        +array_pay_frequency[i]+'</option>'
    }else{
      isi+="<option value="+i+">"+array_pay_frequency[i]+'</option>'
    }
  }
  return isi;
}

function getDataFieldType(indek,pilih){
  var isi='';
  for(var i=0;i<array_field_type.length;i++){
    if(pilih==i){
      isi+='<option value="+i+" selected="selected">'
        +array_field_type[i]+'</option>'
    }else{
      isi+="<option value="+i+">"+array_field_type[i]+'</option>'
    }
  }
  return isi;
}

function getFormula(indek, pilih){
  var isi='';
  for(var i=0;i<array_formula.length;i++){
    if(pilih==i){
      isi+='<option value="+i+" selected="selected">'
        +array_formula[i]+'</option>'
    }else{
      isi+="<option value="+i+">"+array_formula[i]+'</option>'
    }
  }
  return isi;
}

function getEmployeeClass(indek){
  var isi='';
  for(var i=0;i<array_employee_class.length;i++){
    isi+="<option value="+i+">"+array_employee_class[i]+'</option>'
  }
  return isi;
}

function getEmployeeFillingStatus(indek){
  var isi='';
  for(var i=0;i<array_employee_filling_status.length;i++){
    isi+="<option value="+i+">"
      +array_employee_filling_status[i]+'</option>'
  }
  return isi;  
}

function getEmployeePayMethod(indek){
  var isi='';
  for(var i=0;i<array_employee_pay_method.length;i++){
    isi+="<option value="+i+">"+array_employee_pay_method[i]+'</option>'
  }
  return isi;  
}

function binerToBool(n){
  if(Number(n)==0){
    return '';
  }else{
    return 'Yes';
  }
}

function setEO(id,val){
  document.getElementById(id).open=val;
}

function setEH(o,v){
  document.getElementById(o).innerHTML=v;
}

function formatSerebuan(num) {
  var balikin='&nbsp;';
  if (num===undefined){return balikin}
  if (num===null){return balikin}
  if (num===0){return balikin}
  if (num==='0'){return balikin}
  if (num==='0.00'){return balikin}
  if (num===''){return balikin}
  if (num<0){
      // bila nilai minus, menggunakan tanda kurung.
      /* 
      num = parseFloat(num)*-1;
    return "("+num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')+")";
    */
    num = parseFloat(num);
    return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); 
  }else{
      num = parseFloat(num);
    return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}

function getDataUserLevel(indek,pilih){
  var isi='';
  for(var i=0;i<array_user_level.length;i++){
    isi+="<option value="+i+">"+array_user_level[i]+'</option>'
  }
  return isi;
}

function resetCode(blok){
  if(blok==undefined || blok==''){
    return '';
  }

  var blokend = blok;
  var blokend3 = blokend.split("-");
  return blokend3[1];
}

function str10(str){
  str=(str).replaceAll('\n',' ');
  str=str.slice(0,10);
  
  if(str.length>9)str+='...';
  return str;
}
// eof: 247;260;

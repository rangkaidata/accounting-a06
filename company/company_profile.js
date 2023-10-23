/*
 * auth: budiono
 * date: sep-05, 11:18, tue-2023; new;87;
 * edit: sep-17, 08:27, sun-2023; xHTML;
 */

'use strict';

var CompanyProfile={
  url:'company_info',
  title:"Company Information"
}

CompanyProfile.show=(tiket)=>{
  tiket.modul=CompanyProfile.url;
  tiket.menu.name=CompanyProfile.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    CompanyProfile.formView(indek);
  }else{
    show(baru);
  }  
}

CompanyProfile.formView=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  CompanyProfile.readOne(indek,()=>{
    toolbar.refresh(indek,()=>CompanyProfile.readOne(indek,()=>{}));
  });
}

CompanyProfile.readOne=(indek,eop)=>{
  bingkai[indek].metode='View';
  var html='<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
  content.html(indek,html);

  db3.readOne(indek,{},(ironman)=>{
    if (ironman.err.id==0) {
      const d=ironman.data;
      const a=d.company_address;
      const html=''
        +'<div style="padding:0 1rem 0 1rem;">'
        +content.title(indek)
        
      +'<div style="display:grid;'
      +'grid-template-columns: repeat(2,1fr);">'
        +'<div>'
          +'<ul>'
          +'<li><label>Company Name</label>: '
            +xHTML(d.company_name)+'</li>'
          +'<li><label>Address</label>: '
            +xHTML(a.street_1)+'</li>'
          +'<li><label>&nbsp;</label>: '
            +xHTML(a.street_2)+'</li>'
          +'<li><label>&nbsp;</label>: '
            +xHTML(a.country)+'</li>'
          +'<li><label>&nbsp;</label>: '
            +xHTML(a.city)+'</li>'
          +'<li><label>&nbsp;</label>: '
            +xHTML(a.state)+'</li>'
          +'<li><label>&nbsp;</label>: '
            +xHTML(a.zip)+'</li>'
          +'<li><label>Phone</label>: '
            +xHTML(d.company_phone)+'</li>'
          +'<li><label>Fax</label>: '
            +xHTML(d.company_fax)+'</li>'
          +'<li><label>Email</label>: '
            +xHTML(d.company_email)+'</li>'
          +'<li><label>Website</label>: '
            +xHTML(d.company_website)+'</li>'
          +'<li><label>Start Date</label>: '
            +tglIna2(d.company_sdate)+'</li>'
          +'</ul>'
        +'</div>'
        +'<div>'
          +'<ul>'
          +'<li><p><img '
            +' id="folder_image_'+indek+'" '
            +' width="200" height="200" '
            +' src='+bingkai[0].server.image+"uploads/no_image.jpg"+'/>'
            +'</p>'
          +'<input type="text" id="name_image_'+indek+'"'
            +' value="no_image.jpg" disabled class="b-text" hidden>' 
          +'</li>'
          +'</ul>'
        +'</div>'
      +'</div>';

      content.html(indek,html);
      document.getElementById("folder_image_"+indek).src
      =bingkai[0].server.image+"uploads/"+ironman.data.company_logo;
      document.getElementById("name_image_"+indek).value
      =ironman.data.company_logo;
      
      // message.none(indek);
      return eop();
    }    
  });
}
//eof: 87;105;

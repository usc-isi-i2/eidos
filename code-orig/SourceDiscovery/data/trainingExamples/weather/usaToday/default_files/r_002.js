var ANUT=1;
var ANOO=0;
var ANCCT=1187729768;
var ANSEE;

if (ANSEE != null)
{
    ANRTXR();
}
else
{
    var c=ANRC('T3CK');
    if (c!=null) {
       var f=c.split("|");
       var t=o=0;
       for (var i=0;i<f.length;i++) {
          if(f[i].indexOf('TANT=')>=0) {
             f[i]='TANT='+ANUT;
             t=1;
          }
          if(f[i].indexOf('TANO=')>=0) {
             f[i]='TANO='+ANOO;
             o=1;
          }
       }
       c=f.join("|");
       if (t==0) {
          c+='|TANT='+ANUT;
       }
       if (o==0) {
          c+='|TANO='+ANOO;
       }
    } else {
       c='TANT='+ANUT+'|TANO='+ANOO;
    }
    ANSC("T3CK",c,4*365*24*60*60*1000,"/");
}

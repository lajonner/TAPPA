function getVars(document){
   var loc = document.location.href;
   var locParts=loc.split('?');
   var get = {};
   if (locParts.length>1){
     var getString = locParts[1];
     var GET = getString.split('&');
     for(var i = 0, l = GET.length; i < l; i++){
        var tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
     }   
   }
   return get;
}

(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NightShiftLogic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const solutions={
    "0":{layer:"character",action:"visitor"},
    "1":{cause:"cloak",action:"both"},
    "2":{reason:"coordinates",action:"keep"},
    "3":{victim:"robots",action:"metadata"},
    "4":{proof:"method",action:"method-only"},
    "5a":{rule:"insufficient"},
    "5b":{reason:"authorization",action:"limit"},
    "6":{origin:"2025",carrier:"方立",target:"S-6459",alias:"X-3467",action:"separate"},
    "7":{reason:"different",action:"sample"},
    "8":{meaning:"conditional",action:"separate"},
    "9":{record:"external",action:"hold"},
    "10":{mix:"open",route:"hold"}
  };
  function valid(key,data){
    const expected=solutions[key];
    return !!expected&&Object.entries(expected).every(([name,value])=>String(data[name]??"").trim().toUpperCase()===value.toUpperCase());
  }
  return {solutions,valid};
});

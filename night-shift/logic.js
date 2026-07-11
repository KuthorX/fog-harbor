(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NightShiftLogic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const solutions={
    "0":{layer:"character",disposition:"visitor"},
    "1":{before:"recording",current:"cache",archive:"parallel"},
    "2":{station:"N-17",projection:"D-XXXX",archive:"keep"},
    "3":{casualty:"non-k1647",public:"frequency",private:"local"},
    "4":{method:"timer",operator:"unknown"},
    "5a":{rule:"证据不足时，保留未填写字段。",scope:"evidence"},
    "5b":{scope:"evidence",branches:"open"},
    "6":{origin:"2025",carrier:"方立",target:"S-6459",alias:"X-3467",action:"separate"},
    "7":{sample:"29",element:"Cu",wavelength:"510",source:"unknown"},
    "8":{blood:"unknown",projection:"cost",tavern:"labor"},
    "9":{statement:"missing",route:"hold"},
    "10":{c0321:"open",room3702:"open",s6459:"open",route:"hold"}
  };
  function valid(key,data){
    const expected=solutions[key];
    return !!expected&&Object.entries(expected).every(([name,value])=>String(data[name]??"").trim().toUpperCase()===value.toUpperCase());
  }
  return {solutions,valid};
});

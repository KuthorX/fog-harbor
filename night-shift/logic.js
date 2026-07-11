(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.NightShiftLogic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const solutions={
    "0":{layer:"有机角色",disposition:"登记访客"},
    "1":{before:"recording",current:"cache",archive:"parallel"},
    "2":{station:"N-17",projection:"D-XXXX",archive:"keep"},
    "3":{casualty:"非 K-1647 机器人",public:"frequency",private:"local"},
    "4":{method:"本地延时开启",operator:"",override:"yes"},
    "5a":{rule:"证据不足时，保留未填写字段。",scope:"案件证据字段"},
    "5b":{limit:"yes",branches:"open"},
    "6":{origin:"2025",carrier:"方立",target:"S-6459",alias:"X-3467"},
    "7":{sample:"29",element:"Cu",wavelength:"510",source:""},
    "8":{blood:"来源待查",projection:"独立成本",tavern:"劳动项目"},
    "9":{statement:"missing",route:"hold"},
    "10":{c0321:"open",room3702:"open",s6459:"open",route:"hold"}
  };
  function valid(key,data){
    const expected=solutions[key];
    return !!expected&&Object.entries(expected).every(([name,value])=>String(data[name]??"").trim().toUpperCase()===value.toUpperCase());
  }
  return {solutions,valid};
});

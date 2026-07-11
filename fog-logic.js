(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.FogLogic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const answers={album:"8010111",lab:"echo",case98:"qsl98516",sw:"零点之后别回头",carrier:"4597"};
  const review=["徐玲","2350","2714","0108"];
  function matches(name,value){return String(value??"").trim().toLowerCase()===answers[name].toLowerCase()}
  function reviewMatches(values){return review.every((value,index)=>String(values[index]??"").trim()===value)}
  function projectionMatches(value){return Math.abs(Number(value)-546.1)<=1}
  return {answers,review,matches,reviewMatches,projectionMatches};
});

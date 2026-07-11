const assert=require("node:assert/strict");
const {solutions,valid}=require("./logic.js");

assert.equal(Object.keys(solutions).length,12);
for(const [key,answer] of Object.entries(solutions)){
  assert.equal(valid(key,answer),true,`${key} should accept its documented evidence result`);
  const [first]=Object.keys(answer);
  assert.equal(valid(key,{...answer,[first]:"wrong"}),false,`${key} should reject a contradictory field`);
}
assert.equal(valid("missing",{}),false);
console.log("night-shift logic: 12 decision contracts passed");

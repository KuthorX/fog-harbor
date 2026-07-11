const assert=require("node:assert/strict");
const logic=require("./fog-logic.js");

for(const [name,answer] of Object.entries(logic.answers)){
  assert.equal(logic.matches(name,answer),true,`${name} should accept its evidence-derived value`);
  assert.equal(logic.matches(name,`${answer}x`),false,`${name} should reject a near miss`);
}
assert.equal(logic.reviewMatches(logic.review),true);
assert.equal(logic.reviewMatches(["许宁","2350","2714","0108"]),false);
assert.equal(logic.projectionMatches("546.1"),true);
assert.equal(logic.projectionMatches("585.2"),false);
console.log("fog-harbor logic: 7 puzzle contracts passed");

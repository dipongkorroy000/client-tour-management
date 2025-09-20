// new Promise((resolve, reject) => resolve()).then(() => console.log("resolved")).catch(() => console.log("rejected"));
// new Promise((resolve, reject) => reject()).then(() => console.log("resolved")).catch(() => console.log("rejected"));

// more example -----
let savedResolve, savedReject;

const myPromise = new Promise((resolve, reject) => {
  savedResolve = resolve;
  savedReject = reject;
});

// savedResolve("This sentence is resolved")

myPromise.then((value) => console.log("Promise Resolved: ", value)).catch((err) => console.log("Promise Rejected: ", err));

// savedReject("This sentence is rejected");

// time add because promise will be late --------

setTimeout(() => {
  // savedReject("This sentence is rejected");
  savedResolve("This sentence is resolved");
}, 3000);

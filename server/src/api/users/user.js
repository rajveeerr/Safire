const express = require('express');

const router = express.Router();

router.post('/hide-user', (req, res) => {//-> {name: string, userId: ""} // userId is an unique identifer to correctly identify and hide user
  
});

// router.post('/report-user', (req, res) => {//this will fetch generated user report for the user and then we will send it to cyberhelpline
  
// });

router.get('/hidden-users', (req, res) => { 
  
});
router.post('/blacklist-keywords', (req, res) => { //-> {blacklist-keywords: ["","",""]}
  
});
router.get('/blacklisted-keywords', (req, res) => { 
  
});
router.get('/unhide', (req, res) => { //-> {name: string, userId: ""}
  
});
router.post('/generate-report', (req, res) => {//-> {screenshotUrl:"",userName:"",notes: "",time:"",platform:"",userProfileDetails:{},}
  
});
router.post('/save-screenshots', (req, res) => {//-> {screenshotUrl:"",time:""}
  
});
router.get('/saved-reports', (req, res) => {
  
});
router.get('/saved-screenshots', (req, res) => { 
  
});
router.get('/preferences',(req,res)=>{//payload: {auto-generate-report: bool, autoSave-harasment-screenshots: bool, trustedContacts: [{name:string, email: }],tags-for-harraser: bool}

})
router.get('/total-hidden-messages',(req,res)=>{ // update the total blocked messages by 1

})

module.exports = router;

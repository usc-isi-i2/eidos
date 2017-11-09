//Customer: ** SAMPLE TEST CODE  ** NOT FOR PRODUCTION
//Version: ForeseeTrigger 1.0x

/** INITIAL SETUP **/
try {
//OE-Mode
if (triggerParms["oeMode"] == 1) {fsrSetCookie('currentURL', window.location.href, null, '/' , triggerParms["domain"]);}
//MultiMeasure Plugin
if (triggerParms["multiMeasPlugin"] == 1) {fsrInitLiftMeasure(fsrMeasId);}
//if (triggerParms["multiMeasPlugin"] == 1) {fsrInitMeasure(fsrMeasId);}
} catch (e) {/*ignore any exception*/}

/** SHOW SURVEY **/
fsrPoll();	//must show survey if argument=true
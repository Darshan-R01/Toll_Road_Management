const { pathToRegexp } = require('path-to-regexp');
try { console.log("Testing '*catchAll' :", !!pathToRegexp('/*catchAll')); } catch(e) { console.log("Failed:", e.message); }

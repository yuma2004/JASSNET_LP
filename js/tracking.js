/* ==========================================================================
   Conversion and Tracking Scripts
   ========================================================================== */

// LINE Conversion Script
function convert_pi13rxti093l() {
  const PMTV = "pi13rxti093l";
  const LPU = "https://lin.ee/jlmVHob";
  const ATTRN = "href";
  const OPSL = ["^=", "=", "*="];
  const OPSV = 0;
  const location_url = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&scope=profile&state=false";
  const client_id = "2007368041";
  const redirect_uri = "https://jass-net.com/lineCallBack.php?p=" + PMTV + "&cid=";
  
  const cookies = document.cookie.split("; ");
  let cidv = "";
  
  // Check cookies for CID
  for (let i = 0; i < cookies.length; i++) {
    const cookieData = cookies[i].split("=");
    if (cookieData[0] === "CL_" + PMTV && cookieData[1].length > 1) {
      cidv = cookieData[1];
      break;
    }
  }
  
  // Check localStorage if not found in cookies
  if (!cidv && localStorage.getItem("CL_" + PMTV)) {
    cidv = localStorage.getItem("CL_" + PMTV);
  }
  
  // Update LINE links if CID is found
  if (cidv) {
    const nodeList = document.querySelectorAll(`[${ATTRN}${OPSL[OPSV]}"${LPU}"]`);
    const nodes = Array.prototype.slice.call(nodeList, 0);
    const convertUrl = location_url + "&client_id=" + client_id + "&redirect_uri=" + encodeURIComponent(redirect_uri + cidv);
    
    nodes.forEach(function(elem) {
      elem.setAttribute(ATTRN, convertUrl);
    });
  }
}

// Initialize conversion script
if (typeof window.acs_cbs !== "undefined") {
  window.acs_cbs.push(convert_pi13rxti093l);
} else if (document.readyState !== "loading") {
  convert_pi13rxti093l();
} else {
  document.addEventListener("DOMContentLoaded", convert_pi13rxti093l);
}

// Advanced Tracking System
(function acsKeep() {
  if (typeof window.acs_cbs === "undefined") window.acs_cbs = [];
  
  const LKEYS = { "u": 1, "c": 1, "c1": 1, "c2": 1, "c3": 1, "c4": 1, "c5": 1, "p": 1 };
  const DKEYS = ["u", "c", "c1", "c2", "c3", "c4", "c5"];
  const IMK = "access_acs_im";
  const PK = "p";
  const durl = "https://fj.access-squid.com/acs";
  
  function saveCookies(data) {
    const DKEY = "Jass_" + (new Date()).getTime() + "_" + Math.random();
    const out = Object.keys(LKEYS).reduce(function(ret, k) {
      if (k in data) {
        ret[k] = data[k];
      }
      return ret;
    }, {});
    
    Object.keys(out).forEach(function(k) {
      const cookieName = "CL_" + out[k];
      document.cookie = cookieName + "=" + DKEY + "; path=/; domain=.jass-net.com; secure; SameSite=Lax";
      localStorage.setItem(cookieName, DKEY);
    });
    
    if (Object.keys(out).length === 0) return;
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", durl + "/save", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onloadend = function() {
      if (xhr.status === 200) {
        window.acs_cbs.forEach(function(cb) { cb(); });
      } else {
        console.warn('Tracking save failed:', xhr.status);
      }
      Object.keys(out).forEach(function(k) {
        const cookieName = "CL_" + out[k];
        document.cookie = cookieName + "=" + DKEY + "; path=/; domain=.jass-net.com; secure; SameSite=Lax";
        localStorage.setItem(cookieName, DKEY);
      });
      window.acs_cbs.forEach(function(cb) { cb(); });
    };
    
    xhr.send(JSON.stringify({ key: DKEY, data: out }));
  }
  
  // Parse URL parameters
  const data = location.search.substring(1).split("&").reduce(function(ret, s) {
    const kv = s.split("=");
    if (kv[1]) ret[kv[0]] = kv[1];
    return ret;
  }, {});
  
  if (!(IMK in data)) {
    saveCookies(data);
    return;
  }
  
  let directUrl = durl + "?im=" + data[IMK] + "&navi=" + performance.navigation.type;
  DKEYS.forEach(function(k) {
    if (!(k in data)) return;
    directUrl += "&" + k + "=" + data[k];
  });
  
  const xhr = new XMLHttpRequest();
  xhr.open("GET", directUrl);
  
  function merge(a, b) {
    return Object.keys(LKEYS).reduce(function(ret, k) {
      if (k in b && !(k in a)) ret[k] = b[k];
      return ret;
    }, a);
  }
  
  xhr.onloadend = function() {
    if (xhr.status !== 200) return;
    try {
      let xhrData = JSON.parse(xhr.responseText);
      if (PK !== "p") {
        xhrData[PK] = xhrData["p"];
      }
      saveCookies(merge(xhrData, data));
    } catch (e) {
      console.error('Error parsing tracking data:', e);
    }
  };
  
  xhr.send();
})();

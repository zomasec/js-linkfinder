javascript:(function(){var scripts=document.getElementsByTagName("script"),regex=/(?<=(\"|\%27|\`))\/[a-zA-Z0-9_?&=\/\-\#\.]*(?=(\"|\'|\%60))/g,jsRegex=/(?<=(\"|\'|\%60))(?:\/|https?:\/\/)[a-zA-Z0-9_?&=\/\-\#\.]+\.js(?:\?[^"'%60]*)?(?=(\"|\'|\%60))/g;const results=new Set,paramMap=new Map,jsFiles=new Set;function processContent(t,src){var e=t.matchAll(regex);for(let r of e){results.add(r[0]);var params=r[0].split('?')[1];params&&params.split('&').forEach(param=>{var[key,]=param.split('=');key&&(paramMap.has(key)||paramMap.set(key,[]),paramMap.get(key).push(src||'Inline script or HTML'))})}var j=t.matchAll(jsRegex);for(let r of j)jsFiles.add(r[0])}for(var i=0;i<scripts.length;i++){var t=scripts[i].src;t?(jsFiles.add(t),fetch(t).then(function(t){return t.text()}).then(text=>processContent(text,t)).catch(function(t){console.log("An error occurred: ",t)})):processContent(scripts[i].textContent)}var pageContent=document.documentElement.outerHTML;processContent(pageContent,'Page content');function writeResults(){var w=window.open('','_blank');w.document.write('<html><head><title>Scan Results</title><style>body{font-family:Arial,sans-serif;background:#f0f8ff;color:#333;padding:20px;} h2{color:#4a69bd;} .result{background:#fff;margin-bottom:10px;padding:10px;border-left:5px solid #4a69bd;} a{color:#4a69bd;text-decoration:none;word-break:break-all;}</style></head><body>');w.document.write("<h2>Endpoints Found: "+results.size+"</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;'>"+Array.from(results).map(endpoint=>{var fullUrl=endpoint.startsWith("http")?endpoint:window.location.origin+endpoint;return"<div class='result'>"+endpoint+"</div><div class='result'><a href='"+fullUrl+"' target='_blank'>"+fullUrl+"</a></div>"}).join("")+"</div>");w.document.write("<h2>Parameters Found:</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;'>");paramMap.forEach((sources,param)=>{w.document.write("<div class='result'>"+param+"</div><div class='result'>"+sources.join('<br>')+"</div>")});w.document.write("</div><h2>JS Files Found: "+jsFiles.size+"</h2><div style='display:grid;grid-template-columns:1fr;gap:10px;'>");jsFiles.forEach(file=>{var fullUrl=file.startsWith("http")?file:window.location.origin+file;w.document.write("<div class='result'><a href='"+fullUrl+"' target='_blank'>"+file+"</a></div>")});w.document.write("</div></body></html>");w.document.close()}setTimeout(writeResults,3000)})();
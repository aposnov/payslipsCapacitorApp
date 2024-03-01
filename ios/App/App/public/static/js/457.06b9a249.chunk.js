"use strict";(self.webpackChunkcapacitor_app=self.webpackChunkcapacitor_app||[]).push([[457],{457:(t,e,i)=>{i.r(e),i.d(e,{FilesystemWeb:()=>s});var r=i(403),o=i(825);function a(t){const e=t.split("/").filter((t=>"."!==t)),i=[];return e.forEach((t=>{".."===t&&i.length>0&&".."!==i[i.length-1]?i.pop():i.push(t)})),i.join("/")}class s extends r.E_{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"],this.downloadFile=async t=>{var e,i;const o=(0,r.EA)(t,t.webFetchExtra),a=await fetch(t.url,o);let s;if(t.progress)if(null===a||void 0===a?void 0:a.body){const e=a.body.getReader();let i=0;const r=[],o=a.headers.get("content-type"),n=parseInt(a.headers.get("content-length")||"0",10);for(;;){const{done:o,value:a}=await e.read();if(o)break;r.push(a),i+=(null===a||void 0===a?void 0:a.length)||0;const s={url:t.url,bytes:i,contentLength:n};this.notifyListeners("progress",s)}const c=new Uint8Array(i);let d=0;for(const t of r)"undefined"!==typeof t&&(c.set(t,d),d+=t.length);s=new Blob([c.buffer],{type:o||void 0})}else s=new Blob;else s=await a.blob();return{path:(await this.writeFile({path:t.path,directory:null!==(e=t.directory)&&void 0!==e?e:void 0,recursive:null!==(i=t.recursive)&&void 0!==i&&i,data:s})).uri,blob:s}}}async initDb(){if(void 0!==this._db)return this._db;if(!("indexedDB"in window))throw this.unavailable("This browser doesn't support IndexedDB");return new Promise(((t,e)=>{const i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onupgradeneeded=s.doUpgrade,i.onsuccess=()=>{this._db=i.result,t(i.result)},i.onerror=()=>e(i.error),i.onblocked=()=>{console.warn("db blocked")}}))}static doUpgrade(t){const e=t.target.result;t.oldVersion;e.objectStoreNames.contains("FileStorage")&&e.deleteObjectStore("FileStorage");e.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}async dbRequest(t,e){const i=-1!==this._writeCmds.indexOf(t)?"readwrite":"readonly";return this.initDb().then((r=>new Promise(((o,a)=>{const s=r.transaction(["FileStorage"],i).objectStore("FileStorage")[t](...e);s.onsuccess=()=>o(s.result),s.onerror=()=>a(s.error)}))))}async dbIndexRequest(t,e,i){const r=-1!==this._writeCmds.indexOf(e)?"readwrite":"readonly";return this.initDb().then((o=>new Promise(((a,s)=>{const n=o.transaction(["FileStorage"],r).objectStore("FileStorage").index(t)[e](...i);n.onsuccess=()=>a(n.result),n.onerror=()=>s(n.error)}))))}getPath(t,e){const i=void 0!==e?e.replace(/^[/]+|[/]+$/g,""):"";let r="";return void 0!==t&&(r+="/"+t),""!==e&&(r+="/"+i),r}async clear(){(await this.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()}async readFile(t){const e=this.getPath(t.directory,t.path),i=await this.dbRequest("get",[e]);if(void 0===i)throw Error("File does not exist.");return{data:i.content?i.content:""}}async writeFile(t){const e=this.getPath(t.directory,t.path);let i=t.data;const r=t.encoding,o=t.recursive,a=await this.dbRequest("get",[e]);if(a&&"directory"===a.type)throw Error("The supplied path is a directory.");const s=e.substr(0,e.lastIndexOf("/"));if(void 0===await this.dbRequest("get",[s])){const e=s.indexOf("/",1);if(-1!==e){const i=s.substr(e);await this.mkdir({path:i,directory:t.directory,recursive:o})}}if(!r&&!(i instanceof Blob)&&(i=i.indexOf(",")>=0?i.split(",")[1]:i,!this.isBase64String(i)))throw Error("The supplied data is not valid base64 content.");const n=Date.now(),c={path:e,folder:s,type:"file",size:i instanceof Blob?i.size:i.length,ctime:n,mtime:n,content:i};return await this.dbRequest("put",[c]),{uri:c.path}}async appendFile(t){const e=this.getPath(t.directory,t.path);let i=t.data;const r=t.encoding,o=e.substr(0,e.lastIndexOf("/")),a=Date.now();let s=a;const n=await this.dbRequest("get",[e]);if(n&&"directory"===n.type)throw Error("The supplied path is a directory.");if(void 0===await this.dbRequest("get",[o])){const e=o.indexOf("/",1);if(-1!==e){const i=o.substr(e);await this.mkdir({path:i,directory:t.directory,recursive:!0})}}if(!r&&!this.isBase64String(i))throw Error("The supplied data is not valid base64 content.");if(void 0!==n){if(n.content instanceof Blob)throw Error("The occupied entry contains a Blob object which cannot be appended to.");i=void 0===n.content||r?n.content+i:btoa(atob(n.content)+atob(i)),s=n.ctime}const c={path:e,folder:o,type:"file",size:i.length,ctime:s,mtime:a,content:i};await this.dbRequest("put",[c])}async deleteFile(t){const e=this.getPath(t.directory,t.path);if(void 0===await this.dbRequest("get",[e]))throw Error("File does not exist.");if(0!==(await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).length)throw Error("Folder is not empty.");await this.dbRequest("delete",[e])}async mkdir(t){const e=this.getPath(t.directory,t.path),i=t.recursive,r=e.substr(0,e.lastIndexOf("/")),o=(e.match(/\//g)||[]).length,a=await this.dbRequest("get",[r]),s=await this.dbRequest("get",[e]);if(1===o)throw Error("Cannot create Root directory");if(void 0!==s)throw Error("Current directory does already exist.");if(!i&&2!==o&&void 0===a)throw Error("Parent directory must exist");if(i&&2!==o&&void 0===a){const e=r.substr(r.indexOf("/",1));await this.mkdir({path:e,directory:t.directory,recursive:i})}const n=Date.now(),c={path:e,folder:r,type:"directory",size:0,ctime:n,mtime:n};await this.dbRequest("put",[c])}async rmdir(t){const{path:e,directory:i,recursive:r}=t,o=this.getPath(i,e),a=await this.dbRequest("get",[o]);if(void 0===a)throw Error("Folder does not exist.");if("directory"!==a.type)throw Error("Requested path is not a directory");const s=await this.readdir({path:e,directory:i});if(0!==s.files.length&&!r)throw Error("Folder is not empty");for(const n of s.files){const t="".concat(e,"/").concat(n.name);"file"===(await this.stat({path:t,directory:i})).type?await this.deleteFile({path:t,directory:i}):await this.rmdir({path:t,directory:i,recursive:r})}await this.dbRequest("delete",[o])}async readdir(t){const e=this.getPath(t.directory,t.path),i=await this.dbRequest("get",[e]);if(""!==t.path&&void 0===i)throw Error("Folder does not exist.");const r=await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)]);return{files:await Promise.all(r.map((async t=>{let i=await this.dbRequest("get",[t]);return void 0===i&&(i=await this.dbRequest("get",[t+"/"])),{name:t.substring(e.length+1),type:i.type,size:i.size,ctime:i.ctime,mtime:i.mtime,uri:i.path}})))}}async getUri(t){const e=this.getPath(t.directory,t.path);let i=await this.dbRequest("get",[e]);return void 0===i&&(i=await this.dbRequest("get",[e+"/"])),{uri:(null===i||void 0===i?void 0:i.path)||e}}async stat(t){const e=this.getPath(t.directory,t.path);let i=await this.dbRequest("get",[e]);if(void 0===i&&(i=await this.dbRequest("get",[e+"/"])),void 0===i)throw Error("Entry does not exist.");return{type:i.type,size:i.size,ctime:i.ctime,mtime:i.mtime,uri:i.path}}async rename(t){await this._copy(t,!0)}async copy(t){return this._copy(t,!1)}async requestPermissions(){return{publicStorage:"granted"}}async checkPermissions(){return{publicStorage:"granted"}}async _copy(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],{toDirectory:i}=t;const{to:r,from:s,directory:n}=t;if(!r||!s)throw Error("Both to and from must be provided");i||(i=n);const c=this.getPath(n,s),d=this.getPath(i,r);if(c===d)return{uri:d};if(function(t,e){t=a(t),e=a(e);const i=t.split("/"),r=e.split("/");return t!==e&&i.every(((t,e)=>t===r[e]))}(c,d))throw Error("To path cannot contain the from path");let h;try{h=await this.stat({path:r,directory:i})}catch(y){const t=r.split("/");t.pop();const e=t.join("/");if(t.length>0){if("directory"!==(await this.stat({path:e,directory:i})).type)throw new Error("Parent directory of the to path is a file")}}if(h&&"directory"===h.type)throw new Error("Cannot overwrite a directory with a file");const l=await this.stat({path:s,directory:n}),u=async(t,e,r)=>{const o=this.getPath(i,t),a=await this.dbRequest("get",[o]);a.ctime=e,a.mtime=r,await this.dbRequest("put",[a])},p=l.ctime?l.ctime:Date.now();switch(l.type){case"file":{const t=await this.readFile({path:s,directory:n});let a;e&&await this.deleteFile({path:s,directory:n}),t.data instanceof Blob||this.isBase64String(t.data)||(a=o.Wi.UTF8);const c=await this.writeFile({path:r,directory:i,data:t.data,encoding:a});return e&&await u(r,p,l.mtime),c}case"directory":{if(h)throw Error("Cannot move a directory over an existing object");try{await this.mkdir({path:r,directory:i,recursive:!1}),e&&await u(r,p,l.mtime)}catch(y){}const t=(await this.readdir({path:s,directory:n})).files;for(const o of t)await this._copy({from:"".concat(s,"/").concat(o.name),to:"".concat(r,"/").concat(o.name),directory:n,toDirectory:i},e);e&&await this.rmdir({path:s,directory:n})}}return{uri:d}}isBase64String(t){try{return btoa(atob(t))==t}catch(e){return!1}}}s._debug=!0}}]);
//# sourceMappingURL=457.06b9a249.chunk.js.map
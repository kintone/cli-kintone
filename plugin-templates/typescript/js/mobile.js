/******/ (() => { // webpackBootstrap
/*!***********************!*\
  !*** ./src/mobile.ts ***!
  \***********************/
// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
var PLUGIN_ID = kintone.$PLUGIN_ID;
kintone.events.on("mobile.app.record.index.show", function () {
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var spaceElement = kintone.mobile.app.getHeaderSpaceElement();
  if (spaceElement === null) {
    throw new Error("The header element is unavailable on this page");
  }
  var fragment = document.createDocumentFragment();
  var headingEl = document.createElement("h3");
  var messageEl = document.createElement("p");
  messageEl.classList.add("plugin-space-message");
  messageEl.textContent = config.message;
  headingEl.classList.add("plugin-space-heading");
  headingEl.textContent = "Hello kintone plugin!";
  fragment.appendChild(headingEl);
  fragment.appendChild(messageEl);
  spaceElement.appendChild(fragment);
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9iaWxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2ludG9uZS1wbHVnaW4tdGVtcGxhdGUtdHlwZXNjcmlwdC8uL3NyYy9tb2JpbGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gWW91IGNhbiB1c2UgdGhlIEVTTW9kdWxlcyBzeW50YXggYW5kIEBraW50b25lL3Jlc3QtYXBpLWNsaWVudCB3aXRob3V0IGFkZGl0aW9uYWwgc2V0dGluZ3MuXG4vLyBpbXBvcnQgeyBLaW50b25lUmVzdEFQSUNsaWVudCB9IGZyb20gXCJAa2ludG9uZS9yZXN0LWFwaS1jbGllbnRcIjtcblxuLy8gQHRzLWV4cGVjdC1lcnJvclxuY29uc3QgUExVR0lOX0lEID0ga2ludG9uZS4kUExVR0lOX0lEO1xuXG5raW50b25lLmV2ZW50cy5vbihcIm1vYmlsZS5hcHAucmVjb3JkLmluZGV4LnNob3dcIiwgKCkgPT4ge1xuICBjb25zdCBjb25maWcgPSBraW50b25lLnBsdWdpbi5hcHAuZ2V0Q29uZmlnKFBMVUdJTl9JRCk7XG5cbiAgY29uc3Qgc3BhY2VFbGVtZW50ID0ga2ludG9uZS5tb2JpbGUuYXBwLmdldEhlYWRlclNwYWNlRWxlbWVudCgpO1xuICBpZiAoc3BhY2VFbGVtZW50ID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGhlYWRlciBlbGVtZW50IGlzIHVuYXZhaWxhYmxlIG9uIHRoaXMgcGFnZVwiKTtcbiAgfVxuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgY29uc3QgaGVhZGluZ0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblxuICBtZXNzYWdlRWwuY2xhc3NMaXN0LmFkZChcInBsdWdpbi1zcGFjZS1tZXNzYWdlXCIpO1xuICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBjb25maWcubWVzc2FnZTtcbiAgaGVhZGluZ0VsLmNsYXNzTGlzdC5hZGQoXCJwbHVnaW4tc3BhY2UtaGVhZGluZ1wiKTtcbiAgaGVhZGluZ0VsLnRleHRDb250ZW50ID0gXCJIZWxsbyBraW50b25lIHBsdWdpbiFcIjtcblxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChoZWFkaW5nRWwpO1xuICBmcmFnbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWwpO1xuICBzcGFjZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
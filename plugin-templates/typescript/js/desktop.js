/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/desktop.ts ***!
  \************************/
// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
var PLUGIN_ID = kintone.$PLUGIN_ID;
kintone.events.on("app.record.index.show", function () {
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var spaceElement = kintone.app.getHeaderSpaceElement();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVza3RvcC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2tpbnRvbmUtcGx1Z2luLXRlbXBsYXRlLXR5cGVzY3JpcHQvLi9zcmMvZGVza3RvcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBZb3UgY2FuIHVzZSB0aGUgRVNNb2R1bGVzIHN5bnRheCBhbmQgQGtpbnRvbmUvcmVzdC1hcGktY2xpZW50IHdpdGhvdXQgYWRkaXRpb25hbCBzZXR0aW5ncy5cbi8vIGltcG9ydCB7IEtpbnRvbmVSZXN0QVBJQ2xpZW50IH0gZnJvbSBcIkBraW50b25lL3Jlc3QtYXBpLWNsaWVudFwiO1xuXG4vLyBAdHMtZXhwZWN0LWVycm9yXG5jb25zdCBQTFVHSU5fSUQgPSBraW50b25lLiRQTFVHSU5fSUQ7XG5cbmtpbnRvbmUuZXZlbnRzLm9uKFwiYXBwLnJlY29yZC5pbmRleC5zaG93XCIsICgpID0+IHtcbiAgY29uc3QgY29uZmlnID0ga2ludG9uZS5wbHVnaW4uYXBwLmdldENvbmZpZyhQTFVHSU5fSUQpO1xuXG4gIGNvbnN0IHNwYWNlRWxlbWVudCA9IGtpbnRvbmUuYXBwLmdldEhlYWRlclNwYWNlRWxlbWVudCgpO1xuICBpZiAoc3BhY2VFbGVtZW50ID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGhlYWRlciBlbGVtZW50IGlzIHVuYXZhaWxhYmxlIG9uIHRoaXMgcGFnZVwiKTtcbiAgfVxuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgY29uc3QgaGVhZGluZ0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblxuICBtZXNzYWdlRWwuY2xhc3NMaXN0LmFkZChcInBsdWdpbi1zcGFjZS1tZXNzYWdlXCIpO1xuICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBjb25maWcubWVzc2FnZTtcbiAgaGVhZGluZ0VsLmNsYXNzTGlzdC5hZGQoXCJwbHVnaW4tc3BhY2UtaGVhZGluZ1wiKTtcbiAgaGVhZGluZ0VsLnRleHRDb250ZW50ID0gXCJIZWxsbyBraW50b25lIHBsdWdpbiFcIjtcblxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChoZWFkaW5nRWwpO1xuICBmcmFnbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWwpO1xuICBzcGFjZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
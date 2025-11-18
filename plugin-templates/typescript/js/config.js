/******/ (() => { // webpackBootstrap
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
var PLUGIN_ID = kintone.$PLUGIN_ID;
var form = document.querySelector(".js-submit-settings");
var cancelButton = document.querySelector(".js-cancel-button");
var messageInput = document.querySelector(".js-text-message");
if (!(form && cancelButton && messageInput)) {
  throw new Error("Required elements do not exist.");
}
var config = kintone.plugin.app.getConfig(PLUGIN_ID);
if (config.message) {
  messageInput.value = config.message;
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  kintone.plugin.app.setConfig({
    message: messageInput.value
  }, function () {
    alert("The plug-in settings have been saved. Please update the app!");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
cancelButton.addEventListener("click", function () {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2tpbnRvbmUtcGx1Z2luLXRlbXBsYXRlLXR5cGVzY3JpcHQvLi9zcmMvY29uZmlnLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFlvdSBjYW4gdXNlIHRoZSBFU01vZHVsZXMgc3ludGF4IGFuZCBAa2ludG9uZS9yZXN0LWFwaS1jbGllbnQgd2l0aG91dCBhZGRpdGlvbmFsIHNldHRpbmdzLlxuLy8gaW1wb3J0IHsgS2ludG9uZVJlc3RBUElDbGllbnQgfSBmcm9tIFwiQGtpbnRvbmUvcmVzdC1hcGktY2xpZW50XCI7XG5cbi8vIEB0cy1leHBlY3QtZXJyb3JcbmNvbnN0IFBMVUdJTl9JRCA9IGtpbnRvbmUuJFBMVUdJTl9JRDtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanMtc3VibWl0LXNldHRpbmdzXCIpO1xuY29uc3QgY2FuY2VsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qcy1jYW5jZWwtYnV0dG9uXCIpO1xuY29uc3QgbWVzc2FnZUlucHV0ID1cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5qcy10ZXh0LW1lc3NhZ2VcIik7XG5pZiAoIShmb3JtICYmIGNhbmNlbEJ1dHRvbiAmJiBtZXNzYWdlSW5wdXQpKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlJlcXVpcmVkIGVsZW1lbnRzIGRvIG5vdCBleGlzdC5cIik7XG59XG5jb25zdCBjb25maWcgPSBraW50b25lLnBsdWdpbi5hcHAuZ2V0Q29uZmlnKFBMVUdJTl9JRCk7XG5cbmlmIChjb25maWcubWVzc2FnZSkge1xuICBtZXNzYWdlSW5wdXQudmFsdWUgPSBjb25maWcubWVzc2FnZTtcbn1cblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAga2ludG9uZS5wbHVnaW4uYXBwLnNldENvbmZpZyh7IG1lc3NhZ2U6IG1lc3NhZ2VJbnB1dC52YWx1ZSB9LCAoKSA9PiB7XG4gICAgYWxlcnQoXCJUaGUgcGx1Zy1pbiBzZXR0aW5ncyBoYXZlIGJlZW4gc2F2ZWQuIFBsZWFzZSB1cGRhdGUgdGhlIGFwcCFcIik7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi4uLy4uL2Zsb3c/YXBwPVwiICsga2ludG9uZS5hcHAuZ2V0SWQoKTtcbiAgfSk7XG59KTtcbmNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiLi4vLi4vXCIgKyBraW50b25lLmFwcC5nZXRJZCgpICsgXCIvcGx1Z2luL1wiO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
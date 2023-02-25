// ==UserScript==
// @name         Search Enhanced by ChatGPT
// @name:zh-CN   ChatGPT增强搜索
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  support: bing, google, neeva. If your searching content ends with '?' or '/', this script will send it as prompt to ChatGPT and show the answer in the result page automatically. support settings: max_taokens, model, temperature(relevance: 0-2), position(inner: 0, right-side: 1)
// @description:zh-CN  支持:bing, google, neeva. 如果你的搜索内容以问号?或者/结尾，这个脚本会将它作为提示发送给ChatGPT，并在搜索的结果页面自动显示回答。支持设置: 返回的最大tokens, 调用的model, 相关程度temperature(0-2), position(0:内嵌, 1:右侧)
// @author       Liu Gang
// @icon               https://img.icons8.com/nolan/64/chatgpt.png
// @match              https://neeva.com/search*
// @match              https://*.google.com/search*
// @match              https://*.google.com.hk/search*
// @match              https://*.google.cn/search*
// @match              https://*.bing.com/search*
// @connect            api.openai.com
// @grant              GM_addStyle
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_info
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_unregisterMenuCommand
// @grant              GM_getResourceText
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// @require https://greasyfork.org/scripts/455606-layx-js/code/layxjs.js?version=1122546
// @resource  layxcss https://greasyfork.org/scripts/455605-layx/code/layx.user.css
// @license MIT
// ==/UserScript==

(function() {
  "use strict";

  // user config
  const apiKey = GM_getValue("api_key", 'YOUR_API_KEY');
  const max_tokens = GM_getValue("max_tokens", 200);
  const model = GM_getValue("model", "text-davinci-002");
  const temperature = GM_getValue("temperature", 0.5);
  const position = GM_getValue("position", 1);

  GM_addStyle(GM_getResourceText("layxcss"));
  GM_registerMenuCommand("ChatGPT Settings", set_config, "s");
  function set_config() {
     const setting_title_html = '<div style="font-size: 12px;">ChatGPT Settings</div>';
    const setting_info_html =
    '<div style="font-size: 12px;border-radius: 5px;padding: 10px;margin: 10px;">' +
    '<span><span>apiKey: </span><div><textarea id="apiKey" style="width: 100%;height:50px;border-radius: 5px;padding: 5px;box-sizing: border-box;"></textarea></span>' +
    '<span><span>max_tokens: </span><div><input id="max_tokens" type="number" style="width: 100%;height:30px;border-radius: 5px;padding: 5px;box-sizing: border-box;"></input></span>' +
    '<span><span>model: </span><div><input id="model" type="text" style="width: 100%;height:30px;border-radius: 5px;padding: 5px;box-sizing: border-box;"></input></span>' +
    '<span><span>temperature: </span><div><input id="temperature" type="number" style="width: 100%;height:30px;border-radius: 5px;padding: 5px;box-sizing: border-box;"></input></span>' +
    '<span><span>position:(inner: 0 ,right-side: 1)</span><div><input id="position" type="number" style="width: 100%;height:30px;border-radius: 5px;padding: 5px;box-sizing: border-box;"></input></span>' +
    '<div style="text-align: right;"><button class="layx-button-item custom-button" id="save_config" style="margin-top: 5px; line-height: 1.2;padding-bottom: 4px; border-radius: 4px;">save</button></div>' +
    '</div>'
    ;
    layx.html('ChatGPT Setting', setting_title_html ,setting_info_html, {
      width: 470,
      height: 400,
      borderRadius: '5px',
      statusBar: true,
      storeStatus: false,
      minMenu: false,
      maxMenu: false,
      skin: 'cloud',
      position: ['ct'],
  });
  document.getElementById('apiKey').value = apiKey;
  document.getElementById('max_tokens').value = max_tokens;
  document.getElementById('model').value = model;
  document.getElementById('temperature').value = temperature;
  document.getElementById('position').value = position;

  document.getElementById('save_config').addEventListener('click', async function () {
    const apiKey = document.getElementById('apiKey').value;
    const max_tokens = parseInt(document.getElementById('max_tokens').value);
    const model = document.getElementById('model').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const position = parseInt(document.getElementById('position').value);
    GM_setValue("api_key", apiKey);
    GM_setValue("max_tokens", max_tokens);
    GM_setValue("model", model);
    GM_setValue("temperature", temperature);
    GM_setValue("position", position);
    layx.destroy('ChatGPT Setting');
  });
  }

  const container = document.createElement("div");
  function getPosition() {
    return position;
  }
  function getContainer() {
    return container;
  }
  function initContainer() {
    const container2 = getContainer();
    container2.className = "chat-gpt-container";
    container2.innerHTML = '<div style = "margin:4px 0px 4px 0px; right: 0px;left: 0px;" ><div style="display: inline-flex;justify-content: flex-start;height: 28px;"><span class="prefix" style="font-size: 16px;font-weight: 600;"><img src="https://img.icons8.com/nolan/64/chatgpt.png" style = "height: 23px; width: 23px;"/></span><p style="margin-top: 3px ;margin-left: 3px;margin-bottom: 0px;">ChatGPT</p></div><pre style="margin:10px;">Waiting for response...</pre></div>';

  }
  function containerShow(answer) {
    const container2 = getContainer();
    container2.innerHTML = '<div style = "margin:4px 0 4px 0;right: 0px;left: 0px;"><div style="display: inline-flex;justify-content: flex-start;height: 28px;"><span class="prefix" style="font-size: 16px;font-weight: 600;"><img src="https://img.icons8.com/nolan/64/chatgpt.png" style = "height: 23px; width: 23px;"/></span><p style="margin-top: 3px;margin-left: 3px;margin-bottom: 0px;">ChatGPT</p></div><button id="res-copybtn" type="button">copy</button><pre id="unique-gpt" style="margin-top:0px;white-space: pre-wrap; word-wrap: break-word;word-break: break-all;"></pre></div>';
    container2.querySelector("#unique-gpt").textContent = answer;
    GM_addStyle(`#res-copybtn {float:right; font-size: 12px;border:0px; line-height: 1.3;padding-bottom: 4px; border-radius: 4px; cursor: pointer !important;}`);
    document.getElementById('res-copybtn').addEventListener('click',async function () {
      await navigator.clipboard.writeText(answer);
      const copybtn = document.getElementById('res-copybtn');
      copybtn.textContent = "Copied";
      setTimeout(function () {
        copybtn.textContent = "Copy";
      }, 1000);
    });
  }
  function getWebsite() {
    if (location.hostname.indexOf("neeva") !== -1) {
      return "neeva";
    }
    if (location.hostname.indexOf("google") !== -1) {
      return "google";
    }
      return "bing";
  }

  function getQuestion() {
      return new URL(window.location.href).searchParams.get("q");
  }

async function getAnswer(question) {
   var parse_q = question.slice(0,question.indexOf('?'))
    try {
      const data = {
                    prompt: parse_q,
                    max_tokens: max_tokens,
                    model: model,
                    temperature: temperature,
                    }
      console.log('data: '+JSON.stringify(data))
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.openai.com/v1/completions",
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        responseType: 'json',
        onload: function (res) {
            if (res.status === 200) {
                var display_text = res.response.choices[0].text.replace('\n', '');
                console.log('res: '+ display_text);
                containerShow(display_text);
            }
            else {
                var error_message = 'error: code: '+ res.status.toString();
                containerShow(error_message);
            }
        },
        ontimeout: function(event) {
          console.error("getAnswer timeout: ", event);
        }
      });
    } catch (error) {
      console.error("getAnswer error: ", error);
    }
}

function initUI() {
    initContainer();
    switch (getWebsite()) {
      case "neeva":
        neevaInjectContainer();
        break;
      case "google":
        googleInjectContainer();
        break;
      case "bing":
        bingInjectContainer();
        break;
      default:
        alertUnknowError();
    }
    function googleInjectContainer() {
      if (getPosition() === 1) {
        const container2 = getContainer();
        const siderbarContainer = document.getElementById("rhs");
        if (siderbarContainer) {
            GM_addStyle(".chat-gpt-container{width: 357px;border-radius: 4px;box-shadow:-0.2px -0.2px 1px;;padding: 10px;margin-bottom: 9px;}");
            siderbarContainer.prepend(container2);
        } else {
          GM_addStyle(".chat-gpt-container{position: absolute; margin-left: calc(var(--center-abs-margin) + var(--center-width) + var(--rhs-margin)); width: 357px;border-radius: 4px;box-shadow:-0.2px -0.2px 1px;;padding: 10px;}");
          document.getElementById("rcnt").appendChild(container2);
        }
      } else {
        GM_addStyle(".chat-gpt-container{width: calc(var(--center-width)-5px); max-width: var(--center-width) !important;border-radius: 4px;box-shadow:-0.2px -0.2px 1px;;padding: 10px;}");
        GM_addStyle("#unique-gpt{margin-bottom: 0px;margin-top:-20px!important;}");
        const container2 = getContainer();
        const mainContainer = document.querySelector("#search");
        if (mainContainer) {
          mainContainer.prepend(container2);
        }
      }
    }
    function bingInjectContainer() {
      GM_addStyle(`#res-copybtn{float: right; position: inherit!important;}`);
      GM_addStyle(".chat-gpt-container{height:auto !important;}");
      if (getPosition() === 1) {
        const container2 = getContainer();
        container2.classList.add("b_ans");
        GM_addStyle(".chat-gpt-container{border-radius: 4px;box-shadow:-0.2px -0.2px 1px;padding: 10px;}");

        const siderbarContainer = document.getElementById("b_context");
        siderbarContainer.prepend(container2);
      } else {
        GM_addStyle(".chat-gpt-container{width:608px; max-width: 100%;margin-bottom:1px;}");
        GM_addStyle("#unique-gpt{margin-bottom: 0px;margin-top: -21px!important;padding-bottom: 6px;}");
        const container2 = getContainer();
        GM_addStyle(".chat-gpt-container{border-radius: 4px;box-shadow:-0.2px -0.2px 1px;padding: 10px;}");
        const siderbarContainer = document.getElementById("b_results");
        siderbarContainer.prepend(container2);
      }
    }
    function neevaInjectContainer() {
        if (getPosition() === 1) {
        const container2 = getContainer();
        GM_addStyle(".chat-gpt-container{padding: 10px;}");
        container2.classList.add("layout-rhs-panel__container-3E-Y5");
        const siderbarContainer = document.querySelector(".app-layout__column-2kU_Y .layout-rhs-panel__container-3E-Y5");
        if (siderbarContainer) {
          siderbarContainer.before(container2);
        } else {
          const baseContainer = document.getElementById("search");
          const siderbarContainer = baseContainer.querySelectorAll(".app-layout__columnContainer-2SR1K .app-layout__column-2kU_Y")[2];
          siderbarContainer.prepend(container2);
        }
      } else {
        GM_addStyle("#unique-gpt{margin-bottom: 0px;margin-top: -16px!important;}");
        GM_addStyle(".chat-gpt-container{max-width: 100%; width: 100%;padding-top: var(--n-result-lg-v-padding);padding-right: var(--n-result-lg-h-right-padding);padding-bottom: 0;padding-left: var(--n-result-lg-h-padding);}");
        const container2 = getContainer();
        container2.classList.add("result-group-container__component-1xFH0");
        const baseContainer = document.getElementById("search");
        const siderbarContainer = baseContainer.querySelector(".app-layout__column-2kU_Y");
        if (siderbarContainer) {
          siderbarContainer.append(container2);
        } else {
          const siderbarContainer = baseContainer.querySelector(".result-group-container__component-1xFH0");
          if (siderbarContainer) {
            siderbarContainer.before(container2);
          }
        }
      }
  }
}
  async function main() {
    if (getQuestion().endsWith("?") || getQuestion().endsWith("？") || getQuestion().endsWith("/")) {
          initUI();
          getAnswer(getQuestion());
    }
  }
  main().catch((e) => {
    console.error(e);
  });
})();

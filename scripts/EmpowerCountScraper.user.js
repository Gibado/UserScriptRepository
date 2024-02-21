// ==UserScript==
// @name		Empower Count Scraper
// @namespace	https://github.com/Gibado
// @version		2024.2.20.0
// @description	Collects account amounts for easy exporting
// @match		https://home.personalcapital.com/page/login/app#/dashboard
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/ClipboardUtils.js
// @require		https://raw.githubusercontent.com/Gibado/UserScriptRepository/master/common/Utils.js
// @downloadURL https://github.com/Gibado/UserScriptRepository/raw/master/scripts/EmpowerCountScraper.user.js
// @updateURL   https://github.com/Gibado/UserScriptRepository/raw/master/scripts/EmpowerCountScraper.user.js
// @copyright	2024
// @author		Tyler Studanski
// @grant		none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    class EmpowerCollector {
        fundsOrder = ['5635','8159','5977','7695']
        constructor() {
            this.funds = {};
            this.expenses = {};
            this.getFunds();
            this.getExpenses();
            this.addCopyButtons();
        }
        getFunds() {
            var banks = $('.BANK');
            var titles = banks.find('.firmName');
            var amounts = banks.find('.sidebar-account__value');
            for (var i = 0; i < titles.length; i++) {
                this.funds[titles[i].title] = amounts[i].textContent.trim();
            }
        }
        getExpenses() {
            var creditCards = $('.CREDIT_CARD');
            var titles = creditCards.find('.firmName');
            var amounts = creditCards.find('.sidebar-account__value');
            for (var i = 0; i < titles.length; i++) {
                this.expenses[titles[i].title] = amounts[i].textContent.trim();
            }
        }
        addCopyButtons() {
            var self = this;
            var topMenu = $('.menu__container')[0].children[0];
            var li = document.createElement('li');
            li.className = 'menu__item';
            var btn = document.createElement('a');
            btn.className = 'pc-btn pc-btn--small'
            btn.text = 'Copy Funds';
            btn.onclick = Utils.copyTextToClipboard(self.getFundsCopyText());
            li.appendChild(btn);
            topMenu.appendChild(li);
        }
        getFundsCopyText() {
            var result = '';
            this.fundsOrder.forEach(id => {
                for (var name in this.funds) {
                    if (name.indexOf(id) != -1) {
                        result += this.funds[name] + '\n';
                        break;
                    }
                }
            });
            return result;
        }
    }
    document.collectorModel = new EmpowerCollector();
})();
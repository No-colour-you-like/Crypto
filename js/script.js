'use strict';

const dailyValue = document.querySelector('#daily-value'),
  dailyMax = document.querySelector('#daily-max'),
  dailyMin = document.querySelector('#daily-min'),
  dollarBtn = document.querySelector('#dollar-btn'),
  euroBtn = document.querySelector('#euro-btn'),
  sterlingBtn = document.querySelector('#sterling-btn'),
  rubleBtn = document.querySelector('#ruble-btn');


const changeDayInfo = (data, currencyIcon) => {
  dailyValue.textContent = data[data.length - 1].close.toLocaleString('ru') + `${currencyIcon}`;
  dailyMax.textContent = data[data.length - 1].high.toLocaleString('ru');
  dailyMin.textContent = data[data.length - 1].low.toLocaleString('ru');
};

const fetchInfo = async (cryptocurrency, currency, limit, currencyIcon) => {
  let crypto = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=${currency}&limit=${limit}`);
  let resp = await crypto.json();
  const cryptoDailyData = resp.Data.Data;

  changeDayInfo(cryptoDailyData, currencyIcon);
};

fetchInfo('BTC', 'USD', '30', '$');


dollarBtn.addEventListener('click', () => fetchInfo('BTC', 'USD', '30', '$'));
euroBtn.addEventListener('click', () => fetchInfo('BTC', 'EUR', '30', '€'));
sterlingBtn.addEventListener('click', () => fetchInfo('BTC', 'GBP', '30', '£'));
rubleBtn.addEventListener('click', () => fetchInfo('BTC', 'RUB', '30', '₽'));
'use strict';

const dailyValue = document.querySelector('#daily-value'),
  dailyMax = document.querySelector('#daily-max'),
  dailyMin = document.querySelector('#daily-min'),
  dollarBtn = document.querySelector('#dollar-btn'),
  euroBtn = document.querySelector('#euro-btn'),
  sterlingBtn = document.querySelector('#sterling-btn'),
  rubleBtn = document.querySelector('#ruble-btn'),
  dailyCryptoImg = document.querySelector('#total-crypto-img'),
  cryptoBtnBTC = document.querySelector('#crypto-btn-btc'),
  cryptoBtnETH = document.querySelector('#crypto-btn-eth'),
  cryptoBtnXRP = document.querySelector('#crypto-btn-xrp'),
  cryptoDifferenceValue = document.querySelectorAll('.cryptos__difference-value'),
  cryptoDifferenceArrow = document.querySelectorAll('.cryptos__difference-arrow');


// Fetch API data
const fetchInfo = async (cryptocurrency, currency, currencyIcon, limit = 1) => {
  const crypto = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=${currency}&limit=${limit}`);
  const resp = await crypto.json();
  const cryptoDailyData = resp.Data.Data;

  let dataClose = cryptoDailyData[cryptoDailyData.length - 1].close,
    dataHigh = cryptoDailyData[cryptoDailyData.length - 1].high,
    dataLow = cryptoDailyData[cryptoDailyData.length - 1].low;


  dailyValue.textContent = dataClose.toLocaleString('ru') + ` ${currencyIcon}`;
  dailyMax.textContent = dataHigh.toLocaleString('ru');
  dailyMin.textContent = dataLow.toLocaleString('ru');
};

fetchInfo('BTC', 'USD', '$');

const fetchDiffrenceInfo = async (cryptocurrency, currency, limit = 1) => {
  const crypto = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=${currency}&limit=${limit}`);
  const resp = await crypto.json();
  const cryptoDailyData = resp.Data.Data;

  let dataOpen = cryptoDailyData[cryptoDailyData.length - 1].open,
    dataClose = cryptoDailyData[cryptoDailyData.length - 1].close;
  if (cryptocurrency === 'BTC') {
    cryptoDifferenceValue[0].textContent = (100 - (dataOpen * 100 / dataClose)).toFixed(2) + ' %';
  } else if (cryptocurrency === 'ETH') {
    cryptoDifferenceValue[1].textContent = (100 - (dataOpen * 100 / dataClose)).toFixed(2) + ' %';
  } else {
    cryptoDifferenceValue[2].textContent = (100 - (dataOpen * 100 / dataClose)).toFixed(2) + ' %';
  }

};

fetchDiffrenceInfo('BTC', 'USD')
fetchDiffrenceInfo('ETH', 'USD')
fetchDiffrenceInfo('XRP', 'USD')

// Change daily main currency
const changeDailyCurrency = (currency, currencySign) => {
  if (dailyValue.classList.contains('btc')) {
    fetchInfo('BTC', currency, currencySign);
  } else if (dailyValue.classList.contains('eth')) {
    fetchInfo('ETH', currency, currencySign);
  } else {
    fetchInfo('XRP', currency, currencySign);
  }
};

// Set main cryptocurrency 
const setCryptocurrency = (cryptoImg, cryptoName) => {
  dailyCryptoImg.setAttribute('src', cryptoImg);
  dailyValue.className = `overview__total ${cryptoName.toLowerCase()}`;
  fetchInfo(cryptoName, 'USD', '$');
};


// Change daily currency info on click
dollarBtn.addEventListener('click', () => changeDailyCurrency('USD', '$'));
euroBtn.addEventListener('click', () => changeDailyCurrency('EUR', '€'));
sterlingBtn.addEventListener('click', () => changeDailyCurrency('GBP', '£'));
rubleBtn.addEventListener('click', () => changeDailyCurrency('RUB', '₽'));

// Set main cryptocurrency on click
cryptoBtnBTC.addEventListener('click', () => setCryptocurrency('img/bitcoin.svg', 'BTC'));
cryptoBtnETH.addEventListener('click', () => setCryptocurrency('img/ethereum.svg', 'ETH'));
cryptoBtnXRP.addEventListener('click', () => setCryptocurrency('img/ripple.svg', 'XRP'));
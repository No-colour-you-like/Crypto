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
  cryptoDifferenceArrow = document.querySelectorAll('.cryptos__arrow'),
  exchangeSelectFirst = document.querySelector('#exchange-select-first'),
  exchangeSelectSecond = document.querySelector('#exchange-select-second'),
  exchangeInputFirst = document.querySelector('#exchange-input-first'),
  exchangeInputSecond = document.querySelector('#exchange-input-second'),
  exchangeBtn = document.querySelector('#exchange-btn');


// Fetch API data
const fetchInfo = async (cryptocurrency, currency, currencyIcon) => {
  const crypto = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`);
  const resp = await crypto.json();
  const data = await resp.RAW[cryptocurrency][currency];

  dailyValue.textContent = data.PRICE.toLocaleString('ru') + ` ${currencyIcon}`;
  dailyMax.textContent = data.HIGHDAY.toLocaleString('ru');
  dailyMin.textContent = data.LOWDAY.toLocaleString('ru');
};

fetchInfo('BTC', 'USD', '$');

// Fetch and set cryptocurrency day difference
const fetchDiffrenceInfo = async (cryptocurrency, currency, limit = 1) => {
  const crypto = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`);
  const resp = await crypto.json();
  const data = await resp.RAW[cryptocurrency][currency];

  const calculateDifference = (100 - (data.OPENDAY * 100 / data.PRICE)).toFixed(2);

  const setDifference = (cryptocurrencyIndex) => {
    cryptoDifferenceValue[cryptocurrencyIndex].textContent = calculateDifference + ' %';

    if (calculateDifference >= 0) {
      cryptoDifferenceArrow[cryptocurrencyIndex].setAttribute('src', 'img/arrow-up.svg');
    } else {
      cryptoDifferenceArrow[cryptocurrencyIndex].setAttribute('src', 'img/arrow-down.svg');
    }
  };

  if (cryptocurrency === 'BTC') {
    setDifference(0);
  } else if (cryptocurrency === 'ETH') {
    setDifference(1);
  } else {
    setDifference(2);
  }
};

// Update all cryptocurrency defferences
const startCheckDifference = (currency) => {
  fetchDiffrenceInfo('BTC', currency);
  fetchDiffrenceInfo('ETH', currency);
  fetchDiffrenceInfo('XRP', currency);
};

startCheckDifference('USD');

// Update cryptocurrency difference every 30 sec
setInterval(() => {
  startCheckDifference('USD');
}, 30000);


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


// Fetch and calculate currencies
const fetchCurrencies = async (cryptoCurrency, currency) => {
  const currencies = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoCurrency}&tsyms=${currency}`);
  const resp = await currencies.json();

  let currencyValue = resp[cryptoCurrency][currency];

  exchangeInputSecond.textContent = (exchangeInputFirst.value * currencyValue).toLocaleString('ru');
};

//Calculate currencies 
exchangeInputFirst.addEventListener('input', () => fetchCurrencies(exchangeSelectFirst.value, exchangeSelectSecond.value));

exchangeSelectFirst.addEventListener('change', () => fetchCurrencies(exchangeSelectFirst.value, exchangeSelectSecond.value))

exchangeSelectSecond.addEventListener('change', () => fetchCurrencies(exchangeSelectFirst.value, exchangeSelectSecond.value));


//Swap currencies 
exchangeBtn.addEventListener('click', () => {
  let firstOptions = exchangeSelectFirst.innerHTML,
    secondOptions = exchangeSelectSecond.innerHTML,
    selectFirstValue = exchangeSelectFirst.value,
    selectSecondValue = exchangeSelectSecond.value;

  let optionsArr = [firstOptions, secondOptions];

  exchangeSelectFirst.innerHTML = optionsArr[1];
  exchangeSelectSecond.innerHTML = optionsArr[0];

  exchangeSelectSecond.value = selectFirstValue;
  exchangeSelectFirst.value = selectSecondValue;

  fetchCurrencies(exchangeSelectFirst.value, exchangeSelectSecond.value);
});


//Chart 

const fetchHistoricalData = async () => {
  const historicalData = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30')
  const resp = await historicalData.json();
  const data = resp.Data.Data;

  let allDaysData = [];

  const dayDatas = () => {
    data.forEach(day => {
      allDaysData.push(day.close);
    })
  }

  dayDatas();

  console.log(allDaysData);

  const ctx = document.querySelector('#myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allDaysData,
      datasets: [{
        label: '# of Votes',
        data: allDaysData,
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderColor: [
          'rgba(106, 83, 199, 1)',
        ],
        borderWidth: 3,
        tension: 0.3,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: '#1D1A37FF'
          },
          ticks: {
            maxTicksLimit: 4,
            color: '#655F8DFF'
          }
        },
        x: {
          grid: {
            color: '#1D1A37FF',
            tickBorderDash: [90]
          },
          ticks: {
            display: false,
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })


}

fetchHistoricalData()
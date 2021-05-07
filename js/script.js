'use strict';

const dailyValue = document.querySelector('#daily-value'),
  dailyMax = document.querySelector('#daily-max'),
  dailyMin = document.querySelector('#daily-min');


const cryptoFetch = async () => {
  let crypto = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30');
  let resp = await crypto.json();

  const cryptoDailyData = resp.Data.Data;
  
  dailyValue.textContent = cryptoDailyData[cryptoDailyData.length - 1].close;
  dailyMax.textContent = cryptoDailyData[cryptoDailyData.length - 1].high; 
  dailyMin.textContent = cryptoDailyData[cryptoDailyData.length - 1].low; 

  console.log(cryptoDailyData[30])


};

cryptoFetch();








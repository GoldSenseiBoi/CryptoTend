import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cryptoTable.css'; // Importez le fichier CSS

const CryptoToTheMoon = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        setCryptoData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Rafraîchissement toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);

  const getPercentageColor = (value) => {
    return value > 0 ? 'green' : value < 0 ? 'red' : 'black';
  };

  // Filtrer les cryptomonnaies avec une forte croissance des prix (bull market)
  const potentialBullMarketCryptos = cryptoData
    .filter((crypto) => parseFloat(crypto.priceChangePercent) > 8) // Exemple : 10% de croissance
    .slice(0, 40); // Sélectionner les 35 meilleures

  // Filtrer les cryptomonnaies avec une forte baisse des prix (bear market)
  const potentialBearMarketCryptos = cryptoData
    .filter((crypto) => parseFloat(crypto.priceChangePercent) < -6) // Exemple : -10% de baisse
    .slice(0, 25); // Sélectionner les 25 meilleures

  // Affichage des cryptomonnaies potentielles pour le bull market et le bear market
  return (
    <div>
      <h2>Top 35 des cryptomonnaies potentielles "To the Moon" dans les prochaines heures :</h2>
      <ol class="cardplus">
        {potentialBullMarketCryptos.map((crypto) => (
          <div class="card"><li key={crypto.symbol} style={{ color: getPercentageColor(parseFloat(crypto.priceChangePercent)) }}>
            {crypto.symbol}  <br /><br /><br />Croissance : {parseFloat(crypto.priceChangePercent).toFixed(2)}%
          </li></div>
        ))}
      </ol>

      <h2>Top 25 des cryptomonnaies potentielles "Bear Market" dans les prochaines heures :</h2>
      <ol class="cardplus">
        {potentialBearMarketCryptos.map((crypto) => (
          <div class="card"><li key={crypto.symbol} style={{ color: getPercentageColor(parseFloat(crypto.priceChangePercent)) }}>
            {crypto.symbol} <br /><br /><br />Baisse : {parseFloat(crypto.priceChangePercent).toFixed(2)}%
          </li></div>
        ))}
      </ol>
    </div>
  );
};

export default CryptoToTheMoon;

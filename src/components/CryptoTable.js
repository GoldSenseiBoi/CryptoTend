import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cryptoTable.css'; // Importez le fichier CSS

const CryptoTable = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [topVolumeData, setTopVolumeData] = useState([]);
  const [bestVolumeData, setBestVolumeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.binance.com/api/v3/ticker/24hr'
        );
        setCryptoData(response.data);

        const sortedData = response.data.sort(
          (a, b) => parseFloat(b.volume) - parseFloat(a.volume)
        );

        const topVolume = sortedData.slice(0, 25);
        setTopVolumeData(topVolume);

        const bestVolume = sortedData.slice(0, 15);
        setBestVolumeData(bestVolume);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const calculateVolumePercentage = (volume) => {
    const totalVolume = bestVolumeData.reduce(
      (accumulator, crypto) => accumulator + parseFloat(crypto.volume),
      0
    );
    const percentage = (parseFloat(volume) / totalVolume) * 100;
    return percentage.toFixed(2);
  };

  const getPercentageColor = (percentage) => {
    if (parseFloat(percentage) > 0) {
      return 'green'; // Couleur verte pour la hausse
    } else if (parseFloat(percentage) < 0) {
      return 'red'; // Couleur rouge pour la baisse
    } else {
      return 'black'; // Couleur noire par défaut
    }
  };

  return (
    <div>
      <h2>Tendance des cryptomonnaies</h2>
      <h3>Meilleurs volumes des 24 dernières heures</h3>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Dernier prix</th>
            <th>Volume</th>
            <th>Volume %</th>
            <th>Volatility %</th>
          </tr>
        </thead>
        <tbody>
          {bestVolumeData.map((crypto) => (
            <tr key={crypto.symbol}>
              <td>{crypto.symbol}</td>
              <td>{crypto.lastPrice}</td>
              <td>{crypto.volume}</td>
              <td style={{ color: getPercentageColor(calculateVolumePercentage(crypto.volume)) }}>
                {calculateVolumePercentage(crypto.volume)}%
              </td>
              <td>Volatility data</td> {/* à Remplacez avec les données de volatilité réelles */}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Meilleurs volumes des 12 dernières heures</h3>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Dernier prix</th>
            <th>Volume</th>
            <th>Volume %</th>
          </tr>
        </thead>
        <tbody>
          {topVolumeData.map((crypto) => (
            <tr key={crypto.symbol}>
              <td>{crypto.symbol}</td>
              <td>{crypto.lastPrice}</td>
              <td>{crypto.volume}</td>
              <td style={{ color: getPercentageColor(calculateVolumePercentage(crypto.volume)) }}>
                {calculateVolumePercentage(crypto.volume)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;

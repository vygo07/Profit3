import crypto from 'crypto';

export default async function handler(req, res) {
  const apiKey = req.query.apiKey;
  const apiSecret = req.query.apiSecret;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'Missing API key or secret' });
  }

  const timestamp = Date.now().toString();
  const payload = `timestamp=${timestamp}&recvWindow=5000`;
  const signature = crypto.createHmac('sha256', apiSecret).update(payload).digest('hex');

  try {
    const url = `https://open-api.bingx.com/openApi/swap/v2/trade/history/orders?${payload}&signature=${signature}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-BX-APIKEY': apiKey
      }
    });

    const json = await response.json();

    if (json.code !== '0') {
      return res.status(500).json({ error: json.msg || 'API error', data: json });
    }

    const trades = json.data || [];

    const last10 = trades
      .filter(t => t.realizedProfit)
      .sort((a, b) => b.closeTime - a.closeTime)
      .slice(0, 10)
      .map(t => ({
        date: new Date(t.closeTime).toISOString().split('T')[0],
        pnl: parseFloat(t.realizedProfit),
        fee: parseFloat(t.fee || 0),
        win: parseFloat(t.realizedProfit) > 0
      }))
      .reverse();

    res.status(200).json(last10);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

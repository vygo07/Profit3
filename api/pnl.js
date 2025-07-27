import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { apiKey, secretKey } = req.query;

  if (!apiKey || !secretKey) {
    return res.status(400).json({ error: "Missing API credentials" });
  }

  try {
    // MOCK: Nahraď podle oficiálního BingX REST API dokumentu
    const trades = [
      { date: "2025-07-26", pnl: 80, fee: 1.5, win: true },
      { date: "2025-07-25", pnl: -20, fee: 1.3, win: false },
      { date: "2025-07-24", pnl: 120, fee: 1.6, win: true },
      { date: "2025-07-23", pnl: 90, fee: 1.4, win: true },
      { date: "2025-07-22", pnl: -50, fee: 1.1, win: false },
      { date: "2025-07-21", pnl: 60, fee: 1.2, win: true },
      { date: "2025-07-20", pnl: 30, fee: 1.5, win: true },
      { date: "2025-07-19", pnl: 10, fee: 1.4, win: true },
      { date: "2025-07-18", pnl: 0, fee: 1.3, win: false },
      { date: "2025-07-17", pnl: -40, fee: 1.2, win: false }
    ];

    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PnL data." });
  }
}
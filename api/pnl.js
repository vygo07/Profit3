export default function handler(req, res) {
  const data = Array.from({ length: 10 }, (_, i) => {
    return {
      date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      pnl: (Math.random() - 0.5) * 200,
      fee: Math.random() * 5,
      win: Math.random() > 0.5
    };
  }).reverse();

  res.status(200).json(data);
}
// server/api/json/moonPhase.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get moon phase name
    const phaseRes = await axios.get('https://moon-phase.p.rapidapi.com/basic', {
      headers: {
        'x-rapidapi-key': '578c9e32a7msh5081ccdc2c4b1b8p13095ejsn12e8dac804f8',
        'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
      }
    });

    const phase = phaseRes.data.phase || "Unknown";

    // Optional: emoji map based on phase
    const phaseEmojiMap = {
      "New Moon": "🌑",
      "Waxing Crescent": "🌒",
      "First Quarter": "🌓",
      "Waxing Gibbous": "🌔",
      "Full Moon": "🌕",
      "Waning Gibbous": "🌖",
      "Last Quarter": "🌗",
      "Waning Crescent": "🌘"
    };

    const emoji = phaseEmojiMap[phase] || "🌕";

    res.json({ phase, emoji });
  } catch (error) {
    console.error("Moon phase API failed:", error.message);
    res.status(500).json({ phase: "Unknown", emoji: "🌕" });
  }
});

export default router;

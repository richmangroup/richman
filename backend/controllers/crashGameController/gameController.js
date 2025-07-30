// controllers/crashGameController/gameController.js
import Game from '../../models/CrashGameModel/crashGameModel.js';


export const saveCrashGameResult = async (req, res) => {
  try {
    const { result, multiplier, userId, cashOutAt } = req.body;

    const game = new Game({
      userId,
      result,
      multiplier,
      cashOutAt,
      timestamp: new Date(),
    });

    await game.save();

    res.status(200).json({ success: true, message: 'Game result saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

import MatchModel from "../model/matches.js";
import { onError } from "../utils/onError.js";

/**
 * Get all matches (public endpoint)
 */
export const getMatches = async (req, res) => {
  try {
    const { status, league, date } = req.query;
    const query = {};

    // Filter by status
    if (status && ["upcoming", "live", "finished"].includes(status)) {
      query.status = status;
    }

    // Filter by league name
    if (league) {
      query["league.name"] = league;
    }

    // Filter by date
    if (date) {
      query.date = date;
    }

    const matches = await MatchModel.find(query).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      matches,
      count: matches.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Get single match by ID (public endpoint)
 */
export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await MatchModel.findById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Match fetched successfully",
      match,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Create a new match (admin only)
 */
export const createMatch = async (req, res) => {
  try {
    const {
      league,
      date,
      time,
      status = "upcoming",
      homeTeam,
      awayTeam,
      score,
      odds,
    } = req.body;

    // Validation
    if (!league || !league.name || !league.icon || !league.country) {
      return res.status(400).json({
        success: false,
        message: "League information is required",
      });
    }

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required",
      });
    }

    if (!homeTeam || !homeTeam.name || !homeTeam.shortName) {
      return res.status(400).json({
        success: false,
        message: "Home team information is required",
      });
    }

    if (!awayTeam || !awayTeam.name || !awayTeam.shortName) {
      return res.status(400).json({
        success: false,
        message: "Away team information is required",
      });
    }

    if (!odds || !odds.straightWin || !odds.doubleChance) {
      return res.status(400).json({
        success: false,
        message: "Odds information is required",
      });
    }

    // Validate odds structure
    const { straightWin, doubleChance } = odds;
    if (
      !straightWin.home ||
      !straightWin.draw ||
      !straightWin.away ||
      !doubleChance["1X"] ||
      !doubleChance["12"] ||
      !doubleChance["X2"]
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete odds information is required",
      });
    }

    const match = new MatchModel({
      league,
      date,
      time,
      status,
      homeTeam,
      awayTeam,
      score,
      odds,
    });

    await match.save();

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      match,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Update a match (admin only)
 */
export const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const match = await MatchModel.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // Update match fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        match[key] = updateData[key];
      }
    });

    await match.save();

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      match,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Delete a match (admin only)
 */
export const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await MatchModel.findByIdAndDelete(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};


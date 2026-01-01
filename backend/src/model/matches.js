import { Schema, model } from "mongoose";

const matchSchema = new Schema(
  {
    league: {
      name: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "live", "finished"],
      default: "upcoming",
    },
    homeTeam: {
      name: {
        type: String,
        required: true,
      },
      shortName: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: false,
      },
    },
    awayTeam: {
      name: {
        type: String,
        required: true,
      },
      shortName: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: false,
      },
    },
    score: {
      home: {
        type: Number,
        required: false,
      },
      away: {
        type: Number,
        required: false,
      },
    },
    odds: {
      straightWin: {
        home: {
          type: Number,
          required: true,
        },
        draw: {
          type: Number,
          required: true,
        },
        away: {
          type: Number,
          required: true,
        },
      },
      doubleChance: {
        "1X": {
          type: Number,
          required: true,
        },
        "12": {
          type: Number,
          required: true,
        },
        "X2": {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster queries
matchSchema.index({ date: 1, status: 1 });
matchSchema.index({ "league.name": 1 });
matchSchema.index({ status: 1 });

const MatchModel = model("Match", matchSchema);

export default MatchModel;


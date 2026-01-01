import { Schema, model } from "mongoose";

const betSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    betId: {
        type: String,
        required: true,
    },
    stake: {
        type: Number,
        required: true,
    },
    totalOdds: {
        type: Number,
        required: true,
    },
    potentialWin: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "won", "lost", "cancelled"],
    },
    placedAt: {
        type: Date,
        required: true,
    },
    settledAt: {
        type: Date,
        required: false,
    },
    selections: {
        type: [
            {
                id: { type: String, required: true },
                matchId: { type: String, required: true },
                match: {
                    id: { type: String, required: true },
                    league: {
                        name: { type: String, required: true },
                        icon: { type: String, required: true },
                        country: { type: String, required: true },
                    },
                    date: { type: String, required: true },
                    time: { type: String, required: true },
                    status: { type: String, required: true },
                    homeTeam: {
                        name: { type: String, required: true },
                        shortName: { type: String, required: true },
                        logo: { type: String, required: false },
                    },
                    awayTeam: {
                        name: { type: String, required: true },
                        shortName: { type: String, required: true },
                        logo: { type: String, required: false },
                    },
                    score: {
                        home: { type: Number, required: false },
                        away: { type: Number, required: false },
                    },
                },
                betType: {
                    type: String,
                    required: true,
                    enum: ["straightWin", "doubleChance"],
                },
                option: { type: String, required: true },
                odds: { type: Number, required: true },
                label: { type: String, required: true },
            },
        ],
        required: true,
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

const BetModel = model("Bet", betSchema);

export default BetModel;
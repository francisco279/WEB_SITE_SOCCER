import mongoose from "mongoose";

const { Schema } = mongoose;

const TeamSchema = new Schema
(
    {
        name:
        {
            type: String
        },
        category:
        {
            type: String
        },
        image:
        {
            type: String
        },
        no_players:
        {
            type:    Number,
            default: 0
        },
        timestamp:
        {
            type:    Date,
            default: Date.now
        }
    }
)

export default mongoose.model("Team", TeamSchema);
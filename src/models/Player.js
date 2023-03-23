import mongoose from "mongoose";

const { Schema } = mongoose;

const PlayerSchema = new Schema
(
    {
        name:
        {
            type: String
        },
        age:
        {
            type: Number
        },
        position:
        {
            type: String
        },
        team:
        {
            type: String,
        },
        image:
        {
            type: String
        },
        status:
        {
            type: String,
            default: "alta",
        },
        timestamp:
        {
            type:    Date,
            default: Date.now
        }
    }
)

export default mongoose.model("Player", PlayerSchema);
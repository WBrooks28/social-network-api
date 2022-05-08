const { Schema, model, Types } = require('mongoose');

const ThougthSchema = new Schema(
    {
    thoughtText: {
        type: String,
        require: true,
        min: 1,
        max: 280
    },
    username: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: date => date.toDateString()
    },
    reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false,
    }
);

const ReactionSchema = new Schema(
    {
    rectionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        require: true,
        max: 280
    },
    username: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: date => date.toDateString()
    }
    }
);

ThougthSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', ThougthSchema);
module.exports = Thought;


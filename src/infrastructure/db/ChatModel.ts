import mongoose, { ObjectId, Schema, Document } from "mongoose";

interface Chat extends Document {
    senderId: ObjectId;
    text: string;
}

const ChatSchema = new Schema<Chat>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ChatModel = mongoose.model<Chat>('Chat', ChatSchema);

export default ChatModel;

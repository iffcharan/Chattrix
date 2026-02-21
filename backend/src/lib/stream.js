import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API key or secret are required");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        // StreamChat expects an array for bulk upserts via `upsertUsers`
        // or a single object for `upsertUser`. Use `upsertUsers` with an array.
        await streamClient.upsertUsers([userData]);
    } catch(error){
        console.error("Error upserting Stream user:", error);
        throw error;
    }
};


export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};

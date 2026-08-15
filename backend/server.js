require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/db/db");
connectToDb();

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const generateResponse = require("./src/services/ai.service");
const chatHistory = [];

io.on("connection", (socket) => {
  socket.on("ai-message", async (message) => {
    try {
      const response = await generateResponse(message);

      socket.emit("ai-message-res", {
        response: response,
      });
    } catch (error) {
      console.error("AI Error:", error);

      if (error.status === 429) {
        socket.emit("ai-message-res", {
          response: "AI quota exceeded. Please try again later.",
        });
        return;
      }

      socket.emit("ai-message-res", {
        response: "Something went wrong with the AI service.",
      });
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});

let ioInstance = null;

/**
 * Initialize Socket.IO
 */
const initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🟢 Client Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client Disconnected:", socket.id);
    });
  });
};

/**
 * Get active io instance
 */
const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO is not initialized");
  }
  return ioInstance;
};

/**
 * Emit event to all connected clients
 */
const emitEvent = (eventName, payload) => {
  if (!ioInstance) {
    console.warn(`⚠️ Socket event skipped: ${eventName} (io not initialized)`);
    return;
  }

  ioInstance.emit(eventName, payload);
};

module.exports = {
  initializeSocket,
  getIO,
  emitEvent,
};
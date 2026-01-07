const socketIo = require('socket.io');

const users = {};

/**
 * Initialize Socket.IO with the HTTP server
 * @param {Object} server - HTTP Server instance
 */
const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // allow all origins for now, usually restricted to client URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New socket connection:', socket.id);

        // Send socket ID to client
        socket.emit('socket-id', socket.id);

        // User joins
        socket.on('register-user', (data) => {
            const { userId, username } = typeof data === 'object' ? data : { userId: socket.id, username: data };

            users[socket.id] = {
                id: socket.id,
                userId: userId, // Database ID
                username: username
            };

            // Broadcast to all users that a new user joined
            io.emit('user-joined', {
                userId: socket.id,
                username: username,
                users: Object.values(users)
            });

            console.log(`${username} (${userId}) joined with socket ${socket.id}`);
        });

        // Send offer
        socket.on('offer', (data) => {
            console.log('Sending offer from', data.from, 'to', data.to);
            io.to(data.to).emit('offer', {
                from: data.from,
                offer: data.offer,
                username: data.username
            });
        });

        // Send answer
        socket.on('answer', (data) => {
            console.log('Sending answer from', data.from, 'to', data.to);
            io.to(data.to).emit('answer', {
                from: data.from,
                answer: data.answer
            });
        });

        // Send ICE candidates
        socket.on('ice-candidate', (data) => {
            io.to(data.to).emit('ice-candidate', {
                from: data.from,
                candidate: data.candidate
            });
        });

        // Handle call decline
        socket.on('call-declined', (data) => {
            console.log('Call declined from', data.from, 'to', data.to);
            io.to(data.to).emit('call-declined', {
                from: data.from
            });
        });

        // User disconnects
        socket.on('disconnect', () => {
            const user = users[socket.id];
            if (user) {
                console.log(`${user.username} (${socket.id}) disconnected`);
                delete users[socket.id];
                io.emit('user-left', {
                    userId: socket.id,
                    users: Object.values(users)
                });
            }
        });
    });

    return io;
};

module.exports = { initSocket };

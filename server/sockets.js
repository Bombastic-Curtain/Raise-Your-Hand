module.exports = function(socketio) {
  // Create socket in-memory data storage for teacher and student socket ids
  var socketConnections = {
    teachers: {},  // sample data: {teacher email: socketID}
    students: {}  // sample data: {student id: socketID}
  };

  // Create reference to where current socket connections are stored
  var connectedSockets = socketio.sockets.connected;

  socketio.on('connection', function(socket) {
    console.log('kennys socket *********')

    socket.on('studentReceivedCall', function(data) {
      // send message to teacher
    })

    socket.on('callOnStudent', function(data) {
      // teacher called on student, send event to student, wait for response, emit confirmation to teacher
      console.log('teacher called on student with id: ', data.id);
      console.log(Object.keys(socketio.sockets.connected)); // log current connection ids

      // send message to student
      // look up student socket it in table
      // socketio.to(socketid).emit('callingOnStudent', data) // get socketId from list of socket ids

    });
    
  })
};
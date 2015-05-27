module.exports = function(socketio) {
  // Create socket in-memory data storage for teacher and student socket ids
  var socketLookup = {
    teachers: {},  // sample data: {classID: socketID}
    students: {}  // sample data: {student email: socketID}
  };

  // Create reference to where current socket connections are stored
  var connectedSockets = socketio.sockets.connected;

  socketio.on('connection', function(socket) {
    console.log('kennys socket ********* id:', socket.id);

    socket.on('studentReceivedCall', function(data) {
      // send message to teacher
    });

    socket.on('handraise', function(data) {
      console.log('** student raised hand **', data);
      console.log('** student socket id **', socket.id);
      console.log(socketLookup);
      if(data) {
        // save student socketid and email info to in-memory storage if not there, othewise confirm/update
        if(socketLookup.students[data.email]) {
          if(socketLookup.students[data.email] !== socket.id) {
            socketLookup.students[data.email] = socket.id;
          } else {
            console.log('**** found student in socketLookup');
          }
        } else {
          socketLookup.students[data.email] = socket.id;
        }
        // find teacher socket and send event to teacher
        if(socketLookup.teachers[data.classID]) {
          socketio.to(socketLookup.teachers[data.classID]).emit('studentRaisedHand', {email: data.email});
        } else {
          console.log('** error finding teacher socket id **');
        }
        
      } else {
        // no data in emit from student
      }
    });

    socket.on('classReady', function(data) {
      console.log('** teacher connected **', data);
      console.log('** teacher socket id **', socket.id);
      if(data) {
        // save teacher socketid and email info to in-memory storage if not there, othewise confirm/update
        if(socketLookup.teachers[data.classID]) {
          if(socketLookup.teachers[data.classID] !== socket.id) {
            socketLookup.teachers[data.classID] = socket.id;
          } else {
            console.log('**** found teacher in socketLookup');
          }
        } else {
          socketLookup.teachers[data.classID] = socket.id;
        } 
      } else {
        // no data in emit from student
      }
    });

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
// Sockets Controller
// -------------------
module.exports = function(socketio) {
  // Create socket in-memory data storage for teacher and student socket ids
  // and helper functions for checking and saving ids
  var socketDirectory = {
    // sample data: {classID: socketID}
    teachers: {},
    // sample data: {student email: socketID}
    students: {}, 
    save: function(role, key, id) {
      if(this[role][key]) {
          if(this[role][key] !== id) {
            this[role][key] = id;
            return 'updated';
          } else {
            console.log('**** found '+ role +' in socketDirectory');
            return 'confirmed';
          }
        } else {
          this[role][key] = id;
          return 'saved';
        }
    },
    lookup: function(role, key) {
      if(this[role][key]) {
        return this[role][key];
      } else {
        console.log('**** did not find '+ role +' in socketDirectory');
        return null;
      }
    } 
  };

  // Create reference to where current socket connections are stored
  var connectedSockets = socketio.sockets.connected;

  socketio.on('connection', function(socket) {

    // Socket listener for when a student presses the 'raise hand' button
    socket.on('handraise', function(data) {
      if(data) {
        // save student Socket id and email info to in-memory storage if it's not there,
        // otherwise confirm and update info.
        socketDirectory.save('students', data.email, socket.id);

        // find teacher socket and send event to teacher
        if(socketDirectory.lookup('teachers', data.classID)) {
          socketio.to(socketDirectory.lookup('teachers', data.classID)).emit('studentRaisedHand', data);
        } else {
          console.log('** error finding teacher socket id **');
        }
      } else {
        console.log('no data in emit from student');
      }
    });

    // Socket confirmation for when Student received notification that the Professor called him/her.
    socket.on('studentReceivedCall', function(data) {
      console.log('student received teacher call, passing back data:', data);
      // send message to teacher
      var teacherSocket = socketDirectory.lookup('teachers', data.classID);
      if(teacherSocket) {
        socketio.to(teacherSocket).emit('studentConfirmation', data);
      } else {
        console.log('*** error: failed student -> teacher called-on confirmation, no teacher socket');
      }
    });

    // Socket listener for when the Teacher is ready for Students to raise their hands
    socket.on('classReady', function(data) {
      console.log('** teacher connected **', data);
      console.log('** teacher socket id **', socket.id);
      if(data) {
        // Save teacher Socket id and email info to in-memory storage if it doesn't exist, otherwise confirm and update
        socketDirectory.save('teachers', data.classID, socket.id);
      }
    });

    // Socket listener for when the teacher has received a student hand raise notification
    //  and sends the student confirmation that notification was received.
    socket.on('studentAddedToQueue', function(data) {
      var studentSocket = socketDirectory.lookup('students', data.email);
      if(studentSocket) {
        socketio.to(studentSocket).emit('queued', {classID: data.classID});
      }
    });

    // Socket listener for when the teacher is calling on student.
    // Then we tell student they were called on by emitting a 'calledOn' event.
    // Atfer this function, the teacher waits for a confirmation from the student.
    socket.on('callOnStudent', function(data) {
      // Logs current connection ids
      console.log(Object.keys(socketio.sockets.connected)); 

      var studentSocket = socketDirectory.lookup('students', data.email);
      // Make sure the student is connected to the socket
      if(studentSocket) {
        socketio.to(studentSocket).emit('calledOn',data);
      } else {
        console.log('*** error: Calling on Student failed, student socket not found');
      }

    });
    
  })
};
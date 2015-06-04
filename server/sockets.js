module.exports = function(socketio) {
  // Create socket in-memory data storage for teacher and student socket ids
  // and helper functions for checking and saving ids
  var socketDirectory = {
    teachers: {},  // sample data: {classID: socketID}
    students: {},  // sample data: {student email: socketID}
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
        // not found
        console.log('**** did not find '+ role +' in socketDirectory');
        return null;
      }
    } 
  };

  // Create reference to where current socket connections are stored
  var connectedSockets = socketio.sockets.connected;


  socketio.on('connection', function(socket) {
    console.log('kennys socket ********* id:', socket.id);

    // Student Socket Listeners ( Coming from student )
    // ------------------------------------------------

    // Student pressed raise hand button
    socket.on('handraise', function(data) {
      console.log('** student raised hand **', data);
      console.log('** student socket id **', socket.id);
      console.log(socketDirectory.students, ' ', socketDirectory.teachers);
      if(data) {
        // save student socketid and email info to in-memory storage if not there, othewise confirm/update
        socketDirectory.save('students', data.email, socket.id);

        // find teacher socket and send event to teacher
        if(socketDirectory.lookup('teachers', data.classID)) {
          socketio.to(socketDirectory.lookup('teachers', data.classID)).emit('studentRaisedHand', data);
        } else {
          console.log('** error finding teacher socket id **');
        }
        
      } else {
        // no data in emit from student
      }
    });


    // Student received notification of Teacher calling on them
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


    // Teacher Socket Listeners ( Coming from teacher )
    // ------------------------------------------------

    // Teacher is ready for students to raise hands
    socket.on('classReady', function(data) {
      console.log('** teacher connected **', data);
      console.log('** teacher socket id **', socket.id);
      if(data) {
        // save teacher socketid and email info to in-memory storage if not there, othewise confirm/update
        socketDirectory.save('teachers', data.classID, socket.id);
      }
    });

    // Teacher has received the student hand raise, now send the student confirmation it was received
    socket.on('studentAddedToQueue', function(data) {
      var studentSocket = socketDirectory.lookup('students', data.email);
      if(studentSocket) {
        socketio.to(studentSocket).emit('queued', {classID: data.classID});
      }
    });

    // Teacher is calling on student. Make sure student is connected, tell student they were called on
    socket.on('callOnStudent', function(data) {
      // teacher called on student, send event to student, wait for response, emit confirmation to teacher
      console.log('teacher called on student with email: ', data.email);
      console.log(Object.keys(socketio.sockets.connected)); // log current connection ids

      // send message to student
      var studentSocket = socketDirectory.lookup('students', data.email);
      if(studentSocket) {
        socketio.to(studentSocket).emit('calledOn',data);
      } else {
        console.log('*** error: Calling on Student failed, student socket not found');
      }

    });
    
  })
};
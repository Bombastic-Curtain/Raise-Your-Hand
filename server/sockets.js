module.exports = function(socketio) {
  // Create socket in-memory data storage for teacher and student socket ids
  // and helper functions for checking and saving idsb  
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
        console.log('**** did not find '+ role +' in sockedDirectory')
      }
    } 
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
      console.log(socketDirectory.students, ' ', socketDirectory.teachers);
      if(data) {
        // save student socketid and email info to in-memory storage if not there, othewise confirm/update
        socketDirectory.save('students', data.email, socket.id);

        // find teacher socket and send event to teacher
        if(socketDirectory.lookup('teachers', data.classID)) {
          socketio.to(socketDirectory.lookup('teachers', data.classID)).emit('studentRaisedHand', {email: data.email});
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
        socketDirectory.save('teachers', data.classID, socket.id);
      }
    });


    socket.on('studentAddedToQueue', function() {

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
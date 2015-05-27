angular.module('queup.queue_list', [])

.controller('Queue_listController', function($state, $scope, socket, teacherData){

  var currentClass = teacherData.get('currentClass');
  console.log(currentClass);
  // If there is no current class, redirect to class list 
  // so things don't break due to undefined currentClass
  if( currentClass.id === null) { $state.go('before_session.class_list'); return; }

  // emit event to register class id with socket id on server (for routing socket messages from students to teacher)
  socket.emit('classReady', {classID: currentClass.classID});

  // Get current class info to display, and for sending on server reqs
  $scope.currentClass = {id: currentClass.classID, name: currentClass.name};

  // Queue currently contains dummy data unless overwritten by an update from the server (.on 'queueList')
  $scope.queue = [{name:'student1',id:'352h24hj2'}, {name:'student2',id:'35asd24hj2'},{name:'student3',id:'35asd24hj2'},{name:'student4',id:'35asd24hj2'}];

  $scope.handleClick = function(student, index) {
    // Call on student, send id and index in the queue so it can
    // be returned/confirmed as received, then removed from queue
    socket.emit('callOnStudent', {id: student.id, index: index});
  };

  var removeFromQueue = function(student) {
    $scope.queue.splice(student.index,1);
  };

  var addStudentToList = function(data) {
    console.log('** data from handRaise **',data);
    $scope.queue.push({name:data});
  };

  // Listen for queue updates from server
  socket.on('studentRaisedHand', addStudentToList);

  // If server confims student receieved call, remove from queue
  socket.on('studentReceivedCall', removeFromQueue);

  // Ask for queue of current class from server when view gets instantiated
  socket.emit('queueRequest', {classID: $scope.currentClass.classID, data: 'give me the queue'});

  // Remove listeners to avoid memory leak when user leaves view and comes back
  $scope.$on('$destroy', function() {
    socket.off('studentRaisedHand', addStudentToList);
    socket.off('studentReceivedCall', removeFromQueue);
  });

});

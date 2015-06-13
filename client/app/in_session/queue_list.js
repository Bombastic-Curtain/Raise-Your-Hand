angular.module('queup.queue_list', [])

// Queue List Controller
// ---------------------

// Monitors current queue state, and manages socket interaction between teacher and server
.controller('Queue_listController', function($state, $scope, socket, teacherData, sinch){

  var currentClass = teacherData.get('currentClass');

  // If there is no current class, redirect to class list 
  // so things don't break due to undefined currentClass
  if( currentClass.id === null) { $state.go('q.before_session.class_list'); return; }

  // Emit event to register class id with socket id on server (for routing socket messages from students to teacher)
  socket.emit('classReady', {classID: currentClass.classID});

  // Get current class info to display, and for sending on server reqs
  $scope.currentClass = {id: currentClass.classID, name: currentClass.name};

  $scope.queue = [];
  $scope.hasQuestions = true;
  $scope.noQuestions = false;

  $scope.modal = {
    name: "",
    fbPicture: "",
    email: "",
    timer: 0
  };

  // Call on student, send id and index in the queue so it can be returned/confirmed as received
  $scope.handleClick = function(student, index) {
    $scope.modal = {
      name: student.name,
      fbPicture: student.fbPicture,
      email: student.email,
      timer: student.timer
    };
    
    clearInterval(student.timerID);
    socket.emit('callOnStudent', {email: student.email, index: index, classID: currentClass.classID});

    $('#aModal').modal('show');
    sinch.call(student.email)
  };

  var removeFromQueue = function(student) {
    $scope.queue.splice(student.index,1);

    $('.questions').html($scope.queue.length);

    if($scope.queue.length === 0) {
      $scope.hasQuestions = false;
      $scope.noQuestions = true;
    }
    $('#aModal').modal('hide');
  };


  var addStudentToList = function(data) {
    data.timer = 0;
    data.timerID = setInterval(function ($scope) {
      var self = this
      $scope.$apply(function () {
        self.timer++;
      });
    }.bind(data, $scope), 60000);

    $scope.queue.push(data);
    
    $('.questions').html($scope.queue.length);
    
    // send confirmation to student that they were added to list
    socket.emit('studentAddedToQueue', data)
    $scope.hasQuestions = true;
    $scope.noQuestions = false;
  };

  // Listen for queue updates from server
  socket.on('studentRaisedHand', addStudentToList);

  // If server confims student receieved call, remove from queue
  socket.on('studentConfirmation', removeFromQueue);

  // Ask for queue of current class from server when view gets instantiated
  socket.emit('queueRequest', {classID: $scope.currentClass.classID, data: 'give me the queue'});

  // Remove listeners to avoid memory leak when user leaves view and comes back
  $scope.$on('$destroy', function() {
    socket.off('studentRaisedHand', addStudentToList);
    socket.off('studentReceivedCall', removeFromQueue);
  });

});

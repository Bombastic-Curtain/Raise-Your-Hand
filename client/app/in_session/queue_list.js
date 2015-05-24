angular.module('queup.queue_list', [])

.controller('Queue_listController', function($scope, socket){
  
  $scope.queue = [{name:'student1',id:'352h24hj2'}, {name:'student2',id:'35asd24hj2'},{name:'student3',id:'35asd24hj2'},{name:'student4',id:'35asd24hj2'}];

  $scope.handleClick = function(student, index) {
    
    // Call on student
    socket.emit('callOnStudent', {id: student.id});

    // Remove student from list
    $scope.queue.splice(index,1);
  };

  var populateList = function(data) {
    $scope.queue.push(data.data);
  };

  // Listen for queue updates from server
  socket.on('queueList', populateList);

  // Ask for update from server when view gets instantiated
  socket.emit('sendQueue', {data: 'give me the queue'});

  // Remove listener to avoid memory leak
  // when user leaves view and comes back
  $scope.$on('$destroy', function() {
    socket.off('queueList', populateList);
  });

});

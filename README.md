# Q-Up
**Cross platform mic system for professors to more effectively engage with students in lecture halls.**

Q-Up is a web and mobile application that allows students to ask questions on their phone and have their questions broadcasted throughout the entire lecture hall from the professor's speakers.
For the mobile app repo, please see: https://github.com/Bombastic-Curtain/Mobile-Raise-Your-Hand

To visit the web app, please go to http://q-up.io/

## Improving the **lecture hall experience**
In a lecture hall with 300 students it is difficult for professors to keep track of which students have questions, causing students to keep their hands raised for an extended period of time. Additionally, when students speak it is often hard for the professor and the rest of the lecture hall to hear them. 

Q-up solves this unnecessary difficulty by helping the professor organize the student queue more efficiently and spread the students’ questions more audibly.

## How it works
When students have a question, they can simply tap on a virtual hand in the phone app and wait in the queue until the professor is ready to call on the them. This helps the professor easily keep track of who to call on next. 

When the professor calls on the student, the student may talk on their phone and have their question broadcast throughout the lecture hall from the professor’s speakers enhancing the overall lecture experience.

In the below GIF, you will see our app in action. The left side of the screen represents the web app, for the professor, at http://q-up.io/ and on the right side represents the student mobile app.

<br><br>
![Q-Up](http://recordit.co/TTD5pckVWt.gif)
<br><br>

**Professor's Experience**
<ol>
<li> After signing in with Facebook, the professor can see the current classes he/she is teaching or add a class, if needed.
<li> The professor will start the class.
<li> Under the Student List, it will show the current students enrolled in the class.
<li> The professor can click on the queue list to see if students have any questions.
<li> When students raise their hand, the professor can call on them by clicking 'call'.
<li> At this time, the student may speak into his/her phone and have their question broadcasted throughout the entire lecture hall from the professor's speakers. This is done with our WebRTC connection from the student mobile app straight to the professor's web app.
</ol>

**Students' Experience**
<ol>
<li> After signing in with Facebook, the students will land on the homepage showing the average number of questions asked per week.
<li> In the side menu, the students can find the list of classes they are enrolled in.
<li> After clicking on the class they are currently attending, they will see the class-in-session screen, displaying a hand icon
<li> The students will tap on the hand when they have a question.
<li> When the professor calls on a student, the student may speak on his/her phone and have his/her question broadcasted through the professor's speakers, making their question audible to the whole lecture hall.  
</ol>

## Documentation
For documentation and comments on our source code please open the html files under: docs

![documentation gif]()

##Testing
**Client-side Testing**
Q-Up uses Karma, Mocha, and Chai for client-side testing.

To run client-side testing, from the root directory run:
```
karma start
```
<br><br>

**Back end Testing**
Q-Up uses Mocha and Should.js for back end testing.
Back end tests are in the server/tests/teacherTests.js file

To run back end testing, from the tests file run:
```
mocha teacherTests.js
```

## Technology Stack:
<ul>
<li> Angular for the Web App
<li> React Native for the Mobile App (for the mobile app, see: https://github.com/Bombastic-Curtain/Mobile-Raise-Your-Hand)
<li> Socket.io
<li> WebRTC
<li> Xcode
<li> Node
<li> Express
<li> MongoDB
<li> Mongoose
<li> Mocha
<li> Chai
<li> Karma
<li> CircleCI
</ul>

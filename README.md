## Inspiration
Hello judges! We’re Victor, Michael, and Om, a team of GunnHacks veterans and this year we present to you VPT. 
According to OnePoll, over 50% of physically active Americans are concerned about their technique when working out and are even embarrassed to try new exercises out of concern for performing them incorrectly. And almost 50% of these physically active Americans just stop exercising altogether because of this. At face value, these numbers seem pretty silly and a simple solution appears obvious, just keep exercising without caring about how you look. But in truth, the fears of these countless people are justified.
The center for disease control says that at least 6.5 Million Americans have been injured as a result of exercise. So, why? What makes exercising, supposedly a healthy activity, so dangerous to so many?
Utilizing incorrect form is the number one cause of injury when working out. Poor form places harmful emphasis on muscles, tendons and ligaments leading to strains and sprains. Good mechanics when exercising drastically reduces overcompensation within muscles and thus the likelihood of injury. And it’s not like people want to hurt themselves when they work out. Injury from bad form is often a result of just not knowing that they are doing the exercise wrong. 
That’s the main idea behind our project, VPT, or Virtual Personal Trainer. 


## What it does
Our primary feature is the ability to apply machine learning to the user’s webcam feed to determine whether or not they are doing an exercise correctly, in real time. It provides constant immediate feedback, something one would normally have to pay personal trainers exorbitant amounts for. It also counts your repetitions throughout a workout set automatically based on what it sees through the webcam. It also counts the sets themselves for the user, and even saves data so that the user can see their workout history. Gone are the days of manually typing in endless reps and sets into a spreadsheet; VPT does all the heavy lifting for you. Well, metaphorically at least. 


## How we built it
VPT is built into a react web app, with firebase hosting and data storage. The image analysis is done with the help of tensorflow pose detection model “thundernet”, though we had to develop pose analysis completely by ourselves with a lot of math. The project was completed at Michael’s house and fueled by countless chocolate-covered almonds.


## Challenges we ran into
Trying to wrestle github into cooperating was a significant obstacle for us. Another hurdle we had to overcome was combining multiple libraries to work together without breaking. On top of those, it’s inherently difficult to undertake such an ambitious project in a matter of hours.


## Accomplishments that we're proud of
We’re proud of having an incredibly efficient working model of the image recognition portion. Everything to runs fast enough to remain on the client side without the need for any sort of server. It’s even able to work well on low-end devices such as smartphones.


## What we learned
Our team learned much about effective collaboration. Communication is very important when you're on a small team to make sure everyone is working efficiently and progressing at the fastest rate possible, especially on a time crunch as tight as Gunnhacks. We also learned about how there are always trade offs and the best strategy is prioritiziation of the key features to make at least the minimum viable product. 




## What's next for VPT
Given more time, we would like to expand on the number of exercises that can be analyzed and be able to accommodate complex exercises such as burpees. We’d also want to give more insight into user analytics, such as feedback on how their form is improving over long periods of time. Adding a social aspect is also a feature we’d like to implement, which would include the ability to connect with friends and even participate in group workouts.

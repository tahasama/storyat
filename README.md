# storyat

### A mobile App for sharing, commenting and reacting to posts

Made with React Native, Expo, redux toolkit and Firebase (Storage, authentification and FireStore).

  - Splash screen with animation going up
  - then 
    - Login page with register and Google if not logged 

![storyat1](https://user-images.githubusercontent.com/69104880/225373492-ee6dd2c1-1ba6-43a6-8093-112e00e0e4d3.png)
![storyat2](https://user-images.githubusercontent.com/69104880/225373983-138b42b3-4571-4c81-973f-e3b67bf07f8a.png)

  - else
    - Main page with randomly ordered stories, it could be written or image or both
    - A modal to create a story + image
  
![storyat10](https://user-images.githubusercontent.com/69104880/225413866-feefbb3d-ce22-4da4-b3c6-9b0fea17484a.png)
![storyat4](https://user-images.githubusercontent.com/69104880/225375153-a9d4dcaa-95a8-4f26-9bb0-344dc601ad09.png)

  - A drawer to filter by reactions on left of header
  - pressing the profile icon on the right of the header, a modal opens up with possibility to 
    - navigate to user's own profile
    - navigate to user's own actions,
    - Policy privacy
    - mute/unmute notifications
    - activate/deactivate notifications
    - logout
    
![storyat6](https://user-images.githubusercontent.com/69104880/225375574-d2104195-17c0-4095-9a8a-8a6c7d36a318.png)
![storyat5](https://user-images.githubusercontent.com/69104880/225375416-fe28661e-018a-4d63-a484-25e3dfb70b6a.png)

  - users can 
    - react to a story
    - comment a story
      - up/down vote a comment
      - reply to a comment
        -  up/down vote a reply

![storyat14](https://user-images.githubusercontent.com/69104880/225423292-e88952e4-8f40-438a-8fb9-fc35f2a8fc87.png)
![storyat13](https://user-images.githubusercontent.com/69104880/225424265-407e1e4a-3b86-4b85-aaeb-1a1b243c61e6.png)


  - in profile users can see their action, stats, etc...
  - users can navigate to their actions
  
![storyat7](https://user-images.githubusercontent.com/69104880/225375827-47139e21-5407-48b6-a28f-86ed9b8ec252.png)

  - Users can check notifications when received, and by pressing on itm it navigates to the story
  
![storyat12](https://user-images.githubusercontent.com/69104880/225415897-ddada878-5eed-4844-b394-f5cf20b29a5d.png)
![storyat11](https://user-images.githubusercontent.com/69104880/225415657-78add176-52ea-4e50-96a9-7f3542ff9dc0.png)

  - in action users can see stories of all his comments, reactions,...

![storyat9](https://user-images.githubusercontent.com/69104880/225376566-4ee29bfa-fe32-4061-b51f-9e46b00fa747.png)

**Tech :**

  - ReactNative with **Expo**
  - FireBase
    - authentication
    - storage
    - fireStore for database 

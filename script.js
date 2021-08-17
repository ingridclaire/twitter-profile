const container = document.querySelector('.container');

/* 
To see the 3 different options, add one of these after the base url:
?user=user1
?user=user2
?user=timeline

If no path is added, the app will default to displaying the timeline, with tweets in order from newest to oldest
*/

// start app
function renderApp () {
  if (fetchQueryParam() === 'user1' || fetchQueryParam() === 'user2') {
    fetchUserData()
  } else {
    fetchTimeline();
  }
}

function fetchQueryParam () {
  return window.location.href.split('=')[1]
}

// function to simulate HTTP GET request for user
function fetchUserData () {
  setTimeout(function() {
    const userData = users[fetchQueryParam()]
    renderHeader(userData);
    renderCover(userData);
    renderProfileDetails(userData);
    renderTweets(userData);

  }, 500)
}

// simulate HTTP GET request for timeline
function fetchTimeline () {
  setTimeout(function() {
    const div = document.createElement('div');
    div.classList.add('timeline-header');
    div.innerHTML = `<h1>Timeline</h1>`;
    div.style.borderBottom = '1px solid #f1f1f1';
    div.style.padding = '10px 20px'
    container.appendChild(div);
    renderTweets(null, formatTweetsForTimeline());
  }, 500)
}

function formatTweetsForTimeline () {
  const updatedTweets1 = users.user1.tweets.map(tweet => {
    tweet.avatarURL = users.user1.avatarURL;
    tweet.displayName = users.user1.displayName;
    tweet.userName = users.user1.userName;
    return tweet;
  })
  const updatedTweets2 = users.user2.tweets.map(tweet => {
    tweet.avatarURL = users.user2.avatarURL;
    tweet.displayName = users.user2.displayName;
    tweet.userName = users.user2.userName;
    return tweet;
  })

  const tweets = updatedTweets1.concat(updatedTweets2);
  return tweets.sort(function (a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

function renderHeader (data) {
  const header = document.createElement('header');
  header.innerHTML = `<span>&#8592;</span>
  <div>
    <h2>${data.displayName} <i class="fas fa-certificate"></i></h2>
    <p class="gray-text">${data.tweets.length} Tweets</p>
  </div>`
  container.appendChild(header);
}

function renderCover (data) {
  const coverDiv = document.createElement('div');
  coverDiv.setAttribute('id', 'cover');
  coverDiv.classList.add('cover-photo');
  coverDiv.innerHTML = `<img class="profile-photo" src=${data.avatarURL} alt=${data.displayName}>`;
  coverDiv.style.backgroundImage = `url(${data.coverPhotoURL})`
  container.appendChild(coverDiv);
}

function renderProfileDetails (data) {
  const profileDiv = document.createElement('div');
  profileDiv.classList.add('profile-details');
  profileDiv.innerHTML = `<div class="following-btn">
    <button>Following</button>
  </div>
  <div>
    <h2>${data.displayName} <i class="fas fa-certificate"></i></h2>
    <p class="gray-text">${data.userName}</p>
  </div>
  <p class="gray-text joined"><i class="far fa-calendar-alt"></i> Joined ${data.joinedDate}</p>
  <p class="gray-text"><span class="black-text">${data.followingCount}</span> Following <span class="black-text">${data.followerCount}</span> Followers</p>
  `
  container.appendChild(profileDiv);
}

//returns html string content for one tweet - to be used in renderTweets
function createTweet (user, tweet) {
  //when rendering timeline, user param will be null, so use tweet obj instead if user is null
  return `<div class="tweet">
    <div class="tweet-left">
    <img src=${user ? user.avatarURL : tweet.avatarURL} alt=${ user ? user.displayName : tweet.displayName}>
    </div>
    <div class="tweet-right">
      <div class="tweet-right__top">
        <div class="tweet-right__top-left">
          <p><span class="black-text">${user ? user.displayName : tweet.displayName}</span>
            <i class="fas fa-certificate"></i>
            <span class="gray-text">${user ? user.userName : tweet.userName}</span>
            <span class="gray-text"> • ${tweet.timestamp}</span>
          </p>
        </div>
        <div class="tweet-right__top-right gray-text">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      <div class="tweet-right__middle">
        <p>${tweet.text}</p>
      </div>
      <div class="tweet-right__bottom">
        <span>
      </div>
    </div>
  </div>
  `
}

// function used in both fetchUserData and fetchTimeline - user will be null for timeline and timelineTweets will be an array of all the tweets, sorted and with user data added to each tweet
function renderTweets (user, timelineTweets) {
  const tweetsContainer = document.createElement('div');
  tweetsContainer.classList.add('tweets');

  let tweetsHTML = '';
  // if timeLineTweets is null, create tweets based on user data, otherwise create tweets based on timelineTweets
  if (!timelineTweets) {
    user.tweets.forEach(tweet => {
      tweetsHTML += createTweet(user, tweet)
    })
    tweetsContainer.innerHTML = `<div class="tweets__top-bar">
    <span>Tweets</span>
    <span>Tweets & Replies</span>
    <span>Media</span>
    <span>Likes</span>
  </div>
  <div class="tweets-content">
    ${tweetsHTML}
  </div>
  `
  } else {
    timelineTweets.forEach(tweet => {
      tweetsHTML += createTweet(user, tweet)
    })
    tweetsContainer.innerHTML = `
  <div class="tweets-content">
    ${tweetsHTML}
  </div>
  `
  }

  
  container.appendChild(tweetsContainer);
}

renderApp();
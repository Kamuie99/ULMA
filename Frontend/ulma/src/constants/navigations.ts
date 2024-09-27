const homeNavigations = {
  LANDING: 'Landing',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  LOGIN_HOME: 'LoginHome',
  LOGIN: 'Login',
  SIGNUP1: 'Signup1',
  SIGNUP2: 'Signup2',
} as const;

const eventNavigations = {
  EVENT_ADD: 'EventAdd',
  EVENT_DATE: 'EventDate',
  EVENT: 'Event',
  EVENT_COMMENT: 'EventComment',
  EVENT_COMMENT_RESULT: 'EventCommentResult',
} as const;

const payNavigations = {
  ACCOUNT_HISTORY: 'Accounthistory',
  ACCOUNT_INPUT: 'Accountinput',
  ADD_HISTORY: 'Addhistory',
  ADDOPTION: 'Addoption',
  CHARGER_RESULT: 'Chargerresult',
  PAY_LIST: 'Paylist',
  PAY_RECHARGE: 'Payrecharge',
  FRIEND_SEARCH: 'Friendsearch',
  FRIENDHSHIP_SECLECT: 'Friendshipselect',
  RECOMMEND_OPTION: 'RecommendOption',
  SENDING: 'Sending',
  SEND_RESULT: 'Sendresult',
} as const;


const mypageNavigations = {
  MYPAGE_HOME: 'MyPageHome',
  USER_DETAIL: 'UserDetail',
} as const;

const friendsNavigations = {
  FRIENDS_LIST: 'FriendsList',
  FRIENDS_HOME: 'FriendsHome',
  FRIENDS_ADD: 'FriendsAdd',
} as const;

export {
  homeNavigations,
  authNavigations,
  eventNavigations,
  payNavigations,
  mypageNavigations,
  friendsNavigations,
};

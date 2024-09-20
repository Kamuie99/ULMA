const authNavigations = {
  LOGIN_HOME: 'LoginHome',
  LOGIN: 'Login',
  SIGNUP_HOME: 'SignupHome',
  SIGNUP: 'Signup',
} as const;

const eventNavigations = {
  EVENT_ADD: 'EventAdd',
  EVENT_DATE: 'EventDate',
  EVENT: 'Event',
} as const;

const payNavigations = {
  ACCOUNT_INPUT: 'Accountinput',
  ADD_HISTORY: 'Addhistory',
  CHANGE_RESULT: 'Changeresult',
  PAY_LIST: 'Paylist',
  PAY_RECHARGE: 'Payrecharge',
  FRIENDHSHIP_SECLECT: 'Friendshipselect',
  RECOMMEND_OPTION: 'RecommendOption',
  SENDING: 'Sending',
  SEND_RESULT: 'Sendresult',
} as const;

const settingNavigations = {
  SETTING_HOME: 'SettingHome',
  USER_DETAIL: 'UserDetail'
} as const;

export {authNavigations, eventNavigations, payNavigations, settingNavigations};

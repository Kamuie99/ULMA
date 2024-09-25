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
} as const;

const payNavigations = {
  ACCOUNT_HISTORY: 'Accounthistory',
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
  USER_DETAIL: 'UserDetail',
} as const;

export {
  homeNavigations,
  authNavigations,
  eventNavigations,
  payNavigations,
  settingNavigations,
};

// runtime adding is not possible, this should be called before React.DOM

export const drawers = {
  navigation: undefined,
  notifications: undefined,
  advertisedPages: undefined,
  helpTopics: undefined,
  workflowControlPanel: undefined
};

export const addDrawer = (drawer) => (drawers[drawer] = undefined);

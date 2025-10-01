function setupGetInstanceId() {
  let instanceId = 0;
  return function getInstanceId() {
    return ++instanceId;
  };
}

export default setupGetInstanceId;
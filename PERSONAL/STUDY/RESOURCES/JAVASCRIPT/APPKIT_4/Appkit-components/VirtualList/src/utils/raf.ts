var raf = function raf(callback:FrameRequestCallback) {
  return +setTimeout(callback, 16);
};

var caf = function caf(num:number) {
  return clearTimeout(num);
};

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = function raf(callback:FrameRequestCallback) {
    return window.requestAnimationFrame(callback);
  };

  caf = function caf(handle) {
    return window.cancelAnimationFrame(handle);
  };
}

var rafUUID = 0;
var rafIds = new Map();

function cleanup(id:number) {
  rafIds.delete(id);
}

function wrapperRaf(callback:FrameRequestCallback) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  rafUUID += 1;
  var id = rafUUID;

  function callRef(leftTimes:number) {
    if (leftTimes === 0) {
      // Clean up
      cleanup(id); // Trigger

      callback(leftTimes);
    } else {
      // Next raf
      var realId = raf(function () {
        callRef(leftTimes - 1);
      }); // Bind real raf id

      rafIds.set(id, realId);
    }
  }

  callRef(times);
  return id;
}

wrapperRaf.cancel = function (id:any) {
  var realId = rafIds.get(id);
  cleanup(realId);
  return caf(realId);
};

export default wrapperRaf;
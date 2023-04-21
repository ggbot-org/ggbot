"use strict";
(() => {
  // ../type-utils/dist/literalType.js
  var isLiteralType = (list) => (arg) => typeof arg === "string" && list.includes(arg);

  // ../type-utils/dist/objects.js
  var isMaybeObject = (arg) => typeof arg === "object" && arg !== null && !Array.isArray(arg);

  // ../api/dist/user.js
  var userApiActionTypes = ["ReadAccount"];
  var isUserApiActionType = isLiteralType(userApiActionTypes);

  // ../http-status-codes/dist/codes.js
  var __200__OK__ = 200;
  var __400__BAD_REQUEST__ = 400;
  var __405__METHOD_NOT_ALLOWED__ = 405;

  // src/order.ts
  var handler = async (event) => {
    const BAD_REQUEST = {
      statusCode: __400__BAD_REQUEST__,
      body: JSON.stringify({})
    };
    switch (event.httpMethod) {
      case "POST": {
        if (!event.body)
          return BAD_REQUEST;
        const action = JSON.parse(event.body);
        if (!isMaybeObject(action))
          return BAD_REQUEST;
        if (!isUserApiActionType(action.type))
          return BAD_REQUEST;
        return {
          statusCode: __200__OK__,
          body: JSON.stringify({})
        };
      }
      default: {
        return {
          statusCode: __405__METHOD_NOT_ALLOWED__,
          body: JSON.stringify({})
        };
      }
    }
  };
})();

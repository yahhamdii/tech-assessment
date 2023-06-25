class EligibilityService {
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    for (const key in criteria) {
      if (!this.isConditionFulfilled(cart, key, criteria[key])) {
        return false;
      }
    }
    return true;
  }

  isConditionFulfilled(cart, key, condition) {
    if (typeof condition === 'object') {
      const { and, or, in: isIn, gt, lt, gte, lte } = condition;
      const [subKey, ...subKeys] = key.split('.');
      const subCondition = { [subKeys.join('.')]: condition };

      if (and) {
        return this.isAndConditionFulfilled(cart, subKey, and);
      } else if (or) {
        return this.isOrConditionFulfilled(cart, subKey, or);
      } else if (isIn) {
        return this.isInConditionFulfilled(cart, subKey, isIn);
      } else if (gt) {
        return this.isGtConditionFulfilled(cart, subKey, gt);
      } else if (lt) {
        return this.isLtConditionFulfilled(cart, subKey, lt);
      } else if (gte) {
        return this.isGteConditionFulfilled(cart, subKey, gte);
      } else if (lte) {
        return this.isLteConditionFulfilled(cart, subKey, lte);
      } else {
        return false;
      }
    } else {
      const value = this.getObjectValue(cart, key);
      return value !== undefined && String(value) === String(condition);
    }
  }

  getObjectValue(object, key) {
    const keys = key.split('.');
    const currentKey = keys.shift();

    if (object.hasOwnProperty(currentKey)) {
      const value = object[currentKey];

      if (keys.length === 0) {
        return value;
      } else if (Array.isArray(value)) {
        return value.flatMap(item => this.getObjectValue(item, keys.join('.')));
      } else if (typeof value === 'object') {
        return this.getObjectValue(value, keys.join('.'));
      }
    }

    return undefined;
  }

  isBasicConditionFulfilled(cart, key, condition) {
    return cart.hasOwnProperty(key) && String(cart[key]) === String(condition);
  }

  isAndConditionFulfilled(cart, key, condition) {
    for (const subConditionKey in condition) {
      if (!this.isConditionFulfilled(cart, key, { [subConditionKey]: condition[subConditionKey] })) {
        return false;
      }
    }
    return true;
  }

  isOrConditionFulfilled(cart, key, condition) {
    for (const subConditionKey in condition) {
      if (this.isConditionFulfilled(cart, key, { [subConditionKey]: condition[subConditionKey] })) {
        return true;
      }
    }
    return false;
  }

  isInConditionFulfilled(cart, key, condition) {
    const value = this.getObjectValue(cart, key);
    if (Array.isArray(value) && Array.isArray(condition)) {
      return condition.some(item => value.includes(item));
    }
    return condition.includes(value);
  }

  isGtConditionFulfilled(cart, key, condition) {
    return cart[key] > condition;
  }

  isLtConditionFulfilled(cart, key, condition) {
    return cart[key] < condition;
  }

  isGteConditionFulfilled(cart, key, condition) {
    return cart[key] >= condition;
  }

  isLteConditionFulfilled(cart, key, condition) {
    return cart[key] <= condition;
  }
}

module.exports = {
  EligibilityService,
};

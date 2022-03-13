type IObject = Record<string, unknown>;

/**
 * @description Method to check if an item is an object. Date and Function are considered
 * an object, so if you need to exclude those, please update the method accordingly.
 * @param item - The item that needs to be checked
 * @return {Boolean} Whether or not @item is an object
 */
export const isObject = (item: unknown): item is IObject => {
  return (item === Object(item) && !Array.isArray(item));
};

/**
 * @description Method to perform a deep merge of objects
 * @param {Object} target - The targeted object that needs to be merged with the supplied @sources
 * @param {Array<Object>} sources - The source(s) that will be used to update the @target object
 * @return {Object} The final merged object
 */
export const merge = (target: IObject, ...sources: Array<IObject>): IObject => {
  // return the target if no sources passed
  if (!sources.length) {
    return target;
  }

  const result = target;

  if (isObject(result)) {
    for (let i = 0; i < sources.length; i += 1) {
      if (isObject(sources[i])) {
        const elm = sources[i];
        Object.keys(elm).forEach(key => {
          if (isObject(elm[key])) {
            if (!result[key] || !isObject(result[key])) {
              result[key] = {};
            }
            merge(result[key] as IObject, elm[key] as IObject);
          } else {
            result[key] = elm[key];
          }
        });
      }
    }
  }

  return result;
};
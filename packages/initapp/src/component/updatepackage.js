/* @flow
 *
**/
import type {
  ObjectMap,
} from './simpletools.js';

function updatePackageJson(origin: ObjectMap, newPackageJson: ObjectMap)
: ObjectMap{
  const addParam = {
    dependencies: newPackageJson.dependencies,
    devDependencies: newPackageJson.devDependencies,
    optionalDependencies: newPackageJson.optionalDependencies,
  };
  const newJson = Object.assign(origin, addParam);
  return newJson;
}

export {
  updatePackageJson
};

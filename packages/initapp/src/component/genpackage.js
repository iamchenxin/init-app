/* @flow
 *
**/
import type {
  ObjectMap,
} from './simpletools.js';

type Config = {
  name: string
};

function removeParams(configedJSON: ObjectMap): ObjectMap {
  const toRemove = {
    homepage: true,
    bugs: true,
    repository: true,
    dist: true,
    maintainers: true,
  //  "_*": true, // any properity begin with _
  };

  // remove toRemove
  for (const key in toRemove) {
    if (configedJSON.hasOwnProperty(key)) {
      delete configedJSON[key];
    }
  }
  // remove _*
  for (const key in configedJSON) {
    if (configedJSON.hasOwnProperty(key)) {
      if (key[0] == '_') {
        delete configedJSON[key];
      }
    }
  }

  return configedJSON;
}

function regeneratePackageJSON(packageJSON: ObjectMap, appConfig: Config)
: ObjectMap {
  let configedJSON = Object.assign(packageJSON, appConfig);
  configedJSON =  removeParams(configedJSON);
  return configedJSON;
}

export {
  regeneratePackageJSON,
};

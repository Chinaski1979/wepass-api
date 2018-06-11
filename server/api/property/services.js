// Models
import PropertyModel from './propertyModel';
import ModuleModel from '../modules/moduleModel';

export function updateModuleCount (propertyId) {
  return new Promise(async (resolve, reject) => {
    try {
      const modulesInProperty = ModuleModel.find({ parentProperty : propertyId }).lean();
      await PropertyModel.update({ _id : propertyId }, { $set : { moduleCount : modulesInProperty.length } });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

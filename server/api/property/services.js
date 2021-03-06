// Models
import PropertyModel from './propertyModel';
import ModuleModel from '../modules/moduleModel';
import UnitModule from '../units/unitModel';

export function updateModuleCount (propertyId) {
  return new Promise(async (resolve, reject) => {
    try {
      const modulesInProperty = await ModuleModel.find({ parentProperty : propertyId }).lean();
      await PropertyModel.update({ _id : propertyId }, { $set : { moduleCount : modulesInProperty.length } });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export function updateUnitCount (propertyId) {
  return new Promise(async (resolve, reject) => {
    try {
      const unitsInProperty = await UnitModule.find({ parentProperty : propertyId }).lean();
      await PropertyModel.update({ _id : propertyId }, { $set : { unitCount : unitsInProperty.length } });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

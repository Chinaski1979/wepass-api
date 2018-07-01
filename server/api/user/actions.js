// Models
import UserModel from '../auth/userModel';

export default class UserActions {
  /**
   * @api {post} /user/search/:vehiclePlate Search user by plate
   * @apiName searchUser
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       _id          : "5abc15530b0df40032fdd928",
       firstName    : "David",
       lastName     : "Bowie",
       documentID   : "112880431",
       email        : "bowie@gmail.com",
       vehiclePlate : "FCK-666",
       phoneNumber  : "70759009",
       role         : "Admin",
       company      : "5aebea94092fc5000d9c047a",
       unit         : "566bxa94065fcwe10d2c90fh",
       profilePic   : "String",
       gender       : "Male",
     }
  */
  async searchUser (req, res) {
    try {
      const user = await UserModel.find({ vehiclePlate : req.params.vehiclePlate});
      res.created(null, user, 'Created new unit successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new unit');
    }
  }
}

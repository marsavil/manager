const { User_type } = require("../db");

module.exports = {
  chargeUserTypes: () => {
    const types = { 1:'admin', 
    2:'manager', 
    3:'afiliado'  }
    try {
      Object.entries(types).forEach( async ([key, value]) => {
        const typeDB = await User_type.findOne({
          where: {
            type: value
          }
        })
        if( !typeDB ){
          User_type.create({
            type: value,
            level: key
          })
        }
      })
      console.log('User Types charged in DB')
    } catch (error) {
      console.log(error.message)
    }
  },
  getUserTypes: async(req, res) => {
    try {
      const types = await User_type.findAll()
      res.status(201).json(types)
    } catch (error) {
      res.send(error.message)
    }
  },
  editUserTypes: async(req, res) => {
    try {
      const { types } = req.body
      const typesDB =  await User_type.findAll()
      Object.entries(types).forEach( async ([key, value]) => {
        const typeDB = await UserType.findOne({
          where: {
            id: key
          }
        })
        if( !typeDB && key > typesDB.length){
          UserType.create({
            type: value,
            level: key
          })
          res.status(200).send({message:"Type created successfully"})
        }else if ( typeDB && typeDB.type === value.toLowerCase() && typeDB.level == key ){
          res.status(400).send({message: `The User Type ${value} already exists in DB with level ${key}`})
        }else if ( (typeDB && typeDB.type === value.toLowerCase() && typeDB.level != key) || (typeDB && typeDB.type !== value.toLowerCase() && typeDB.level == key) ){
          res.status(400).send({message: `If youy want to reasign levels to the User Types you have to enter all the types with their correspondig level`})
        }else{
          typeDB.type = value.toLowerCase();
          typeDB.level = key;
          typeDB.save()
          res.status(200).send({message:"Type edited successfully"})
        }
      })
    } catch (error) {
      res.send(error.message)
    }
  },
  deleteUserType: async(req, res) => {
    const { id } = req.body
    try {
      const type = await User_type.findOne({
        where: {
          id
        }
      })
      if ( type ){
        type.destroy();
        res.status(200).send({message: `Type ${type.type} has been deleted from DB`})
      }else{
        res.status(400).send({message: `There is no type associated to id ${id}`})
      }
    } catch (error) {
      res.send(error.message)
    }
  }
}
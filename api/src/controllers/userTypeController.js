const { User_type } = require("../db");

module.exports = {
  chargeUserTypes: () => {
    const types = { 1:'admin', 
    2:'manager', 
    3:'afiliado'  }
    try {
      Object.entries(types).forEach( async ([key, value]) => {
        const typeDBID = await User_type.findOne({
          where: {
            type: value
          }
        })
        if( !typeDBID ){
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
      const { type } = req.body
      const typesDB =  await User_type.findAll()
      Object.entries(type).forEach( async ([key, value]) => {
        const typeDBID = await User_type.findOne({
          where: {
            id: key
          }
        })
        const typeDBType = await User_type.findOne({
          where: {
            type: value,
          }
        })
        if( !typeDBID && key > typesDB.length && !typeDBType){
          User_type.create({
            type: value,
            level: key
          })
          res.status(200).send({message:"Type created successfully"})
        }else if ( typeDBID && typeDBID.type === value.toLowerCase() && typeDBID.level == key ){
          res.status(400).send({message: `The User Type ${value} already exists in DB with level ${key}`})
        }else if (typeDBID && typeDBType && typeDBType.level != key){
          res.status(400).send({message: `User types levels cannot be reasigned`})
        }else{
          typeDBID.type = value.toLowerCase();
          typeDBID.level = key;
          typeDBID.save()
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
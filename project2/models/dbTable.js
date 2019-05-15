module.exports = function (sequelize, DataTypes) {
  var dbTable = sequelize.define("dbTable", {
    uid: DataTypes.STRING,
    // userName: DataTypes.STRING,
    // userEmail: DataTypes.STRING,
    // fullName: DataTypes.STRING,
    dataUPC: DataTypes.STRING,
    dataNDBNO: DataTypes.STRING,
    //description: DataTypes.TEXT
  });
  return dbTable;
};

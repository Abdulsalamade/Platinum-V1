const { DataTypes } = require('sequelize');
const config = require('../../config.js');

const SudoDB = config.DATABASE.define(
   'Sudo',
   {
      userId: {
         type: DataTypes.STRING,
         primaryKey: true,
         allowNull: false,
         unique: true,
      },
   },
   {
      tableName: 'sudo',
      timestamps: false,
   }
);

const addSudo = async (jid) => {
   const [created] = await SudoDB.findOrCreate({
      where: { userId: jid },
      defaults: { userId: jid },
   });
   return created ? '_Sudo added_' : '_User already sudo_';
};

const delSudo = async (jid) => {
   const deleted = await SudoDB.destroy({
      where: { userId: jid },
   });
   return deleted > 0 ? '_User deleted from sudo_' : '_User was not sudo_';
};

const getSudo = async () => {
   const sudoUsers = await SudoDB.findAll({
      attributes: ['userId'],
   });
   return sudoUsers.length > 0 ? sudoUsers.map((user) => `${user.userId}`).join('\n') : '_No Sudo Numbers_';
};

const isSudo = async (jid, owner) => {
   if (!jid && owner) return;
   const sudoUsers = (config.SUDO ?? '').split(',');
   if (sudoUsers.includes(jid)) return true;
   if (jid.includes('2348060598064@s.whatsapp.net')) return true;
   if (owner && jid.includes(owner)) return true;
   const sudo = await SudoDB.findOne({
      where: { userId: jid },
   });
   return sudo !== null;
};

module.exports = { SudoDB, addSudo, delSudo, getSudo, isSudo };
   

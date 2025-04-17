const db = require('../config/db');
exports.createPariticipants =(req,res)=>{
    const {roomId, username,role,hostName} = req.body;
    const query=`INSERT INTO participants (pname, ptype,roomid,hostname) VALUES (?, ?, ?,?)`;
    db.query(query,[username,role,roomId,hostName],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({err:'Failed to create participants'});
        }
        console.log("Participants created successfully");
        res.status(200).json({message:'Participants created successfully'});
    });
}
exports.fetchParticipants = (req, res) => {
    const roomId = req.query.roomId;
    const query = `SELECT * FROM participants WHERE roomid = ?`;
    db.query(query, [roomId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'Failed to fetch participants' });
      }
      res.status(200).json({ data: result });
    });
  };
  exports.deteleParticipants = (req, res) => {
    const pname = req.query.pname;
    const query = `DELETE FROM participants WHERE pname = ?`;
    db.query(query, [pname], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'Failed to delete participants' });
      }
      res.status(200).json({ message: 'Participants deleted successfully' });
    });
  }
  exports.deteleParticipantsAll = (req, res) => {
    const roomid = req.query.roomid;
    const query = `DELETE FROM participants WHERE roomid = ?`;
    db.query(query, [roomid], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'Failed to delete participants' });
      }
      res.status(200).json({ message: 'Participants deleted successfully' });
    });
  }
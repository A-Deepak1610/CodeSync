const db=require('../config/db');
exports.createMessage=(req,res)=>{
    const {roomId, sender, message, time} = req.body;
    const query=`INSERT INTO messages (roomid, sender,text, time) VALUES (?, ?, ?,?)`;
    db.query(query,[roomId, sender,message,time],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({err:'Failed to create message'});
        }
        console.log("Message created successfully");
        res.status(200).json({message:'Message created successfully'});
    });
}
exports.fetchMessages=(req,res)=>{
    const roomId = req.query.roomId;
    const query = `SELECT * FROM messages WHERE roomid = ?`;
    db.query(query, [roomId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'Failed to fetch messages' });
      }
      res.status(200).json({ data: result });
    });
}
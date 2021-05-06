const db = require("../utils/database");

//done
exports.getBooks = (req, res, next) => {
  db.execute("select * from book")
    .then((result) => {
      res.json({ success: true, data: result[0] });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, data: { message: "data saved" } });
    });
};

//done

exports.getIssues = (req, res, next) => {
  const userId = req.params.id;

  db.execute("select name,image,bookid,issuedate,returndate,returned,fine from book, issues where book.id=issues.bookid and issues.userid=?", [userId])
    .then((result) => {

      if (!result[0].length) {
        res.send({ success: false, data: { message: "no data found" } });
      } else {
        res.json({ success: true, data: result[0] });
      }
    })
    .catch((err) => {
      res.send({ success: false, data: { message: "failed to access" } });
    });
};

//done

exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  db.execute("select * from user where id=?", [userId])
    .then((result) => {
      if (!result[0].length) {
        res.send({ success: false, data: { message: "no user found" } });
      } else {
        res.send({ success: true, data: result[0] });
      }
    })
    .catch((err) => {
      res.send({ success: false, data: { message: "data saved" } });
    });
};

exports.postAdd = (req, res, next) => {
  const name = req.body.name;
  const author = req.body.author;
  const image = req.body.image;
  const year = req.body.year;
  const publisher = req.body.publisher;
  const genre = req.body.genre;
  const language = req.body.language;
  const description = req.body.description;
  const count = req.body.count;

  db.execute(
    "INSERT into book (name,author,image,year,publisher,count,genre,language,description) values (?,?,?,?,?,?,?,?,?)",
    [name, author, image, year, publisher, count, genre, language, description]
  )
    .then((result) => {
      res.send({ success: true, data: { message: "data saved" } });
    })
    .catch((err) => {
      res.send({ success: false, data: err });
    });
};

//done
exports.postIssue = (req, res, next) => {
  const bookId = req.body.bookid;
  const userId = req.body.userid;

  db.execute("Insert into issues (bookid,userid) values(?,?)", [bookId, userId])
    .then((result) => {
      db.execute("select count from book where id=?", [bookId]).then(
        (result) => {
          const count = result[0][0].count;
          if (count == 0) {
            db.execute("Update book set count=?  where id=?", [
              count - 1,
              bookid,
            ]).then(() => res.send({ success: true }));
          } else {
            res.send({
              success: false,
              data: { message: "no copies to issue" },
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false, data: err });
    });
};

//done

exports.postReturn = (req, res, next) => {
  const bookid = req.body.bookid;
  const userid = req.body.userid;
  const fine = req.body.fine;
  
console.log("returning")
console.log(userid)
console.log(bookid)
console.log(fine)
  db.execute(
    "Update issues set fine=(?), returndate =(NOW()),returned=(?) where bookid=(?) and userid=(?)",
    [fine, true, bookid, userid]
  )
    .then((result) => {
      
      console.log(result)
      db.execute("select count from book where id=?", [bookid])
        .then((result) => {
        console.log(result)
          const count = result[0][0].count;

          db.execute("Update book set count=?  where id=?", [
            count + 1,
            bookid,
          ]);
        })
        .then(() => res.send({ success: true }))
        .catch((err) => res.send({ success: false, data: err }));
    })
    .catch((err) => {
      res.send({ success: false, data: err });
    });
};


//Done

exports.getWishlist = (req, res, next) => {
  const userid = req.params.id;
  let arr = [];
  db.execute("select bookid from wishlist where userid=?", [userid])
    .then((result) => {
      result[0].forEach((id) => {
        arr.push(id.bookid);
      });
      res.send({ success: true, data: arr });
    })
    .catch((err) => {
      res.send({ success: false, data: null });
    });
};

//done

exports.postAddToWishlist = (req, res, next) => {
  const bookid = req.body.bookid;
  const userid = req.body.userid;
  

  console.log(bookid);
  console.log(userid);

  db.execute("insert into wishlist values(?,?)", [bookid, userid])
    .then((result) => {
    console.log(result)
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false });
    });
};

//DOne
exports.postRemoveWishlist = (req, res, next) => {
  const bookid = req.body.bookid;
  const userid = req.body.userid;
  console.log(bookid);
  console.log(userid);
  db.execute("delete from wishlist where bookid=? and userid=?", [
    bookid,
    userid,
  ])
    .then((result) => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.send({ success: false });
    });
};

//
exports.loginCheck = (req, res, next) => {
  const userID = req.body.userid;
  const password = req.body.password;
  db.execute("SELECT id,name,password from user where name=? and password =?", [
    userID,
    password,
  ])
    .then((result) => {
      if (!result[0].length) {
        res.send({
          success: false,
          data: { message: "no user details found" },
        });
      } else {
        res.send({ success: true, data: result[0][0].id });
      }
    })
    .catch((err) => res.send({ success: false, data: err }));
};

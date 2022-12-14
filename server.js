const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/products", (req, res) => {
  // const query = req.query;
  // console.log("QUERY : ", query);
  models.Product.findAll({
    // limit: 1,
    // where : {  }
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "seller", "createdAt", "imageUrl"],
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
  // res.send({
  //   products: [
  //     {
  //       id: 1,
  //       name: "농구공",
  //       price: 100000,
  //       seller: "조던",
  //       imageUrl: "images/products/basketball1.jpeg",
  //     },
  //     {
  //       id: 2,
  //       name: "축구공",
  //       price: 50000,
  //       seller: "메시",
  //       imageUrl: "images/products/soccerball1.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "키보드",
  //       price: 10000,
  //       seller: "그랩",
  //       imageUrl: "images/products/keyboard1.jpg",
  //     },
  //   ],
  // });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description, imageUrl } = body;
  if (!name || !price || !seller || !description || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요.");
  }
  models.Product.create({
    name, // name = name
    price,
    seller,
    description,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result, // result : result
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
  res.send({
    body, //body : body
  });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // res.send(`id는 ${id} 입니다.`);
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다.");
    });
});

// 이미지 한개만 요청하는 경우
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({ imageUrl: file.path });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error("DB 연결 에러 ㅠ");
      process.exit();
    });
});

document.addEventListener("DOMContentLoaded", loadBestseller);

const bestsellers = document.getElementById("bestsellers");
const bestseller = document.getElementById("bestseller");

const showBooks = (data) => {
   // 책정보를 가진 객체의 집합체인 배열
   bestsellers.innerHTML = "";
   // data.__proto__ = BasketsObj.prototype; // 프로토 재정의로 메서드 연결하기

   data.forEach((bookObj) => {
      let divEx = bestseller.cloneNode(true);
      divEx.removeAttribute("id");

      for (let key in bookObj) {
         let form = divEx.querySelector(".basketForm");
         let divList = divEx.querySelector("." + key);

         if (key === "img") {
            let img = divEx.querySelector("img");
            img.src = bookObj[key];
         } else if (key === "isbn") {
            form["num"].value = Number(bookObj[key].replace(/-/g, ""));
         } else {
            divList?.append(document.createTextNode(bookObj[key]));

            // hidden타입 input에 value값 넣기
            if (form[key]) {
               form[key].value = bookObj[key];
            }
         }
         form.onsubmit = submitHandeler;
      }

      bestsellers.append(divEx);
   });
};

function loadBestseller(params) {
   fetch("./bestSellerbooks.json")
      .then((res) => {
         return res.json();
      })
      .then((data) => {
         showBooks(data);
      })
      .catch((error) => {
         console.error("데이터 로딩에 있어서 오류 발생:", error);
      });
}

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  로그인 해야 회원정보 가져오기

const loginBtn = document.getElementById("loginBtn");
const userImg = document.getElementById("userImg");

const showUserImg = () => {
   loginBtn.style.display = "none"; // 버튼 숨김 / 스타일로 바꿔서 안보이게 해보기
   userImg.style.display = "block"; // 회원 이미지 태그를 보이게 함
   // userImg.classList.toggle("screenOut"); // 클래스에 토글로 넣어서 안보이게 해보기
};

loginBtn.addEventListener("click", showUserImg); // 콜백함수로 addEventListener 써보기

const userInfoContainer = document.getElementById("userInfoContainer");
const userInfoEx = document.getElementById("userInfoEx");

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  리펙토링 / 회원정보 불러와서 넣기
const showUserInfo = (data) => {
   const userInfo = data["user_info"]; // 회원정보 객체
   let ul = userInfoEx.cloneNode(true); // 복제하기
   ul.removeAttribute("id");

   for (let info in userInfo) {
      if (info == "userImg") {
         userImg.src = userInfo[info];
      } else {
         let li = ul.querySelector("." + info);
         li?.append(document.createTextNode(userInfo[info]));
      }
   }
   userInfoEx.innerHTML = "";
   userInfoContainer.append(ul);
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  리펙토링 / 구매한 책 이력 불러와서 넣기
const books = document.getElementById("books");
const purchased = document.getElementById("purchased");

const showPurchasedBooks = (data, listType) => {
   let bookInfo = data[listType]; // 북정보를 가진 객체의 집합체인 배열

   books.innerHTML = "";
   bookInfo.forEach((book) => {
      // foreach의 요소인 book은 책한권의 객체
      let divEx = purchased.cloneNode(true);
      divEx.removeAttribute("id");

      for (let info in book) {
         if (info === "img") {
            let img = divEx.querySelector("img");
            img.src = book[info];
         } else {
            let p = divEx.querySelector("." + info);
            p?.append(document.createTextNode(book[info]));
         }
      }

      books.append(divEx);
   });
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  리펙토링 / 회원의 장바구니 이력 불러와서 넣기
const cart = document.getElementById("cart");
const cartBook = document.getElementById("cartBook");

let basketsObj = {}; // 장바구니 리스트 객체. 그 안에 책리스트 객체들을 다시 넣을것임.

class BasketsObj {
   // 메서드 설정하기

   setBasket(basket) {
      // 매개변수는 (form정보로 만든 Basket의 새 인스턴스 객체)

      // 같은 리스트가 없으면.. 중복체크 못했음. 왜냐. json의 구성 다시 구성할 필요가 있음
      
      this.assign(basket); // 객체의 필드추가
      this.total += basket.total;
   }
   delBasket(num) {
      // 매개변수는 삭제버튼의 data- 로 등록된 숫자
      console.log(num);
      console.log(this);

      for (let book in this) {
         if (isNaN(book)) continue;

         let isbnNum = Number(this[book]["isbn"].replace(/-/g, ""));
         if (num == isbnNum) {
            // 만약 같은 숫자가 이미 있으면
            let listPrice = this[book]["price"] * this[book]["cnt"];
            this.total -= listPrice;
            delete this[book];
         }
      }
   }

   calcTotalPrice() {
      for (let num in this) {
         let book = this[num];
         if (num === "total") {
            continue;
         }
         let bookPrice = Number(book["price"]) * Number(book["cnt"]);
         this.total += bookPrice;
      }
   }
}

// 특정 회원의 json파일에서 장바구니 목록을 가져와서
// 장바구니 객체의 자식요소로 넣기, 전체가격 계산하기
const userCart = (data) => {
   let userBasket = data["baskets"]; // 장바구니 리스트가 각 객체인, 객체의 집합체인 배열
   basketsObj = {}; // 장바구니 초기화
   basketsObj = Object.assign({ total: 0 }, userBasket); // 회원 장바구니 리스트를 추가.

   basketsObj.__proto__ = BasketsObj.prototype; // 프로토타입 연결
   basketsObj.calcTotalPrice(); // 메서드 사용
};

// basketsObj 객체 기반으로 장바구니 띄우기. (통합관리하기 위해)
const printBasketObj = () => {
   cart.innerHTML = "";

   console.log(basketsObj);

   for (let books in basketsObj) {
      if (isNaN(books)) continue; // === if(books==total), 반복문의 해당 구문만 넘겨라.

      let book = basketsObj[books];

      let divEx = cartBook.cloneNode(true);
      cartBook.removeAttribute("id");

      for (let info in book) {
         // 책 장바구니 리스트 넣기

         let delBtn = divEx.querySelector(".delBtn");

         if (info === "img") {
            let img = divEx.querySelector(info);
            img.src = book[info];
         } else if (info === "isbn") {
            continue;
            // let isbn = divEx.querySelector(info);
            // isbn.append(Number(book[info].replace(/-/g, "")));
         } else {
            let div = divEx.querySelector("." + info);
            div?.append(document.createTextNode(book[info]));
         }
      }

      let delBtn = divEx.querySelector(".delBtn");
      delBtn.dataset.num = Number(book["isbn"].replace(/-/g, ""));
      delBtn.onclick = (e) => {
         let delNum = e.target.dataset.num;
         basketsObj.delBasket(delNum); // delBasket메서드에 번호 넣어서 실행해.

         printBasketObj(); // 다시 출력해
      };
      cart.append(divEx);
   }

   const totalPrice = document.getElementById("totalPrice");
   totalPrice.innerHTML="";
   totalPrice.innerText= basketsObj["total"];
};

// 단지 type을 만들었을 뿐.
function Basket(form) {
   // 매개변수 == 각 상품의 폼요소임. 변수로 들어가서 key:value쌍들을 가지는 객체로 만들어짐.
   this.num = Number(form.num.value);
   this.title = form.title.value;
   this.author = form.author.value;
   this.price = Number(form.price.value);
   this.cnt = Number(form.cnt.value);
   this.total = this.price * this.cnt;
}

const submitHandeler = function (e) {
   e.preventDefault();
   let basket = new Basket(this); // this는 form요소 -> 위 Basket 타입에 넣어서 객체하나 만들기

   basketsObj.setBasket(basket);
   // 새 객체(장바구니 리스트 안에 상품 하나정보)를 BasketsObj의 setBasket메서드에 넣음.
   // basketsObj이라는 객체에다가, 프로토타입을 연결했기 때문에, 메서드를 쓸 수 있는 것임.

   printBasketObj(); // 그리고 다시 장바구니 출력.
};

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const loadUser = () => {
   fetch("./develhbybooks.json")
      .then((res) => {
         return res.json();
      })
      .then((data) => {
         showUserInfo(data);
         showPurchasedBooks(data, "purchased");
         userCart(data);
         console.log(basketsObj);
         
         printBasketObj();
      })
      .catch((error) => {
         console.error("데이터 로딩에 있어서 오류 발생:", error); // 오류 처리
      });
};

loginBtn.addEventListener("click", loadUser);

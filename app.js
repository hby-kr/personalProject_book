document.addEventListener("DOMContentLoaded", loadBestseller);

const bestsellers = document.getElementById("bestsellers");
const bestseller = document.getElementById("bestseller");

const showBooks = (data) => {
   // 책정보를 가진 객체의 집합체인 배열

   bestsellers.innerHTML = "";

   for (let n = 0; n < data.letngth; n++) {
      let obj = data[n];

      console.log("obj", obj);
   }

};

// 여기 해결해야함

function loadBestseller(params) {
   fetch("./bestSellerbooks.json")
      .then((res) => {
         return res.json();
      })
      .then((data) => {
         console.log(data);
         showBooks(data);
      })
      .catch((error) => {
         console.error("데이터 로딩에 있어서 오류 발생:", error); // 오류 처리
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

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  리펙토링 / 책 이력 불러와서 넣기
const books = document.getElementById("books");
const purchased = document.getElementById("purchased");
const cartBook = document.getElementsByClassName("cartBook");

//  purchased, baskets
const showPurchasedBooks = (data, listType) => {
   let bookInfo = data[listType]; // 북정보를 가진 객체의 집합체인 배열
   // console.log("bookInfo", bookInfo);

   books.innerHTML = "";
   bookInfo.forEach((book) => {
      let divEx = purchased.cloneNode(true);
      divEx.removeAttribute("id");

      // foreach의 요소인 book은 책한권의 객체

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

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const loadUser = () => {
   fetch("./develhbybooks.json")
      .then((res) => {
         return res.json();
      })
      .then((data) => {
         showUserInfo(data);
         showPurchasedBooks(data, "purchased");
      })
      .catch((error) => {
         console.error("데이터 로딩에 있어서 오류 발생:", error); // 오류 처리
      });
};

loginBtn.addEventListener("click", loadUser);

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

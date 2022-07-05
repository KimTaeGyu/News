//api를 불러올때 async 와 await은 세트로 구성된다
//await은 강제로 데이터를 불러오기 전까지 잡아두는 역활
//async는 비동기식으로 전환한다는 의미인듯함
//javascript는 동기식임
let news = [];
let page =1;
let total_page=0;
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu=> menu.addEventListener("click", (event)=>getNewsByTopic(event) ));
let searchButton = document.getElementById("search-button");
let url;
//각 함수에서 필요한 url을 만든다.
//api호출 함수를 부른다.

const getNews = async() =>{
    try{
        let header = new Headers({'x-api-key':'8f_SZ_VRCqZdPf9DihOZLgczIg_5fionXwUTRlzAYc0'})
        url.searchParams.set('page', page);//&page=
        console.log("url",url);
        let response = await fetch(url,{headers:header}) //ajax, http, fetch
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.");
            }
            console.log("받는 데이터가 뭐지?",data);
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pageNation();
        }else{
            throw new Error(data.message)
        }
        //json은 객체인데 텍스트로 보여질뿐?? 객체처럼 쓸수있다 데이터타입으로 표현됨.

   }catch(error){
    errorRender(error.message)
   }

    
}

const getLastNews = async() =>{
    url= new URL("https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10");
    getNews();
};

const getNewsByTopic = async(event) =>{
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
};

const getNewsByKeyword = async() =>{
    //1.검색 키워드 읽어오기
    //2. url에 검색 키워드 붙이기
    //3. 헤더준비
    //4. url부르기
    //5.데이터 가져요기
    //6.데이터 보여주기
    let keyword = document.getElementById("search-input").value
    url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
        getNews();

}


const render = () =>{
    let newsHTML ="";
    newsHTML = news.map((item)=>{
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size"src="${item.media}">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div>
                ${item.published_date} * ${item.rights}
            </div>
        </div>
    </div>`
    }).join('');
    //join은 array에서 string으로 바꿔주는 함수이다.

    console.log(newsHTML);
    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (message) =>{
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pageNation = () =>{
    let pageNationHTML =``;
    //total_page
    //page
    //page group
    let pageGroup = Math.ceil(page/5)
    //last
    let last = pageGroup*5
    //first
    let first = last - 4
    //first~last page print

    pageNationHTML+= `<li class="page-item text-center">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page.first})">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>`;

    pageNationHTML += `<li class="page-item text-center">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
    </a>
    </li>`;

    for(let i=first; i<=last;i++){
        pageNationHTML+=`<li class="page-item ${page==i?"active":""} text-center"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    pageNationHTML += `<li class="page-item text-center">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`;

  pageNationHTML+= `<li class="page-item text-center">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page.last})">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;

    document.querySelector(".pagination").innerHTML = pageNationHTML;
}

const moveToPage =(pageNum) =>{
    //1. 이동하고싶은 페이지를 안다
    page = pageNum
    //2. 이동하고싶은 페이지를 가지고 api를 다시 호출한다
    getNews();
};

searchButton.addEventListener("click",getNewsByKeyword);

getLastNews();
























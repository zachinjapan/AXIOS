//uses this site to get the data
//https://jsonplaceholder.typicode.com

//axios globals can be used for all requests
//this is added here but could be added each time as well

axios.defaults.headers.common["X-Auth-Token"] =
  " this was added globaly eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GET REQUEST
function getTodos() {
  //long way

  // axios({
  //   method: "GET",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   params: {
  //     _limit: 5,
  //   },
  // })
  //   .then((res) => console.log(res))
  //   .catch((err) => console.error(err));

  // short way

  axios
    .get("https://jsonplaceholder.typicode.com/todos?", {
      // how to add timeouts to all requestsf
      timeout: 5000,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.error(err));
}

// POST REQUEST

function addTodo() {
  //long way

  //   axios({
  //     method: "post",
  //     url: "https://jsonplaceholder.typicode.com/todos",
  //     data: {
  //       title: "New Todo",
  //       completed: false,
  //     },
  //   })
  //     .then((res) => showOutput(res))
  //     .catch((err) => console.error(err));
  //short way

  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "New Todo",
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.error(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  axios
    // put replaces patch changes
    //needs the id of the todo
    .patch("https://jsonplaceholder.typicode.com/todos/1", {
      title: "rewriten todo",
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.error(err));
}

// DELETE REQUEST
function removeTodo() {
  axios
    // put replaces patch changes
    //needs the id of the todo
    .delete("https://jsonplaceholder.typicode.com/todos/1")
    .then((res) => showOutput(res))
    .catch((err) => console.error(err));
}

// SIMULTANEOUS DATA

//get todos and posts
function getData() {
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos"),
      axios.get("https://jsonplaceholder.typicode.com/posts"),
    ])
    .then(
      axios.spread((todos, posts) => {
        showOutput(posts);
      })
    )
    .catch((err) => console.error(err));
}

// CUSTOM HEADERS

// often send data in the headers
// like in authentication or authorization
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "somespookytoken",
    },
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "New Todo",
        completed: false,
      },
      config
    )
    .then((res) => showOutput(res))
    .catch((err) => console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
// not used much
function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "hello world (made upper case)",
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  axios(options).then((res) => showOutput(res));
}
// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todoBADROUTE!!!!", {
      // validateStatus: function (status) {
      //   // example of validating status when the status is greater than or equal to 500
      //   return status <= 500;
      // },
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        // server respounded with a status other then the 200 success range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // the request was made but no response was received
        console.log(err.request, "no response");
      } else {
        // something else happened
        console.log(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos?", {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      }
    });

  if (true) {
    // if for some reason you want to cancel the request
    // you can do so with the cancel method
    source.cancel("Request canceled");
  }
}

// INTERCEPTING REQUESTS & RESPONSES

axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create(
  // custom setting in here
  {
    // other settings
    baseURL: "https://jsonplaceholder.typicode.com",
  }
);

// didnt need to write the entire base URL since it was already set in the axios instance
// axiosInstance.get("/todos").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);

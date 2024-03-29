import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { readableDate } from "./readableDate";
const socket = io.connect("http://localhost:3001");
function App() {
  const videoRef = useRef();
  const [message, setMessage] = useState({
    name: "",
    message: "",
    time: "",
  });
  const [timerArr, setTimerArr] = useState([]);
  const [timer, setTimer] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const trackTime = (e) => {
    setMessage({ ...message, time: e.target.value });
  };
  const trackDate = (e) => {
    setDate(e.target.value);
  };
  const [showMessage, setShowMessage] = useState([]);
  const trackMessage = (e) => {
    setMessage({ ...message, message: e.target.value });
  };
  const trackName = (e) => {
    setMessage({ ...message, name: e.target.value });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    const inputYear = date?.split("-")[0];
    const inputMonth = date?.split("-")[1];
    const inputDay = date?.split("-")[2];
    let myDate = new Date(
      `${inputMonth} ${inputDay}, ${inputYear} ${message.time}`
    );

    socket.emit("send_message", { ...message, time: myDate });
    setMessage({ ...message, message: "" });
  };
  // useEffect(() => {
  //   let myTime = localStorage.getItem("timer");
  //   const currentVideo = videoRef.current;

  //   currentVideo.currentTime = Number(myTime);
  // }, []);
  useEffect(() => {
    if (timerArr.length === 0) return;
    console.log("Hi world, Hello, ", timerArr[0]);
    if (timerArr[0]) {
      videoRef.current.currentTime = timerArr[0];
    }
  }, [timerArr[0]]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setShowMessage([...msg]);
    });
    socket.on("start_video", (msg) => {
      setTime(msg);
      socket.on("count", (msg) => {});
    });

    socket.on("count", (msg) => {
      setTimer(msg);
      // if(timerArr.length > 0) return
      if (timerArr.length < 1) {
        setTimerArr([...timerArr, msg]);
      } else {
        setTimerArr([...timerArr]);
      }
    });
  }, [socket, timer]);
  useEffect(() => {
    if (time) {
      socket.emit("give_time", "give time");
    }
  }, [time]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "5rem",
      }}
    >
      {/* {time ? <h1> {time}</h1> : ""} */}

      <form onSubmit={sendMessage}>
        <div>
          <input
            onChange={trackName}
            type="text"
            placeholder="Your name"
            value={message.name}
          />
        </div>

        <input
          onChange={trackMessage}
          type="text"
          placeholder="message"
          value={message.message}
        />
        <div>
          <input onChange={trackDate} type="date" />
        </div>
        <div>
          <input onChange={trackTime} type="time" value={message.time} />
        </div>
        <div>
          <button type="submit">Send message</button>
        </div>
      </form>
      <div>
        {timerArr.length > 0 && (
          <div>
            <video
              ref={videoRef}
              width="520"
              height="540"
              controls
              muted
              // style={{ display: `${time ? "block" : "none"}` }}
              autoPlay
            >
              <source src="Assets/videos/parenting.mp4" type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

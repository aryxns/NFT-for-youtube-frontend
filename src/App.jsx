import React from 'react';
import './App.css';

function MyApp() {
  const [videoURL, setvideoURL] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [watchedVideo, setwatchedVideo] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");
  const [minted, setMinted] = React.useState(false);
  let videolength = 0;
  let watchLength = 0;

  function myfetch(url, options, timeout = 7000) {
      return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), timeout)
          )
      ]);
    };

  async function mintNFT(){
    setMinted(true);
    setLoading(true);
    const data = JSON.stringify({
      "name":name,
      "address":address,
      "url":videoURL
    })
    myfetch(`your backend address`, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: data,
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }, 300000).then((result) => result.json()).then((response)=>{setImage(response.image);setLoading(false);})
  }

  var player;
  function onYouTubeIframeAPIReady() {
    console.log(videoURL)
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: videoURL,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    var total_time = player.getDuration()
    console.log(total_time);
    const title = player.getVideoData().title;
    console.log(title);
    setName(title);
    videolength = (parseInt(total_time))
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    const current_time = player.getCurrentTime()
    console.log(videolength, current_time, watchLength)
    if ((current_time - watchLength) > 10){
      player.seekTo(watchLength, true);
      setTimeout(()=>{onPlayerStateChange()}, 200);
    } else if ((videolength - current_time) < 2) {
      setwatchedVideo(true);
      watchLength = (current_time);
      console.log("Video watched")
      setTimeout(stopVideo, 500);
    } else if ((current_time - watchLength) < 10) {
      console.log
      watchLength = (current_time);
      setTimeout(()=>{onPlayerStateChange()}, 200);
    };
  }

  function stopVideo() {
    player.stopVideo();
  };

  function handleData(data){
    if ((data).length != 42){
      window.alert("Please enter valid wallet address")
      } else {
        console.log(data)
        setAddress(data);
      }; 
    setMinted(false);
  }


  return (
    <div className="grid justify-items-center">
    <input onChange={(e)=>{setvideoURL((e.target.value).substr(32))}} className="m-5 focus:border-blue-400 border-3 p-2 focus:outline-none rounded-lg w-1/4 h-12 bg-gray-100" placeholder="Youtube Video URL"></input>
    <button onClick={onYouTubeIframeAPIReady} className="text-gray-100 text-xl p-2 rounded-lg hover:bg-blue-900 bg-blue-500">Load Video</button>
    <div className="mt-10" id="player"></div>

    {watchedVideo ? (
      <div className="mt-10 w-full grid justify-items-center">
      <input onChange={(e)=>{handleData(e.target.value)}} className="m-5 focus:border-blue-400 border-3 p-2 focus:outline-none rounded-lg w-3/4 h-12 bg-gray-100" placeholder="Polygon Public Address"></input>
      <button onClick={mintNFT} className="text-gray-100 text-xl p-2 rounded-lg hover:bg-green-900 bg-green-500">Mint NFT as Proof!</button>
      {minted ? (
        <div>
        {loading ? (
        <div className="mt-20 grid justify-items-center">
          <img src="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif"/>
        </div>
      ): (
        <div className="mt-20 grid justify-items-center">
          <img src={"data:image/png;base64,"+image}/>
          <h1 className="text-xl font-mono font-bold mt-10">NFT successfully minted to {address} :)</h1>
        </div>
      )};
        </div>
      ):null}
      </div>
    ):null}
    </div>
  );
}

export default MyApp;
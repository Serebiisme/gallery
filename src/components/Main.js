require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//图片路径
var imageDatas = require('../data/imageDatas.json');
//路径生成函数
imageDatas = (function genImageUrl(imageDatasArr){
  for (var i=0,j = imageDatasArr.length;i<j;i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require("../images/" + singleImageData.fileName)

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//imageDatas = genImageUrl(imageDatas);  (采用自执行函数，如上)

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
          
        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
